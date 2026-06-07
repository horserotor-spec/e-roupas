import { createFileRoute, Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { orders, clientById, statusLabel, statusTone } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · e-roupas OS" }] }),
  component: Financeiro,
});

function Financeiro() {
  const aguardando = orders.filter((o) => o.status === "aguardando_financeiro");
  const total = orders.reduce((s, o) => s + o.total, 0);
  const bloqueado = aguardando.reduce((s, o) => s + o.total, 0);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Financeiro</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi label="Em carteira" value={`R$ ${total.toLocaleString("pt-BR")}`} hint="Pedidos ativos" />
        <Kpi label="Aguardando liberação" value={`R$ ${bloqueado.toLocaleString("pt-BR")}`} hint={`${aguardando.length} pedidos`} />
        <Kpi label="Multi-marca" value="ER + PG8" hint="Mesmo CNPJ, centros distintos" />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Aguardando financeiro</h2>
        <div className="divide-y divide-border -mx-2">
          {aguardando.map((o) => {
            const c = clientById(o.clientId);
            return (
              <Link key={o.id} to="/pedidos/$orderId" params={{ orderId: o.id }}
                className="flex items-center gap-3 px-2 py-3 hover:bg-muted/60 rounded-lg">
                <div className="text-xs font-mono text-muted-foreground w-32">{o.code}</div>
                <div className="flex-1 text-sm truncate">{c?.name}</div>
                <StatusBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</StatusBadge>
                <div className="text-sm number w-24 text-right font-medium">{formatCurrency(o.total)}</div>
              </Link>
            );
          })}
          {aguardando.length === 0 && <p className="px-2 py-6 text-sm text-muted-foreground">Tudo liberado.</p>}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold tracking-tight number mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}
