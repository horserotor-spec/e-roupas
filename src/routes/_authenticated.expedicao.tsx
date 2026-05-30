import { createFileRoute, Link } from "@tanstack/react-router";
import { orders, clientById } from "@/lib/mock-data";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/expedicao")({
  head: () => ({ meta: [{ title: "Expedição · e-roupas OS" }] }),
  component: Expedicao,
});

function Expedicao() {
  const liberaveis = orders.filter((o) =>
    o.items.every((i) => i.processes.every((p) => p.status === "concluido")) &&
    o.status !== "entregue" && o.status !== "finalizado",
  );
  const emTransito = orders.filter((o) => o.status === "expedicao");

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Expedição</h1>
      <p className="text-sm text-muted-foreground mt-1">Só libera quando todos os itens do pedido estiverem concluídos.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-6">
        <Col title="Prontos para expedir" empty="Nenhum pedido pronto." items={liberaveis} />
        <Col title="Em trânsito" empty="Sem entregas em andamento." items={emTransito} />
      </div>
    </div>
  );
}

function Col({ title, items, empty }: { title: string; items: typeof orders; empty: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      <div className="space-y-2">
        {items.map((o) => {
          const c = clientById(o.clientId);
          return (
            <Link key={o.id} to="/pedidos/$orderId" params={{ orderId: o.id }}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 hover:border-primary">
              <Truck className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{c?.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{o.code}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(o.deadline).toLocaleDateString("pt-BR")}</div>
            </Link>
          );
        })}
        {items.length === 0 && <p className="text-sm text-muted-foreground py-4">{empty}</p>}
      </div>
    </section>
  );
}
