import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { f as useOrders } from "./_ssr/orders-CbTRcciT.mjs";
import { B as Button } from "./_ssr/router-BxmJvJdu.mjs";
import "./_libs/sonner.mjs";
import { ab as RefreshCw, a5 as PackageCheck, ar as Truck, q as CircleAlert, aa as Printer } from "./_libs/lucide-react.mjs";
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
function Expedicao() {
  const {
    data: allOrders = [],
    isLoading,
    refetch
  } = useOrders();
  const prontosParaPostar = allOrders.filter((o) => (o.status === "separacao" || o.status === "expedicao") && !o.tracking_code);
  const emTransito = allOrders.filter((o) => o.status === "expedicao" && o.tracking_code);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Operação Logística" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Expedição Kanban" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Gerencie embalagem, geração de etiquetas e despachos (SGP Web)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => refetch(), variant: "outline", size: "sm", className: "h-9 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-4 ${isLoading ? "animate-spin" : ""}` }),
        " Atualizar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { title: "Prontos para Expedir / Embalar", subtitle: "Aguardando geração de etiqueta e despacho.", empty: "Nenhum pedido na fila de expedição.", items: prontosParaPostar, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { className: "size-4 text-amber-500" }), borderClass: "border-amber-200", bgClass: "bg-amber-50/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { title: "Postados / Em Trânsito", subtitle: "Etiqueta gerada, a caminho do cliente.", empty: "Sem despachos ativos.", items: emTransito, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "size-4 text-blue-500" }), borderClass: "border-blue-200", bgClass: "bg-blue-50/50" })
    ] })
  ] });
}
function Col({
  title,
  subtitle,
  items,
  empty,
  icon,
  borderClass,
  bgClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `rounded-2xl border ${borderClass} bg-card p-4 h-full flex flex-col`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-3 p-3 rounded-xl ${bgClass} mb-4`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-slate-800", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto font-mono text-sm font-bold bg-white px-2 py-0.5 rounded-md border shadow-sm", children: items.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1 overflow-y-auto", children: [
      items.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 hover:border-primary transition-colors group relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos/$orderId", params: {
          orderId: o.id
        }, className: "absolute inset-0 z-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-primary transition-colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 ml-1 z-10 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-slate-800 truncate pr-2", children: o.client_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono font-medium text-slate-500 shrink-0", children: o.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "size-3" }),
                " ",
                o.logistics_type || "Correios"
              ] }),
              o.tracking_code && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-blue-600 text-[10px] mt-0.5 bg-blue-50 px-1.5 py-0.5 rounded", children: [
                "Obj: ",
                o.tracking_code
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-slate-400 font-semibold", children: "Prazo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xs font-medium ${new Date(o.deadline) < /* @__PURE__ */ new Date() ? "text-red-500 flex items-center gap-1" : "text-slate-600"}`, children: [
                new Date(o.deadline) < /* @__PURE__ */ new Date() && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3" }),
                o.deadline ? new Date(o.deadline).toLocaleDateString("pt-BR") : "—"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "z-10 flex gap-2 mt-2 pt-2 border-t border-slate-100 ml-1 justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/print/etiqueta/$id", params: {
          id: o.id
        }, target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", className: "h-7 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3 mr-1.5" }),
          " Ver Etiqueta PLP"
        ] }) }) })
      ] }, o.id)),
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "size-8 opacity-20 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: empty })
      ] })
    ] })
  ] });
}
export {
  Expedicao as component
};
