import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Calendar, TrendingUp, TrendingDown, Percent, DollarSign, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/financeiro/dre")({
  head: () => ({ meta: [{ title: "DRE Anual · e-roupas OS" }] }),
  component: DREPage,
});

const MONTH_NAMES = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

function DREPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [cmvConfig, setCmvConfig] = useState({
    saquinho: 0.50,
    etiqueta: 0.30,
    dtf: 1.50,
    bordado: 2.00,
    mp_default: 15.00
  });

  const years = ["2026", "2027", "2028", "2029", "2030"];

  const loadData = async () => {
    setLoading(true);
    try {
      const yearStart = `${selectedYear}-01-01`;
      const yearEnd = `${selectedYear}-12-31`;

      // 1. Buscar transações financeiras do ano selecionado (não canceladas)
      const { data: txData, error: txError } = await supabase
        .from("financial_transactions")
        .select("*, financial_categories(*)")
        .neq("status", "cancelado")
        .gte("due_date", yearStart)
        .lte("due_date", yearEnd);

      if (txError) throw txError;
      setTransactions(txData || []);

      // 2. Buscar movimentações de estoque do tipo consumo no ano selecionado
      const { data: movData, error: movError } = await supabase
        .from("inventory_movements")
        .select(`
          quantity,
          created_at,
          inventory_batches (
            average_cost,
            product_variants (
              products (
                name,
                category,
                supports_dtf,
                supports_embroidery
              )
            )
          )
        `)
        .eq("movement_type", "consumo")
        .gte("created_at", `${yearStart}T00:00:00.000Z`)
        .lte("created_at", `${yearEnd}T23:59:59.999Z`);

      if (movError) throw movError;
      setMovements(movData || []);

      // 3. Buscar configurações de CMV
      const { data: configData } = await supabase
        .from("system_settings")
        .select("*")
        .eq("key", "cmv_costs_config")
        .maybeSingle();

      if (configData && configData.value) {
        setCmvConfig(prev => ({ ...prev, ...configData.value }));
      }

    } catch (err: any) {
      console.error("Erro ao carregar dados do DRE:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  // Função auxiliar para obter o índice do mês (0-11) a partir de uma data YYYY-MM-DD
  const getMonthFromDate = (dateStr: string) => {
    if (!dateStr) return 0;
    const parts = dateStr.split("-");
    if (parts.length < 2) return 0;
    return parseInt(parts[1], 10) - 1;
  };

  // Função auxiliar para obter o índice do mês a partir de um timestamp ISO
  const getMonthFromTimestamp = (timestamp: string) => {
    if (!timestamp) return 0;
    const date = new Date(timestamp);
    return date.getMonth();
  };

  // Inicializar estrutura da planilha (12 meses + coluna de Total)
  const createEmptyRow = () => Array(13).fill(0);

  // Linhas da DRE
  const receitaOperacionalBruta = createEmptyRow();
  const impostosEDevolucoes = createEmptyRow();
  const receitaOperacionalLiquida = createEmptyRow();
  const cmv = createEmptyRow();
  const cmvPercent = createEmptyRow();
  const lucroBruto = createEmptyRow();
  const margemBruta = createEmptyRow();

  // Subcategorias de Despesas Operacionais
  const despesasOperacionais = createEmptyRow();
  const despesasGeraisAdmin = createEmptyRow();
  const despesasAluguelCondoIptu = createEmptyRow();
  const despesasMarketing = createEmptyRow();
  const despesasPessoal = createEmptyRow();
  const despesasInvestimento = createEmptyRow();
  const despesasProLabore = createEmptyRow();
  const despesasUtilidades = createEmptyRow();

  const lucroOperacional = createEmptyRow();
  const margemOperacional = createEmptyRow();

  // Resultado Financeiro
  const resultadoFinanceiro = createEmptyRow();
  const receitasFinanceiras = createEmptyRow();
  const despesasFinanceiras = createEmptyRow();

  const lucroLiquido = createEmptyRow();
  const margemLiquida = createEmptyRow();

  // 1. Processar Transações Financeiras (Entradas e Saídas)
  transactions.forEach(tx => {
    const m = getMonthFromDate(tx.due_date);
    if (m < 0 || m > 11) return;
    const amt = Number(tx.amount || 0);
    const catName = tx.financial_categories?.name || "";
    const catType = tx.financial_categories?.type || "";

    if (tx.type === "receber") {
      if (catType === "financeiro") {
        receitasFinanceiras[m] += amt;
        receitasFinanceiras[12] += amt;
      } else {
        receitaOperacionalBruta[m] += amt;
        receitaOperacionalBruta[12] += amt;
      }
    } else if (tx.type === "pagar") {
      if (catType === "imposto") {
        impostosEDevolucoes[m] += amt;
        impostosEDevolucoes[12] += amt;
      } else if (catType === "financeiro") {
        despesasFinanceiras[m] += amt;
        despesasFinanceiras[12] += amt;
      } else if (catType === "custo_fixo" || catType === "custo_variavel") {
        // Mapear despesas operacionais conforme categorias específicas
        const nameLower = catName.toLowerCase();
        
        if (nameLower === "cmv" || nameLower.includes("cmv")) {
          cmv[m] += amt;
          cmv[12] += amt;
        } else if (nameLower.includes("aluguel") || nameLower.includes("condomínio") || nameLower.includes("iptu")) {
          despesasAluguelCondoIptu[m] += amt;
          despesasAluguelCondoIptu[12] += amt;
        } else if (nameLower.includes("marketing") || nameLower.includes("tráfego") || nameLower.includes("propaganda")) {
          despesasMarketing[m] += amt;
          despesasMarketing[12] += amt;
        } else if (nameLower.includes("pró-labore") || nameLower.includes("prolabore")) {
          despesasProLabore[m] += amt;
          despesasProLabore[12] += amt;
        } else if (nameLower.includes("salário") || nameLower.includes("pessoal") || nameLower.includes("folha")) {
          despesasPessoal[m] += amt;
          despesasPessoal[12] += amt;
        } else if (nameLower.includes("energia") || nameLower.includes("elétrica") || nameLower.includes("internet") || nameLower.includes("telefone") || nameLower.includes("telefonia") || nameLower.includes("água")) {
          despesasUtilidades[m] += amt;
          despesasUtilidades[12] += amt;
        } else if (nameLower.includes("investimento") || nameLower.includes("máquina") || nameLower.includes("melhoria")) {
          despesasInvestimento[m] += amt;
          despesasInvestimento[12] += amt;
        } else {
          // Fallback para Gerais e Administrativas
          despesasGeraisAdmin[m] += amt;
          despesasGeraisAdmin[12] += amt;
        }
      }
    }
  });

  // 2. Processar Movimentações de Estoque (Cálculo Real do CMV)
  movements.forEach(mov => {
    const m = getMonthFromTimestamp(mov.created_at);
    if (m < 0 || m > 11) return;

    const qty = Math.abs(Number(mov.quantity || 0));
    if (qty <= 0) return;

    const batch = mov.inventory_batches;
    const variant = batch?.product_variants;
    const prod = variant?.products;

    // Calcular componentes
    const costPeca = qty * (Number(batch?.average_cost || 0) || cmvConfig.mp_default);
    const costSaquinho = qty * cmvConfig.saquinho;
    const costEtiqueta = qty * cmvConfig.etiqueta;
    
    // DTF e Bordado aplicam-se apenas a camisetas/produtos compatíveis
    const hasDtf = prod?.supports_dtf ?? true;
    const hasEmbroidery = prod?.supports_embroidery ?? true;
    
    const costDtf = hasDtf ? (qty * cmvConfig.dtf) : 0;
    const costBordado = hasEmbroidery ? (qty * cmvConfig.bordado) : 0;

    const totalItemCMV = costPeca + costSaquinho + costEtiqueta + costDtf + costBordado;

    cmv[m] += totalItemCMV;
    cmv[12] += totalItemCMV;
  });

  // 3. Realizar Cálculos de Margens e Totais para cada mês (e coluna de Total)
  for (let i = 0; i <= 12; i++) {
    // Receita Operacional Líquida = Receita Operacional Bruta - Impostos e Devoluções
    receitaOperacionalLiquida[i] = receitaOperacionalBruta[i] - impostosEDevolucoes[i];

    // CMV %
    if (receitaOperacionalLiquida[i] > 0) {
      cmvPercent[i] = cmv[i] / receitaOperacionalLiquida[i];
    } else {
      cmvPercent[i] = 0;
    }

    // Lucro (Prejuízo) Bruto = Receita Operacional Líquida - CMV
    lucroBruto[i] = receitaOperacionalLiquida[i] - cmv[i];

    // Margem Bruta (%)
    if (receitaOperacionalLiquida[i] > 0) {
      margemBruta[i] = lucroBruto[i] / receitaOperacionalLiquida[i];
    } else {
      margemBruta[i] = 0;
    }

    // Despesas Operacionais = Gerais e Adm + Aluguel + Marketing + Pessoal + Investimento + Pro labore + Utilidades
    despesasOperacionais[i] = 
      despesasGeraisAdmin[i] + 
      despesasAluguelCondoIptu[i] + 
      despesasMarketing[i] + 
      despesasPessoal[i] + 
      despesasInvestimento[i] + 
      despesasProLabore[i] + 
      despesasUtilidades[i];

    // Lucro/Prejuízo Operacional = Lucro Bruto - Despesas Operacionais
    lucroOperacional[i] = lucroBruto[i] - despesasOperacionais[i];

    // Margem Operacional (%)
    if (receitaOperacionalLiquida[i] > 0) {
      margemOperacional[i] = lucroOperacional[i] / receitaOperacionalLiquida[i];
    } else {
      margemOperacional[i] = 0;
    }

    // Resultado Financeiro = Receitas Financeiras - Despesas Financeiras
    resultadoFinanceiro[i] = receitasFinanceiras[i] - despesasFinanceiras[i];

    // Lucro (Prejuízo) Líquido = Lucro Operacional + Resultado Financeiro (Receitas Fin. - Despesas Fin.)
    lucroLiquido[i] = lucroOperacional[i] + resultadoFinanceiro[i];

    // Margem Líquida (%)
    if (receitaOperacionalLiquida[i] > 0) {
      margemLiquida[i] = lucroLiquido[i] / receitaOperacionalLiquida[i];
    } else {
      margemLiquida[i] = 0;
    }
  }

  const renderCell = (val: number, isPercent = false, isBold = false, allowColor = false) => {
    let formatted = "";
    if (isPercent) {
      formatted = `${(val * 100).toFixed(1)}%`;
    } else {
      formatted = formatCurrency(Math.abs(val));
      if (val < 0) {
        formatted = `- ${formatted}`;
      }
    }

    let colorCls = "text-slate-700";
    if (allowColor) {
      if (val > 0) colorCls = "text-emerald-600 font-semibold";
      else if (val < 0) colorCls = "text-red-500 font-semibold";
    }

    return (
      <span className={`${isBold ? 'font-bold' : ''} ${colorCls} tabular-nums`}>
        {formatted === "R$ 0,00" || formatted === "0.0%" ? "—" : formatted}
      </span>
    );
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in">
      
      {/* Header Planilha */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="e-roupas" className="h-8 object-contain" />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">DRE Gerencial {selectedYear}</h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 border rounded-lg shadow-sm">
          <Calendar className="size-4.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase">Selecione o Ano:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-8 w-24 text-xs font-bold border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y} className="text-xs font-bold">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 font-bold uppercase text-[9px] tracking-wider divide-x divide-slate-200">
                  <th className="px-4 py-3 sticky left-0 bg-slate-100 z-10 w-64 border-r border-slate-300">Estrutura DRE</th>
                  {MONTH_NAMES.map(m => (
                    <th key={m} className="px-3 py-3 text-center min-w-[90px]">{m}</th>
                  ))}
                  <th className="px-4 py-3 text-center bg-amber-50 font-black text-amber-900 border-l border-slate-350 min-w-[110px]">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 divide-x divide-slate-100">
                
                {/* Receita Bruta */}
                <tr className="bg-slate-50 font-bold border-b border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 text-slate-800">Receita Operacional Bruta</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">{renderCell(receitaOperacionalBruta[i])}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-50 text-slate-900 border-l border-slate-350">{renderCell(receitaOperacionalBruta[12], false, true)}</td>
                </tr>

                {/* Impostos */}
                <tr className="text-red-500 font-medium">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300">Impostos e Devoluções</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">({renderCell(impostosEDevolucoes[i])})</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">({renderCell(impostosEDevolucoes[12], false, true)})</td>
                </tr>

                {/* Receita Líquida */}
                <tr className="bg-slate-50 font-bold border-y border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 text-slate-800">Receita Operacional Líquida</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">{renderCell(receitaOperacionalLiquida[i])}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-50 text-slate-900 border-l border-slate-350">{renderCell(receitaOperacionalLiquida[12], false, true)}</td>
                </tr>

                {/* CMV */}
                <tr className="text-red-500 font-medium">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300">Custo da Mercadoria Vendida (CMV)</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">({renderCell(cmv[i])})</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">({renderCell(cmv[12], false, true)})</td>
                </tr>

                {/* CMV % */}
                <tr className="text-slate-400">
                  <td className="px-4 py-1.5 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">CMV %</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-1.5 text-center">{renderCell(cmvPercent[i], true)}</td>
                  ))}
                  <td className="px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350">{renderCell(cmvPercent[12], true, true)}</td>
                </tr>

                {/* Lucro Bruto */}
                <tr className="bg-slate-100 font-bold border-y border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-300 text-slate-800">Lucro (Prejuízo) Bruto</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">{renderCell(lucroBruto[i], false, true, true)}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-100 border-l border-slate-350">{renderCell(lucroBruto[12], false, true, true)}</td>
                </tr>

                {/* Margem Bruta % */}
                <tr className="text-slate-500 font-semibold bg-slate-50">
                  <td className="px-4 py-1.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 pl-8">Margem Bruta (%)</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-1.5 text-center">{renderCell(margemBruta[i], true)}</td>
                  ))}
                  <td className="px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350">{renderCell(margemBruta[12], true, true)}</td>
                </tr>

                {/* Despesas Operacionais */}
                <tr className="bg-slate-50 font-bold text-red-500 border-t border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300">Despesas Operacionais</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">({renderCell(despesasOperacionais[i])})</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-50 border-l border-slate-350">({renderCell(despesasOperacionais[12], false, true)})</td>
                </tr>

                {/* Sub-despesas */}
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Gerais e Administrativas</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasGeraisAdmin[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasGeraisAdmin[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Aluguel, Condomínio e IPTU</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasAluguelCondoIptu[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasAluguelCondoIptu[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Propaganda e Marketing</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasMarketing[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasMarketing[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Pessoal</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasPessoal[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasPessoal[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Investimento</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasInvestimento[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasInvestimento[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Pro labore</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasProLabore[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasProLabore[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Utilidades</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(despesasUtilidades[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(despesasUtilidades[12], false, true)}</td>
                </tr>

                {/* Lucro Operacional */}
                <tr className="bg-slate-100 font-bold border-y border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-300 text-slate-800">Lucro/Prejuízo Operacional</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">{renderCell(lucroOperacional[i], false, true, true)}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-100 border-l border-slate-350">{renderCell(lucroOperacional[12], false, true, true)}</td>
                </tr>

                {/* Margem Operacional % */}
                <tr className="text-slate-500 font-semibold bg-slate-50">
                  <td className="px-4 py-1.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 pl-8">Margem Operacional (%)</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-1.5 text-center">{renderCell(margemOperacional[i], true)}</td>
                  ))}
                  <td className="px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350">{renderCell(margemOperacional[12], true, true)}</td>
                </tr>

                {/* Resultado Financeiro */}
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td className="px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300">Resultado Financeiro</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2.5 text-right">{renderCell(resultadoFinanceiro[i], false, true, true)}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right bg-amber-50 border-l border-slate-350">{renderCell(resultadoFinanceiro[12], false, true, true)}</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Receitas Financeiras</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">{renderCell(receitasFinanceiras[i])}</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">{renderCell(receitasFinanceiras[12], false, true)}</td>
                </tr>
                <tr className="text-slate-600 text-red-500">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8">Despesas Financeiras</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-right">({renderCell(despesasFinanceiras[i])})</td>
                  ))}
                  <td className="px-4 py-2 text-right bg-amber-50 border-l border-slate-350">({renderCell(despesasFinanceiras[12], false, true)})</td>
                </tr>

                {/* Lucro Líquido */}
                <tr className="bg-slate-900 text-white font-extrabold border-t-2 border-slate-955">
                  <td className="px-4 py-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-300">Lucro (Prejuízo) Líquido</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-3 text-right text-emerald-400 font-bold">{renderCell(lucroLiquido[i], false, true, true)}</td>
                  ))}
                  <td className="px-4 py-3 text-right bg-slate-800 text-emerald-400 font-extrabold border-l border-slate-350">{renderCell(lucroLiquido[12], false, true, true)}</td>
                </tr>

                {/* Margem Líquida % */}
                <tr className="bg-slate-950 text-slate-300 font-semibold border-b">
                  <td className="px-4 py-2 sticky left-0 bg-slate-950 z-10 border-r border-slate-300 pl-8">Margem Líquida (%)</td>
                  {Array(12).fill(0).map((_, i) => (
                    <td key={i} className="px-3 py-2 text-center">{renderCell(margemLiquida[i], true)}</td>
                  ))}
                  <td className="px-4 py-2 text-center bg-slate-900 border-l border-slate-350">{renderCell(margemLiquida[12], true, true)}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
