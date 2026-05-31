import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders, useUpdateOrderItemStatus, OrderItem, Order } from "@/lib/api/orders";
import { Loader2, ArrowRight, Printer, Scissors, Shirt, Package, Truck, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/producao")({
  head: () => ({ meta: [{ title: "Produção · e-roupas OS" }] }),
  component: ProducaoPage,
});

type ProductionStage = {
  id: string;
  label: string;
  icon: any;
  color: string;
};

const stages: ProductionStage[] = [
  { id: "aguardando", label: "Aguardando", icon: Box, color: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "captura", label: "Captura (Picking)", icon: Package, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "impressao", label: "Impressão / Corte", icon: Printer, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "prensa", label: "Prensa / Costura", icon: Shirt, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "manuseio", label: "Manuseio / QC", icon: Scissors, color: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "envio", label: "Expedição", icon: Truck, color: "bg-green-50 text-green-700 border-green-200" }
];

function ProducaoPage() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderItemStatus();

  // Filter orders that are active in production
  const activeOrders = orders.filter(o => ["em_producao", "atendimento", "expedicao"].includes(o.status));

  // Flatten items
  const allItems: { order: Order; item: OrderItem }[] = [];
  activeOrders.forEach(o => {
    o.items.forEach(i => {
      // ignore concluded items for this board
      if (i.production_status !== "concluido") {
        allItems.push({ order: o, item: i });
      }
    });
  });

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("itemId", itemId);
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (!itemId) return;

    try {
      await updateStatus.mutateAsync({ id: itemId, status: stageId });
    } catch (err) {
      toast.error("Erro ao mover item.");
    }
  };

  const advanceStage = async (itemId: string, currentStage: string) => {
    const idx = stages.findIndex(s => s.id === currentStage);
    let nextStage = "concluido";
    if (idx >= 0 && idx < stages.length - 1) {
      nextStage = stages[idx + 1].id;
    }
    
    try {
      await updateStatus.mutateAsync({ id: itemId, status: nextStage });
    } catch (err) {
      toast.error("Erro ao mover item.");
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1800px] mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Chão de Fábrica</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Painel de Produção (PCP)</h1>
        <p className="text-sm text-muted-foreground mt-1">Arraste os itens entre as colunas ou clique na setinha para avançar.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start min-h-0 snap-x">
        {stages.map((stage) => {
          const itemsInStage = allItems.filter(x => (x.item.production_status || "aguardando") === stage.id);
          const Icon = stage.icon;
          
          return (
            <div 
              key={stage.id} 
              className="w-80 shrink-0 snap-center h-full flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className={cn("px-4 py-3 rounded-t-xl border-t border-l border-r font-medium flex items-center justify-between", stage.color)}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span className="text-sm tracking-tight">{stage.label}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">{itemsInStage.length}</span>
              </div>
              <div className="bg-slate-100/50 border rounded-b-xl p-2 flex-1 overflow-y-auto space-y-2">
                {itemsInStage.map(({ order, item }) => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id!)}
                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Link to="/pedidos/$id" params={{ id: order.id }} className="text-[10px] font-mono text-blue-600 hover:underline">
                        {order.code}
                      </Link>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">{order.client_name}</span>
                    </div>
                    
                    <h3 className="font-semibold text-sm leading-tight text-slate-800">{item.product_name}</h3>
                    
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase">Ficha Técnica:</p>
                        {item.customizations.map((c: any, i: number) => (
                          <div key={i} className="text-xs bg-slate-50 p-1.5 rounded border border-slate-100 flex justify-between">
                            <span className="font-medium text-slate-700">{c.quantity}x {c.name}</span>
                            <span className="text-slate-500">{c.details}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Qtd: {item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => advanceStage(item.id!, stage.id)}
                        title="Avançar etapa"
                      >
                        <ArrowRight className="size-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {itemsInStage.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    Vazio
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
