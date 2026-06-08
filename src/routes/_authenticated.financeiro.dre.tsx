import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Calendar, Landmark, Percent, Loader2, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/financeiro/dre")({
  head: () => ({ meta: [{ title: "DRE Gerencial · Financeiro" }] }),
  component: DRE,
});

function DRE() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cc, setCc] = useState("Todos");
  const [period, setPeriod] = useState("mes"); // mes, trimestre, ano, personalizado
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    setLoading(true);
    // DRE considera todos os títulos ativos (não cancelados)
    const { data: txData } = await supabase
      .from('financial_transactions')
      .select('*, financial_categories(*)')
      .neq('status', 'cancelado');
    
    if (txData) setData(txData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Set default dates based on chosen period
  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    if (period === "mes") {
      const start = new Date(y, m, 1).toISOString().split('T')[0];
      const end = new Date(y, m + 1, 0).toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    } else if (period === "trimestre") {
      const qStartMonth = Math.floor(m / 3) * 3;
      const start = new Date(y, qStartMonth, 1).toISOString().split('T')[0];
      const end = new Date(y, qStartMonth + 3, 0).toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    } else if (period === "ano") {
      const start = `${y}-01-01`;
      const end = `${y}-12-31`;
      setStartDate(start);
      setEndDate(end);
    }
  }, [period]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Filtragem por Competência (due_date) e Centro de Custo
  const filtered = data.filter(t => {
    const matchesCC = cc === "Todos" || t.cost_center === cc;
    const matchesStart = !startDate || t.due_date >= startDate;
    const matchesEnd = !endDate || t.due_date <= endDate;
    return matchesCC && matchesStart && matchesEnd;
  });

  // Agrupamento por Categoria (conforme Plano de Contas)
  let receitaBruta = 0;
  let impostos = 0;
  let custosVariaveis = 0;
  let custosFixos = 0;
  let financeiro = 0;

  filtered.forEach(t => {
    const amt = Number(t.amount || 0);
    const catType = t.financial_categories?.type || '';

    if (t.type === 'receber') {
      receitaBruta += amt; // Entradas sempre somam na Receita Bruta
    } else if (t.type === 'pagar') {
      if (catType === 'imposto') {
        impostos += amt;
      } else if (catType === 'custo_variavel') {
        custosVariaveis += amt;
      } else if (catType === 'custo_fixo') {
        custosFixos += amt;
      } else if (catType === 'financeiro') {
        financeiro += amt;
      } else {
        // Fallback para despesas sem categoria mapeada
        custosFixos += amt;
      }
    }
  });

  const margemContribuicao = receitaBruta - impostos - custosVariaveis;
  const lucroOperacional = margemContribuicao - custosFixos;
  const lucroLiquido = lucroOperacional - financeiro;

  // Percentuais de análise vertical (em relação à Receita Bruta)
  const getPct = (val: number) => {
    if (receitaBruta === 0) return "0.0%";
    return `${((val / receitaBruta) * 100).toFixed(1)}%`;
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">DRE Gerencial</h1>
          <p className="text-muted-foreground mt-1">Demonstrativo de Resultado do Exercício por competência (vencimento).</p>
        </div>
      </div>

      {/* Filtros da DRE */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Centro de Custo</label>
            <Select value={cc} onValueChange={setCc}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Centros</SelectItem>
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

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Período</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Mês Atual</SelectItem>
                <SelectItem value="trimestre">Trimestre Atual</SelectItem>
                <SelectItem value="ano">Ano Atual</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Início</label>
            <Input 
              type="date" 
              value={startDate} 
              onChange={e => { setStartDate(e.target.value); setPeriod("personalizado"); }}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Fim</label>
            <Input 
              type="date" 
              value={endDate} 
              onChange={e => { setEndDate(e.target.value); setPeriod("personalizado"); }}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Estrutura DRE Gerencial */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-10 space-y-5">
        
        {/* Receita Bruta */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-slate-200">
          <span className="font-bold text-slate-800 text-base">RECEITA OPERACIONAL BRUTA</span>
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-slate-400 w-12 text-right">100.0%</span>
            <span className="font-bold text-emerald-600 text-base min-w-[120px] text-right">{formatCurrency(receitaBruta)}</span>
          </div>
        </div>

        {/* Deduções e Custos Variáveis */}
        <div className="pl-4 space-y-3.5 border-b pb-4 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span>(-) Simples Nacional / Impostos</span>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-slate-400 w-12 text-right">{getPct(impostos)}</span>
              <span className="text-red-500 font-medium min-w-[120px] text-right">({formatCurrency(impostos)})</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>(-) Custos Variáveis (CMV / Insumos / Frete)</span>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-slate-400 w-12 text-right">{getPct(custosVariaveis)}</span>
              <span className="text-red-500 font-medium min-w-[120px] text-right">({formatCurrency(custosVariaveis)})</span>
            </div>
          </div>
        </div>

        {/* Margem de Contribuição */}
        <div className="flex justify-between items-center py-3.5 bg-slate-50 px-5 rounded-xl font-bold text-sm text-slate-800 border">
          <span className="flex items-center gap-2">
            <Percent className="size-4 text-slate-500" />
            MARGEM DE CONTRIBUIÇÃO
          </span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500 w-12 text-right">{getPct(margemContribuicao)}</span>
            <span className="text-slate-900 min-w-[120px] text-right">{formatCurrency(margemContribuicao)}</span>
          </div>
        </div>

        {/* Custos Fixos */}
        <div className="pl-4 space-y-3.5 border-b pb-4 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span>(-) Custos Fixos (Aluguel, Folha, Marketing, Software)</span>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-slate-400 w-12 text-right">{getPct(custosFixos)}</span>
              <span className="text-red-500 font-medium min-w-[120px] text-right">({formatCurrency(custosFixos)})</span>
            </div>
          </div>
        </div>

        {/* Lucro Operacional */}
        <div className="flex justify-between items-center py-3.5 bg-slate-50 px-5 rounded-xl font-bold text-sm text-slate-800 border">
          <span>= LUCRO OPERACIONAL BRUTO (EBITDA)</span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500 w-12 text-right">{getPct(lucroOperacional)}</span>
            <span className="text-slate-900 min-w-[120px] text-right">{formatCurrency(lucroOperacional)}</span>
          </div>
        </div>

        {/* Despesas Financeiras */}
        <div className="pl-4 space-y-3.5 border-b pb-4 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span>(-) Resultado Financeiro (Taxas de Cartão, Juros)</span>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-slate-400 w-12 text-right">{getPct(financeiro)}</span>
              <span className="text-red-500 font-medium min-w-[120px] text-right">({formatCurrency(financeiro)})</span>
            </div>
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="flex justify-between items-center py-5 bg-slate-900 text-white px-6 rounded-2xl shadow-md border border-slate-950">
          <span className="font-extrabold text-sm flex items-center gap-2">
            <Calculator className="size-4.5 text-emerald-400 animate-pulse" />
            LUCRO LÍQUIDO DO EXERCÍCIO
          </span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-400 font-medium w-12 text-right">{getPct(lucroLiquido)}</span>
            <span className={`font-black text-base min-w-[120px] text-right ${lucroLiquido < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {formatCurrency(lucroLiquido)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
