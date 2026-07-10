import { createFileRoute } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { orders, clients } from "@/lib/mock-data";
import { BarChart3, Boxes, ArrowRight, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
import { toast } from "sonner";
import { useState } from "react";

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

  const [loadingType, setLoadingType] = useState<string | null>(null);

  const exportData = async (table: string, name: string) => {
    try {
      setLoadingType(table);
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.info(`Nenhum dado encontrado para ${name}.`);
        return;
      }
      const csv = Papa.unparse(data, { header: true });
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${table}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Relatório de ${name} exportado com sucesso!`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao exportar ${name}: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };

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

      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">Exportação de Dados</h2>
      
      <div className="grid grid-cols-1 gap-3">
        <ExportCard 
          title="Relatório de Produção" 
          description="Exportação completa de todos os pedidos e seus status." 
          isLoading={loadingType === "orders"} 
          onExport={() => exportData("orders", "Produção")} 
        />
        <ExportCard 
          title="Relatório de Produtos" 
          description="Exportação do catálogo completo de produtos." 
          isLoading={loadingType === "products"} 
          onExport={() => exportData("products", "Produtos")} 
        />
        <ExportCard 
          title="Relatório de Orçamentos" 
          description="Exportação de orçamentos gerados." 
          isLoading={loadingType === "quotes"} 
          onExport={() => exportData("quotes", "Orçamentos")} 
        />
        <ExportCard 
          title="Relatório de Fornecedores" 
          description="Exportação do cadastro de fornecedores." 
          isLoading={loadingType === "suppliers"} 
          onExport={() => exportData("suppliers", "Fornecedores")} 
        />
        <ExportCard 
          title="Relatório de Clientes" 
          description="Exportação do cadastro completo do CRM." 
          isLoading={loadingType === "clients"} 
          onExport={() => exportData("clients", "Clientes")} 
        />

        <div className="rounded-2xl border border-border bg-white p-5 flex flex-col md:flex-row items-center justify-between gap-4">
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
      </div>
    </div>
  );
}

function ExportCard({ title, description, onExport, isLoading }: { title: string, description: string, onExport: () => void, isLoading: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Download className="size-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        onClick={onExport} 
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50"
      >
        <Download className="size-4" /> {isLoading ? "Exportando..." : "Exportar CSV"}
      </button>
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
