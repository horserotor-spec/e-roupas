import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useDeferredValue } from "react";
import { useQuotes, useQuoteKPIs, Quote } from "@/lib/api/quotes";
import { quoteStatusLabel, quoteStatusTone, QuoteStatus } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, FileText, TrendingUp, Clock, Percent, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_authenticated/orcamentos/")({
  head: () => ({ meta: [{ title: "Orçamentos · e-roupas OS" }] }),
  component: QuotesPage,
});

function QuotesPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: quotes = [], isLoading } = useQuotes(deferredQ);
  const { data: kpis } = useQuoteKPIs();

  const filtered = statusFilter === "all"
    ? quotes
    : quotes.filter(q => q.status === statusFilter);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">COMERCIAL</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Orçamentos</h1>
        </div>
        <Link to="/orcamentos/novo">
          <Button className="h-9 inline-flex items-center gap-1.5 px-3">
            <Plus className="size-4" /> Novo Orçamento
          </Button>
        </Link>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard
          icon={<DollarSign className="size-4" />}
          label="Em aberto"
          value={`R$ ${(kpis?.openTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          hint={`${kpis?.totalOpen || 0} orçamentos`}
          color="text-blue-600 bg-blue-500/10"
        />
        <KpiCard
          icon={<Percent className="size-4" />}
          label="Taxa de conversão"
          value={`${(kpis?.conversionRate || 0).toFixed(1)}%`}
          hint={`${kpis?.totalConverted || 0} de ${kpis?.totalQuotes || 0}`}
          color="text-green-600 bg-green-500/10"
        />
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="Margem bruta média"
          value={`${(kpis?.avgMargin || 0).toFixed(1)}%`}
          hint="Sobre orçamentos com custo"
          color={`${(kpis?.avgMargin || 0) < 15 ? "text-red-600 bg-red-500/10" : "text-emerald-600 bg-emerald-500/10"}`}
        />
        <KpiCard
          icon={<Clock className="size-4" />}
          label="Tempo de fechamento"
          value={`${(kpis?.avgClosingDays || 0).toFixed(0)} dias`}
          hint="Média orçamento → pedido"
          color="text-purple-600 bg-purple-500/10"
        />
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código ou cliente..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { value: "all", label: "Todos" },
            { value: "rascunho", label: "Rascunho" },
            { value: "enviado", label: "Enviado" },
            { value: "negociacao", label: "Negociação" },
            { value: "aprovado", label: "Aprovado" },
            { value: "rejeitado", label: "Rejeitado" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Código</th>
              <th className="text-left font-medium px-4 py-2.5">Cliente</th>
              <th className="text-center font-medium px-4 py-2.5">Itens</th>
              <th className="text-right font-medium px-4 py-2.5 number">Total (R$)</th>
              <th className="text-center font-medium px-4 py-2.5">Margem</th>
              <th className="text-center font-medium px-4 py-2.5">Status</th>
              <th className="text-right font-medium px-4 py-2.5">Data</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Carregando...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filtered.map((quote) => (
              <tr key={quote.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <Link to="/orcamentos/$id" params={{ id: quote.id }} className="font-mono text-xs font-semibold text-primary hover:underline">
                    {quote.code}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium">{quote.client_name}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{quote.items?.length || 0}</td>
                <td className="px-4 py-3 text-right number font-medium">
                  {quote.final_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-center">
                  <MarginBadge margin={quote.gross_margin_pct} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge tone={quoteStatusTone[quote.status]}>
                    {quoteStatusLabel[quote.status]}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {new Date(quote.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to="/orcamentos/$id" params={{ id: quote.id }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileText className="size-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, hint, color }: { icon: React.ReactNode; label: string; value: string; hint: string; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight number">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

function MarginBadge({ margin }: { margin: number }) {
  const m = Number(margin || 0);
  let color = "bg-green-500/10 text-green-600";
  if (m < 0) color = "bg-red-500/10 text-red-600";
  else if (m < 15) color = "bg-amber-500/10 text-amber-600";
  else if (m < 30) color = "bg-yellow-500/10 text-yellow-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${color}`}>
      {m.toFixed(1)}%
    </span>
  );
}
