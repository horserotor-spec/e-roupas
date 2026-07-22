import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { Order, allocateStockAndCreateProcesses } from "@/lib/api/orders";
import { statusLabel, statusTone } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User, Package, Calendar, Tag, CreditCard, Box, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useState, useEffect } from "react";
import { useClients } from "@/lib/api/clients";
import { useUpdateOrder, useDeleteOrder } from "@/lib/api/orders";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, Factory, X, MessageSquare, Phone, Receipt, FileText } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEmitirNFSe } from "@/lib/api/bling";

interface DrawerPedidoProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrawerPedido({ order, open, onOpenChange }: DrawerPedidoProps) {
  const queryClient = useQueryClient();
  const [isAllocating, setIsAllocating] = useState(false);

  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const emitirNFSe = useEmitirNFSe();
  const { data: clients = [] } = useClients();
  const suppliers = clients.filter(c => c.entity_type === "fornecedor");

  // Buscar reservas de estoque para identificar itens em falta
  const { data: reservations = [] } = useQuery({
    queryKey: ["order_reservations", order?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_reservations")
        .select("*, inventory_batches(*)")
        .eq("order_id", order?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!order?.id,
  });

  // Buscar detalhes dos produtos e seus fornecedores de insumos (MP)
  const { data: productsDetails = [] } = useQuery({
    queryKey: ["order_products_suppliers", order?.id],
    queryFn: async () => {
      const productIds = order?.items?.map(i => i.product_id).filter(Boolean) || [];
      if (productIds.length === 0) return [];
      
      const { data: prods, error } = await supabase
        .from("products")
        .select("*, suppliers(*)")
        .in("id", productIds);
      
      if (error) throw error;
      
      const results = [...(prods || [])];
      
      // Se for PA (Produto Acabado), tentar resolver o fornecedor da MP correspondente
      for (const prod of results) {
        if (!prod.suppliers && prod.format === 'PA' && prod.model_id && prod.fabric_id && prod.color_id) {
          const { data: mpProd } = await supabase
            .from("products")
            .select("*, suppliers(*)")
            .eq("format", "MP")
            .eq("model_id", prod.model_id)
            .eq("fabric_id", prod.fabric_id)
            .eq("color_id", prod.color_id)
            .eq("active", true)
            .maybeSingle();
          
          if (mpProd && mpProd.suppliers) {
            prod.suppliers = mpProd.suppliers;
          }
        }
      }
      return results;
    },
    enabled: !!order?.items && order.items.length > 0,
  });

  const [addressForm, setAddressForm] = useState({
    street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipcode: ""
  });
  const [deadlinesForm, setDeadlinesForm] = useState({
    corte_deadline: "",
    costura_deadline: "",
    acabamento_deadline: ""
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDeadlines, setIsEditingDeadlines] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!order) return null;

  const handleForceAllocate = async () => {
    if (!order?.id) return;
    setIsAllocating(true);
    try {
      await allocateStockAndCreateProcesses(order.id);
      toast.success("Estoque recalculado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["order_reservations", order.id] });
    } catch (e: any) {
      toast.error(e.message || "Erro ao alocar estoque.");
    } finally {
      setIsAllocating(false);
    }
  };



  const overdue = order.deadline && new Date(order.deadline) < new Date() && order.status !== "entregue" && order.status !== "finalizado";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-xl overflow-hidden flex flex-col p-0">
        <div className="bg-slate-50/50 p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{order.brand_code}</span>
                <Badge variant={order.urgent ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                  {order.urgent ? "Urgente" : "Normal"}
                </Badge>
              </div>
              <SheetTitle className="text-2xl font-semibold tracking-tight">{order.code}</SheetTitle>
              <SheetDescription className="text-sm mt-1 flex items-center gap-2">
                <User className="size-4" /> {order.client_name}
              </SheetDescription>
            </div>
            <div className="text-right">
              <Badge variant="outline" className={`
                ${statusTone[order.status] === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                statusTone[order.status] === 'warning' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                statusTone[order.status] === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                statusTone[order.status] === 'primary' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-slate-50 text-slate-700 border-slate-200'}
              `}>
                {statusLabel[order.status]}
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 pb-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="size-4" />
                  <span className="text-xs font-medium uppercase">Prazo</span>
                </div>
                <div className={`font-medium ${overdue ? "text-destructive" : "text-foreground"}`}>
                  {order.deadline ? format(new Date(order.deadline), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Não definido"}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CreditCard className="size-4" />
                  <span className="text-xs font-medium uppercase">Valor Total</span>
                </div>
                <div className="font-medium text-foreground">
                  {formatCurrency(order.final_total)}
                </div>
              </div>
            </div>

            {/* Itens */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="size-4 text-muted-foreground" /> Itens do Pedido ({order.items?.length || 0})
                </h3>
                <Button variant="outline" size="sm" onClick={handleForceAllocate} disabled={isAllocating} className="h-7 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {isAllocating ? "Recalculando..." : "🔄 Recalcular Estoque"}
                </Button>
              </div>
              <div className="space-y-3">
                {order.items?.map((item) => {
                  const itemReservations = reservations.filter((r: any) => r.order_item_id === item.id);
                  const qtyReserved = itemReservations.reduce((acc: number, r: any) => acc + Number(r.quantity), 0);
                  const qtyMissing = Math.max(0, Number(item.quantity) - qtyReserved);

                  const prodDetail = productsDetails.find((p: any) => p.id === item.product_id);
                  const supplier = prodDetail?.suppliers;

                  return (
                    <div key={item.id} className="p-3 rounded-lg border bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{item.quantity}x {item.product_name} {item.size ? `(Tam: ${item.size})` : ''}</div>
                        <span className="text-xs text-muted-foreground font-mono">{item.sku || "N/A"}</span>
                      </div>

                      {/* Status de Estoque */}
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs">
                          {qtyMissing > 0 ? (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              ⚠️ Falta de Estoque ({qtyMissing} un. em falta)
                            </span>
                          ) : (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              ✓ Estoque Alocado
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Link com Fornecedor de Matéria-Prima em falta */}
                      {qtyMissing > 0 && supplier && (
                        <div className="mt-2.5 p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-xs">
                          <div className="font-bold text-red-800 uppercase text-[9px] mb-1">Fornecedor da Matéria-Prima (Insumo)</div>
                          <div className="text-slate-700 font-semibold">{supplier.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Prazo de Entrega: <strong className="text-slate-700">{supplier.lead_time_days} dias</strong></div>
                          
                          {(supplier.phone || supplier.whatsapp) && (
                            <div className="mt-2 flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  const num = (supplier.whatsapp || supplier.phone).replace(/\D/g, "");
                                  const msg = encodeURIComponent(`Olá, precisamos de matéria-prima para o pedido ${order.code}. Você tem o tecido do item "${item.product_name}" com prazo para entrega?`);
                                  window.open(`https://wa.me/55${num}?text=${msg}`, "_blank");
                                }}
                                title="Enviar mensagem no WhatsApp"
                              >
                                <MessageSquare className="size-3" />
                              </Button>
                              <span className="text-[10px] text-slate-500 font-mono">Contato: {supplier.whatsapp || supplier.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 pt-2.5 border-t border-slate-100">
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Personalizações</div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.customizations.map((c: any, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] bg-slate-100 font-normal">
                                {c.name} {c.details ? `(${c.details})` : ''}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {(!order.items || order.items.length === 0) && (
                  <div className="text-sm text-muted-foreground italic">Nenhum item adicionado.</div>
                )}
              </div>
            </div>


            
{/* Observações */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag className="size-4 text-muted-foreground" /> Observações
              </h3>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-dashed">
                {order.notes || "Nenhuma observação registrada."}
              </div>
            </div>

          </div>
        </ScrollArea>
      
        {/* Footer actions */}
        <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="size-4 mr-1.5" /> Excluir Pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o pedido <strong>{order.code}</strong>? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => {
                  try {
                    await deleteOrder.mutateAsync(order.id);
                    toast.success("Pedido excluído!");
                    onOpenChange(false);
                  } catch (e: any) {
                    toast.error("Erro ao excluir: " + e.message);
                  }
                }}>
                  Sim, excluir pedido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex gap-2">
            {order.metadata?.nfse_bling_id ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-sm font-medium">
                <Receipt className="size-4" /> NFS-e Emitida (Bling)
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                onClick={async () => {
                  try {
                    await emitirNFSe.mutateAsync(order.id);
                    toast.success("Comando de emissão enviado para o Bling!");
                  } catch (e: any) {
                    toast.error(e.message || "Erro ao emitir NFS-e");
                  }
                }}
                disabled={emitirNFSe.isPending}
              >
                {emitirNFSe.isPending ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Receipt className="size-4 mr-1.5" />}
                Emitir NFS-e
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </div>
      </SheetContent>

    </Sheet>
  );
}
