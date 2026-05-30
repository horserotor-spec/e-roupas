import { createFileRoute, Link } from "@tanstack/react-router";
import { orders, clientById, statusLabel, statusTone, isOverdue, type OrderStatus } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import { Search, Plus, Flame } from "lucide-react";

export const Route = createFileRoute("/_authenticated/pedidos/")({
  head: () => ({ meta: [{ title: "Pedidos · e-roupas OS" }] }),
  component: PedidosPage,
});

const filters: { key: "todos" | "urgentes" | "atrasados" | OrderStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "urgentes", label: "Urgentes" },
  { key: "atrasados", label: "Atrasados" },
  { key: "aguardando_arte", label: "Ag. arte" },
  { key: "aguardando_financeiro", label: "Ag. financeiro" },
  { key: "em_producao", label: "Em produção" },
  { key: "expedicao", label: "Expedição" },
];

function PedidosPage() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]["key"]>("todos");

  const filtered = orders.filter((o) => {
    if (f === "urgentes" && !o.urgent) return false;
    if (f === "atrasados" && !isOverdue(o)) return false;
    if (f !== "todos" && f !== "urgentes" && f !== "atrasados" && o.status !== f) return false;
    if (q) {
      const c = clientById(o.clientId);
      const blob = `${o.code} ${c?.name ?? ""} ${o.items.map((i) => i.product).join(" ")}`.toLowerCase();
      if (!blob.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Núcleo do ERP</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pedidos</h1>
        </div>
        <button className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> Novo pedido
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar código, cliente, produto…"
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((flt) => (
            <button
              key={flt.key}
              onClick={() => setF(flt.key)}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => {
              const c = clientById(o.clientId);
              const overdue = isOverdue(o);
              return (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link to="/pedidos/$orderId" params={{ orderId: o.id }} className="font-mono text-xs hover:text-primary">{o.code}</Link>
                    {o.urgent && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--destructive)]">
                        <Flame className="size-3" /> Urgente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium truncate">{c?.name}</div>
                    <div className="text-xs text-muted-foreground">{o.brand === "ER" ? "e-roupas" : "peagah8"} · {o.owner}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {o.items.map((i) => `${i.qty}× ${i.product}`).join(" · ")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</StatusBadge></td>
                  <td className={`px-4 py-3 hidden md:table-cell text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {new Date(o.deadline).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right number font-medium">R$ {o.total.toLocaleString("pt-BR")}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum pedido com esse filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
