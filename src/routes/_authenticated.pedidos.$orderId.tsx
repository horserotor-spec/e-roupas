import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { statusLabel, statusTone, processLabel, type OrderStatus } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Trash2, Flame, Calendar, User, Package, MessageSquare, Paperclip, CheckCircle2, CircleDashed, Loader2, Lock, Plus, Activity, Edit, RefreshCw, Check } from "lucide-react";
import { useOrder, useUpdateOrder, useDeleteOrder, useOverrideStockBatch, consumeStockForOrder } from "@/lib/api/orders";
import { useOrderItems } from "@/lib/api/order_items";
import { useOrderTimeline, logTimelineEvent } from "@/lib/api/timeline";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { OrderItemDrawer } from "@/components/pedidos/OrderItemDrawer";
import { toast } from "sonner";
import { OrderItemProcess, useOrderItemProcesses } from "@/lib/api/production";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_authenticated/pedidos/$orderId")({
  head: ({ params }) => ({ meta: [{ title: `Pedido ${params.orderId} · e-roupas OS` }] }),
  component: OrderPage,
  notFoundComponent: () => <div className="p-10 text-sm text-muted-foreground">Pedido não encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-sm text-destructive">{error.message}</div>,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  
  const { data: order, isLoading: isLoadingOrder } = useOrder(orderId);
  const { data: items = [], isLoading: isLoadingItems } = useOrderItems(orderId);
    const { data: timeline = [], isLoading: isLoadingTimeline } = useOrderTimeline(orderId);
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const navigate = useNavigate();
  const overrideStock = useOverrideStockBatch();

  const SIZES = ["2", "4", "6", "8", "10", "12", "14", "16", "PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
  const groupedItems: any[] = [];
  
  (items || []).forEach((item) => {
    const existing = groupedItems.find(g => 
      g.product_id === item.product_id && 
      g.gender === item.gender && 
      JSON.stringify(g.customizations) === JSON.stringify(item.customizations) &&
      g.unit_price === item.unit_price &&
      g.list_price === item.list_price
    );

    if (existing) {
        unit_price: item.unit_price || 0,
        customizations: item.customizations || [],
        notes: item.notes,
        sizes,
        totalQty: item.quantity || 0,
        itemIds: [item.id]
      });
    }
  });

  const { data: reservations = [], refetch: refetchReservations } = useQuery({
    queryKey: ["stock_reservations", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_reservations")
        .select(`
          *,
          inventory_batches (
            *,
            product_variants (
              *,
              models:product_models(*),
              fabrics(*),
              canonical_colors(*)
            )
          )
        `)
        .eq("order_id", orderId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId
  });

  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  if (isLoadingOrder) {
    return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin size-4"/> Carregando pedido...</div>;
  }

  if (!order) {
    return <div className="p-10 text-sm text-muted-foreground">Pedido não encontrado.</div>;
  }

  const openNewItem = () => {
    setEditingItem(null);
    setItemDrawerOpen(true);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return;
    try {
      await updateOrder.mutateAsync({ id: order.id, status: newStatus });
      await logTimelineEvent({
        orderId: order.id,
        action: "status_alterado",
        description: `Status alterado de "${statusLabel[order.status]}" para "${statusLabel[newStatus]}"`,
        oldStatus: order.status,
        newStatus: newStatus,
      });

      if (newStatus === "liberado_producao") {
        try {
          await consumeStockForOrder(order.id);
          toast.success("Estoque consumido com sucesso!");
        } catch (consumeErr: any) {
          toast.error("Erro ao consumir estoque: " + consumeErr.message);
        }
      }

      toast.success("Status atualizado!");
    } catch (e: any) {
      toast.error("Erro ao atualizar status.");
    }
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <Link to="/pedidos" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3.5" /> Pedidos
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-muted-foreground">{order.code}</p>
            {order.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--destructive)]">
                <Flame className="size-3" /> Urgente
              </span>
            )}
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            <Link to="/crm" className="hover:text-primary">{order.client_name}</Link>
          </h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> Prazo {order.deadline ? new Date(order.deadline).toLocaleDateString("pt-BR") : '—'}</span>
            <span className="inline-flex items-center gap-1" title="Responsável"><User className="size-3.5" /> {order.owner_name}</span>
            {order.salesperson_name && <span className="inline-flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full" title="Vendedor"><User className="size-3.5" /> {order.salesperson_name}</span>}
            <span className="inline-flex items-center gap-1"><Package className="size-3.5" /> {order.brand_code}</span>
            {order.mix_fabrics_allowed && (
              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium" title="Mistura de tecidos autorizada pelo cliente">
                <Check className="size-3" /> Mistura Autorizada
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-muted-foreground mb-1">Status Atual</span>
            <Select value={order.status} onValueChange={(v) => handleStatusChange(v as OrderStatus)}>
              <SelectTrigger className="h-8 text-xs bg-surface border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabel).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-right ml-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="text-xl font-semibold number">R$ {order.final_total.toLocaleString("pt-BR")}</div>
            {order.commissions_total > 0 && (
              <div className="text-[10px] text-muted-foreground mt-1">Comissão: R$ {Number(order.commissions_total).toLocaleString("pt-BR")}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold mb-1">Itens do pedido</h2>
                <p className="text-xs text-muted-foreground">Produtos e processos vinculados agrupados em grade.</p>
              </div>
              <Button size="sm" onClick={openNewItem} className="h-8 gap-1 text-xs">
                <Plus className="size-3.5" /> Novo Item
              </Button>
            </div>

            <div className="space-y-4">
              {isLoadingItems ? (
                <div className="text-center py-4 text-xs text-muted-foreground"><Loader2 className="animate-spin size-4 inline mr-2"/> Carregando itens...</div>
              ) : groupedItems.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                  Nenhum item adicionado a este pedido.
                </div>
              ) : (
                groupedItems.map((group, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-4 bg-surface hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="text-sm font-semibold">{group.product_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {[group.model, group.line, group.fabric, group.color, group.gender].filter(Boolean).join(" · ")}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground mt-1">SKU Base: {group.sku || "—"}</div>
                        {group.notes && <div className="text-xs text-muted-foreground mt-1 italic">“{group.notes}”</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-800">{formatCurrency((group.unit_price || 0) * group.totalQty)}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(group.unit_price)} un.</div>
                        <div className="text-xs text-slate-500 mt-1">Total: {group.totalQty} peças</div>
                      </div>
                    </div>

                    {/* Grade de tamanhos */}
                    <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Grade de Quantidades</div>
                      <div className="flex flex-wrap gap-1.5">
                        {SIZES.map((sz) => {
                          const qty = group.sizes[sz] || 0;
                          if (qty === 0) return null;
                          return (
                            <div key={sz} className="inline-flex items-center bg-white border rounded px-2.5 py-0.5 text-xs text-slate-700 shadow-sm">
                              <span className="font-bold text-slate-400 mr-1">{sz}:</span>
                              <span className="font-semibold text-slate-800">{qty}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Etapas e Processos Produtivos</div>
                      <div className="flex flex-col gap-2">
                        {group.itemIds.map((itemId: string) => {
                          const originalItem = items.find(it => it.id === itemId);
                          return (
                            <div key={itemId} className="flex items-center gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0">
                              <span className="text-xs font-bold text-slate-500 shrink-0 w-8">{originalItem?.size}:</span>
                              <ItemProcesses orderItemId={itemId} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAINEL DE ALOCAÇÃO FÍSICA DE ESTOQUE (OVERRIDE MANUAL) */}
          {reservations.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold mb-1">Alocação Física de Lotes (Override FIFO)</h2>
                  <p className="text-xs text-muted-foreground">Rastreabilidade completa de matérias-primas por lote e override manual.</p>
                </div>
              </div>
              
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item / Grade</th>
                      <th className="px-4 py-3 font-medium text-center w-20">Qtd Reservada</th>
                      <th className="px-4 py-3 font-medium">Lote Alocado (FIFO)</th>
                      <th className="px-4 py-3 font-medium w-64">Alterar Lote (Override)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {reservations.map((res: any) => {
                      const item = items.find(it => it.id === res.order_item_id);
                      const batch = res.inventory_batches;
                      const variant = batch?.product_variants;
                      
                      return (
                        <tr key={res.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">{item?.product_name || "Produto"}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {[item?.model, item?.fabric, item?.color, item?.size, item?.gender].filter(Boolean).join(" · ")}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">{res.quantity}</td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-slate-800">{batch?.batch_code || "Sem Lote"}</div>
                            <div className="text-[10px] text-muted-foreground">
                              Fornecedor: {batch?.suppliers?.name || "Interno"} | Entrou em: {batch?.entry_date ? new Date(batch.entry_date).toLocaleDateString("pt-BR") : "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <BatchSelector 
                              productVariantId={variant?.id}
                              currentBatchId={res.batch_id}
                              qty={res.quantity}
                              onOverride={async (newBatchId) => {
                                try {
                                  await overrideStock.mutateAsync({ reservationId: res.id, newBatchId });
                                  toast.success("Lote alterado com sucesso!");
                                  refetchReservations();
                                } catch (err: any) {
                                  toast.error(err.message || "Erro ao alterar lote");
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5 flex flex-col h-[600px]">
          <h2 className="text-sm font-semibold mb-1">Timeline do Pedido</h2>
          <p className="text-xs text-muted-foreground mb-4">Auditoria e histórico de ações.</p>

          <ul className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingTimeline ? (
              <div className="text-center py-4 text-xs text-muted-foreground"><Loader2 className="animate-spin size-4 inline mr-2"/> Carregando timeline...</div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground">Nenhum evento registrado.</div>
            ) : (
              timeline.map((t: any) => (
                <li key={t.id} className="flex gap-3">
                  <div className="size-7 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0 border border-border">
                    {t.action.includes("criado") ? <Plus className="size-3.5" />
                      : t.action.includes("status") ? <Activity className="size-3.5 text-primary" />
                      : <CircleDashed className="size-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs">
                      <span className="font-medium">{t.users?.name || "Sistema"}</span>
                      <span className="text-muted-foreground"> · {new Date(t.created_at).toLocaleString("pt-BR")}</span>
                    </div>
                    <p className="text-sm mt-0.5 leading-relaxed text-foreground/90">{t.description}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>

      <OrderItemDrawer 
        open={itemDrawerOpen} 
        onOpenChange={setItemDrawerOpen} 
        orderId={orderId} 
        item={editingItem} 
      />
    </div>
  );
}

function ItemProcesses({ orderItemId }: { orderItemId: string }) {
  const { data: processes = [], isLoading } = useOrderItemProcesses(orderItemId);

  if (isLoading) return <div className="text-xs text-muted-foreground">Carregando processos...</div>;
  
  if (processes.length === 0) return (
    <div className="text-[10px] text-muted-foreground">Sem processos produtivos vinculados.</div>
  );

  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Processos</div>
      <div className="flex flex-wrap gap-2">
        {processes.map((p: any) => (
          <ProcessChip key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function ProcessChip({ p }: { p: any }) {
  const map = {
    pendente: { Icon: CircleDashed, cls: "text-muted-foreground bg-muted border-border" },
    em_andamento: { Icon: Loader2, cls: "text-primary bg-primary-soft border-transparent" },
    concluido: { Icon: CheckCircle2, cls: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)] border-transparent" },
    bloqueado: { Icon: Lock, cls: "text-muted-foreground bg-muted/60 border-dashed border-border opacity-70" },
  }[p.status as string] || { Icon: CircleDashed, cls: "text-muted-foreground bg-muted border-border" };
  
  const { Icon, cls } = map;
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 h-7 text-xs font-medium ${cls}`}>
      <Icon className={`size-3.5 ${p.status === "em_andamento" ? "animate-spin" : ""}`} />
      {p.production_processes?.name || "Processo"}
    </div>
  );
}

function BatchSelector({ 
  productVariantId, 
  currentBatchId, 
  onOverride,
  qty
}: { 
  productVariantId: string; 
  currentBatchId: string; 
  qty: number;
  onOverride: (batchId: string) => Promise<void>;
}) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productVariantId) {
      setLoading(true);
      supabase
        .from("inventory_batches")
        .select("id, batch_code, quantity_available, suppliers(name)")
        .eq("product_variant_id", productVariantId)
        .eq("active", true)
        .then(({ data }) => {
          if (data) setBatches(data);
          setLoading(false);
        });
    }
  }, [productVariantId]);

  if (loading) return <span className="text-[10px] text-muted-foreground animate-pulse">Carregando lotes...</span>;

  const options = batches.filter(b => b.id === currentBatchId || Number(b.quantity_available) >= qty);

  return (
    <Select value={currentBatchId} onValueChange={onOverride}>
      <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
        <SelectValue placeholder="Selecione outro lote..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((b) => (
          <SelectItem key={b.id} value={b.id} className="text-xs">
            {b.batch_code} ({b.suppliers?.name || "Interno"}) — Disp: {b.quantity_available} un
          </SelectItem>
        ))}
        {options.length === 0 && (
          <SelectItem value={currentBatchId} disabled className="text-xs">
            Nenhum outro lote disponível com saldo
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
