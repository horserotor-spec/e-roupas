import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { w as formatCurrency, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { C as Card, d as CardHeader, e as CardTitle, a as CardContent } from "./_ssr/card-J2pjOAqh.mjs";
import "./_libs/sonner.mjs";
import { V as LoaderCircle, ap as TrendingUp, ao as TrendingDown } from "./_libs/lucide-react.mjs";
import { R as ResponsiveContainer, d as PieChart, P as Pie, c as Cell, T as Tooltip, b as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, L as Legend, B as Bar } from "./_libs/recharts.mjs";
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
import "./_libs/lodash.mjs";
import "./_libs/react-smooth.mjs";
import "./_libs/prop-types.mjs";
import "./_libs/fast-equals.mjs";
import "./_libs/tiny-invariant.mjs";
import "./_libs/react-is.mjs";
import "./_libs/d3-shape.mjs";
import "./_libs/d3-path.mjs";
import "./_libs/victory-vendor.mjs";
import "./_libs/d3-scale.mjs";
import "./_libs/internmap.mjs";
import "./_libs/d3-array.mjs";
import "./_libs/d3-time-format.mjs";
import "./_libs/d3-time.mjs";
import "./_libs/d3-interpolate.mjs";
import "./_libs/d3-color.mjs";
import "./_libs/d3-format.mjs";
import "./_libs/recharts-scale.mjs";
import "./_libs/decimal.js-light.mjs";
import "./_libs/eventemitter3.mjs";
const COST_CENTERS = ["Atendimento", "Designer", "Financeiro", "Impressão", "Produção", "Expedição", "Compras", "Estoque", "Comercial", "Diretoria", "Geral"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19A3", "#19FFD8", "#8CFF19", "#FF4C4C", "#4C97FF", "#7F7F7F"];
function CentroCustos() {
  const [data, setData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadData = async () => {
    setLoading(true);
    const {
      data: txData
    } = await supabase.from("financial_transactions").select("*").neq("status", "cancelado");
    if (txData) setData(txData);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[80vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  const centerSummaries = COST_CENTERS.map((center) => {
    let receitas = 0;
    let despesas = 0;
    data.forEach((t) => {
      if (t.cost_center === center) {
        const amt = Number(t.amount || 0);
        if (t.type === "receber") receitas += amt;
        if (t.type === "pagar") despesas += amt;
      }
    });
    return {
      name: center,
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  }).filter((c) => c.receitas > 0 || c.despesas > 0);
  const pieData = centerSummaries.filter((c) => c.despesas > 0).map((c) => ({
    name: c.name,
    value: c.despesas
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Módulo Financeiro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-bold tracking-tight text-slate-800", children: "Centro de Custos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Visibilidade de receitas, despesas e rentabilidade por departamento." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-1 border border-border shadow-sm rounded-2xl bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800", children: "Distribuição de Despesas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-[300px] flex items-center justify-center", children: pieData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Nenhuma despesa para exibir no gráfico." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, paddingAngle: 3, dataKey: "value", children: pieData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => [`R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          })}`], contentStyle: {
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "11px"
          } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 border border-border shadow-sm rounded-2xl bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800 font-sans", children: "Receitas vs Despesas por Área" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-[300px]", children: centerSummaries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-xs text-muted-foreground", children: "Nenhum lançamento no período." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: centerSummaries, margin: {
          top: 10,
          right: 10,
          left: -10,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tickLine: false, axisLine: false, tick: {
            fill: "#64748b",
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: (val) => `R$${val}`, tickLine: false, axisLine: false, tick: {
            fill: "#64748b",
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => [`R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          })}`], contentStyle: {
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "11px"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { tick: {
            fontSize: 10
          }, wrapperStyle: {
            paddingTop: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { name: "Receitas", dataKey: "receitas", fill: "#10b981", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { name: "Despesas", dataKey: "despesas", fill: "#ef4444", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl overflow-hidden bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-slate-50/50 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800", children: "Demonstrativo por Centro de Custo" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3", children: "Centro de Custo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Total Receitas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Total Despesas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Saldo Líquido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-center", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y text-xs", children: [
          centerSummaries.map((c, index) => {
            const isPositive = c.saldo >= 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/30 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-semibold text-slate-800 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full", style: {
                  backgroundColor: COLORS[index % COLORS.length]
                } }),
                c.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right font-medium text-emerald-600", children: formatCurrency(c.receitas) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right font-medium text-red-500", children: formatCurrency(c.despesas) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-6 py-4 text-right font-bold ${isPositive ? "text-emerald-600" : "text-red-600"}`, children: formatCurrency(c.saldo) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`, children: [
                isPositive ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-3" }),
                isPositive ? "Superavitário" : "Deficitário"
              ] }) })
            ] }, c.name);
          }),
          centerSummaries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-6 py-12 text-center text-muted-foreground text-sm", children: "Nenhum centro de custo com movimentação ativa no momento." }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CentroCustos as component
};
