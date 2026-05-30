import { createFileRoute, Link } from "@tanstack/react-router";
import { clients } from "@/lib/mock-data";
import { useState } from "react";
import { Search, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/crm/")({
  head: () => ({ meta: [{ title: "CRM · e-roupas OS" }] }),
  component: CrmPage,
});

function CrmPage() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<"all" | "ER" | "PG8">("all");
  const filtered = clients.filter((c) => {
    if (brand !== "all" && c.brand !== brand) return false;
    if (!q) return true;
    return [c.name, c.email, c.phone, c.document].some((f) => f.toLowerCase().includes(q.toLowerCase()));
  });

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CRM</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Clientes</h1>
        </div>
        <button className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> Novo cliente
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, email, telefone, CNPJ…"
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs">
          {(["all", "ER", "PG8"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-3 h-7 rounded-md font-medium transition-colors ${brand === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {b === "all" ? "Todas" : b === "ER" ? "e-roupas" : "peagah8"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Cliente</th>
              <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">Contato</th>
              <th className="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Origem</th>
              <th className="text-left font-medium px-4 py-2.5">Marca</th>
              <th className="text-right font-medium px-4 py-2.5 number">Pedidos</th>
              <th className="text-right font-medium px-4 py-2.5 number">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link to="/crm/$clientId" params={{ clientId: c.id }} className="font-medium hover:text-primary">{c.name}</Link>
                  <div className="text-xs text-muted-foreground">{c.document}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  <div>{c.phone}</div>
                  <div className="text-xs">{c.email}</div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{c.origin}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{c.brand === "ER" ? "e-roupas" : "peagah8"}</span>
                </td>
                <td className="px-4 py-3 text-right number">{c.orders}</td>
                <td className="px-4 py-3 text-right number font-medium">R$ {c.total.toLocaleString("pt-BR")}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
