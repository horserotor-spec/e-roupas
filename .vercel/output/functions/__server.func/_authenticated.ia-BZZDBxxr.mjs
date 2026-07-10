import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { aj as Sparkles, ae as Send } from "./_libs/lucide-react.mjs";
const suggestions = ["Quais pedidos estão atrasados?", "Resumo do dia de produção", "Top 3 clientes por ticket médio", "Qual processo é o gargalo da semana?"];
function IA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "IA" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Assistente operacional" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Pergunte sobre a operação. Conexão com OpenAI chega na Sprint 2." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary-soft text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "e-roupas OS · IA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Pronto para responder em linguagem natural." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-muted/50 p-4 text-sm leading-relaxed", children: "Olá! Sou o assistente operacional do e-roupas OS. Posso ajudar com pedidos, produção, clientes e relatórios. Escolha uma sugestão ou pergunte à vontade." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-left text-sm rounded-lg border border-border bg-surface px-3 py-2 hover:border-primary transition-colors", children: s }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Pergunte algo…", className: "flex-1 bg-transparent text-sm outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) })
      ] })
    ] })
  ] });
}
export {
  IA as component
};
