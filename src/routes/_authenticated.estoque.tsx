import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estoque")({
  head: () => ({ meta: [{ title: "Estoque · e-roupas OS" }] }),
  component: () => <Placeholder title="Estoque" subtitle="Reservas após confirmação de pedido. Sprint 2." />,
});

function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 rounded-2xl border border-dashed border-border p-16 text-center">
        <Boxes className="size-8 text-muted-foreground mx-auto" />
        <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">Arquitetura preparada — telas chegam na Sprint 2.</p>
      </div>
    </div>
  );
}
