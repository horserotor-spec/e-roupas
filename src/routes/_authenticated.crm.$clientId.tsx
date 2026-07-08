import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { statusLabel, statusTone } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Mail, Phone, FileText, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/crm/$clientId")({
  loader: async ({ params }) => {
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("*")
      .eq("id", params.clientId)
      .maybeSingle();

    if (clientErr || !client) {
      throw notFound();
    }

    const { data: dbOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("client_id", params.clientId)
      .order("created_at", { ascending: false });

    const clientOrders = dbOrders || [];

    const total = clientOrders.reduce((sum, o) => sum + Number(o.final_total || 0), 0);
    const ordersCount = clientOrders.length;
    const ticket = ordersCount > 0 ? total / ordersCount : 0;

    return {
      client: {
        ...client,
        total,
        orders: ordersCount,
        ticket,
      },
      clientOrders,
    };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.client.name ?? "Cliente"} · CRM` }] }),
  component: ClientPage,
  notFoundComponent: () => <div className="p-10 text-sm text-muted-foreground">Cliente não encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-sm text-destructive">{error.message}</div>,
});

function ClientPage() {
  const { client, clientOrders } = Route.useLoaderData() as { client: any; clientOrders: any[] };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <Link to="/crm" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3.5" /> Clientes
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {client.entity_type || "Cliente"} · {client.lead_source || "Sem origem"}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{client.name}</h1>
          {client.company_name && (
            <p className="text-sm text-muted-foreground mt-1">Razão Social/Fantasia: {client.company_name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Stat label="Pedidos" value={client.orders} />
          <Stat label="Ticket médio" value={`R$ ${client.ticket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <Stat label="Total" value={`R$ ${client.total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <aside className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold mb-2">Dados</h2>
          <Row icon={Phone} label="Telefone" value={client.phone || "—"} />
          <Row icon={Mail} label="Email" value={client.email || "—"} />
          <Row icon={FileText} label="Documento" value={client.document || "—"} />
          <Row icon={MapPin} label="Endereço" value={
            client.street 
              ? `${client.street}, ${client.number || "S/N"}${client.complement ? ` - ${client.complement}` : ""}, ${client.neighborhood || ""}, ${client.city || ""}/${client.state || ""}` 
              : "—"
          } />
          <div className="pt-3 hairline-t">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Observações</div>
            <p className="text-sm leading-relaxed">{client.notes || "Sem observações."}</p>
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
                <div className="flex-1 text-sm truncate">{o.brand_code || "Pedido"}</div>
                <StatusBadge tone={statusTone[o.status] || "neutral"}>{statusLabel[o.status] || o.status}</StatusBadge>
                <div className="text-sm number w-24 text-right">{formatCurrency(o.final_total)}</div>
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
