import { createFileRoute, Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { useOrders } from "@/lib/api/orders";
import { useClients } from "@/lib/api/clients";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/financeiro/")({
  head: () => ({ meta: [{ title: "Financeiro · e-roupas OS" }] }),
  component: Financeiro,
});

const statusLabel: Record<string, string> = {
  aguardando_financeiro: "Aguardando financeiro",
  confirmado: "Confirmado",
  pendente: "Pendente",
};

const statusTone: Record<string, "warning" | "info" | "default"> = {
  aguardando_financeiro: "warning",
  confirmado: "info",
  pendente: "default",
};

function Financeiro() {
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const { data: clients = [], isLoading: isLoadingClients } = useClients();

  if (isLoadingOrders || isLoadingClients) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Active orders (Em carteira)
  // Let's assume active means not 'orcamento', 'cancelado', 'entregue'
  const activeOrders = orders.filter((o: any) => 
    !["orcamento", "cancelado", "entregue", "enviado"].includes(o.status)
  );
  
  const aguardando = orders.filter((o: any) => o.status === "aguardando_financeiro");
  
  const total = activeOrders.reduce((s: number, o: any) => s + Number(o.final_total || 0), 0);
  const bloqueado = aguardando.reduce((s: number, o: any) => s + Number(o.final_total || 0), 0);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto animate-in fade-in">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Financeiro</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi label="Em carteira" value={formatCurrency(total)} hint="Pedidos ativos" />
        <Kpi label="Aguardando liberação" value={formatCurrency(bloqueado)} hint={`${aguardando.length} pedidos`} />
        <Kpi label="Multi-marca" value="ER + PG8" hint="Mesmo CNPJ, centros distintos" />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Aguardando financeiro</h2>
        <div className="divide-y divide-border -mx-2">
          {aguardando.map((o: any) => {
            const c = clients.find((client: any) => client.id === o.client_id) || { name: o.client_name };
            return (
              <Link key={o.id} to="/pedidos/$id" params={{ id: o.id }}
                className="flex items-center gap-3 px-2 py-3 hover:bg-muted/60 rounded-lg transition-colors">
                <div className="text-xs font-mono text-muted-foreground w-32">{o.code}</div>
                <div className="flex-1 text-sm truncate">{c?.name || "Cliente não identificado"}</div>
                <StatusBadge tone={statusTone[o.status] || "default"}>{statusLabel[o.status] || o.status}</StatusBadge>
                <div className="text-sm number w-24 text-right font-medium">{formatCurrency(o.final_total || 0)}</div>
              </Link>
            );
          })}
          {aguardando.length === 0 && <p className="px-2 py-6 text-sm text-muted-foreground text-center">Nenhum pedido aguardando liberação financeira.</p>}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold tracking-tight number mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}
