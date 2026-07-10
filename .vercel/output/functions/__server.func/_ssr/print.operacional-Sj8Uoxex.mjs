import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useOrder } from "./orders-E2Xxa3Vy.mjs";
import { R as Route$u, B as Button } from "./router-C3pqRbRf.mjs";
import { B as Barcode } from "../_libs/react-barcode.mjs";
import "../_libs/sonner.mjs";
import { V as LoaderCircle, P as Grid3x3, aa as Printer } from "../_libs/lucide-react.mjs";
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
import "../_libs/jsbarcode.mjs";
import "../_libs/prop-types.mjs";
function PrintOperacionalPage() {
  const params = Route$u.useSearch();
  const orderId = params.orderId || "";
  const {
    data: order,
    isLoading,
    error
  } = useOrder(orderId);
  const [startPosition, setStartPosition] = reactExports.useState(0);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-screen items-center justify-center text-slate-500 font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Pedido não encontrado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-2", children: [
        "ID recebido: ",
        orderId || "NENHUM"
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 mt-2", children: [
        "Erro interno: ",
        error.message || String(error)
      ] })
    ] });
  }
  const totalLabelsOnSheet = 65;
  const labelsToPrint = [];
  order.items.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    for (let i = 0; i < qty; i++) {
      const prod = item.products || {};
      const fabricSigla = (prod.fabrics?.code || item.fabric?.substring(0, 3) || "GEN").toUpperCase();
      const colorSigla = (prod.canonical_colors?.code || item.color?.substring(0, 3) || "GEN").toUpperCase();
      const modelSigla = "REG";
      const sizeStr = (item.size || "G").toUpperCase();
      const artCode = (item.sku?.split("-")[0] || "ART").toUpperCase();
      const exactSku = item.sku || `${artCode}-REG-${fabricSigla}-${colorSigla}-${sizeStr}`;
      labelsToPrint.push({
        orderCode: order.code,
        art: artCode,
        model: modelSigla,
        fabric: fabricSigla,
        color: colorSigla,
        size: sizeStr,
        barcode: exactSku
      });
    }
  });
  const finalSheetLabels = Array(startPosition).fill(null).concat(labelsToPrint);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen print:min-h-0 print:h-auto print:block bg-slate-100 py-10 print:py-0 print:bg-white flex flex-col items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[210mm] bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-slate-800 flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "size-5 text-primary" }),
        " Configuração de Impressão de Etiquetas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-4", children: [
        "Layout: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "38,1x21,2mm em Folha A4 (5 Colunas x 13 Linhas)" }),
        ". Clique na grade abaixo para escolher a partir de qual posição deseja iniciar a impressão:"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1 border border-slate-200 p-2 rounded-lg bg-slate-50 w-full max-w-[400px] mx-auto mb-6", children: Array.from({
        length: totalLabelsOnSheet
      }).map((_, idx) => {
        const isSelected = startPosition === idx;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStartPosition(idx), className: `aspect-[381/212] border text-[8px] flex items-center justify-center font-bold rounded transition-colors ${isSelected ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-700 border-slate-200"}`, children: idx + 1 }, idx);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 font-medium", children: [
          "Imprimindo ",
          labelsToPrint.length,
          " etiqueta(s) a partir da posição ",
          startPosition + 1,
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.print(), className: "bg-primary text-white hover:bg-primary/90 rounded-full px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
          " Imprimir Etiquetas"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          @media print {
            body, html { margin: 0; padding: 0; background: white; height: 100%; }
            .print-hidden { display: none !important; }
            @page {
              size: A4 portrait;
              margin: 0;
            }
            .a4-sheet {
              width: 210mm !important;
              height: 297mm !important;
              box-shadow: none !important;
              border: none !important;
              page-break-after: avoid;
              break-after: avoid;
            }
          }
          /* Estilo A4 estruturado de 5 colunas e 13 linhas (38,1x21,2mm) */
          .a4-sheet {
            display: grid;
            grid-template-columns: repeat(5, 38.1mm);
            grid-template-rows: repeat(13, 21.2mm);
            column-gap: 2.65mm;
            row-gap: 0mm;
            padding: 10.9mm 4.49mm; /* Borda cima/baixo: 10.90mm, Borda esq/dir: 4.49mm */
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            box-sizing: border-box;
            background: white;
            border: none;
          }
          .label-cell {
            box-sizing: border-box;
            border: 0.1mm dotted rgba(0, 0, 0, 0.08); /* Delinear as bordas de forma sutil */
            padding: 1.5mm 1mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
          }
        ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "a4-sheet shadow-lg", children: finalSheetLabels.map((lbl, idx) => {
      if (!lbl) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-cell" }, `empty-${idx}`);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-cell text-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[8px] font-bold leading-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Ped: ",
            lbl.orderCode
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black text-white text-[10px] px-1 py-0.5 rounded font-black tracking-wider flex items-center justify-center min-w-[16px] h-[14px] leading-none", children: lbl.size })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7.5px] font-bold text-center leading-none truncate max-w-full my-0.5", children: lbl.barcode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex justify-center overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { value: lbl.barcode, width: 0.9, height: 28, fontSize: 8, displayValue: false, margin: 0, background: "transparent" }) })
      ] }, idx);
    }) })
  ] });
}
export {
  PrintOperacionalPage as component
};
