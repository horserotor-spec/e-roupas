import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { clientById, orders, statusLabel, statusTone, type Client } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Mail, Phone, FileText, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/crm/$clientId")({
  loader: ({ params }) => {
    const client = clientById(params.clientId);
    if (!client) throw notFound();
    return { client };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.client.name ?? "Cliente"} · CRM` }] }),
  component: ClientPage,
  notFoundComponent: () => <div className="p-10 text-sm text-muted-foreground">Cliente não encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-sm text-destructive">{error.message}</div>,
});

function ClientPage() {
  const { client } = Route.useLoaderData() as { client: Client };
  const clientOrders = orders.filter((o) => o.clientId === client.id);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <Link to="/crm" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3.5" /> Clientes
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{client.brand === "ER" ? "e-roupas" : "peagah8"} · {client.origin}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{client.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Responsável: {client.owner}</p>
        </div>
        <div className="flex gap-2">
          <Stat label="Pedidos" value={client.orders} />
          <Stat label="Ticket médio" value={`R$ ${client.ticket.toLocaleString("pt-BR")}`} />
          <Stat label="Total" value={`R$ ${client.total.toLocaleString("pt-BR")}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <aside className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold mb-2">Dados</h2>
          <Row icon={Phone} label="Telefone" value={client.phone} />
          <Row icon={Mail} label="Email" value={client.email} />
          <Row icon={FileText} label="Documento" value={client.document} />
          <Row icon={MapPin} label="Marca" value={client.brand === "ER" ? "e-roupas" : "peagah8"} />
          <div className="pt-3 hairline-t">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Observações</div>
            <p className="text-sm leading-relaxed">{client.notes}</p>
          </div>
        </aside>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Histórico de pedidos</h2>
          <div className="divide-y divide-border -mx-2">
            {clientOrders.map((o) => (
              <Link
                key={o.id} to="/pedidos/$orderId" params={{ orderId: o.id }}
                className="flex items-center gap-3 px-2 py-3 hover:bg-muted/60 rounded-lg"
              >
                <div className="text-xs font-mono text-muted-foreground w-32">{o.code}</div>
                <div className="flex-1 text-sm truncate">{o.items.map((i) => i.product).join(", ")}</div>
                <StatusBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</StatusBadge>
                <div className="text-sm number w-24 text-right">{formatCurrency(o.total)}</div>
              </Link>
            ))}
            {clientOrders.length === 0 && <p className="px-2 py-6 text-sm text-muted-foreground">Sem pedidos registrados.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-base font-semibold number mt-0.5">{value}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="size-4 mt-0.5 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm truncate">{value}</div>
      </div>
    </div>
  );
}
