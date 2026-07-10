import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { w as formatCurrency, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { o as orders, a as clients } from "./_ssr/mock-data-DefFmkSt.mjs";
import { P as Papa } from "./_libs/papaparse.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { h as Boxes, d as ArrowRight, z as Download } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "./_libs/isbot.mjs";
function Relatorios() {
  const er = orders.filter((o) => o.brand === "ER");
  const pg8 = orders.filter((o) => o.brand === "PG8");
  const erTotal = er.reduce((s, o) => s + o.total, 0);
  const pg8Total = pg8.reduce((s, o) => s + o.total, 0);
  const sum = erTotal + pg8Total;
  const [loadingType, setLoadingType] = reactExports.useState(null);
  const exportData = async (table, name) => {
    try {
      setLoadingType(table);
      const {
        data,
        error
      } = await supabase.from(table).select("*");
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.info(`Nenhum dado encontrado para ${name}.`);
        return;
      }
      const csv = Papa.unparse(data, {
        header: true
      });
      const blob = new Blob([new Uint8Array([239, 187, 191]), csv], {
        type: "text/csv;charset=utf-8;"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${table}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Relatório de ${name} exportado com sucesso!`);
    } catch (err) {
      console.error(err);
      toast.error(`Erro ao exportar ${name}: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "BI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Relatórios" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: "Receita por marca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandBar, { label: "e-roupas", value: erTotal, total: sum, color: "var(--primary)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandBar, { label: "peagah8", value: pg8Total, total: sum, color: "oklch(0.62 0.16 152)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "Mesmo CNPJ, centros de resultado distintos." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: "Resumo operacional" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pedidos ativos", value: orders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Clientes", value: clients.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Receita ER", value: `R$ ${erTotal.toLocaleString("pt-BR")}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Receita PG8", value: `R$ ${pg8Total.toLocaleString("pt-BR")}` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold tracking-tight mt-8 mb-4", children: "Exportação de Dados" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCard, { title: "Relatório de Produção", description: "Exportação completa de todos os pedidos e seus status.", isLoading: loadingType === "orders", onExport: () => exportData("orders", "Produção") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCard, { title: "Relatório de Produtos", description: "Exportação do catálogo completo de produtos.", isLoading: loadingType === "products", onExport: () => exportData("products", "Produtos") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCard, { title: "Relatório de Orçamentos", description: "Exportação de orçamentos gerados.", isLoading: loadingType === "quotes", onExport: () => exportData("quotes", "Orçamentos") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCard, { title: "Relatório de Fornecedores", description: "Exportação do cadastro de fornecedores.", isLoading: loadingType === "suppliers", onExport: () => exportData("suppliers", "Fornecedores") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCard, { title: "Relatório de Clientes", description: "Exportação do cadastro completo do CRM.", isLoading: loadingType === "clients", onExport: () => exportData("clients", "Clientes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-white p-5 flex flex-col md:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-800", children: "Relatório Industrial de Estoque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Rastreabilidade, movimentações, saldo imutável e exportação de CSV." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/estoque", className: "inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0", children: [
          "Acessar Relatório ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
        ] })
      ] })
    ] })
  ] });
}
function ExportCard({
  title,
  description,
  onExport,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-white p-5 flex flex-col md:flex-row items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-800", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onExport, disabled: isLoading, className: "inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
      " ",
      isLoading ? "Exportando..." : "Exportar CSV"
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-lg font-semibold number mt-0.5", children: value })
  ] });
}
function BrandBar({
  label,
  value,
  total,
  color
}) {
  const pct = total > 0 ? Math.round(value / total * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground number", children: [
        formatCurrency(value),
        " · ",
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
      width: `${pct}%`,
      background: color
    } }) })
  ] });
}
export {
  Relatorios as component
};
