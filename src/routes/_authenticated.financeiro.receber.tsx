import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowDownToLine, CheckCircle2, Clock, XCircle, Search, Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/financeiro/receber")({
  head: () => ({ meta: [{ title: "Contas a Receber · Financeiro" }] }),
  component: ContasReceber,
});

function ContasReceber() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [q, setQ] = useState("");

  const loadData = async () => {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*, orders(code, client_name)')
      .eq('type', 'receber')
      .order('due_date', { ascending: true });
    if (data) setTransactions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConciliar = async (id: string, amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('financial_transactions').update({
      status: 'recebido',
      payment_date: today,
    }).eq('id', id);
    if (error) {
      toast.error("Erro ao conciliar.");
    } else {
      toast.success("Recebimento confirmado!");
      loadData();
    }
  };

  const filtered = transactions.filter(t => 
    (t.description?.toLowerCase().includes(q.toLowerCase()) || t.orders?.client_name?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contas a Receber</h1>
          <p className="text-muted-foreground mt-1">Gestão de faturamento e entradas.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente ou ref..." 
              value={q} 
              onChange={e => setQ(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Descrição / Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Forma Pagto</th>
              <th className="px-4 py-3 font-medium text-right">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(t => {
              const isOverdue = t.status === 'pendente' && t.due_date < new Date().toISOString().split('T')[0];
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalIcon className="size-4 text-slate-400" />
                      {new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{t.description} {t.orders?.code && <span className="text-muted-foreground text-xs ml-2">#{t.orders.code}</span>}</td>
                  <td className="px-4 py-3">{t.orders?.client_name || '-'}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{t.payment_method || 'Não inf.'}</Badge></td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">R$ {Number(t.amount).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
                  <td className="px-4 py-3">
                    {t.status === 'recebido' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Recebido</Badge>
                    ) : isOverdue ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Atrasado</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pendente</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.status !== 'recebido' && (
                      <Button size="sm" onClick={() => handleConciliar(t.id, t.amount)} className="bg-emerald-600 hover:bg-emerald-700">
                        <ArrowDownToLine className="size-4 mr-1.5" /> Baixar
                      </Button>
                    )}
                    {t.status === 'recebido' && (
                      <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        em {t.payment_date && new Date(t.payment_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nenhum título a receber encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
