import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Loader2, Landmark, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/financeiro/centro-custos")({
  head: () => ({ meta: [{ title: "Centro de Custos · Financeiro" }] }),
  component: CentroCustos,
});

const COST_CENTERS = [
  'Atendimento', 'Designer', 'Financeiro', 'Impressão', 'Produção', 
  'Expedição', 'Compras', 'Estoque', 'Comercial', 'Diretoria', 'Geral'
];

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF19A3', '#19FFD8', '#8CFF19', '#FF4C4C', '#4C97FF', '#7F7F7F'
];

function CentroCustos() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { data: txData } = await supabase
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

  // Agrupar por Centro de Custo
  const centerSummaries = COST_CENTERS.map(center => {
    let receitas = 0;
    let despesas = 0;

    data.forEach(t => {
      if (t.cost_center === center) {
        const amt = Number(t.amount || 0);
        if (t.type === 'receber') receitas += amt;
        if (t.type === 'pagar') despesas += amt;
      }
    });

    return {
      name: center,
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  }).filter(c => c.receitas > 0 || c.despesas > 0); // Excluir vazios para não poluir

  // Dados para o gráfico de despesas por área (PieChart)
  const pieData = centerSummaries
    .filter(c => c.despesas > 0)
    .map(c => ({
      name: c.name,
      value: c.despesas
    }));

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Módulo Financeiro</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Centro de Custos</h1>
        <p className="text-muted-foreground mt-1">Visibilidade de receitas, despesas e rentabilidade por departamento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de distribuição de despesas */}
        <Card className="lg:col-span-1 border border-border shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma despesa para exibir no gráfico.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits:2})}`]}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico comparativo de Receitas vs Despesas */}
        <Card className="lg:col-span-2 border border-border shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 font-sans">Receitas vs Despesas por Área</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {centerSummaries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Nenhum lançamento no período.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={centerSummaries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis tickFormatter={(val) => `R$${val}`} tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`]}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}}
                  />
                  <Legend tick={{fontSize: 10}} wrapperStyle={{paddingTop: 10}} />
                  <Bar name="Receitas" dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar name="Despesas" dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Consolidado */}
      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-sm font-bold text-slate-800">Demonstrativo por Centro de Custo</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Centro de Custo</th>
                <th className="px-6 py-3 text-right">Total Receitas</th>
                <th className="px-6 py-3 text-right">Total Despesas</th>
                <th className="px-6 py-3 text-right">Saldo Líquido</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {centerSummaries.map((c, index) => {
                const isPositive = c.saldo >= 0;
                return (
                  <tr key={c.name} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {formatCurrency(c.receitas)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-500">
                      {formatCurrency(c.despesas)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(c.saldo)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {isPositive ? 'Superavitário' : 'Deficitário'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {centerSummaries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    Nenhum centro de custo com movimentação ativa no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
