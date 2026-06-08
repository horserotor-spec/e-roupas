import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Download, Printer, Search, Calendar as CalIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/financeiro/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios Financeiros · Financeiro" }] }),
  component: RelatoriosFinanceiros,
});

function RelatoriosFinanceiros() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [costCenterFilter, setCostCenterFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [supplierFilter, setSupplierFilter] = useState("Todos");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("Todos");
  const [originFilter, setOriginFilter] = useState("Todos");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadLookupsAndData = async () => {
    setLoading(true);
    
    // Buscar transações
    const { data: txData } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(*), orders(code, client_id, origin_channel, clients(name))')
      .order('due_date', { ascending: false });
    if (txData) setTransactions(txData);

    // Buscar categorias
    const { data: catData } = await supabase.from('financial_categories').select('*').order('name');
    if (catData) setCategories(catData);

    // Buscar clientes
    const { data: clientData } = await supabase.from('clients').select('id, name').eq('entity_type', 'cliente').order('name');
    if (clientData) setClients(clientData);

    // Buscar fornecedores
    const { data: supplierData } = await supabase.from('suppliers').select('id, name').order('name');
    if (supplierData) setSuppliers(supplierData);

    setLoading(false);
  };

  useEffect(() => {
    loadLookupsAndData();
  }, []);

  const getDynamicStatus = (t: any) => {
    if (t.status === 'recebido' || t.status === 'pago' || t.status === 'cancelado' || t.status === 'parcial') {
      return t.status;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (t.due_date < todayStr) return 'atrasado';
    if (t.due_date === todayStr) return 'vence_hoje';
    return 'no_prazo';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      recebido: "Recebido",
      pago: "Pago",
      atrasado: "Atrasado",
      vence_hoje: "Vence hoje",
      no_prazo: "No prazo",
      parcial: "Parcial",
      cancelado: "Cancelado",
      pendente: "Pendente"
    };
    return labels[status] || status;
  };

  const getStatusTone = (status: string) => {
    const tones: Record<string, string> = {
      recebido: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pago: "bg-slate-100 text-slate-700 border-slate-200",
      atrasado: "bg-rose-50 text-rose-700 border-rose-100",
      vence_hoje: "bg-amber-50 text-amber-700 border-amber-100",
      no_prazo: "bg-blue-50 text-blue-700 border-blue-100",
      parcial: "bg-purple-50 text-purple-700 border-purple-100",
      cancelado: "bg-slate-150 text-slate-500 border-slate-200"
    };
    return tones[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  // Filtragem
  const filtered = transactions.filter(t => {
    const dStatus = getDynamicStatus(t);
    const catName = t.financial_categories?.name || "";
    
    // Busca textual
    const matchesSearch = t.description.toLowerCase().includes(q.toLowerCase()) || 
                          catName.toLowerCase().includes(q.toLowerCase()) ||
                          t.cost_center.toLowerCase().includes(q.toLowerCase()) ||
                          (t.orders?.code || "").toLowerCase().includes(q.toLowerCase());

    const matchesType = typeFilter === "Todos" || t.type === typeFilter;
    const matchesStatus = statusFilter === "Todos" || dStatus === statusFilter;
    const matchesCostCenter = costCenterFilter === "Todos" || t.cost_center === costCenterFilter;
    const matchesCategory = categoryFilter === "Todos" || t.category_id === categoryFilter;
    const matchesClient = clientFilter === "Todos" || t.orders?.client_id === clientFilter;
    const matchesSupplier = supplierFilter === "Todos" || t.supplier_id === supplierFilter;
    const matchesPaymentMethod = paymentMethodFilter === "Todos" || t.payment_method === paymentMethodFilter;
    const matchesOrigin = originFilter === "Todos" || t.orders?.origin_channel === originFilter;
    
    const matchesStart = !startDate || t.due_date >= startDate;
    const matchesEnd = !endDate || t.due_date <= endDate;

    return matchesSearch && matchesType && matchesStatus && matchesCostCenter && 
           matchesCategory && matchesClient && matchesSupplier && 
           matchesPaymentMethod && matchesOrigin && matchesStart && matchesEnd;
  });

  const clearFilters = () => {
    setQ("");
    setTypeFilter("Todos");
    setStatusFilter("Todos");
    setCostCenterFilter("Todos");
    setCategoryFilter("Todos");
    setClientFilter("Todos");
    setSupplierFilter("Todos");
    setPaymentMethodFilter("Todos");
    setOriginFilter("Todos");
    setStartDate("");
    setEndDate("");
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.warning("Nenhum dado para exportar.");
      return;
    }

    const headers = [
      "Vencimento", "Pagamento", "Tipo", "Descricao", "Valor (R$)", 
      "Status", "Forma Pagamento", "Centro Custo", "Categoria", "Cliente", "Origem Pedido"
    ];

    const rows = filtered.map(t => [
      t.due_date,
      t.payment_date || "",
      t.type === 'receber' ? 'Receita' : 'Despesa',
      t.description.replace(/;/g, ","),
      Number(t.amount).toFixed(2),
      getDynamicStatus(t),
      t.payment_method || "PIX",
      t.cost_center,
      t.financial_categories?.name || "Avulso",
      (t.orders?.clients?.name || "").replace(/;/g, ","),
      t.orders?.origin_channel || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório CSV exportado com sucesso!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in print:p-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Módulo Financeiro</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Relatórios Financeiros</h1>
          <p className="text-muted-foreground mt-1">Gere demonstrativos, cruze dados operacionais e exporte relatórios consolidados.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" className="h-9 inline-flex items-center gap-1.5 px-3">
            <Printer className="size-4" /> Imprimir (PDF)
          </Button>
          <Button onClick={handleExportCSV} className="bg-slate-900 hover:bg-slate-800 text-white h-9 inline-flex items-center gap-1.5 px-3">
            <Download className="size-4" /> Exportar (CSV/Excel)
          </Button>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="size-4 text-slate-400" />
          <span>Filtros Cruzados</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Busca Geral</label>
            <Input 
              placeholder="Descrição, pedido..." 
              value={q} 
              onChange={e => setQ(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Tipo</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Tipos</SelectItem>
                <SelectItem value="receber">Receita (Entrada)</SelectItem>
                <SelectItem value="pagar">Despesa (Saída)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="no_prazo">No prazo</SelectItem>
                <SelectItem value="vence_hoje">Vence hoje</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="recebido">Recebido</SelectItem>
                <SelectItem value="pago">Pago / Quitado</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Centro de Custo</label>
            <Select value={costCenterFilter} onValueChange={setCostCenterFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Centros</SelectItem>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Atendimento">Atendimento</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Impressão">Impressão</SelectItem>
                <SelectItem value="Produção">Produção</SelectItem>
                <SelectItem value="Expedição">Expedição</SelectItem>
                <SelectItem value="Compras">Compras</SelectItem>
                <SelectItem value="Estoque">Estoque</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Diretoria">Diretoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Categoria / Conta</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas as Contas</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Cliente</label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Clientes</SelectItem>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Fornecedor</label>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Fornecedores</SelectItem>
                {suppliers.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Forma de Pagto</label>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas as Formas</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Débito">Débito</SelectItem>
                <SelectItem value="Crédito à vista">Crédito à vista</SelectItem>
                <SelectItem value="Crédito parcelado">Crédito parcelado</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Vencimento Início</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Vencimento Fim</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 text-xs" />
          </div>
        </div>

        {(q || typeFilter !== "Todos" || statusFilter !== "Todos" || costCenterFilter !== "Todos" || 
          categoryFilter !== "Todos" || clientFilter !== "Todos" || supplierFilter !== "Todos" || 
          paymentMethodFilter !== "Todos" || startDate || endDate) && (
          <div className="pt-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 h-8 px-3">
              <X className="size-3.5 mr-1" /> Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Relatório Impresso Cabeçalho */}
      <div className="hidden print:block border-b-2 pb-4 mb-6">
        <h2 className="text-2xl font-bold uppercase">Relatório Financeiro Consolidado</h2>
        <p className="text-xs text-slate-500 mt-1">Gerado em: {new Date().toLocaleString('pt-BR')} | Total de registros: {filtered.length}</p>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider print:bg-transparent print:text-black">
                <tr>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Descrição / Lançamento</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-center">Centro Custo</th>
                  <th className="px-4 py-3">Forma Pagto</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs print:divide-slate-200">
                {filtered.map(t => {
                  const isReceber = t.type === 'receber';
                  const dStatus = getDynamicStatus(t);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                        {new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 font-semibold uppercase tracking-wider text-[10px]">
                        <span className={isReceber ? 'text-emerald-600' : 'text-red-500'}>
                          {isReceber ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {t.description}
                        {t.orders?.code && (
                          <span className="ml-1.5 font-mono text-[9px] text-muted-foreground">
                            #{t.orders.code}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{t.financial_categories?.name || 'Avulso'}</td>
                      <td className="px-4 py-3 text-center text-slate-600 font-medium">{t.cost_center}</td>
                      <td className="px-4 py-3">{t.payment_method || 'PIX'}</td>
                      <td className={`px-4 py-3 text-right font-bold ${isReceber ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isReceber ? '+' : '-'} {formatCurrency(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-semibold print:border-none print:bg-transparent ${getStatusTone(dStatus)}`}>
                          {getStatusLabel(dStatus)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground text-sm">
                      Nenhum lançamento corresponde aos filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo Consolidado (Totalizadores) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border rounded-xl p-5 shadow-inner print:border-2 print:shadow-none print:mt-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total de Receitas</span>
          <div className="text-xl font-bold text-emerald-600">
            {formatCurrency(filtered.filter(t => t.type === 'receber').reduce((acc, t) => acc + Number(t.amount), 0))}
          </div>
        </div>
        <div className="space-y-1 text-center sm:text-left border-t sm:border-t-0 sm:border-x px-4 border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total de Despesas</span>
          <div className="text-xl font-bold text-red-500">
            {formatCurrency(filtered.filter(t => t.type === 'pagar').reduce((acc, t) => acc + Number(t.amount), 0))}
          </div>
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saldo do Filtro</span>
          <div className={`text-xl font-extrabold ${
            (filtered.filter(t => t.type === 'receber').reduce((acc, t) => acc + Number(t.amount), 0) -
            filtered.filter(t => t.type === 'pagar').reduce((acc, t) => acc + Number(t.amount), 0)) >= 0 
              ? 'text-emerald-600' 
              : 'text-red-500'
          }`}>
            {formatCurrency(
              filtered.filter(t => t.type === 'receber').reduce((acc, t) => acc + Number(t.amount), 0) -
              filtered.filter(t => t.type === 'pagar').reduce((acc, t) => acc + Number(t.amount), 0)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
