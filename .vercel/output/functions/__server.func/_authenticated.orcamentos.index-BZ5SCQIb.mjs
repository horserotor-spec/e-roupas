import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { f as useOrders } from "./_ssr/orders-CbTRcciT.mjs";
import { s as statusLabel, a as statusTone } from "./_ssr/constants-B8Sd5U_d.mjs";
import { S as StatusBadge } from "./_ssr/StatusBadge-BxIltDfX.mjs";
import { B as Button } from "./_ssr/router-BxmJvJdu.mjs";
import "./_libs/sonner.mjs";
import { a9 as Plus, D as DollarSign, ap as TrendingUp, ad as Search, V as LoaderCircle, M as FileText } from "./_libs/lucide-react.mjs";
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
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__query-core.mjs";
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
function QuotesPage() {
  const [q, setQ] = reactExports.useState("");
  const deferredQ = reactExports.useDeferredValue(q);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const {
    data: allOrders = [],
    isLoading
  } = useOrders(deferredQ);
  const quotes = reactExports.useMemo(() => {
    return allOrders.filter((o) => o.status === "orcamento");
  }, [allOrders]);
  const kpis = reactExports.useMemo(() => {
    const total = quotes.length;
    const openTotal = quotes.reduce((acc, q2) => acc + Number(q2.final_total || 0), 0);
    let totalMargin = 0;
    let marginCount = 0;
    quotes.forEach((q2) => {
      let cost = 0;
      let hasCost = false;
      let itemsNet = 0;
      q2.items.forEach((i) => {
        const baseCost = Number(i.unit_cost || 0);
        const custCostSum = (i.customizations || []).reduce((acc, c) => acc + Number(c.cost || 0) * Number(c.quantity || 1), 0);
        const itemCost = (baseCost + custCostSum) * i.quantity;
        itemsNet += Number(i.unit_price || 0) * i.quantity;
        if (itemCost > 0) {
          hasCost = true;
        }
        cost += itemCost;
      });
      const saleDiscount = itemsNet * (Number(q2.discount || 0) / 100);
      const liquidRevenue = itemsNet - saleDiscount;
      if (hasCost && liquidRevenue > 0) {
        const margin = (liquidRevenue - cost) / liquidRevenue * 100;
        totalMargin += margin;
        marginCount++;
      }
    });
    const avgMargin = marginCount > 0 ? totalMargin / marginCount : 0;
    return {
      totalOpen: total,
      openTotal,
      avgMargin
    };
  }, [quotes]);
  const filtered = statusFilter === "all" ? quotes : quotes.filter((q2) => q2.status === statusFilter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "COMERCIAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Orçamentos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/novo", search: {
        type: "orcamento"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Novo Orçamento"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-4" }), label: "Valor em aberto", value: `R$ ${(kpis.openTotal || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}`, hint: `${kpis.totalOpen || 0} orçamentos ativos`, color: "text-blue-600 bg-blue-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }), label: "Margem bruta média", value: `${(kpis.avgMargin || 0).toFixed(1)}%`, hint: "Sobre orçamentos com custo", color: `${(kpis.avgMargin || 0) < 15 ? "text-red-600 bg-red-500/10" : "text-emerald-600 bg-emerald-500/10"}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar por código ou cliente...", className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Código" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center font-medium px-4 py-2.5", children: "Itens" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Total (R$)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center font-medium px-4 py-2.5", children: "Margem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center font-medium px-4 py-2.5", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          " Carregando..."
        ] }) }) }),
        !isLoading && filtered.map((quote) => {
          let cost = 0;
          quote.items.forEach((i) => cost += (i.unit_cost || 0) * i.quantity);
          let marginPct = 0;
          if (cost > 0 && quote.final_total > 0) {
            marginPct = (quote.final_total - cost) / quote.final_total * 100;
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/$id", params: {
              id: quote.id
            }, className: "font-mono text-xs font-semibold text-primary hover:underline", children: quote.code }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: quote.client_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-muted-foreground", children: quote.items?.length || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right number font-medium", children: quote.final_total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarginBadge, { margin: marginPct }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: statusTone[quote.status], children: statusLabel[quote.status] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground", children: new Date(quote.created_at).toLocaleDateString("pt-BR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/$id", params: {
              id: quote.id
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }) }) }) })
          ] }, quote.id);
        }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum orçamento encontrado." }) })
      ] })
    ] }) })
  ] });
}
function KpiCard({
  icon,
  label,
  value,
  hint,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-1.5 rounded-lg ${color}`, children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold tracking-tight number", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: hint })
  ] });
}
function MarginBadge({
  margin
}) {
  const m = Number(margin || 0);
  let color = "bg-green-500/10 text-green-600";
  if (m < 0) color = "bg-red-500/10 text-red-600";
  else if (m < 15) color = "bg-amber-500/10 text-amber-600";
  else if (m < 30) color = "bg-yellow-500/10 text-yellow-700";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${color}`, children: [
    m.toFixed(1),
    "%"
  ] });
}
export {
  QuotesPage as component
};
