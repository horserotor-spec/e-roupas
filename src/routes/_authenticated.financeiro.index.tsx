import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, 
  AlertTriangle, DollarSign, Calendar, Activity, Loader2, ArrowRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/financeiro/")({
  head: () => ({ meta: [{ title: "Visão Geral · Financeiro" }] }),
  component: FinanceiroOverview,
});

function FinanceiroOverview() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(name)')
      .order('due_date', { ascending: false });
    
    if (data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  // Cálculo dos KPIs
  let receberHoje = 0;
  let receberVencido = 0;
  let pagarHoje = 0;
  let pagarVencido = 0;
  let saldoCaixa = 0; // Total recebido - total pago
  let previstoEntradas = 0; // pendente no futuro
  let previstoSaidas = 0; // pendente no futuro
  let entradasMes = 0; // recebidos no mês atual
  let saidasMes = 0; // pagos no mês atual

  transactions.forEach(t => {
    const amount = Number(t.amount || 0);
    const isReceber = t.type === 'receber';
    const isPagar = t.type === 'pagar';
    const date = t.payment_date || t.due_date;

    if (t.status === 'recebido') {
      saldoCaixa += amount;
      if (date >= startOfMonth && date <= endOfMonth) {
        entradasMes += amount;
      }
    } else if (t.status === 'pago') {
      saldoCaixa -= amount;
      if (date >= startOfMonth && date <= endOfMonth) {
        saidasMes += amount;
      }
    } else if (t.status !== 'cancelado') {
      // Título pendente/atrasado
      if (isReceber) {
        previstoEntradas += amount;
        if (t.due_date === todayStr) {
          receberHoje += amount;
        } else if (t.due_date < todayStr) {
          receberVencido += amount;
        }
      } else if (isPagar) {
        previstoSaidas += amount;
        if (t.due_date === todayStr) {
          pagarHoje += amount;
        } else if (t.due_date < todayStr) {
          pagarVencido += amount;
        }
      }
    }
  });

  const saldoPrevisto = saldoCaixa + previstoEntradas - previstoSaidas;
  const lucroOperacional = entradasMes - saidasMes;

  // Montar gráfico de fluxo de caixa dos últimos 7 dias
  const chartData = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    
    let entries = 0;
    let exits = 0;

    transactions.forEach(t => {
      if (t.status !== 'cancelado') {
        const targetDate = t.payment_date || t.due_date;
        if (targetDate === dStr) {
          if (t.type === 'receber') entries += Number(t.amount);
          if (t.type === 'pagar') exits += Number(t.amount);
        }
      }
    });

    chartData.push({
      name: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      Entradas: entries,
      Saídas: exits,
      Saldo: entries - exits
    });
  }

  const recentTx = transactions.slice(0, 5);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Módulo Financeiro</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Visão Geral</h1>
      </div>

      {/* Grid de KPIs - Destaques Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          label="Receber Hoje" 
          value={receberHoje} 
          icon={Calendar} 
          accent="emerald" 
          hint="Títulos com vencimento hoje" 
        />
        <KpiCard 
          label="Receber Vencido" 
          value={receberVencido} 
          icon={AlertTriangle} 
          accent="rose" 
          hint="Entradas pendentes em atraso" 
        />
        <KpiCard 
          label="Pagar Hoje" 
          value={pagarHoje} 
          icon={Calendar} 
          accent="amber" 
          hint="Saídas com vencimento hoje" 
        />
        <KpiCard 
          label="Pagar Vencido" 
          value={pagarVencido} 
          icon={AlertTriangle} 
          accent="red" 
          hint="Despesas pendentes vencidas" 
        />
      </div>

      {/* Grid de Saldos e Lucratividade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard 
          label="Saldo Previsto" 
          value={saldoPrevisto} 
          icon={Wallet} 
          hint={`Caixa real: ${formatCurrency(saldoCaixa)}`} 
        />
        <BalanceCard 
          label="Entradas no Mês" 
          value={entradasMes} 
          icon={TrendingUp} 
          trend="up" 
          hint="Recebimentos liquidados" 
        />
        <BalanceCard 
          label="Saídas no Mês" 
          value={saidasMes} 
          icon={TrendingDown} 
          trend="down" 
          hint="Pagamentos liquidados" 
        />
        <BalanceCard 
          label="Lucro Operacional" 
          value={lucroOperacional} 
          icon={DollarSign} 
          trend={lucroOperacional >= 0 ? "up" : "down"}
          hint="Entradas - Saídas reais" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Tendência de Fluxo de Caixa */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Movimentação Diária</h2>
              <p className="text-xs text-muted-foreground">Entradas e saídas agrupadas por dia (previsto/realizado).</p>
            </div>
            <Link to="/financeiro/fluxo-caixa" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Fluxo completo <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <YAxis tickFormatter={(val) => `R$${val}`} tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`]}
                  contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                />
                <Area type="monotone" name="Entradas" dataKey="Entradas" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEntradas)" />
                <Area type="monotone" name="Saídas" dataKey="Saídas" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSaidas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Lançamentos Recentes */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Lançamentos Recentes</h2>
                <p className="text-xs text-muted-foreground">Últimas transações financeiras geradas.</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentTx.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma transação encontrada.</p>}
              {recentTx.map((t) => {
                const isReceber = t.type === 'receber';
                const statusColor = t.status === 'recebido' || t.status === 'pago' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : (t.status === 'cancelado' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-amber-50 text-amber-700 border-amber-100');
                
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-700 truncate">{t.description}</div>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span>{new Date(t.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>CC: {t.cost_center}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold ${isReceber ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isReceber ? '+' : '-'} {formatCurrency(t.amount)}
                      </div>
                      <Badge variant="outline" className={`mt-1 h-5 px-1.5 text-[9px] uppercase font-bold tracking-wider rounded-md ${statusColor}`}>
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-4 border-t mt-4 flex gap-2">
            <Link to="/financeiro/receber" className="flex-1">
              <button className="w-full py-1.5 border border-border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">Receber</button>
            </Link>
            <Link to="/financeiro/pagar" className="flex-1">
              <button className="w-full py-1.5 border border-border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">Pagar</button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ 
  label, value, icon: Icon, accent, hint 
}: { 
  label: string; value: number; icon: any; accent: "emerald" | "rose" | "amber" | "red"; hint: string;
}) {
  const styles = {
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", icon: "text-emerald-500" },
    rose: { text: "text-rose-600", bg: "bg-rose-50 border-rose-100", icon: "text-rose-500" },
    amber: { text: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: "text-amber-500" },
    red: { text: "text-red-600", bg: "bg-red-50 border-red-100", icon: "text-red-500" },
  }[accent];

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-white ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg bg-white/80 border ${styles.icon}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className={`text-2xl font-bold tracking-tight mt-3 ${styles.text}`}>
        {formatCurrency(value)}
      </div>
      <div className="text-[10px] text-slate-400 mt-1">{hint}</div>
    </div>
  );
}

function BalanceCard({ 
  label, value, icon: Icon, trend, hint 
}: { 
  label: string; value: number; icon: any; trend?: "up" | "down"; hint: string;
}) {
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-800";
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="p-1.5 rounded-lg bg-slate-50 border text-slate-400">
          <Icon className="size-4" />
        </div>
      </div>
      <div className={`text-2xl font-bold tracking-tight mt-3 ${trendColor}`}>
        {formatCurrency(value)}
      </div>
      <div className="text-[10px] text-slate-400 mt-1">{hint}</div>
    </div>
  );
}
