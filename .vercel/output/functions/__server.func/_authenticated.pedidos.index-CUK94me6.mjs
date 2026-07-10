import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as statusTone, s as statusLabel } from "./_ssr/constants-B8Sd5U_d.mjs";
import { f as useOrders, h as useUpdateOrder } from "./_ssr/orders-E2Xxa3Vy.mjs";
import { B as Button } from "./_ssr/router-C3pqRbRf.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import "./_libs/sonner.mjs";
import { a9 as Plus, ad as Search, V as LoaderCircle, N as Flame, a6 as Pen } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
const primaryFilters = [{
  key: "todos",
  label: "Todos"
}, {
  key: "urgentes",
  label: "Urgentes"
}, {
  key: "atrasados",
  label: "Atrasados"
}, {
  key: "finalizado",
  label: "Finalizados"
}];
const secondaryFilters = [{
  key: "atendimento",
  label: "Atendimento"
}, {
  key: "arte_criacao",
  label: "Arte/Criação"
}, {
  key: "aguardando_arte",
  label: "Ag. Arte"
}, {
  key: "confirmado",
  label: "Confirmado"
}, {
  key: "aguardando_financeiro",
  label: "Ag. Financeiro"
}, {
  key: "liberado_producao",
  label: "Liberado Prod."
}, {
  key: "separacao",
  label: "Separação"
}, {
  key: "corte",
  label: "Corte"
}, {
  key: "costura",
  label: "Costura"
}, {
  key: "bordado",
  label: "Bordado"
}, {
  key: "impressao",
  label: "Impressão"
}, {
  key: "prensa",
  label: "Prensa"
}, {
  key: "qualidade",
  label: "Qualidade"
}, {
  key: "expedicao",
  label: "Expedição"
}, {
  key: "entregue",
  label: "Entregue"
}];
function isOverdue(deadline, status) {
  if (!deadline) return false;
  if (status === "entregue" || status === "finalizado" || status === "orcamento") return false;
  return new Date(deadline) < /* @__PURE__ */ new Date();
}
function PedidosPage() {
  const [q, setQ] = reactExports.useState("");
  const deferredQ = reactExports.useDeferredValue(q);
  const [f, setF] = reactExports.useState("todos");
  const {
    data: orders = [],
    isLoading
  } = useOrders(deferredQ);
  const updateOrderMutation = useUpdateOrder();
  const filtered = orders.filter((o) => {
    if (o.status === "orcamento") return false;
    if (f === "urgentes" && !o.urgent) return false;
    if (f === "atrasados" && !isOverdue(o.deadline, o.status)) return false;
    if (f !== "todos" && f !== "urgentes" && f !== "atrasados" && o.status !== f) return false;
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Núcleo do ERP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Pedidos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pedidos/novo", search: {
        type: "pedido"
      }, className: "h-9 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Novo pedido"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-72 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar pedido...", className: "h-8 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-sm outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: primaryFilters.map((flt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF(flt.key), className: `shrink-0 h-8 px-3 rounded-md text-xs font-medium transition-colors ${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`, children: flt.label }, flt.key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: secondaryFilters.map((flt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF(flt.key), className: `shrink-0 h-6 px-2.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-colors ${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`, children: flt.label }, flt.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Pedido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5 hidden lg:table-cell", children: "Itens" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5 hidden md:table-cell", children: "Prazo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          " Carregando pedidos..."
        ] }) }) }),
        !isLoading && filtered.map((o) => {
          const overdue = isOverdue(o.deadline, o.status);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/$orderId", params: {
                orderId: o.id
              }, className: "font-mono text-xs hover:text-primary", children: o.code }),
              o.urgent && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--destructive)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
                " Urgente"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: o.client_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                o.brand_code,
                " · ",
                o.owner_name
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs max-w-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2 whitespace-normal break-words", children: o.items.map((i) => `${i.quantity}× ${i.product_name} (${i.sku || "-"} - Tam: ${i.size || "-"})`).join(" · ") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: o.status, onValueChange: (val) => updateOrderMutation.mutate({
              id: o.id,
              status: val
            }), disabled: updateOrderMutation.isPending, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: `h-8 border-none font-medium px-2.5 py-0.5 text-xs inline-flex items-center w-fit gap-1 rounded-full ${statusTone[o.status] === "info" ? "bg-blue-100 text-blue-700" : statusTone[o.status] === "warning" ? "bg-orange-100 text-orange-700" : statusTone[o.status] === "success" ? "bg-green-100 text-green-700" : statusTone[o.status] === "critical" ? "bg-red-100 text-red-700" : statusTone[o.status] === "purple" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(statusLabel).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: key, children: label }, key)) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 hidden md:table-cell text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`, children: o.deadline ? new Date(o.deadline).toLocaleDateString("pt-BR") : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right number font-medium", children: [
              "R$ ",
              o.final_total.toLocaleString("pt-BR")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/$id", params: {
              id: o.id
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }) }) })
          ] }, o.id);
        }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum pedido com esse filtro." }) })
      ] })
    ] }) })
  ] });
}
export {
  PedidosPage as component
};
