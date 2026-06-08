import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

export const Route = createFileRoute("/_authenticated/financeiro/dre")({
  head: () => ({ meta: [{ title: "DRE Gerencial · Financeiro" }] }),
  component: DRE,
});

function DRE() {
  const [data, setData] = useState<any[]>([]);
  const [cc, setCc] = useState("Todos");

  useEffect(() => {
    supabase.from('financial_transactions').select('*, financial_categories(*)').then(({data}) => {
      if (data) setData(data);
    });
  }, []);

  // Filtrar pelo CC
  const filtered = cc === "Todos" ? data : data.filter(d => d.cost_center === cc);

  // Calcular DRE
  let receitaBruta = 0;
  let impostos = 0;
  let custosVariaveis = 0;
  let custosFixos = 0;
  let financeiro = 0;

  filtered.forEach(t => {
    // Apenas considerando transações realizadas (pagas/recebidas) ou pela competência?
    // Em DRE gerencial geralmente consideramos competência (todas do mês), mas vamos simplificar pegando realizadas.
    if (t.status !== 'cancelado') {
      const amt = Number(t.amount);
      const type = t.financial_categories?.type || '';
      
      if (type === 'receita' || t.type === 'receber') receitaBruta += amt;
      else if (type === 'imposto') impostos += amt;
      else if (type === 'custo_variavel') custosVariaveis += amt;
      else if (type === 'custo_fixo') custosFixos += amt;
      else if (type === 'financeiro') financeiro += amt;
      else if (t.type === 'pagar') custosFixos += amt; // Fallback
    }
  });

  const margemContribuicao = receitaBruta - impostos - custosVariaveis;
  const lucroOperacional = margemContribuicao - custosFixos;
  const lucroLiquido = lucroOperacional - financeiro;

  const format = (v: number) => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">DRE Gerencial</h1>
          <p className="text-muted-foreground mt-1">Demonstração do Resultado do Exercício.</p>
        </div>
        <div className="w-48">
          <Select value={cc} onValueChange={setCc}>
            <SelectTrigger><SelectValue placeholder="Centro de Custo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Centros</SelectItem>
              <SelectItem value="Produção">Produção</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
              <SelectItem value="Geral">Geral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
        
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="font-semibold text-slate-800 text-lg">Receita Bruta</span>
          <span className="font-bold text-emerald-600 text-lg">{format(receitaBruta)}</span>
        </div>

        <div className="pl-6 space-y-3 text-sm text-slate-600 border-b pb-4">
          <div className="flex justify-between">
            <span>(-) Impostos e Deduções</span>
            <span className="text-red-500">{format(impostos)}</span>
          </div>
          <div className="flex justify-between">
            <span>(-) Custos Variáveis (CMV)</span>
            <span className="text-red-500">{format(custosVariaveis)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 bg-slate-50 px-6 rounded-lg font-medium">
          <span className="text-slate-800">= Margem de Contribuição</span>
          <span className="text-slate-900">{format(margemContribuicao)} <span className="text-xs text-muted-foreground ml-2">({receitaBruta ? ((margemContribuicao/receitaBruta)*100).toFixed(1) : 0}%)</span></span>
        </div>

        <div className="pl-6 space-y-3 text-sm text-slate-600 border-b pb-4">
          <div className="flex justify-between">
            <span>(-) Custos Fixos (Despesas Operacionais)</span>
            <span className="text-red-500">{format(custosFixos)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 bg-slate-50 px-6 rounded-lg font-medium">
          <span className="text-slate-800">= Lucro Operacional (EBITDA)</span>
          <span className="text-slate-900">{format(lucroOperacional)} <span className="text-xs text-muted-foreground ml-2">({receitaBruta ? ((lucroOperacional/receitaBruta)*100).toFixed(1) : 0}%)</span></span>
        </div>

        <div className="pl-6 space-y-3 text-sm text-slate-600 border-b pb-4">
          <div className="flex justify-between">
            <span>(-) Despesas Financeiras (Juros/Taxas)</span>
            <span className="text-red-500">{format(financeiro)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-5 bg-slate-900 text-slate-50 px-6 rounded-lg shadow-inner">
          <span className="font-bold text-lg flex items-center gap-2"><Calculator className="size-5 text-emerald-400" /> Lucro Líquido</span>
          <span className={`font-bold text-xl ${lucroLiquido < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {format(lucroLiquido)} 
            <span className="text-sm font-normal text-slate-400 ml-3">({receitaBruta ? ((lucroLiquido/receitaBruta)*100).toFixed(1) : 0}%)</span>
          </span>
        </div>

      </div>
    </div>
  );
}
