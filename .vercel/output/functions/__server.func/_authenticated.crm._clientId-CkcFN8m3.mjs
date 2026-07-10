import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { t as Route, w as formatCurrency } from "./_ssr/router-C3pqRbRf.mjs";
import { s as statusLabel, b as statusTone } from "./_ssr/mock-data-DefFmkSt.mjs";
import { S as StatusBadge } from "./_ssr/StatusBadge-CcICm0gO.mjs";
import "./_libs/sonner.mjs";
import { c as ArrowLeft, a8 as Phone, Y as Mail, M as FileText, Z as MapPin } from "./_libs/lucide-react.mjs";
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
function ClientPage() {
  const {
    client,
    clientOrders
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/crm", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
      " Clientes"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
          client.entity_type || "Cliente",
          " · ",
          client.lead_source || "Sem origem"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: client.name }),
        client.company_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Razão Social/Fantasia: ",
          client.company_name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pedidos", value: client.orders }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Ticket médio", value: `R$ ${client.ticket.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total", value: `R$ ${client.total.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}` })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-2xl border border-border bg-card p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-2", children: "Dados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: Phone, label: "Telefone", value: client.phone || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: Mail, label: "Email", value: client.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: FileText, label: "Documento", value: client.document || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { icon: MapPin, label: "Endereço", value: client.street ? `${client.street}, ${client.number || "S/N"}${client.complement ? ` - ${client.complement}` : ""}, ${client.neighborhood || ""}, ${client.city || ""}/${client.state || ""}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 hairline-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: client.notes || "Sem observações." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Histórico de pedidos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border -mx-2", children: [
          clientOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pedidos/$orderId", params: {
            orderId: o.id
          }, className: "flex items-center gap-3 px-2 py-3 hover:bg-muted/60 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground w-32", children: o.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-sm truncate", children: o.brand_code || "Pedido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { tone: statusTone[o.status] || "neutral", children: statusLabel[o.status] || o.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm number w-24 text-right", children: formatCurrency(o.final_total) })
          ] }, o.id)),
          clientOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-6 text-sm text-muted-foreground", children: "Sem pedidos registrados." })
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold number mt-0.5", children: value })
  ] });
}
function Row({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 mt-0.5 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate", children: value })
    ] })
  ] });
}
export {
  ClientPage as component
};
