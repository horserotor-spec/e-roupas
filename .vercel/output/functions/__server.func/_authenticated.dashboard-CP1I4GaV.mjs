import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { y as supabase, w as formatCurrency } from "./_ssr/router-C3pqRbRf.mjs";
import { S as StatusBadge } from "./_ssr/StatusBadge-CcICm0gO.mjs";
import { f as useOrders } from "./_ssr/orders-E2Xxa3Vy.mjs";
import { u as useClients } from "./_ssr/clients-B1XUVlvf.mjs";
import "./_libs/sonner.mjs";
import { V as LoaderCircle, A as Activity, N as Flame, K as FileCheckCorner, v as Clock, aw as UserPlus, ah as ShieldAlert, e as ArrowUpRight } from "./_libs/lucide-react.mjs";
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
const statusLabel = {
  orcamento: "Orçamento",
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_arte: "Em Arte",
  aguardando_arte: "Aguardando Arte",
  em_producao: "Em Produção",
  pronto_coleta: "Pronto Coleta",
  faturado: "Faturado",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado"
};
const statusTone = {
  orcamento: "default",
  pendente: "warning",
  confirmado: "info",
  em_arte: "info",
  aguardando_arte: "warning",
  em_producao: "primary",
  pronto_coleta: "success",
  faturado: "success",
  enviado: "success",
  entregue: "success",
  cancelado: "danger"
};
function Dashboard() {
  const {
    data: orders = [],
    isLoading: loadingOrders
  } = useOrders();
  const {
    data: clients = [],
    isLoading: loadingClients
  } = useClients();
  const [avoidedErrors, setAvoidedErrors] = reactExports.useState(0);
  reactExports.useEffect(() => {
    supabase.from("separation_errors").select("*", {
      count: "exact",
      head: true
    }).then((res) => {
      setAvoidedErrors(res.count || 0);
    });
  }, []);
  if (loadingOrders || loadingClients) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const today = orders.filter((o) => (o.sale_date || o.created_at)?.startsWith(todayStr));
  const urgent = orders.filter((o) => o.urgent || o.priority === "alta");
  const waitingArt = orders.filter((o) => o.status === "aguardando_arte" || o.status === "em_arte");
  const isOverdue = (o) => {
    if (!o.expected_date) return false;
    const expected = new Date(o.expected_date);
    const now = /* @__PURE__ */ new Date();
    const isLate = expected < now && expected.toDateString() !== now.toDateString();
    return isLate && !["faturado", "pronto_coleta", "enviado", "entregue", "cancelado"].includes(o.status);
  };
  const overdue = orders.filter(isOverdue);
  const sixtyDaysAgo = /* @__PURE__ */ new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const newClients = clients.filter((c) => c.created_at && new Date(c.created_at) >= sixtyDaysAgo);
  const recentOrders = [...orders].sort((a, b) => {
    const dA = new Date(a.created_at || a.sale_date || 0).getTime();
    const dB = new Date(b.created_at || b.sale_date || 0).getTime();
    return dB - dA;
  }).slice(0, 5);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  const displayDate = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", options);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: displayDate }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Visão geral da operação" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/pedidos", label: "Pedidos do dia", value: today.length, hint: "Criados hoje", icon: Activity, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/pedidos", label: "Urgentes", value: urgent.length, hint: "Prioridade alta", icon: Flame, accent: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/pedidos", label: "Aguardando arte", value: waitingArt.length, hint: "Cliente / designer", icon: FileCheckCorner, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/pedidos", label: "Atrasados", value: overdue.length, hint: "Prazo vencido", icon: Clock, accent: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/crm", label: "Clientes novos", value: newClients.length, hint: "Últimos 60d", icon: UserPlus, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { to: "/producao", label: "Erros Evitados", value: avoidedErrors, hint: "Separação física", icon: ShieldAlert, accent: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold tracking-tight", children: "Pedidos recentes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Últimos pedidos inseridos no sistema." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pedidos", className: "text-xs text-primary inline-flex items-center gap-1 hover:underline", children: [
            "Ver todos ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border -mx-2", children: [
          recentOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-4 text-sm text-muted-foreground", children: "Nenhum pedido encontrado." }),
          recentOrders.map((o) => {
            const client = clients.find((c) => c.id === o.client_id) || {
              name: o.client_name
            };
            const itemCount = Array.isArray(o.items) ? o.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0) : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pedidos/$id", params: {
              id: o.id
            }, className: "flex items-center gap-4 px-2 py-3 hover:bg-muted/60 rounded-lg transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground number w-32 shrink-0", children: o.code || o.id.split("-")[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: client?.name || "Cliente não identificado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                  itemCount,
                  " ",
                  itemCount === 1 ? "item" : "itens"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: statusTone[o.status] || "default", children: statusLabel[o.status] || o.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium number w-24 text-right", children: formatCurrency(o.final_total || 0) })
            ] }, o.id);
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold tracking-tight mb-1", children: "Avisos e Lembretes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Destaques do sistema." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          overdue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 size-1.5 rounded-full bg-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Atenção aos Atrasados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5 leading-relaxed", children: [
                "Você possui ",
                overdue.length,
                " pedido(s) com o prazo de entrega vencido."
              ] })
            ] })
          ] }),
          waitingArt.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 size-1.5 rounded-full bg-warning shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Artes Pendentes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5 leading-relaxed", children: [
                "Existem ",
                waitingArt.length,
                " pedido(s) aguardando desenvolvimento ou aprovação de arte."
              ] })
            ] })
          ] }),
          urgent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 size-1.5 rounded-full bg-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Prioridade Alta" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5 leading-relaxed", children: [
                urgent.length,
                " pedido(s) marcado(s) como urgentes necessitam de atenção na produção."
              ] })
            ] })
          ] }),
          overdue.length === 0 && waitingArt.length === 0 && urgent.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 size-1.5 rounded-full bg-success shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Tudo em ordem!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5 leading-relaxed", children: "A operação está fluindo perfeitamente sem atrasos pendentes." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold tracking-tight mb-1", children: "Radar Financeiro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Módulo de contas a receber/pagar." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceWidget, {})
      ] })
    ] })
  ] });
}
function FinanceWidget() {
  const [metrics, setMetrics] = reactExports.useState({
    atrasadas: 0,
    vencemHoje: 0,
    recebidosMes: 0
  });
  reactExports.useEffect(() => {
    const load = async () => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const startOfMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().split("T")[0];
      const {
        data
      } = await supabase.from("financial_transactions").select("*");
      if (data) {
        let atrasadas = 0;
        let vencemHoje = 0;
        let recebidosMes = 0;
        data.forEach((t) => {
          const amt = Number(t.amount);
          if (t.type === "pagar" && t.status === "pendente") {
            if (t.due_date < today) atrasadas++;
          }
          if (t.status === "pendente" && t.due_date === today) {
            vencemHoje++;
          }
          if (t.type === "receber" && (t.status === "recebido" || t.status === "pago") && t.payment_date >= startOfMonth) {
            recebidosMes += amt;
          }
        });
        setMetrics({
          atrasadas,
          vencemHoje,
          recebidosMes
        });
      }
    };
    load();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "⚠" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: metrics.atrasadas > 0 ? "text-red-600 font-bold" : "text-slate-500", children: [
        metrics.atrasadas,
        " contas atrasadas"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "💰" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: metrics.vencemHoje > 0 ? "text-amber-600 font-bold" : "text-slate-500", children: [
        metrics.vencemHoje,
        " contas vencem hoje"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "✔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 font-bold", children: [
        "R$ ",
        metrics.recebidosMes.toLocaleString("pt-BR", {
          minimumFractionDigits: 2
        }),
        " recebidos mês"
      ] })
    ] })
  ] });
}
function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  to
}) {
  const tone = {
    primary: "text-primary bg-primary-soft",
    warning: "text-[color-mix(in_oklab,var(--warning)_55%,black)] dark:text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_16%,transparent)]",
    info: "text-[var(--info)] bg-[color-mix(in_oklab,var(--info)_14%,transparent)]",
    danger: "text-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)]",
    success: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)]"
  }[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "group rounded-2xl border border-border bg-card p-5 hover:border-border-strong transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-8 rounded-lg grid place-items-center ${tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-semibold tracking-tight number", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: hint })
  ] });
}
export {
  Dashboard as component
};
