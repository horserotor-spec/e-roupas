import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders, Order } from "@/lib/api/orders";
import { Loader2, ArrowRight, Clock, Box, ShieldAlert, AlertTriangle, User, Search, Filter, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OrderStatus, statusLabel, statusTone } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useState, useDeferredValue, useMemo } from "react";
import { DrawerPedido } from "@/components/pedidos/DrawerPedido";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/producao")({
  head: () => ({ meta: [{ title: "Produção · e-roupas OS" }] }),
  component: ProducaoPage,
});

const KANBAN_STAGES: { id: OrderStatus; label: string; tone: string }[] = [
  { id: "confirmado", label: "Confirmado", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "aguardando_financeiro", label: "Ag. Financeiro", tone: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "liberado_producao", label: "Liberado", tone: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "separacao", label: "Separação", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "corte", label: "Corte", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "costura", label: "Costura", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "bordado", label: "Bordado", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "impressao", label: "Impressão", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "prensa", label: "Prensa", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "qualidade", label: "Qualidade", tone: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "expedicao", label: "Expedição", tone: "bg-green-50 text-green-700 border-green-200" },
];

function ProducaoPage() {
  const { data: orders = [], isLoading } = useOrders();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allowUrgentMove, setAllowUrgentMove] = useState(false);
  
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);

  // Mover pedido
  const moveOrderMutation = useMutation({
    mutationFn: async ({ orderId, newStatus, oldStatus }: { orderId: string; newStatus: OrderStatus; oldStatus: OrderStatus }) => {
      // 1. Update order
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      if (updateError) throw updateError;

      // 2. Insert Timeline Event
      await supabase
        .from("order_timeline")
        .insert([{
          order_id: orderId,
          user_id: user?.id,
          event_type: "status_change",
          description: `Movido de ${statusLabel[oldStatus]} para ${statusLabel[newStatus]} via Kanban.`,
          // Aqui no futuro poderia gravar um payload json com tempos, etc.
        }]);

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido movido com sucesso!");
    },
    onError: (err) => {
      toast.error("Erro ao mover pedido.");
      console.error(err);
    }
  });

  const activeOrders = useMemo(() => {
    return orders.filter(o => 
      KANBAN_STAGES.some(s => s.id === o.status) &&
      (deferredQ === "" || 
       o.code.toLowerCase().includes(deferredQ.toLowerCase()) || 
       o.client_name.toLowerCase().includes(deferredQ.toLowerCase()))
    );
  }, [orders, deferredQ]);

  const handleDragStart = (e: React.DragEvent, orderId: string, currentStatus: string) => {
    e.dataTransfer.setData("orderId", orderId);
    e.dataTransfer.setData("currentStatus", currentStatus);
  };

  const handleDrop = async (e: React.DragEvent, stageId: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    const currentStatus = e.dataTransfer.getData("currentStatus") as OrderStatus;
    
    if (!orderId || currentStatus === stageId) return;

    // REGRA DE OURO DA SPRINT 2.10: Não permite bypass/avançar de Separação sem bipagem física real
    if (currentStatus === "separacao" && !allowUrgentMove) {
      toast.error("Separação física obrigatória via scanner! Utilize o botão 'Modo Separação' no card do pedido.");
      return;
    }

    // Regras de validação
    const currentIndex = KANBAN_STAGES.findIndex(s => s.id === currentStatus);
    const targetIndex = KANBAN_STAGES.findIndex(s => s.id === stageId);

    // Sem a flag "Produção Urgente", só pode mover 1 etapa para frente (ou para trás livremente caso precise voltar)
    if (!allowUrgentMove && targetIndex > currentIndex + 1) {
      toast.error("Não é possível pular etapas. Ative 'Produção Urgente' para forçar.");
      return;
    }

    moveOrderMutation.mutate({ orderId, newStatus: stageId, oldStatus: currentStatus });
  };

  const openDrawer = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return <div className="flex h-[calc(100vh-64px)] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  // Métricas
  const atrasados = activeOrders.filter(o => o.deadline && new Date(o.deadline) < new Date()).length;
  const urgentes = activeOrders.filter(o => o.urgent).length;
  const total = activeOrders.length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* HEADER */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Kanban de Produção</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span><strong className="text-slate-700">{total}</strong> na esteira</span>
            {atrasados > 0 && <span className="text-red-600 flex items-center gap-1"><AlertTriangle className="size-3" /> {atrasados} atrasados</span>}
            {urgentes > 0 && <span className="text-orange-600 flex items-center gap-1"><ShieldAlert className="size-3" /> {urgentes} urgentes</span>}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden sm:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar pedido ou cliente..."
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-slate-50">
            <Switch id="urgent-mode" checked={allowUrgentMove} onCheckedChange={setAllowUrgentMove} />
            <Label htmlFor="urgent-mode" className="text-xs font-semibold uppercase text-slate-600 cursor-pointer">Livrar Bloqueios</Label>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex h-full items-start gap-4 w-max">
          {KANBAN_STAGES.map((stage) => {
            const stageOrders = activeOrders.filter(o => o.status === stage.id);
            
            return (
              <div 
                key={stage.id} 
                className="w-[320px] shrink-0 h-full max-h-full flex flex-col rounded-xl bg-slate-100/50 border border-slate-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Column Header */}
                <div className={cn("px-4 py-3 rounded-t-xl border-b font-medium flex items-center justify-between", stage.tone)}>
                  <span className="text-sm font-semibold tracking-tight uppercase">{stage.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50">{stageOrders.length}</span>
                </div>
                
                {/* Column Cards */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3 kanban-scroll">
                  {stageOrders.map(order => {
                    const overdue = order.deadline && new Date(order.deadline) < new Date();
                    
                    // Infer badges from items
                    const badges = new Set<string>();
                    order.items?.forEach(i => {
                      i.customizations?.forEach(c => {
                        if (c.name.toLowerCase().includes("dtf")) badges.add("DTF");
                        if (c.name.toLowerCase().includes("bordado")) badges.add("Bordado");
                        if (c.name.toLowerCase().includes("silk")) badges.add("Silk");
                      });
                    });

                    return (
                      <div 
                        key={order.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, order.id, order.status)}
                        onClick={() => openDrawer(order)}
                        className={cn(
                          "bg-white p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
                          order.urgent ? "border-orange-300 shadow-orange-100" : "border-slate-200"
                        )}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {order.code}
                          </span>
                          {order.urgent && <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">URG</Badge>}
                        </div>
                        
                        <div className="text-sm font-medium leading-tight text-slate-900 mb-2 truncate">
                          {order.client_name}
                        </div>
                        
                        <div className="text-xs text-slate-500 mb-3 truncate">
                          {order.items?.map(i => `${i.quantity}x ${i.product_name.split(' ')[0]} (${i.sku || '-'} - Tam: ${i.size || '-'})`).join(', ') || "Sem itens"}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {Array.from(badges).map(b => (
                            <span key={b} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                              {b === 'DTF' ? '🟣' : b === 'Bordado' ? '🟡' : '🟢'} {b}
                            </span>
                          ))}
                        </div>

                        {/* ATALHOS OPERACIONAIS DA SPRINT 2.10 */}
                        {order.status === "separacao" && (
                          <Link 
                            to="/producao/separacao" 
                            search={{ orderId: order.id }}
                            onClick={(e) => e.stopPropagation()} // impede abrir o drawer geral
                            className="w-full h-7 mt-1 mb-2.5 rounded bg-amber-500 hover:bg-amber-600 text-[10px] font-bold text-slate-950 flex items-center justify-center gap-1.5 uppercase transition-colors"
                          >
                            <Barcode className="size-3.5" /> Modo Separação
                          </Link>
                        )}

                        {order.status === "prensa" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const confirmText = `Deseja marcar a Prensa do pedido ${order.code} como ✔ Aplicado?`;
                              if (window.confirm(confirmText)) {
                                supabase.from("orders").update({ status: "qualidade" }).eq("id", order.id).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ["orders"] });
                                  toast.success("Prensa confirmada!");
                                });
                              }
                            }}
                            className="w-full h-7 mt-1 mb-2.5 rounded bg-blue-600 hover:bg-blue-700 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 uppercase transition-colors"
                          >
                            ✔ Aplicar Prensa (Visual)
                          </button>
                        )}

                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className={cn("text-[10px] font-medium flex items-center gap-1", overdue ? "text-red-600 font-bold" : "text-slate-500")}>
                            <Clock className="size-3" />
                            {order.deadline ? new Date(order.deadline).toLocaleDateString("pt-BR", {day: '2-digit', month: '2-digit'}) : "S/ prazo"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0} un
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {stageOrders.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                      Arraste pedidos para cá
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DrawerPedido 
        order={selectedOrder} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </div>
  );
}
