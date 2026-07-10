import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { w as formatCurrency, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import "./_libs/sonner.mjs";
import { V as LoaderCircle, C as Calendar, aq as TriangleAlert, ay as Wallet, ap as TrendingUp, ao as TrendingDown, D as DollarSign, d as ArrowRight } from "./_libs/lucide-react.mjs";
import { R as ResponsiveContainer, a as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, A as Area } from "./_libs/recharts.mjs";
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
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
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
function FinanceiroOverview() {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadData = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("financial_transactions").select("*, financial_categories(name)").order("due_date", {
      ascending: false
    });
    if (data) setTransactions(data);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[80vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const startOfMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).toISOString().split("T")[0];
  let receberHoje = 0;
  let receberVencido = 0;
  let pagarHoje = 0;
  let pagarVencido = 0;
  let saldoCaixa = 0;
  let previstoEntradas = 0;
  let previstoSaidas = 0;
  let entradasMes = 0;
  let saidasMes = 0;
  transactions.forEach((t) => {
    const amount = Number(t.amount || 0);
    const isReceber = t.type === "receber";
    const isPagar = t.type === "pagar";
    const date = t.payment_date || t.due_date;
    if (t.status === "recebido") {
      saldoCaixa += amount;
      if (date >= startOfMonth && date <= endOfMonth) {
        entradasMes += amount;
      }
    } else if (t.status === "pago") {
      saldoCaixa -= amount;
      if (date >= startOfMonth && date <= endOfMonth) {
        saidasMes += amount;
      }
    } else if (t.status !== "cancelado") {
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
  const chartData = [];
  for (let i = -3; i <= 3; i++) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split("T")[0];
    let entries = 0;
    let exits = 0;
    transactions.forEach((t) => {
      if (t.status !== "cancelado") {
        const targetDate = t.payment_date || t.due_date;
        if (targetDate === dStr) {
          if (t.type === "receber") entries += Number(t.amount);
          if (t.type === "pagar") exits += Number(t.amount);
        }
      }
    });
    chartData.push({
      name: d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short"
      }),
      Entradas: entries,
      Saídas: exits,
      Saldo: entries - exits
    });
  }
  const recentTx = transactions.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Módulo Financeiro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-bold tracking-tight text-slate-800", children: "Visão Geral" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Receber Hoje", value: receberHoje, icon: Calendar, accent: "emerald", hint: "Títulos com vencimento hoje" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Receber Vencido", value: receberVencido, icon: TriangleAlert, accent: "rose", hint: "Entradas pendentes em atraso" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pagar Hoje", value: pagarHoje, icon: Calendar, accent: "amber", hint: "Saídas com vencimento hoje" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pagar Vencido", value: pagarVencido, icon: TriangleAlert, accent: "red", hint: "Despesas pendentes vencidas" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCard, { label: "Saldo Previsto", value: saldoPrevisto, icon: Wallet, hint: `Caixa real: ${formatCurrency(saldoCaixa)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCard, { label: "Entradas no Mês", value: entradasMes, icon: TrendingUp, trend: "up", hint: "Recebimentos liquidados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCard, { label: "Saídas no Mês", value: saidasMes, icon: TrendingDown, trend: "down", hint: "Pagamentos liquidados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCard, { label: "Lucro Operacional", value: lucroOperacional, icon: DollarSign, trend: lucroOperacional >= 0 ? "up" : "down", hint: "Entradas - Saídas reais" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-slate-800", children: "Movimentação Diária" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Entradas e saídas agrupadas por dia (previsto/realizado)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/financeiro/fluxo-caixa", className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1", children: [
            "Fluxo completo ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, margin: {
          top: 10,
          right: 10,
          left: -10,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorEntradas", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorSaidas", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tickLine: false, axisLine: false, tick: {
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "Entradas", dataKey: "Entradas", stroke: "#10b981", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorEntradas)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "Saídas", dataKey: "Saídas", stroke: "#ef4444", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorSaidas)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-slate-800", children: "Lançamentos Recentes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Últimas transações financeiras geradas." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
            recentTx.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "Nenhuma transação encontrada." }),
            recentTx.map((t) => {
              const isReceber = t.type === "receber";
              const statusColor = t.status === "recebido" || t.status === "pago" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : t.status === "cancelado" ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-amber-50 text-amber-700 border-amber-100";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 flex items-center justify-between gap-3 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-700 truncate", children: t.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground mt-0.5 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (/* @__PURE__ */ new Date(t.due_date + "T12:00:00")).toLocaleDateString("pt-BR") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "CC: ",
                      t.cost_center
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-bold ${isReceber ? "text-emerald-600" : "text-red-500"}`, children: [
                    isReceber ? "+" : "-",
                    " ",
                    formatCurrency(t.amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `mt-1 h-5 px-1.5 text-[9px] uppercase font-bold tracking-wider rounded-md ${statusColor}`, children: t.status })
                ] })
              ] }, t.id);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/financeiro/receber", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-1.5 border border-border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50", children: "Receber" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/financeiro/pagar", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-1.5 border border-border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50", children: "Pagar" }) })
        ] })
      ] })
    ] })
  ] });
}
function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  hint
}) {
  const styles = {
    emerald: {
      text: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
      icon: "text-emerald-500"
    },
    rose: {
      text: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
      icon: "text-rose-500"
    },
    amber: {
      text: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
      icon: "text-amber-500"
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50 border-red-100",
      icon: "text-red-500"
    }
  }[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md bg-white ${styles.bg}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-1.5 rounded-lg bg-white/80 border ${styles.icon}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold tracking-tight mt-3 ${styles.text}`, children: formatCurrency(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-1", children: hint })
  ] });
}
function BalanceCard({
  label,
  value,
  icon: Icon,
  trend,
  hint
}) {
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-800";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-slate-50 border text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold tracking-tight mt-3 ${trendColor}`, children: formatCurrency(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-1", children: hint })
  ] });
}
export {
  FinanceiroOverview as component
};
