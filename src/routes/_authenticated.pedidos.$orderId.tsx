import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { orderById, clientById, statusLabel, statusTone, processLabel, type OrderItemProcess, type Order } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Flame, Calendar, User, Package, MessageSquare, Paperclip, CheckCircle2, CircleDashed, Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/pedidos/$orderId")({
  loader: ({ params }) => {
    const order = orderById(params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.order.code ?? "Pedido"} · e-roupas OS` }] }),
  component: OrderPage,
  notFoundComponent: () => <div className="p-10 text-sm text-muted-foreground">Pedido não encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-sm text-destructive">{error.message}</div>,
});

function OrderPage() {
  const { order } = Route.useLoaderData() as { order: Order };
  const client = clientById(order.clientId);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <Link to="/pedidos" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3.5" /> Pedidos
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-muted-foreground">{order.code}</p>
            {order.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--destructive)]">
                <Flame className="size-3" /> Urgente
              </span>
            )}
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            <Link to="/crm/$clientId" params={{ clientId: order.clientId }} className="hover:text-primary">{client?.name}</Link>
          </h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> Prazo {new Date(order.deadline).toLocaleDateString("pt-BR")}</span>
            <span className="inline-flex items-center gap-1"><User className="size-3.5" /> {order.owner}</span>
            <span className="inline-flex items-center gap-1"><Package className="size-3.5" /> {order.brand === "ER" ? "e-roupas" : "peagah8"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={statusTone[order.status]}>{statusLabel[order.status]}</StatusBadge>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="text-xl font-semibold number">R$ {order.total.toLocaleString("pt-BR")}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-1">Itens do pedido</h2>
          <p className="text-xs text-muted-foreground mb-4">Cada item pode ter múltiplos processos de produção, com dependências.</p>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-4 bg-surface">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-sm font-semibold">{item.product}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.color} · {item.size} · {item.qty} un.</div>
                    {item.notes && <div className="text-xs text-muted-foreground mt-1 italic">“{item.notes}”</div>}
                  </div>
                </div>

                <div className="mt-4 -mx-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 mb-2">Processos</div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {item.processes.map((p) => (
                      <ProcessChip key={p.id} p={p} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5 flex flex-col">
          <h2 className="text-sm font-semibold mb-1">Timeline universal</h2>
          <p className="text-xs text-muted-foreground mb-4">Mensagens, status, financeiro e produção — tudo aqui.</p>

          <ul className="space-y-4 flex-1">
            {order.timeline.slice().reverse().map((t) => (
              <li key={t.id} className="flex gap-3">
                <div className="size-7 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0">
                  {t.kind === "mensagem" ? <MessageSquare className="size-3.5" />
                    : t.kind === "anexo" ? <Paperclip className="size-3.5" />
                    : t.kind === "aprovacao" ? <CheckCircle2 className="size-3.5 text-[var(--success)]" />
                    : <CircleDashed className="size-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs">
                    <span className="font-medium">{t.author}</span>
                    <span className="text-muted-foreground"> · {t.at}</span>
                  </div>
                  <p className="text-sm mt-0.5 leading-relaxed">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 hairline-t">
            <input
              placeholder="Adicionar nota à timeline…"
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-2">Sprint 1 · entrada visual · auditoria total na Sprint 2.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProcessChip({ p }: { p: OrderItemProcess }) {
  const map = {
    pendente: { Icon: CircleDashed, cls: "text-muted-foreground bg-muted border-border" },
    em_andamento: { Icon: Loader2, cls: "text-primary bg-primary-soft border-transparent" },
    concluido: { Icon: CheckCircle2, cls: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)] border-transparent" },
    bloqueado: { Icon: Lock, cls: "text-muted-foreground bg-muted/60 border-dashed border-border opacity-70" },
  }[p.status];
  const { Icon, cls } = map;
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 h-7 text-xs font-medium ${cls}`}>
      <Icon className={`size-3.5 ${p.status === "em_andamento" ? "animate-spin" : ""}`} />
      {processLabel[p.type]}
      {p.dependsOn?.length ? <span className="text-[10px] opacity-60">· dep. {p.dependsOn.map((d) => processLabel[d]).join(", ")}</span> : null}
    </div>
  );
}
