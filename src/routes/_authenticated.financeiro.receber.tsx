import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownToLine, CheckCircle2, Search, Calendar as CalIcon, Filter, X, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/financeiro/receber")({
  head: () => ({ meta: [{ title: "Contas a Receber · Financeiro" }] }),
  component: ContasReceber,
});

const REVENUE_CATEGORIES = [
  "Venda de Roupas",
  "Private Label",
  "Dropshipping",
  "Serviços",
  "Receitas Financeiras"
];

function ContasReceber() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal Nova/Editar Receita
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTx, setEditingTx] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    due_date: new Date().toISOString().split("T")[0],
    category_name: "Venda de Roupas",
    cost_center: "Comercial",
    payment_method: "PIX",
    notes: "",
    status: "pendente"
  });

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(*), orders(code, client_id, clients(name))')
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
      
      // Log de Auditoria
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Baixa de Conta a Receber",
        after_data: { id, status: "recebido", payment_date: today }
      }]);

      loadData();
    }
  };

  const handleEditClick = (tx: any) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description,
      amount: String(tx.amount),
      due_date: tx.due_date,
      category_name: tx.financial_categories?.name || "Venda de Roupas",
      cost_center: tx.cost_center || "Comercial",
      payment_method: tx.payment_method || "PIX",
      notes: tx.notes || "",
      status: tx.status || "pendente"
    });
    setModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lançamento a receber?")) return;

    const { error } = await supabase.from('financial_transactions').delete().eq('id', id);

    if (error) {
      toast.error("Erro ao excluir lançamento: " + error.message);
    } else {
      toast.success("Lançamento excluído com sucesso!");

      // Log de Auditoria
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Exclusão de Lançamento a Receber",
        after_data: { id }
      }]);

      loadData();
    }
  };

  const resolveCategory = async (name: string) => {
    let type = "receita";
    if (name === "Receitas Financeiras") type = "financeiro";

    const { data: existing } = await supabase
      .from("financial_categories")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existing) return existing.id;

    const { data: created } = await supabase
      .from("financial_categories")
      .insert([{ name, type }])
      .select("id")
      .single();

    return created?.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.due_date || !formData.category_name) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }

    setSaving(true);
    try {
      const amt = parseFloat(formData.amount);
      const categoryId = await resolveCategory(formData.category_name);

      const payload = {
        type: 'receber',
        status: formData.status,
        description: formData.description,
        amount: amt,
        original_amount: amt,
        due_date: formData.due_date,
        category_id: categoryId,
        cost_center: formData.cost_center,
        payment_method: formData.payment_method,
        notes: formData.notes,
        payment_date: formData.status === 'recebido' ? new Date().toISOString().split("T")[0] : null
      };

      if (editingTx) {
        // Atualizar
        const { error } = await supabase
          .from('financial_transactions')
          .update(payload)
          .eq('id', editingTx.id);

        if (error) throw error;
        toast.success("Título a receber atualizado com sucesso!");
      } else {
        // Criar novo
        const { error } = await supabase
          .from('financial_transactions')
          .insert([{ ...payload, created_by: user?.id || null }]);

        if (error) throw error;
        toast.success("Título a receber cadastrado com sucesso!");
      }

      setFormData({
        description: "",
        amount: "",
        due_date: new Date().toISOString().split("T")[0],
        category_name: "Venda de Roupas",
        cost_center: "Comercial",
        payment_method: "PIX",
        notes: "",
        status: "pendente"
      });
      setEditingTx(null);
      setModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error("Erro ao salvar lançamento: " + error.message);
    } finally {
      setSaving(false);
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
        <div>
          <Button onClick={() => { setEditingTx(null); setModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold">
            <Plus className="size-4 mr-1.5" /> Nova Receita
          </Button>
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
                        <div className="flex justify-end gap-1.5 items-center">
                          {dStatus !== 'recebido' && dStatus !== 'cancelado' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleQuickBaixar(t.id)} 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2.5 text-[10px] font-semibold flex items-center"
                            >
                              <ArrowDownToLine className="size-3 mr-1" /> Baixar
                            </Button>
                          )}
                          {dStatus === 'recebido' && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mr-2">
                              ✓ {t.payment_date && new Date(t.payment_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditClick(t)} 
                            className="h-7 px-2 text-[10px] flex items-center gap-1"
                          >
                            <Edit2 className="size-3" /> Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteClick(t.id)} 
                            className="h-7 px-2 text-[10px] text-red-500 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="size-3" /> Excluir
                          </Button>
                        </div>
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

      {/* Modal Nova/Editar Receita */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) setEditingTx(null);
      }}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-850">
                {editingTx ? "Editar Lançamento a Receber" : "Lançamento de Receita Manual"}
              </DialogTitle>
              <DialogDescription className="text-xs">Registre ou edite receitas operacionais ou recebimentos avulsos.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-semibold">Descrição / Origem *</Label>
                <Input 
                  id="description"
                  placeholder="Ex: Faturamento Lote Roupas ERP"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="amount" className="text-xs font-semibold">Valor (R$) *</Label>
                  <Input 
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="due_date" className="text-xs font-semibold">Vencimento *</Label>
                  <Input 
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                    className="h-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Categoria de Receita *</Label>
                  <Select value={formData.category_name} onValueChange={v => setFormData({ ...formData, category_name: v })} required>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REVENUE_CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Meio de Pagamento *</Label>
                  <Select value={formData.payment_method} onValueChange={v => setFormData({ ...formData, payment_method: v })} required>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Boleto">Boleto Bancário</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Transferência">TED/DOC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Status de Recebimento *</Label>
                  <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="recebido">Recebido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Centro de Custo</Label>
                  <Select value={formData.cost_center} onValueChange={v => setFormData({ ...formData, cost_center: v })}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs font-semibold">Observações</Label>
                <Textarea 
                  id="notes"
                  placeholder="Informações adicionais do título"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setModalOpen(false); setEditingTx(null); }} className="h-9 text-xs">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-semibold">
                {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                {editingTx ? "Salvar Alterações" : "Salvar Lançamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
