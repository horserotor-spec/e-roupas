import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckSquare, Calendar, ArrowDownRight, ArrowUpRight, Search, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/financeiro/conciliacao")({
  head: () => ({ meta: [{ title: "Conciliação · Financeiro" }] }),
  component: Conciliacao,
});

function Conciliacao() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Modal Conciliação
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    original_amount: 0,
    interest_amount: "0",
    discount_amount: "0",
    tax_amount: "0", // Salva na observação ou nas taxas se houver (vamos deduzir/gravar em logs)
    final_amount: "0", // Valor líquido pago/recebido
    payment_method: "PIX",
  });

  const loadData = async () => {
    setLoading(true);
    // Seleciona apenas os títulos abertos (pendentes, atrasados, no prazo, vence hoje)
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(*)')
      .in('status', ['pendente', 'no_prazo', 'vence_hoje', 'atrasado', 'parcial'])
      .order('due_date', { ascending: true });
    
    if (data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openConciliation = (tx: any) => {
    setSelectedTx(tx);
    setFormData({
      payment_date: new Date().toISOString().split("T")[0],
      original_amount: Number(tx.amount),
      interest_amount: "0",
      discount_amount: "0",
      tax_amount: "0",
      final_amount: String(tx.amount),
      payment_method: tx.payment_method || "PIX",
    });
    setModalOpen(true);
  };

  // Recalcula o valor final ao alterar juros/descontos/taxas
  const handleAmountChange = (field: string, val: string) => {
    const orig = formData.original_amount;
    let juros = parseFloat(field === 'interest_amount' ? val : formData.interest_amount) || 0;
    let desc = parseFloat(field === 'discount_amount' ? val : formData.discount_amount) || 0;
    let taxa = parseFloat(field === 'tax_amount' ? val : formData.tax_amount) || 0;

    // Se for receita (receber): Valor Final = Original + Juros - Desconto
    // Se for despesa (pagar): Valor Final = Original + Juros - Desconto + Taxa
    const isReceber = selectedTx?.type === 'receber';
    let finalAmt = isReceber 
      ? (orig + juros - desc - taxa) 
      : (orig + juros - desc + taxa);

    setFormData(prev => ({
      ...prev,
      [field]: val,
      final_amount: String(Math.max(0, finalAmt).toFixed(2))
    }));
  };

  const handleConciliar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;

    setSaving(true);
    const finalAmount = parseFloat(formData.final_amount) || 0;
    const interest = parseFloat(formData.interest_amount) || 0;
    const discount = parseFloat(formData.discount_amount) || 0;
    
    // Status final
    const finalStatus = selectedTx.type === 'receber' ? 'recebido' : 'pago';

    const beforeData = { ...selectedTx };

    // Atualiza a transação
    const { error } = await supabase
      .from('financial_transactions')
      .update({
        status: finalStatus,
        payment_date: formData.payment_date,
        amount: finalAmount, // atualiza com o valor real final liquidado
        interest_amount: interest,
        discount_amount: discount,
        payment_method: formData.payment_method,
        notes: `${selectedTx.notes || ''} [Conciliado: Juros R$${interest} | Desc R$${discount} | Taxa R$${formData.tax_amount}]`.trim(),
      })
      .eq('id', selectedTx.id);

    if (error) {
      toast.error("Erro ao conciliar título: " + error.message);
    } else {
      toast.success("Título conciliado com sucesso!");

      // Log de Auditoria detalhado (Quem alterou, antes, depois, data, hora)
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Conciliação de Lançamento",
        before_data: beforeData,
        after_data: {
          id: selectedTx.id,
          status: finalStatus,
          payment_date: formData.payment_date,
          amount: finalAmount,
          interest_amount: interest,
          discount_amount: discount,
          payment_method: formData.payment_method,
          tax_applied: parseFloat(formData.tax_amount)
        }
      }]);

      setModalOpen(false);
      loadData();
    }
    setSaving(false);
  };

  const getDynamicStatus = (t: any) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (t.due_date < todayStr) return 'atrasado';
    if (t.due_date === todayStr) return 'vence_hoje';
    return 'no_prazo';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      atrasado: "Atrasado",
      vence_hoje: "Vence hoje",
      no_prazo: "No prazo",
      parcial: "Parcial",
    };
    return labels[status] || status;
  };

  const getStatusTone = (status: string) => {
    const tones: Record<string, string> = {
      atrasado: "bg-rose-50 text-rose-700 border-rose-100",
      vence_hoje: "bg-amber-50 text-amber-700 border-amber-100",
      no_prazo: "bg-blue-50 text-blue-700 border-blue-100",
      parcial: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return tones[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(q.toLowerCase()) ||
    (t.financial_categories?.name || "").toLowerCase().includes(q.toLowerCase()) ||
    t.cost_center.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-6 animate-in fade-in">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Conciliação Financeira</h1>
        <p className="text-muted-foreground mt-1">Realize a baixa de títulos informando juros, descontos, tarifas e data de pagamento real.</p>
      </div>

      <div className="flex items-center gap-3 max-w-md bg-white border p-1 rounded-xl shadow-sm">
        <Search className="size-4 text-slate-400 ml-2.5" />
        <input 
          placeholder="Filtrar títulos pendentes por descrição, categoria..." 
          value={q} 
          onChange={e => setQ(e.target.value)}
          className="h-8 w-full text-xs outline-none bg-transparent pr-2"
        />
      </div>

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
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria / Centro</th>
                  <th className="px-4 py-3 text-right">Valor Original</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {filtered.map(t => {
                  const isReceber = t.type === 'receber';
                  const dStatus = getDynamicStatus(t);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-center w-12">
                        {isReceber ? (
                          <div className="size-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center" title="A Receber">
                            <ArrowDownRight className="size-4" />
                          </div>
                        ) : (
                          <div className="size-6 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center" title="A Pagar">
                            <ArrowUpRight className="size-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Calendar className="size-3.5 text-slate-400" />
                          {new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{t.description}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex flex-col">
                          <span>{t.financial_categories?.name || 'Lançamento Avulso'}</span>
                          <span className="text-[10px] text-muted-foreground">Centro: {t.cost_center}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${isReceber ? 'text-emerald-600' : 'text-red-500'}`}>
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-semibold ${getStatusTone(dStatus)}`}>
                          {getStatusLabel(dStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          size="sm" 
                          onClick={() => openConciliation(t)} 
                          className="bg-slate-900 hover:bg-slate-800 text-white h-7 px-3 text-[11px] font-semibold"
                        >
                          <CheckSquare className="size-3 mr-1.5" /> Baixar / Conciliar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground text-sm">
                      Nenhum título pendente encontrado para conciliação.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Baixar / Conciliar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleConciliar} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Landmark className="size-5 text-primary" />
                Conciliação de Título
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedTx?.type === 'receber' ? 'Registre a entrada e liquidação deste recebível.' : 'Registre a saída e quitação desta despesa.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center">
                <span className="font-semibold text-slate-600">Descrição:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[220px]">{selectedTx?.description}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="payment_date" className="text-xs font-semibold">Data do Pagamento *</Label>
                  <Input 
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={e => setFormData({ ...formData, payment_date: e.target.value })}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Forma de Pagamento *</Label>
                  <Select value={formData.payment_method} onValueChange={v => setFormData({ ...formData, payment_method: v })} required>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="juros" className="text-xs font-semibold">Juros / Multa (+)</Label>
                  <Input 
                    id="juros"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.interest_amount}
                    onChange={e => handleAmountChange('interest_amount', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="desconto" className="text-xs font-semibold">Desconto (-)</Label>
                  <Input 
                    id="desconto"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.discount_amount}
                    onChange={e => handleAmountChange('discount_amount', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="taxa" className="text-xs font-semibold">Taxa Adm. / Cartão</Label>
                  <Input 
                    id="taxa"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.tax_amount}
                    onChange={e => handleAmountChange('tax_amount', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-slate-700 text-sm">Valor Final Conciliado:</span>
                <span className={`text-base font-extrabold ${selectedTx?.type === 'receber' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatCurrency(parseFloat(formData.final_amount) || 0)}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="h-9 text-xs">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-semibold">
                {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Confirmar Conciliação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
