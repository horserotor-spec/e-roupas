import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ia")({
  head: () => ({ meta: [{ title: "IA Assistente · e-roupas OS" }] }),
  component: IA,
});

const suggestions = [
  "Quais pedidos estão atrasados?",
  "Resumo do dia de produção",
  "Top 3 clientes por ticket médio",
  "Qual processo é o gargalo da semana?",
];

function IA() {
  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">IA</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Assistente operacional</h1>
      <p className="text-sm text-muted-foreground mt-1">Pergunte sobre a operação. Conexão com OpenAI chega na Sprint 2.</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-lg bg-primary-soft text-primary grid place-items-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">e-roupas OS · IA</div>
            <div className="text-xs text-muted-foreground">Pronto para responder em linguagem natural.</div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 text-sm leading-relaxed">
          Olá! Sou o assistente operacional do e-roupas OS. Posso ajudar com pedidos, produção, clientes e relatórios. Escolha uma sugestão ou pergunte à vontade.
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((s) => (
            <button key={s} className="text-left text-sm rounded-lg border border-border bg-surface px-3 py-2 hover:border-primary transition-colors">
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
          <input placeholder="Pergunte algo…" className="flex-1 bg-transparent text-sm outline-none" />
          <button className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center hover:opacity-90">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
