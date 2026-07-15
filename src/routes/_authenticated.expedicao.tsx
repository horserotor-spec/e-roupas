import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, PackageCheck, AlertCircle, RefreshCw, Printer } from "lucide-react";
import { useOrders } from "@/lib/api/orders";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/expedicao")({
  head: () => ({ meta: [{ title: "Expedição Logística · e-roupas OS" }] }),
  component: Expedicao,
});

function Expedicao() {
  // Puxar pedidos da API (todos)
  const { data: allOrders = [], isLoading, refetch } = useOrders();

  // Filtrar Prontos para Expedir: Status "separacao" ou "expedicao" SEM código de rastreio
  const prontosParaPostar = allOrders.filter(
    (o) => (o.status === "separacao" || o.status === "expedicao") && !o.tracking_code
  );

  // Filtrar Em Trânsito: Status "expedicao" COM código de rastreio
  const emTransito = allOrders.filter(
    (o) => o.status === "expedicao" && o.tracking_code
  );

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação Logística</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Expedição Kanban</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie embalagem, geração de etiquetas e despachos (SGP Web).</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="h-9 gap-2">
          <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 items-start">
        <Col 
          title="Prontos para Expedir / Embalar" 
          subtitle="Aguardando geração de etiqueta e despacho."
          empty="Nenhum pedido na fila de expedição." 
          items={prontosParaPostar} 
          icon={<PackageCheck className="size-4 text-amber-500" />}
          borderClass="border-amber-200"
          bgClass="bg-amber-50/50"
        />
        <Col 
          title="Postados / Em Trânsito" 
          subtitle="Etiqueta gerada, a caminho do cliente."
          empty="Sem despachos ativos." 
          items={emTransito} 
          icon={<Truck className="size-4 text-blue-500" />}
          borderClass="border-blue-200"
          bgClass="bg-blue-50/50"
        />
      </div>
    </div>
  );
}

function Col({ title, subtitle, items, empty, icon, borderClass, bgClass }: { title: string; subtitle: string; items: any[]; empty: string; icon: React.ReactNode; borderClass: string; bgClass: string }) {
  return (
    <section className={`rounded-2xl border ${borderClass} bg-card p-4 h-full flex flex-col`}>
      <div className={`flex items-start gap-3 p-3 rounded-xl ${bgClass} mb-4`}>
        <div className="mt-0.5">{icon}</div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-600">{subtitle}</p>
        </div>
        <div className="ml-auto font-mono text-sm font-bold bg-white px-2 py-0.5 rounded-md border shadow-sm">
          {items.length}
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {items.map((o) => (
          <div key={o.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 hover:border-primary transition-colors group relative overflow-hidden">
            <Link to="/pedidos/$orderId" params={{ orderId: o.id }} className="absolute inset-0 z-0"></Link>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-primary transition-colors"></div>
            
            <div className="min-w-0 flex-1 ml-1 z-10 pointer-events-none">
              <div className="flex justify-between items-start mb-1">
                <div className="text-sm font-bold text-slate-800 truncate pr-2">{o.client_name}</div>
                <div className="text-xs font-mono font-medium text-slate-500 shrink-0">{o.code}</div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                  <span className="flex items-center gap-1"><Truck className="size-3" /> {o.logistics_type || "Correios"}</span>
                  {o.tracking_code && <span className="font-mono text-blue-600 text-[10px] mt-0.5 bg-blue-50 px-1.5 py-0.5 rounded">Obj: {o.tracking_code}</span>}
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Prazo</div>
                  <div className={`text-xs font-medium ${new Date(o.deadline) < new Date() ? 'text-red-500 flex items-center gap-1' : 'text-slate-600'}`}>
                    {new Date(o.deadline) < new Date() && <AlertCircle className="size-3" />}
                    {o.deadline ? new Date(o.deadline).toLocaleDateString("pt-BR") : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (z-10 makes it clickable over the absolute Link) */}
            <div className="z-10 flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100 ml-1 justify-end">
              <Link to="/print/etiqueta/$id" params={{ id: o.id }} target="_blank">
                <Button size="sm" variant="secondary" className="h-7 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700">
                  <Printer className="size-3 mr-1.5" /> PLP
                </Button>
              </Link>
              {!o.tracking_code && (
                <Link to="/bipagem/$orderId" params={{ orderId: o.id }}>
                  <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground hover:bg-primary/90">
                    <PackageCheck className="size-3 mr-1.5" /> Conferência
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400 p-4 text-center">
            <Truck className="size-8 opacity-20 mb-2" />
            <p className="text-sm">{empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
