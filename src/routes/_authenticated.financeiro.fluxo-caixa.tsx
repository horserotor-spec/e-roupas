import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2, Calendar, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/financeiro/fluxo-caixa")({
  head: () => ({ meta: [{ title: "Fluxo de Caixa · Financeiro" }] }),
  component: FluxoCaixa,
});

function FluxoCaixa() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupType, setGroupType] = useState("dia"); // dia, semana, mes
  const [viewType, setViewType] = useState("previsto"); // previsto, realizado

  const loadData = async () => {
    setLoading(true);
    const { data: txData, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .neq('status', 'cancelado');
    if (txData) setData(txData);
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

  // Agrupamento dos dados temporal
  const getGroupedData = () => {
    const today = new Date();
    const chartMap: Record<string, { label: string; dateKey: string; entradas: number; saidas: number; saldo: number }> = {};

    if (groupType === "dia") {
      // Últimos 10 dias
      for (let i = -5; i <= 4; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        chartMap[dateStr] = { label, dateKey: dateStr, entradas: 0, saidas: 0, saldo: 0 };
      }
    } else if (groupType === "semana") {
      // Últimas 6 semanas
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - (i * 7));
        // Achar início da semana (Domingo)
        const day = d.getDay();
        const diff = d.getDate() - day;
        const sunday = new Date(d.setDate(diff));
        const sundayStr = sunday.toISOString().split('T')[0];
        
        // Fim da semana (Sábado)
        const saturday = new Date(sunday);
        saturday.setDate(saturday.getDate() + 6);
        
        const label = `Sem ${sunday.getDate()}/${sunday.getMonth() + 1}`;
        chartMap[sundayStr] = { label, dateKey: sundayStr, entradas: 0, saidas: 0, saldo: 0 };
      }
    } else {
      // Últimos 6 meses do ano corrente
      const currentYear = today.getFullYear();
      for (let m = 0; m < 12; m++) {
        const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-01`;
        const label = new Date(currentYear, m, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        chartMap[dateStr] = { label, dateKey: dateStr, entradas: 0, saidas: 0, saldo: 0 };
      }
    }

    // Processar transações
    data.forEach(t => {
      const amt = Number(t.amount || 0);
      const isReceber = t.type === 'receber';
      
      // Decidir qual data usar: previsto (due_date) ou realizado (payment_date se pago, senão descarta se visualizando apenas realizado)
      let targetDate = "";
      if (viewType === "realizado") {
        if (t.status === 'recebido' || t.status === 'pago') {
          targetDate = t.payment_date || t.due_date;
        } else {
          return; // ignora não liquidados se for realizado
        }
      } else {
        targetDate = t.due_date; // previsto sempre considera a data de vencimento original
      }

      // Encontrar chave de agrupamento correspondente
      let matchedKey = "";
      const keys = Object.keys(chartMap).sort();

      if (groupType === "dia") {
        if (chartMap[targetDate]) matchedKey = targetDate;
      } else if (groupType === "semana") {
        // Encontrar a semana correta
        for (let i = 0; i < keys.length; i++) {
          const start = keys[i];
          const endObj = new Date(start + 'T12:00:00');
          endObj.setDate(endObj.getDate() + 7);
          const end = endObj.toISOString().split('T')[0];
          
          if (targetDate >= start && targetDate < end) {
            matchedKey = start;
            break;
          }
        }
      } else {
        // Encontrar o mês correspondente
        const yearMonth = targetDate.substring(0, 7) + "-01";
        if (chartMap[yearMonth]) matchedKey = yearMonth;
      }

      if (matchedKey && chartMap[matchedKey]) {
        if (isReceber) {
          chartMap[matchedKey].entradas += amt;
        } else {
          chartMap[matchedKey].saidas += amt;
        }
      }
    });

    // Converter mapa em array ordenado e calcular saldos
    return Object.keys(chartMap).sort().map(key => {
      const item = chartMap[key];
      item.saldo = item.entradas - item.saidas;
      return item;
    });
  };

  const chartData = getGroupedData();

  // Calcular consolidados totais do período no gráfico
  const totalEntradas = chartData.reduce((acc, c) => acc + c.entradas, 0);
  const totalSaidas = chartData.reduce((acc, c) => acc + c.saidas, 0);
  const totalSaldo = totalEntradas - totalSaidas;

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Módulo Financeiro</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Fluxo de Caixa</h1>
          <p className="text-muted-foreground mt-1">Monitore e projete as entradas e saídas de caixa da sua empresa.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Seletor de Previsto / Realizado */}
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="h-9 w-40 text-xs bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previsto">Fluxo Previsto</SelectItem>
              <SelectItem value="realizado">Fluxo Realizado</SelectItem>
            </SelectContent>
          </Select>

          {/* Seletor de Agrupamento */}
          <Select value={groupType} onValueChange={setGroupType}>
            <SelectTrigger className="h-9 w-32 text-xs bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Agrupar por Dia</SelectItem>
              <SelectItem value="semana">Agrupar por Semana</SelectItem>
              <SelectItem value="mes">Agrupar por Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm rounded-2xl bg-white">
          <CardHeader className="py-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Entradas</span>
          </CardHeader>
          <CardContent className="pb-4 flex justify-between items-center">
            <span className="text-2xl font-bold text-emerald-600">{formatCurrency(totalEntradas)}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100">
              <TrendingUp className="size-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm rounded-2xl bg-white">
          <CardHeader className="py-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Saídas</span>
          </CardHeader>
          <CardContent className="pb-4 flex justify-between items-center">
            <span className="text-2xl font-bold text-red-500">{formatCurrency(totalSaidas)}</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100">
              <TrendingDown className="size-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm rounded-2xl bg-white">
          <CardHeader className="py-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Consolidado</span>
          </CardHeader>
          <CardContent className="pb-4 flex justify-between items-center">
            <span className={`text-2xl font-extrabold ${totalSaldo >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatCurrency(totalSaldo)}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 border">
              <RefreshCw className="size-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área do Gráfico Principal */}
      <Card className="border border-border shadow-sm rounded-2xl bg-white p-6">
        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              {viewType === "previsto" ? "Fluxo de Caixa Previsto (Competência)" : "Fluxo de Caixa Realizado (Regime de Caixa)"}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Entradas e saídas de caixa projetadas no tempo.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <YAxis tickFormatter={(val) => `R$${val}`} tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`]}
                contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px'}}
              />
              <Legend wrapperStyle={{paddingTop: 15, fontSize: 11}} />
              <Bar name="Entradas" dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="Saídas" dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Demonstrativo Detalhado em Tabela */}
      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-sm font-bold text-slate-800">Demonstrativo de Períodos</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Período</th>
                <th className="px-6 py-3 text-right">Entradas</th>
                <th className="px-6 py-3 text-right">Saídas</th>
                <th className="px-6 py-3 text-right">Saldo Período</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {chartData.map(c => {
                const isPositive = c.saldo >= 0;
                return (
                  <tr key={c.label} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      {c.label}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">{formatCurrency(c.entradas)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-red-500">{formatCurrency(c.saidas)}</td>
                    <td className={`px-6 py-4 text-right font-extrabold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatCurrency(c.saldo)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {isPositive ? 'Positivo' : 'Negativo'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
