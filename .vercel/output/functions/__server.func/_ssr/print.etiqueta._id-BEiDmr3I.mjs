import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useOrder } from "./orders-CbTRcciT.mjs";
import { n as Route$e, z as useAuth, B as Button } from "./router-BxmJvJdu.mjs";
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
function FakeBarcode({
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-full max-w-[200px] bg-white overflow-hidden justify-center items-end opacity-90 border-x-4 border-black", children: value.split("").map((char, i) => {
      const width = char.charCodeAt(0) % 4 + 1;
      const isSpace = i % 3 === 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: `${width}px`,
        height: "100%",
        backgroundColor: isSpace ? "transparent" : "black",
        marginLeft: isSpace ? "2px" : "1px"
      } }, i);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] mt-1 font-bold tracking-widest", children: value })
  ] });
}
function PrintEtiquetaPage() {
  const {
    id
  } = Route$e.useParams();
  const {
    loading: authLoading
  } = useAuth();
  const {
    data: order,
    isLoading,
    error
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
  if (authLoading || isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (error || !order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-screen items-center justify-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-slate-800", children: "Pedido não encontrado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500 font-mono text-sm", children: [
        "ID Procurado: ",
        id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-xs font-mono max-w-md text-center", children: error ? String(error.message || error) : "Sem erro retornado, apenas null" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-400 text-xs", children: "O pedido pode não existir ou faltam permissões de acesso (RLS)." })
    ] });
  }
  const senderInfo = {
    name: "e-roupas (Sua Empresa)",
    street: "Rua do Remetente, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zip: "01000-000"
  };
  const trackingCode = order.tracking_code || "BR" + order.code.replace(/\D/g, "") + "BR";
  const isSedex = order.logistics_type?.toLowerCase().includes("sedex");
  const servicoNome = isSedex ? "SEDEX" : "PAC";
  const chancelaCode = isSedex ? "04162" : "04669";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-200 py-10 print:py-0 print:bg-white flex flex-col items-center font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl mx-auto mb-6 flex justify-between items-center px-6 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Configurado para ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "4 etiquetas por página (A4)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Tamanho da etiqueta Correios Padrão: 10,5cm x 14,8cm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.print(), className: "bg-primary text-white hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
        " Imprimir Etiqueta"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          @media print {
            @page { margin: 0; size: A4 portrait; }
            body { margin: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-container { 
              display: block !important;
              box-shadow: none !important;
              background: transparent !important;
              padding: 0 !important;
            }
          }
        ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-container bg-white shadow-md w-[210mm] min-h-[297mm] p-0 box-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "float-left box-border print:border-none relative", style: {
      width: "105mm",
      height: "148.5mm",
      padding: "2mm"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full border-[1.5px] border-black bg-white flex flex-col overflow-hidden text-black p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1/3 p-1 flex flex-col items-center justify-center border-r border-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[14px] text-blue-800 tracking-tighter leading-none mb-0.5", children: "Correios" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/3 p-1 flex flex-col items-center justify-center border-r border-black text-[9px] leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "NF: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "PEDIDO: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: order.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "CONTRATO: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "9912345678" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/3 p-1 flex flex-col items-center justify-center bg-black text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[14px]", children: servicoNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px]", children: chancelaCode })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-2 border-b border-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FakeBarcode, { value: trackingCode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] font-bold mt-1 tracking-widest", children: trackingCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-1 border-b border-dashed border-black pb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase", children: "Recebedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px]", children: "Assinatura: __________________ Documento: _______________" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold uppercase leading-tight mt-1", children: order.delivery_name || order.client_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] leading-tight mt-1", children: [
          order.delivery_street || "Endereço não cadastrado",
          ", ",
          order.delivery_number,
          " ",
          order.delivery_complement && `- ${order.delivery_complement}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] leading-tight", children: order.delivery_neighborhood }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] leading-tight", children: [
          order.delivery_city || "Cidade",
          " / ",
          order.delivery_state || "UF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] font-bold", children: [
          "CEP: ",
          order.delivery_zip || "00000-000"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-6 max-w-[150px] opacity-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FakeBarcode, { value: order.delivery_zip ? order.delivery_zip.replace(/\D/g, "") : "00000000" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-black text-[9px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/2 p-1 border-r border-black", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Peso (kg): ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: order.gross_weight || "0.100" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Volumes: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "1/",
              order.volumes_quantity || 1
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/2 p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Dimensões: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              order.package_width || "10",
              "x",
              order.package_length || "15",
              "x",
              order.package_height || "10",
              " cm"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Obs: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Nenhuma" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-1 text-[9px] relative flex flex-col justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold uppercase mb-0.5", children: "Remetente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: senderInfo.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          senderInfo.street,
          " - ",
          senderInfo.neighborhood
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          senderInfo.city,
          " / ",
          senderInfo.state,
          " - CEP: ",
          senderInfo.zip
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] mt-1 text-slate-600", children: "Não é documento fiscal. Declaração de conteúdo dispensada." })
      ] })
    ] }) }) })
  ] });
}
export {
  PrintEtiquetaPage as component
};
