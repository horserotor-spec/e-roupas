import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownToLine, CheckCircle2, Search, Calendar as CalIcon, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/financeiro/receber")({
  head: () => ({ meta: [{ title: "Contas a Receber · Financeiro" }] }),
  component: ContasReceber,
});

function ContasReceber() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*, orders(code, client_id, clients(name))')
      .eq('type', 'receber')
      .order('due_date', { ascending: true });
    if (data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickBaixar = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('financial_transactions').update({
      status: 'recebido',
      payment_date: today,
    }).eq('id', id);

    if (error) {
      toast.error("Erro ao realizar a baixa.");
    } else {
      toast.success("Recebimento confirmado com sucesso!");
      loadData();
    }
  };

  // Retorna o status dinâmico calculado pela data caso esteja pendente
  const getDynamicStatus = (t: any) => {
    if (t.status === 'recebido' || t.status === 'cancelado' || t.status === 'parcial') {
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
      atrasado: "bg-rose-50 text-rose-700 border-rose-100",
      vence_hoje: "bg-amber-50 text-amber-700 border-amber-100",
      no_prazo: "bg-blue-50 text-blue-700 border-blue-100",
      parcial: "bg-purple-50 text-purple-700 border-purple-100",
      cancelado: "bg-slate-150 text-slate-500 border-slate-200"
    };
    return tones[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  const filtered = transactions.filter(t => {
    const dStatus = getDynamicStatus(t);
    const clientName = t.orders?.clients?.name || t.description || "";
    
    const matchesSearch = clientName.toLowerCase().includes(q.toLowerCase()) || 
                          t.description.toLowerCase().includes(q.toLowerCase()) ||
                          t.orders?.code?.toLowerCase().includes(q.toLowerCase());

    const matchesStatus = statusFilter === "Todos" || dStatus === statusFilter;
    const matchesStart = !startDate || t.due_date >= startDate;
    const matchesEnd = !endDate || t.due_date <= endDate;

    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  const clearFilters = () => {
    setQ("");
    setStatusFilter("Todos");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Contas a Receber</h1>
          <p className="text-muted-foreground mt-1">Gestão de recebíveis, parcelas de vendas e conciliação.</p>
        </div>
      </div>

      {/* Painel de Filtros */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="size-4 text-slate-400" />
          <span>Filtros de Busca</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Cliente ou Descrição</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Nome, ref, pedido..." 
                value={q} 
                onChange={e => setQ(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="no_prazo">No prazo</SelectItem>
                <SelectItem value="vence_hoje">Vence hoje</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="recebido">Recebido</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Vencimento Início</label>
            <Input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Vencimento Fim</label>
            <Input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {(q || statusFilter !== "Todos" || startDate || endDate) && (
          <div className="pt-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 h-8 px-3">
              <X className="size-3.5 mr-1" /> Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Tabela de Títulos */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Descrição / Lançamento</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Forma</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {filtered.map(t => {
                  const dStatus = getDynamicStatus(t);
                  const clientName = t.orders?.clients?.name || "Lançamento Avulso";
                  
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <CalIcon className="size-3.5 text-slate-400" />
                          {new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {t.description} 
                        {t.orders?.code && (
                          <Badge variant="secondary" className="ml-2 font-mono text-[10px] bg-slate-100 text-slate-600">
                            #{t.orders.code}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">{clientName}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-md font-medium">
                          {t.payment_method || 'PIX'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-semibold ${getStatusTone(dStatus)}`}>
                          {getStatusLabel(dStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {dStatus !== 'recebido' && dStatus !== 'cancelado' && (
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              size="sm" 
                              onClick={() => handleQuickBaixar(t.id)} 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-3 text-[11px] font-semibold"
                            >
                              <ArrowDownToLine className="size-3 mr-1" /> Baixar
                            </Button>
                          </div>
                        )}
                        {dStatus === 'recebido' && (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="size-3.5" />
                            em {t.payment_date && new Date(t.payment_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground text-sm">
                      Nenhum título a receber encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
