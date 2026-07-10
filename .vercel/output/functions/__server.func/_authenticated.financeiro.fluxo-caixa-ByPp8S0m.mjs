import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { w as formatCurrency, y as supabase } from "./_ssr/router-C3pqRbRf.mjs";
import { C as Card, d as CardHeader, a as CardContent, e as CardTitle } from "./_ssr/card-KiHn7Ny6.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import { B as Badge } from "./_ssr/badge-D804Hfqt.mjs";
import "./_libs/sonner.mjs";
import { V as LoaderCircle, ap as TrendingUp, ao as TrendingDown, ab as RefreshCw, C as Calendar } from "./_libs/lucide-react.mjs";
import { R as ResponsiveContainer, b as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, B as Bar } from "./_libs/recharts.mjs";
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
function FluxoCaixa() {
  const [data, setData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [groupType, setGroupType] = reactExports.useState("dia");
  const [viewType, setViewType] = reactExports.useState("previsto");
  const loadData = async () => {
    setLoading(true);
    const {
      data: txData,
      error
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
  const getGroupedData = () => {
    const today = /* @__PURE__ */ new Date();
    const chartMap = {};
    if (groupType === "dia") {
      for (let i = -5; i <= 4; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short"
        });
        chartMap[dateStr] = {
          label,
          dateKey: dateStr,
          entradas: 0,
          saidas: 0,
          saldo: 0
        };
      }
    } else if (groupType === "semana") {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i * 7);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const sunday = new Date(d.setDate(diff));
        const sundayStr = sunday.toISOString().split("T")[0];
        const saturday = new Date(sunday);
        saturday.setDate(saturday.getDate() + 6);
        const label = `Sem ${sunday.getDate()}/${sunday.getMonth() + 1}`;
        chartMap[sundayStr] = {
          label,
          dateKey: sundayStr,
          entradas: 0,
          saidas: 0,
          saldo: 0
        };
      }
    } else {
      const currentYear = today.getFullYear();
      for (let m = 0; m < 12; m++) {
        const dateStr = `${currentYear}-${String(m + 1).padStart(2, "0")}-01`;
        const label = new Date(currentYear, m, 1).toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit"
        });
        chartMap[dateStr] = {
          label,
          dateKey: dateStr,
          entradas: 0,
          saidas: 0,
          saldo: 0
        };
      }
    }
    data.forEach((t) => {
      const amt = Number(t.amount || 0);
      const isReceber = t.type === "receber";
      let targetDate = "";
      if (viewType === "realizado") {
        if (t.status === "recebido" || t.status === "pago") {
          targetDate = t.payment_date || t.due_date;
        } else {
          return;
        }
      } else {
        targetDate = t.due_date;
      }
      let matchedKey = "";
      const keys = Object.keys(chartMap).sort();
      if (groupType === "dia") {
        if (chartMap[targetDate]) matchedKey = targetDate;
      } else if (groupType === "semana") {
        for (let i = 0; i < keys.length; i++) {
          const start = keys[i];
          const endObj = /* @__PURE__ */ new Date(start + "T12:00:00");
          endObj.setDate(endObj.getDate() + 7);
          const end = endObj.toISOString().split("T")[0];
          if (targetDate >= start && targetDate < end) {
            matchedKey = start;
            break;
          }
        }
      } else {
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
    return Object.keys(chartMap).sort().map((key) => {
      const item = chartMap[key];
      item.saldo = item.entradas - item.saidas;
      return item;
    });
  };
  const chartData = getGroupedData();
  const totalEntradas = chartData.reduce((acc, c) => acc + c.entradas, 0);
  const totalSaidas = chartData.reduce((acc, c) => acc + c.saidas, 0);
  const totalSaldo = totalEntradas - totalSaidas;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Módulo Financeiro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-bold tracking-tight text-slate-800", children: "Fluxo de Caixa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Monitore e projete as entradas e saídas de caixa da sua empresa." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: viewType, onValueChange: setViewType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-40 text-xs bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "previsto", children: "Fluxo Previsto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "realizado", children: "Fluxo Realizado" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: groupType, onValueChange: setGroupType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-32 text-xs bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dia", children: "Agrupar por Dia" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "semana", children: "Agrupar por Semana" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mes", children: "Agrupar por Mês" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Total de Entradas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pb-4 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-emerald-600", children: formatCurrency(totalEntradas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Total de Saídas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pb-4 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-red-500", children: formatCurrency(totalSaidas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Saldo Consolidado" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pb-4 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-2xl font-extrabold ${totalSaldo >= 0 ? "text-emerald-600" : "text-red-500"}`, children: formatCurrency(totalSaldo) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-slate-50 text-slate-500 border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl bg-white p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "p-0 mb-6 flex flex-row items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800", children: viewType === "previsto" ? "Fluxo de Caixa Previsto (Competência)" : "Fluxo de Caixa Realizado (Regime de Caixa)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Entradas e saídas de caixa projetadas no tempo." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, margin: {
        top: 10,
        right: 10,
        left: -10,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, tick: {
          fill: "#64748b",
          fontSize: 11
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: (val) => `R$${val}`, tickLine: false, axisLine: false, tick: {
          fill: "#64748b",
          fontSize: 11
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => [`R$ ${value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2
        })}`], contentStyle: {
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          fontSize: "11px"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
          paddingTop: 15,
          fontSize: 11
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { name: "Entradas", dataKey: "entradas", fill: "#10b981", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { name: "Saídas", dataKey: "saidas", fill: "#ef4444", radius: [4, 4, 0, 0] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-sm rounded-2xl overflow-hidden bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-slate-50/50 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800", children: "Demonstrativo de Períodos" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3", children: "Período" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Entradas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Saídas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-right", children: "Saldo Período" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-center", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y text-xs", children: chartData.map((c) => {
          const isPositive = c.saldo >= 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-bold text-slate-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-slate-400" }),
              c.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right font-semibold text-emerald-600", children: formatCurrency(c.entradas) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right font-semibold text-red-500", children: formatCurrency(c.saidas) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-6 py-4 text-right font-extrabold ${isPositive ? "text-emerald-600" : "text-red-500"}`, children: formatCurrency(c.saldo) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${isPositive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`, children: isPositive ? "Positivo" : "Negativo" }) })
          ] }, c.label);
        }) })
      ] }) })
    ] })
  ] });
}
export {
  FluxoCaixa as component
};
