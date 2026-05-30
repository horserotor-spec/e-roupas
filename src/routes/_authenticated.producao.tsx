import { createFileRoute, Link } from "@tanstack/react-router";
import { orders, processLabel, clientById, type ProcessType } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/producao")({
  head: () => ({ meta: [{ title: "Produção · e-roupas OS" }] }),
  component: ProducaoPage,
});

const types: ProcessType[] = ["separacao", "corte", "costura", "bordado", "dtf", "silk", "sublimacao", "prensa"];

function ProducaoPage() {
  // colunas por processo: cada card é um item ativo nesse processo
  const cards = types.map((type) => {
    const cardsForType = orders.flatMap((o) =>
      o.items.flatMap((item) =>
        item.processes
          .filter((p) => p.type === type && p.status !== "concluido")
          .map((p) => ({ o, item, p })),
      ),
    );
    return { type, cardsForType };
  });

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Produção</h1>
        <p className="text-sm text-muted-foreground mt-1">Kanban por processo. Cada item pode aparecer em múltiplas colunas simultaneamente.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 md:-mx-10 px-6 md:px-10">
        {cards.map(({ type, cardsForType }) => (
          <div key={type} className="w-72 shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-xs font-semibold tracking-tight">{processLabel[type]}</h2>
              <span className="text-[10px] text-muted-foreground number">{cardsForType.length}</span>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-2 min-h-[320px] space-y-2">
              {cardsForType.map(({ o, item, p }) => {
                const c = clientById(o.clientId);
                return (
                  <Link
                    key={`${o.id}-${item.id}-${p.id}`}
                    to="/pedidos/$orderId" params={{ orderId: o.id }}
                    className="block rounded-xl border border-border bg-surface p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>{o.code}</span>
                      <span className={p.status === "em_andamento" ? "text-primary" : p.status === "bloqueado" ? "text-muted-foreground" : ""}>
                        {p.status === "em_andamento" ? "Em andamento" : p.status === "bloqueado" ? "Bloqueado" : "Pendente"}
                      </span>
                    </div>
                    <div className="text-sm font-medium mt-1 truncate">{item.product}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.qty} un · {c?.name}</div>
                  </Link>
                );
              })}
              {cardsForType.length === 0 && <div className="text-xs text-muted-foreground text-center py-8">Vazio</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
