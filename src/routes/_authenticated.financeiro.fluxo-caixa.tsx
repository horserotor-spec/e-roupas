import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute("/_authenticated/financeiro/fluxo-caixa")({
  head: () => ({ meta: [{ title: "Fluxo de Caixa · Financeiro" }] }),
  component: FluxoCaixa,
});

function FluxoCaixa() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('financial_transactions').select('*').then(({data}) => {
      if (data) setData(data);
    });
  }, []);

  // Simular agrupamento por dia dos últimos 7 dias previstos
  const chartData = [];
  const today = new Date();
  
  for(let i=-3; i<=4; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    let entradas = 0;
    let saidas = 0;

    data.forEach(t => {
      if (t.status !== 'cancelado') {
        const targetDate = t.payment_date || t.due_date; // usa a data de pagamento se tiver, senão a de vencimento
        if (targetDate === dateStr) {
          if (t.type === 'receber') entradas += Number(t.amount);
          if (t.type === 'pagar') saidas += Number(t.amount);
        }
      }
    });

    chartData.push({
      data: d.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}),
      entradas,
      saidas,
      saldo: entradas - saidas
    });
  }

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Fluxo de Caixa</h1>
        <p className="text-muted-foreground mt-1">Previsão e realização diária.</p>
      </div>

      <Card className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="data" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis tickFormatter={(val) => `R$ ${val}`} tickLine={false} axisLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, '']}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Line type="monotone" name="Entradas" dataKey="entradas" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" name="Saídas" dataKey="saidas" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" name="Saldo do Dia" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
