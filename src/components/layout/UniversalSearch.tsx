import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { clients, orders, clientById, statusLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function UniversalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { clients: [], orders: [] };
    return {
      clients: clients
        .filter((c) =>
          [c.name, c.phone, c.email, c.document].some((f) => f.toLowerCase().includes(term)),
        )
        .slice(0, 5),
      orders: orders
        .filter((o) => {
          const c = clientById(o.clientId);
          return [o.code, c?.name ?? "", o.items.map((i) => i.product).join(" ")]
            .some((f) => f.toLowerCase().includes(term));
        })
        .slice(0, 6),
    };
  }, [q]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted-foreground hover:border-border-strong transition-colors"
      >
        <Search className="size-4" />
        <span className="flex-1">Buscar cliente, pedido, telefone…</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-border bg-popover shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-14 hairline-b">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca universal · clientes, pedidos, telefones, produtos"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {!q.trim() && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Comece a digitar — pesquisa em clientes, pedidos, telefones e produtos.
                </div>
              )}

              {q.trim() && results.orders.length === 0 && results.clients.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Nada encontrado para “{q}”.
                </div>
              )}

              {results.orders.length > 0 && (
                <Section title="Pedidos">
                  {results.orders.map((o) => {
                    const c = clientById(o.clientId);
                    return (
                      <Link
                        key={o.id}
                        to="/pedidos/$orderId"
                        params={{ orderId: o.id }}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{o.code} · {c?.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{o.items.map((i) => i.product).join(", ")}</div>
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">{statusLabel[o.status]}</span>
                      </Link>
                    );
                  })}
                </Section>
              )}

              {results.clients.length > 0 && (
                <Section title="Clientes">
                  {results.clients.map((c) => (
                    <Link
                      key={c.id}
                      to="/crm/$clientId"
                      params={{ clientId: c.id }}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.phone} · {c.email}</div>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">{c.brand}</span>
                    </Link>
                  ))}
                </Section>
              )}
            </div>

            <div className="hairline-t bg-muted/40 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Estrutura pronta para busca contextual com IA.</span>
              <span><kbd className="rounded border border-border bg-surface px-1 py-0.5">esc</kbd> fechar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-2 pb-2")}>
      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
