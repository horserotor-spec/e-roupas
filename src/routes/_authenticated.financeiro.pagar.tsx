import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpToLine, CheckCircle2, Search, Calendar as CalIcon, Plus, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/financeiro/pagar")({
  head: () => ({ meta: [{ title: "Contas a Pagar · Financeiro" }] }),
  component: ContasPagar,
});

function ContasPagar() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal Nova Despesa
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    due_date: new Date().toISOString().split("T")[0],
    category_id: "",
    cost_center: "Geral",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    const { data: txData } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(*)')
      .eq('type', 'pagar')
      .order('due_date', { ascending: true });
    if (txData) setTransactions(txData);

    const { data: catData } = await supabase
      .from('financial_categories')
      .select('*')
      .neq('type', 'receita') // Não carregar categorias de receita para contas a pagar
      .order('name');
    if (catData) setCategories(catData);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickQuitar = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('financial_transactions').update({
      status: 'pago',
      payment_date: today,
    }).eq('id', id);

    if (error) {
      toast.error("Erro ao realizar a baixa.");
    } else {
      toast.success("Pagamento confirmado com sucesso!");
      
      // Log de Auditoria
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Baixa de Conta a Pagar",
        after_data: { id, status: "pago", payment_date: today }
      }]);

      loadData();
    }
  };

  const handleCreateDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.due_date || !formData.category_id) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }

    setSaving(true);
    const amt = parseFloat(formData.amount);

    const { data: newTx, error } = await supabase
      .from('financial_transactions')
      .insert([{
        type: 'pagar',
        status: 'pendente',
        description: formData.description,
        amount: amt,
        original_amount: amt,
        due_date: formData.due_date,
        category_id: formData.category_id,
        cost_center: formData.cost_center,
        notes: formData.notes,
        created_by: user?.id || null,
      }])
      .select()
      .single();

    if (error) {
      toast.error("Erro ao cadastrar despesa: " + error.message);
    } else {
      toast.success("Despesa cadastrada com sucesso!");
      
      // Log de Auditoria
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Cadastro Manual de Despesa",
        after_data: { ...formData, id: newTx.id }
      }]);

      // Reset form & reload
      setFormData({
        description: "",
        amount: "",
        due_date: new Date().toISOString().split("T")[0],
        category_id: "",
        cost_center: "Geral",
        notes: "",
      });
      setModalOpen(false);
      loadData();
    }
    setSaving(false);
  };

  const getDynamicStatus = (t: any) => {
    if (t.status === 'pago' || t.status === 'cancelado' || t.status === 'parcial') {
      return t.status;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (t.due_date < todayStr) return 'atrasado';
    if (t.due_date === todayStr) return 'vence_hoje';
    return 'no_prazo';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
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
      pago: "bg-slate-100 text-slate-700 border-slate-200",
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
    const catName = t.financial_categories?.name || "";
    
    const matchesSearch = t.description.toLowerCase().includes(q.toLowerCase()) || 
                          catName.toLowerCase().includes(q.toLowerCase());

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
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Contas a Pagar</h1>
          <p className="text-muted-foreground mt-1">Gestão de saídas, insumos, fornecedores, custos fixos e taxas.</p>
        </div>
        <div>
          <Button onClick={() => setModalOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold">
            <Plus className="size-4 mr-1.5" /> Nova Despesa
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="size-4 text-slate-400" />
          <span>Filtros de Busca</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Descrição / Categoria</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Ex: Aluguel, Pettenati..." 
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
                <SelectItem value="pago">Pago</SelectItem>
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

      {/* Tabela de Contas */}
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
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria / Centro</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {filtered.map(t => {
                  const dStatus = getDynamicStatus(t);
                  
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <CalIcon className="size-3.5 text-slate-400" />
                          {new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{t.description}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex flex-col">
                          <span>{t.financial_categories?.name || 'Avulso'}</span>
                          <span className="text-[10px] text-muted-foreground">Centro: {t.cost_center}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-semibold ${getStatusTone(dStatus)}`}>
                          {getStatusLabel(dStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {dStatus !== 'pago' && dStatus !== 'cancelado' && (
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              size="sm" 
                              onClick={() => handleQuickQuitar(t.id)} 
                              className="bg-slate-900 hover:bg-slate-800 text-white h-7 px-3 text-[11px] font-semibold"
                            >
                              <ArrowUpToLine className="size-3 mr-1" /> Quitar
                            </Button>
                          </div>
                        )}
                        {dStatus === 'pago' && (
                          <span className="text-[11px] text-slate-500 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="size-3.5 text-slate-400" />
                            em {t.payment_date && new Date(t.payment_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground text-sm">
                      Nenhuma conta a pagar encontrada para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Despesa */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleCreateDespesa} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-850">Lançamento de Despesa Manual</DialogTitle>
              <DialogDescription className="text-xs">Registre despesas de custos fixos, insumos ou outros pagamentos.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-semibold">Descrição / Favorecido *</Label>
                <Input 
                  id="description"
                  placeholder="Ex: Aluguel Galpão - Junho"
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
                  <Label className="text-xs font-semibold">Categoria *</Label>
                  <Select value={formData.category_id} onValueChange={v => setFormData({ ...formData, category_id: v })} required>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
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
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs font-semibold">Observações</Label>
                <Textarea 
                  id="notes"
                  placeholder="Informações adicionais da conta"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="h-9 text-xs">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-semibold">
                {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Salvar Lançamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
