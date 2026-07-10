import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { y as supabase, w as formatCurrency } from "./_ssr/router-C3pqRbRf.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import "./_libs/sonner.mjs";
import { C as Calendar, V as LoaderCircle } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/cmdk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
const MONTH_NAMES = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
function DREPage() {
  const [selectedYear, setSelectedYear] = reactExports.useState("2026");
  const [loading, setLoading] = reactExports.useState(true);
  const [transactions, setTransactions] = reactExports.useState([]);
  const [movements, setMovements] = reactExports.useState([]);
  const [cmvConfig, setCmvConfig] = reactExports.useState({
    saquinho: 0.5,
    etiqueta: 0.3,
    dtf: 1.5,
    bordado: 2,
    mp_default: 15
  });
  const years = ["2026", "2027", "2028", "2029", "2030"];
  const loadData = async () => {
    setLoading(true);
    try {
      const yearStart = `${selectedYear}-01-01`;
      const yearEnd = `${selectedYear}-12-31`;
      const {
        data: txData,
        error: txError
      } = await supabase.from("financial_transactions").select("*, financial_categories(*)").neq("status", "cancelado").gte("due_date", yearStart).lte("due_date", yearEnd);
      if (txError) throw txError;
      setTransactions(txData || []);
      const {
        data: movData,
        error: movError
      } = await supabase.from("inventory_movements").select(`
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
        `).eq("movement_type", "consumo").gte("created_at", `${yearStart}T00:00:00.000Z`).lte("created_at", `${yearEnd}T23:59:59.999Z`);
      if (movError) throw movError;
      setMovements(movData || []);
      const {
        data: configData
      } = await supabase.from("system_settings").select("*").eq("key", "cmv_costs_config").maybeSingle();
      if (configData && configData.value) {
        setCmvConfig((prev) => ({
          ...prev,
          ...configData.value
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do DRE:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadData();
  }, [selectedYear]);
  const getMonthFromDate = (dateStr) => {
    if (!dateStr) return 0;
    const parts = dateStr.split("-");
    if (parts.length < 2) return 0;
    return parseInt(parts[1], 10) - 1;
  };
  const getMonthFromTimestamp = (timestamp) => {
    if (!timestamp) return 0;
    const date = new Date(timestamp);
    return date.getMonth();
  };
  const createEmptyRow = () => Array(13).fill(0);
  const receitaOperacionalBruta = createEmptyRow();
  const impostosEDevolucoes = createEmptyRow();
  const receitaOperacionalLiquida = createEmptyRow();
  const cmv = createEmptyRow();
  const cmvPercent = createEmptyRow();
  const lucroBruto = createEmptyRow();
  const margemBruta = createEmptyRow();
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
  const resultadoFinanceiro = createEmptyRow();
  const receitasFinanceiras = createEmptyRow();
  const despesasFinanceiras = createEmptyRow();
  const lucroLiquido = createEmptyRow();
  const margemLiquida = createEmptyRow();
  transactions.forEach((tx) => {
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
          despesasGeraisAdmin[m] += amt;
          despesasGeraisAdmin[12] += amt;
        }
      }
    }
  });
  movements.forEach((mov) => {
    const m = getMonthFromTimestamp(mov.created_at);
    if (m < 0 || m > 11) return;
    const qty = Math.abs(Number(mov.quantity || 0));
    if (qty <= 0) return;
    const batch = mov.inventory_batches;
    const variant = batch?.product_variants;
    const prod = variant?.products;
    const costPeca = qty * (Number(batch?.average_cost || 0) || cmvConfig.mp_default);
    const costSaquinho = qty * cmvConfig.saquinho;
    const costEtiqueta = qty * cmvConfig.etiqueta;
    const hasDtf = prod?.supports_dtf ?? true;
    const hasEmbroidery = prod?.supports_embroidery ?? true;
    const costDtf = hasDtf ? qty * cmvConfig.dtf : 0;
    const costBordado = hasEmbroidery ? qty * cmvConfig.bordado : 0;
    const totalItemCMV = costPeca + costSaquinho + costEtiqueta + costDtf + costBordado;
    cmv[m] += totalItemCMV;
    cmv[12] += totalItemCMV;
  });
  for (let i = 0; i <= 12; i++) {
    receitaOperacionalLiquida[i] = receitaOperacionalBruta[i] - impostosEDevolucoes[i];
    if (receitaOperacionalLiquida[i] > 0) {
      cmvPercent[i] = cmv[i] / receitaOperacionalLiquida[i];
    } else {
      cmvPercent[i] = 0;
    }
    lucroBruto[i] = receitaOperacionalLiquida[i] - cmv[i];
    if (receitaOperacionalLiquida[i] > 0) {
      margemBruta[i] = lucroBruto[i] / receitaOperacionalLiquida[i];
    } else {
      margemBruta[i] = 0;
    }
    despesasOperacionais[i] = despesasGeraisAdmin[i] + despesasAluguelCondoIptu[i] + despesasMarketing[i] + despesasPessoal[i] + despesasInvestimento[i] + despesasProLabore[i] + despesasUtilidades[i];
    lucroOperacional[i] = lucroBruto[i] - despesasOperacionais[i];
    if (receitaOperacionalLiquida[i] > 0) {
      margemOperacional[i] = lucroOperacional[i] / receitaOperacionalLiquida[i];
    } else {
      margemOperacional[i] = 0;
    }
    resultadoFinanceiro[i] = receitasFinanceiras[i] - despesasFinanceiras[i];
    lucroLiquido[i] = lucroOperacional[i] + resultadoFinanceiro[i];
    if (receitaOperacionalLiquida[i] > 0) {
      margemLiquida[i] = lucroLiquido[i] / receitaOperacionalLiquida[i];
    } else {
      margemLiquida[i] = 0;
    }
  }
  const renderCell = (val, isPercent = false, isBold = false, allowColor = false) => {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${isBold ? "font-bold" : ""} ${colorCls} tabular-nums`, children: formatted === "R$ 0,00" || formatted === "0.0%" ? "—" : formatted });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-100 border border-slate-300 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.png", alt: "e-roupas", className: "h-8 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-slate-800 tracking-tight", children: [
          "DRE Gerencial ",
          selectedYear
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white p-2 border rounded-lg shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4.5 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-500 uppercase", children: "Selecione o Ano:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedYear, onValueChange: setSelectedYear, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-24 text-xs font-bold border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: years.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: y, className: "text-xs font-bold", children: y }, y)) })
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-[11px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-100 border-b border-slate-300 text-slate-600 font-bold uppercase text-[9px] tracking-wider divide-x divide-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 sticky left-0 bg-slate-100 z-10 w-64 border-r border-slate-300", children: "Estrutura DRE" }),
        MONTH_NAMES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center min-w-[90px]", children: m }, m)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center bg-amber-50 font-black text-amber-900 border-l border-slate-350 min-w-[110px]", children: "TOTAL" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-200 divide-x divide-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 font-bold border-b border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 text-slate-800", children: "Receita Operacional Bruta" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: renderCell(receitaOperacionalBruta[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right bg-amber-50 text-slate-900 border-l border-slate-350", children: renderCell(receitaOperacionalBruta[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-red-500 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300", children: "Impostos e Devoluções" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right", children: [
            "(",
            renderCell(impostosEDevolucoes[i]),
            ")"
          ] }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: [
            "(",
            renderCell(impostosEDevolucoes[12], false, true),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 font-bold border-y border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 text-slate-800", children: "Receita Operacional Líquida" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: renderCell(receitaOperacionalLiquida[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right bg-amber-50 text-slate-900 border-l border-slate-350", children: renderCell(receitaOperacionalLiquida[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-red-500 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300", children: "Custo da Mercadoria Vendida (CMV)" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right", children: [
            "(",
            renderCell(cmv[i]),
            ")"
          ] }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: [
            "(",
            renderCell(cmv[12], false, true),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "CMV %" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-center", children: renderCell(cmvPercent[i], true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350", children: renderCell(cmvPercent[12], true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-100 font-bold border-y border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-300 text-slate-800", children: "Lucro (Prejuízo) Bruto" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: renderCell(lucroBruto[i], false, true, true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right bg-amber-100 border-l border-slate-350", children: renderCell(lucroBruto[12], false, true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-500 font-semibold bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 pl-8", children: "Margem Bruta (%)" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-center", children: renderCell(margemBruta[i], true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350", children: renderCell(margemBruta[12], true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 font-bold text-red-500 border-t border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300", children: "Despesas Operacionais" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-right", children: [
            "(",
            renderCell(despesasOperacionais[i]),
            ")"
          ] }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right bg-amber-50 border-l border-slate-350", children: [
            "(",
            renderCell(despesasOperacionais[12], false, true),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Gerais e Administrativas" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasGeraisAdmin[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasGeraisAdmin[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Aluguel, Condomínio e IPTU" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasAluguelCondoIptu[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasAluguelCondoIptu[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Propaganda e Marketing" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasMarketing[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasMarketing[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Pessoal" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasPessoal[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasPessoal[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Investimento" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasInvestimento[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasInvestimento[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Pro labore" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasProLabore[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasProLabore[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Utilidades" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(despesasUtilidades[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(despesasUtilidades[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-100 font-bold border-y border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-300 text-slate-800", children: "Lucro/Prejuízo Operacional" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: renderCell(lucroOperacional[i], false, true, true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right bg-amber-100 border-l border-slate-350", children: renderCell(lucroOperacional[12], false, true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-500 font-semibold bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300 pl-8", children: "Margem Operacional (%)" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-center", children: renderCell(margemOperacional[i], true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-1.5 text-center bg-amber-50 border-l border-slate-350", children: renderCell(margemOperacional[12], true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 font-bold border-t border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 sticky left-0 bg-slate-50 z-10 border-r border-slate-300", children: "Resultado Financeiro" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: renderCell(resultadoFinanceiro[i], false, true, true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right bg-amber-50 border-l border-slate-350", children: renderCell(resultadoFinanceiro[12], false, true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Receitas Financeiras" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: renderCell(receitasFinanceiras[i]) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: renderCell(receitasFinanceiras[12], false, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-600 text-red-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-white z-10 border-r border-slate-300 pl-8", children: "Despesas Financeiras" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right", children: [
            "(",
            renderCell(despesasFinanceiras[i]),
            ")"
          ] }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right bg-amber-50 border-l border-slate-350", children: [
            "(",
            renderCell(despesasFinanceiras[12], false, true),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-900 text-white font-extrabold border-t-2 border-slate-955", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-300", children: "Lucro (Prejuízo) Líquido" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-emerald-400 font-bold", children: renderCell(lucroLiquido[i], false, true, true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right bg-slate-800 text-emerald-400 font-extrabold border-l border-slate-350", children: renderCell(lucroLiquido[12], false, true, true) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-950 text-slate-300 font-semibold border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 sticky left-0 bg-slate-950 z-10 border-r border-slate-300 pl-8", children: "Margem Líquida (%)" }),
          Array(12).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: renderCell(margemLiquida[i], true) }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center bg-slate-900 border-l border-slate-350", children: renderCell(margemLiquida[12], true, true) })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  DREPage as component
};
