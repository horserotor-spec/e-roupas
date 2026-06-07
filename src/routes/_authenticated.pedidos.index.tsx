import { createFileRoute, Link } from "@tanstack/react-router";
import { statusLabel, statusTone, type OrderStatus } from "@/lib/constants";
import { useOrders, Order, useUpdateOrder } from "@/lib/api/orders";
import { StatusBadge } from "@/components/StatusBadge";
import { useState, useDeferredValue } from "react";
import { Search, Plus, Flame, Loader2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/pedidos/")({
  head: () => ({ meta: [{ title: "Pedidos · e-roupas OS" }] }),
  component: PedidosPage,
});

const primaryFilters: { key: "todos" | "urgentes" | "atrasados" | OrderStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "urgentes", label: "Urgentes" },
  { key: "atrasados", label: "Atrasados" },
  { key: "finalizado", label: "Finalizados" },
];

const secondaryFilters: { key: OrderStatus; label: string }[] = [
  { key: "orcamento", label: "Orçamento" },
  { key: "arte_criacao", label: "Arte/Criação" },
  { key: "aguardando_arte", label: "Ag. Arte" },
  { key: "confirmado", label: "Confirmado" },
  { key: "aguardando_financeiro", label: "Ag. Financeiro" },
  { key: "liberado_producao", label: "Liberado Prod." },
  { key: "separacao", label: "Separação" },
  { key: "corte", label: "Corte" },
  { key: "costura", label: "Costura" },
  { key: "bordado", label: "Bordado" },
  { key: "impressao", label: "Impressão" },
  { key: "prensa", label: "Prensa" },
  { key: "qualidade", label: "Qualidade" },
  { key: "expedicao", label: "Expedição" },
  { key: "entregue", label: "Entregue" },
];

function isOverdue(deadline: string | null, status: OrderStatus) {
  if (!deadline) return false;
  if (status === "entregue" || status === "finalizado") return false;
  return new Date(deadline) < new Date();
}

function PedidosPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [f, setF] = useState<any>("todos");
  
  const { data: orders = [], isLoading } = useOrders(deferredQ);
  const updateOrderMutation = useUpdateOrder();

  const filtered = orders.filter((o) => {
    if (f === "urgentes" && !o.urgent) return false;
    if (f === "atrasados" && !isOverdue(o.deadline, o.status)) return false;
    if (f !== "todos" && f !== "urgentes" && f !== "atrasados" && o.status !== f) return false;
    return true;
  });

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Núcleo do ERP</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pedidos</h1>
        </div>
        <Link to="/pedidos/novo" className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> Novo pedido
        </Link>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar pedido..."
              className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {primaryFilters.map((flt) => (
              <button
                key={flt.key}
                onClick={() => setF(flt.key as any)}
                className={`shrink-0 h-8 px-3 rounded-md text-xs font-medium transition-colors ${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {flt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {secondaryFilters.map((flt) => (
            <button
              key={flt.key}
              onClick={() => setF(flt.key as any)}
              className={`shrink-0 h-6 px-2.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-colors ${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Pedido</th>
              <th className="text-left font-medium px-4 py-2.5">Cliente</th>
              <th className="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Itens</th>
              <th className="text-left font-medium px-4 py-2.5">Status</th>
              <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">Prazo</th>
              <th className="text-right font-medium px-4 py-2.5 number">Total</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Carregando pedidos...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filtered.map((o) => {
              const overdue = isOverdue(o.deadline, o.status);
              return (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3">
                    <Link to="/pedidos/$orderId" params={{ orderId: o.id }} className="font-mono text-xs hover:text-primary">{o.code}</Link>
                    {o.urgent && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--destructive)]">
                        <Flame className="size-3" /> Urgente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium truncate">{o.client_name}</div>
                    <div className="text-xs text-muted-foreground">{o.brand_code} · {o.owner_name}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {o.items.map((i) => `${i.quantity}× ${i.product_name}`).join(" · ")}
                  </td>
                  <td className="px-4 py-3">
                    <Select 
                      value={o.status} 
                      onValueChange={(val: any) => updateOrderMutation.mutate({ id: o.id, status: val })}
                      disabled={updateOrderMutation.isPending}
                    >
                      <SelectTrigger className={`h-8 border-none font-medium px-2.5 py-0.5 text-xs inline-flex items-center w-fit gap-1 rounded-full ${
                          statusTone[o.status] === 'info' ? 'bg-blue-100 text-blue-700' :
                          statusTone[o.status] === 'warning' ? 'bg-orange-100 text-orange-700' :
                          statusTone[o.status] === 'success' ? 'bg-green-100 text-green-700' :
                          statusTone[o.status] === 'critical' ? 'bg-red-100 text-red-700' :
                          statusTone[o.status] === 'purple' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={`px-4 py-3 hidden md:table-cell text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {o.deadline ? new Date(o.deadline).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right number font-medium">R$ {o.final_total.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/pedidos/$id" params={{ id: o.id }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="size-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum pedido com esse filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
