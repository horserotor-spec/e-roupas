import { createFileRoute } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { orders, clients } from "@/lib/mock-data";
import { BarChart3, Boxes, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios · e-roupas OS" }] }),
  component: Relatorios,
});

function Relatorios() {
  const er = orders.filter((o) => o.brand === "ER");
  const pg8 = orders.filter((o) => o.brand === "PG8");
  const erTotal = er.reduce((s, o) => s + o.total, 0);
  const pg8Total = pg8.reduce((s, o) => s + o.total, 0);
  const sum = erTotal + pg8Total;

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">BI</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Relatórios</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Receita por marca</h2>
          <div className="space-y-4">
            <BrandBar label="e-roupas" value={erTotal} total={sum} color="var(--primary)" />
            <BrandBar label="peagah8" value={pg8Total} total={sum} color="oklch(0.62 0.16 152)" />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Mesmo CNPJ, centros de resultado distintos.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Resumo operacional</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Stat label="Pedidos ativos" value={orders.length} />
            <Stat label="Clientes" value={clients.length} />
            <Stat label="Receita ER" value={`R$ ${erTotal.toLocaleString("pt-BR")}`} />
            <Stat label="Receita PG8" value={`R$ ${pg8Total.toLocaleString("pt-BR")}`} />
          </dl>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-white p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Boxes className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Relatório Industrial de Estoque</h3>
            <p className="text-sm text-slate-500 mt-0.5">Rastreabilidade, movimentações, saldo imutável e exportação de CSV.</p>
          </div>
        </div>
        <Link to="/estoque" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0">
          Acessar Relatório <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-border p-12 text-center">
        <BarChart3 className="size-6 text-muted-foreground mx-auto" />
        <p className="mt-2 text-sm text-muted-foreground">Relatórios completos (funil, SLA, lucro por processo) na Sprint 2.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold number mt-0.5">{value}</dd>
    </div>
  );
}

function BrandBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground number">{formatCurrency(value)} · {pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
