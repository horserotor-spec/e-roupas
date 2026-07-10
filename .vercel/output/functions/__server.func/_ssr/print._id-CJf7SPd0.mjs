import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useOrder } from "./orders-E2Xxa3Vy.mjs";
import { m as Route$t, B as Button } from "./router-C3pqRbRf.mjs";
import "../_libs/sonner.mjs";
import { V as LoaderCircle, aa as Printer } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
function PrintPage() {
  const {
    id
  } = Route$t.useParams();
  const {
    data: order,
    isLoading
  } = useOrder(id);
  reactExports.useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
    }
    return () => {
      if (isDark) {
        html.classList.add("dark");
      }
    };
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center", children: "Pedido não encontrado." });
  }
  const itemsTotalNet = order.items.reduce((acc, item) => acc + Number(item.unit_price || 0) * item.quantity, 0);
  const saleDiscount = itemsTotalNet * (Number(order.discount || 0) / 100);
  const otherExpenses = Number(order.other_expenses || 0);
  const freight = Number(order.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 py-10 print:py-0 print:bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[800px] mx-auto mb-6 flex justify-end px-6 print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.print(), className: "bg-primary text-white hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
      " Imprimir"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[800px] mx-auto bg-white p-12 shadow-sm rounded-xl print:shadow-none print:p-12 print:m-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start border-b pb-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-800 uppercase tracking-tight", children: order.status === "orcamento" ? "Orçamento" : "Pedido de Venda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 font-mono mt-1", children: [
            "#",
            order.code
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.png", alt: "e-roupas", className: "h-8 object-contain ml-auto mb-2", onError: (e) => {
            e.currentTarget.style.display = "none";
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: new Date(order.created_at).toLocaleDateString("pt-BR") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-8 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: order.client_name }),
          order.clients?.company_name && order.clients.company_name !== order.clients.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Razão Social: ",
            order.clients.company_name
          ] }),
          order.clients?.document && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "CPF/CNPJ: ",
            order.clients.document
          ] }),
          (order.clients?.phone || order.clients?.landline_phone) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Tel: ",
            order.clients.phone || order.clients.landline_phone
          ] }),
          order.clients?.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Email: ",
            order.clients.email
          ] }),
          (order.clients?.street || order.clients?.city) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-2 border-t pt-2 leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Endereço:" }),
            " ",
            order.clients.street,
            order.clients.number ? `, ${order.clients.number}` : "",
            order.clients.complement ? ` - ${order.clients.complement}` : "",
            order.clients.neighborhood ? ` - ${order.clients.neighborhood}` : "",
            order.clients.city ? ` - ${order.clients.city}/${order.clients.state || ""}` : "",
            order.clients.zip_code ? ` - CEP: ${order.clients.zip_code}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Detalhes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Vendedor: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.salesperson_name || "N/A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Marca: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.brand_code })
          ] }),
          order.payment_method && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Forma de Pagamento: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.payment_method })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-y text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Item" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 font-semibold", children: "Qtd" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-4 font-semibold", children: "Un. (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-4 font-semibold", children: "Total (R$)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: order.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: item.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 font-mono mt-0.5", children: item.sku })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-center", children: item.quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: (item.unit_price || 0).toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: ((item.unit_price || 0) * item.quantity).toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          }) })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-8 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 whitespace-pre-wrap", children: order.notes || "Nenhuma observação." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Subtotal:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              "R$ ",
              itemsTotalNet.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] })
          ] }),
          saleDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-emerald-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Descontos:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "- R$ ",
              saleDiscount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] })
          ] }),
          (freight > 0 || otherExpenses > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frete/Outros:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "+ R$ ",
              (freight + otherExpenses).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between pt-2 text-lg font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Final:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "R$ ",
              finalTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Forma de Pagamento / Parcelas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left border-collapse border border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 text-slate-500 uppercase", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-200 p-1.5 font-semibold w-12 text-center", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-200 p-1.5 font-semibold", children: "Valor (R$)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-200 p-1.5 font-semibold", children: "Forma" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-200 p-1.5 font-semibold", children: "Data Venc." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (order.payments && order.payments.length > 0 ? order.payments : [{
            amount: finalTotal,
            payment_method: order.payment_method || "PIX",
            due_date: order.sale_date ? order.sale_date.substring(0, 10) : (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
          }]).map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-200 p-1.5 text-center", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "border border-slate-200 p-1.5 font-medium", children: [
              "R$ ",
              Number(p.amount || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-200 p-1.5", children: p.payment_method || "PIX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-200 p-1.5", children: p.due_date ? p.due_date.split("-").reverse().join("/") : "—" })
          ] }, idx)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex justify-between gap-8 pt-8 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[45%] text-center border-t border-slate-400 pt-2 text-xs", children: "Assinatura do Vendedor / Responsável" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[45%] text-center border-t border-slate-400 pt-2 text-xs", children: "De acordo do Cliente (Ok / Assinatura)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-slate-400 mt-16 pt-6 border-t", children: [
        "Documento gerado em ",
        (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")
      ] })
    ] })
  ] });
}
export {
  PrintPage as component
};
