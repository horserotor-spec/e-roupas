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
import { Trash2, Save, Factory, X, MessageSquare, Phone } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

  // Buscar transações financeiras (Contas a Pagar) do pedido para Corte e Costura
  const { data: prodPayments = [], refetch: refetchPayments } = useQuery({
    queryKey: ["order_production_payments", order?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .eq("order_id", order?.id)
        .eq("type", "pagar");
      if (error) throw error;
      return data || [];
    },
    enabled: !!order?.id,
  });

  const [isSavingProd, setIsSavingProd] = useState(false);
  const [prodForm, setProdForm] = useState({
    corte_faction: "",
    corte_start_date: "",
    corte_end_date: "",
    costura_faction: "",
    costura_start_date: "",
    costura_end_date: "",
    acabamento_faction: "",
    acabamento_start_date: "",
    acabamento_end_date: "",
    corte_grid: {} as Record<string, number>,
    corte_unit_price: 0,
    costura_grid: {} as Record<string, number>,
    costura_unit_price: 0,
    acabamento_grid: {} as Record<string, number>,
    acabamento_unit_price: 0,
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

  const SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4", "2", "4", "6", "8", "10", "12", "14", "16"];

  useEffect(() => {
    if (order) {
      setProdForm({
        corte_faction: order.corte_faction || "",
        corte_start_date: order.corte_start_date || "",
        corte_end_date: order.corte_end_date || "",
        costura_faction: order.costura_faction || "",
        costura_start_date: order.costura_start_date || "",
        costura_end_date: order.costura_end_date || "",
        corte_unit_price: order.corte_unit_price || 0,
        costura_unit_price: order.costura_unit_price || 0,
        corte_grid: order.corte_grid || {},
        costura_grid: order.costura_grid || {}
      });
    }
  }, [order]);

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

  const addSizeToGrid = (stage: 'corte' | 'costura', size: string) => {
    if (!size) return;
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      if (grid[size] === undefined) {
        grid[size] = 0;
      }
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const removeSizeFromGrid = (stage: 'corte' | 'costura', size: string) => {
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      delete grid[size];
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const updateGridValue = (stage: 'corte' | 'costura', size: string, value: number) => {
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      grid[size] = value;
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const calculateTotal = (grid: Record<string, number>, price: number) => {
    const totalQty = Object.values(grid).reduce((acc, val) => acc + (val || 0), 0);
    return totalQty * (price || 0);
  };

  const handleSaveProd = async () => {
    if (!order) return;
    setIsSavingProd(true);
    try {
      await updateOrder.mutateAsync({ id: order.id, ...prodForm });
      refetchPayments();
      toast.success("Dados de produção salvos com sucesso!");
    } catch (e: any) {
      toast.error("Erro ao salvar dados: " + e.message);
    } finally {
      setIsSavingProd(false);
    }
  };

  const cortePayment = prodPayments.find((p: any) => p.description?.toLowerCase().includes("corte"));
  const costuraPayment = prodPayments.find((p: any) => p.description?.toLowerCase().includes("costura"));

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

            <Separator />

                        {/* Facções de Produção */}
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Factory className="size-4 text-muted-foreground" /> Produção (Facções)
                </h3>
                <Button size="sm" variant="secondary" onClick={handleSaveProd} disabled={isSavingProd}>
                  <Save className="size-3.5 mr-1.5" /> Salvar
                </Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Corte */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Corte</h4>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-500">Facção / Responsável</Label>
                    <Select value={prodForm.corte_faction} onValueChange={v => setProdForm({...prodForm, corte_faction: v})}>
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue placeholder="Selecione um fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.name} className="text-xs">{s.name}</SelectItem>)}
                        {suppliers.length === 0 && <SelectItem value="none" disabled className="text-xs">Nenhum fornecedor encontrado</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.corte_start_date} onChange={e => setProdForm({...prodForm, corte_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.corte_end_date} onChange={e => setProdForm({...prodForm, corte_end_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <Label className="text-[10px] uppercase text-slate-500">Valor Unitário por Peça (R$)</Label>
                    <Input type="number" step="0.01" className="h-8 text-xs font-medium text-slate-900 bg-white" value={prodForm.corte_unit_price || ''} onChange={e => setProdForm({...prodForm, corte_unit_price: parseFloat(e.target.value) || 0})} placeholder="0.00" />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Grade Produzida (Corte)</Label>
                      <div className="flex items-center gap-1">
                        <select 
                          className="h-6 text-[10px] rounded border-slate-200 px-1 bg-white"
                          onChange={(e) => {
                            addSizeToGrid('corte', e.target.value);
                          }}
                          value=""
                        >
                          <option value="" disabled>+ Add Tamanho</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.keys(prodForm.corte_grid).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-2">Nenhum tamanho adicionado na grade.</div>
                      ) : (
                        Object.entries(prodForm.corte_grid).map(([size, qty]) => (
                          <div key={size} className="flex items-center gap-2">
                            <div className="w-10 h-7 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700">{size}</div>
                            <Input 
                              type="number" 
                              className="h-7 text-xs bg-white text-right flex-1" 
                              value={qty || ''} 
                              onChange={e => updateGridValue('corte', size, parseInt(e.target.value) || 0)} 
                              placeholder="Qtd..."
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeSizeFromGrid('corte', size)}>
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>Total a Pagar:</span>
                    <span>{formatCurrency(calculateTotal(prodForm.corte_grid, prodForm.corte_unit_price))}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right mt-1">
                    {Object.values(prodForm.corte_grid).reduce((a,b)=>a+(b||0),0)} peças totais
                  </div>

                  {cortePayment && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lançamento Financeiro</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 font-semibold uppercase ${
                          cortePayment.status === 'pago' ? 'bg-green-50 text-green-700 border-green-200' :
                          cortePayment.status === 'atrasado' ? 'bg-red-50 text-red-700 border-red-200' :
                          cortePayment.status === 'vence_hoje' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {cortePayment.status === 'pago' ? 'Pago' : cortePayment.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                        </Badge>
                        <span className="text-[10px] text-slate-500">Vencimento: <strong className="text-slate-700">{cortePayment.due_date ? cortePayment.due_date.split('-').reverse().join('/') : '—'}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Costura */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Costura</h4>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-500">Facção / Responsável</Label>
                    <Select value={prodForm.costura_faction} onValueChange={v => setProdForm({...prodForm, costura_faction: v})}>
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue placeholder="Selecione um fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.name} className="text-xs">{s.name}</SelectItem>)}
                        {suppliers.length === 0 && <SelectItem value="none" disabled className="text-xs">Nenhum fornecedor encontrado</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.costura_start_date} onChange={e => setProdForm({...prodForm, costura_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.costura_end_date} onChange={e => setProdForm({...prodForm, costura_end_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <Label className="text-[10px] uppercase text-slate-500">Valor Unitário por Peça (R$)</Label>
                    <Input type="number" step="0.01" className="h-8 text-xs font-medium text-slate-900 bg-white" value={prodForm.costura_unit_price || ''} onChange={e => setProdForm({...prodForm, costura_unit_price: parseFloat(e.target.value) || 0})} placeholder="0.00" />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Grade Produzida (Costura)</Label>
                      <div className="flex items-center gap-1">
                        <select 
                          className="h-6 text-[10px] rounded border-slate-200 px-1 bg-white"
                          onChange={(e) => {
                            addSizeToGrid('costura', e.target.value);
                          }}
                          value=""
                        >
                          <option value="" disabled>+ Add Tamanho</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.keys(prodForm.costura_grid).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-2">Nenhum tamanho adicionado na grade.</div>
                      ) : (
                        Object.entries(prodForm.costura_grid).map(([size, qty]) => (
                          <div key={size} className="flex items-center gap-2">
                            <div className="w-10 h-7 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700">{size}</div>
                            <Input 
                              type="number" 
                              className="h-7 text-xs bg-white text-right flex-1" 
                              value={qty || ''} 
                              onChange={e => updateGridValue('costura', size, parseInt(e.target.value) || 0)} 
                              placeholder="Qtd..."
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeSizeFromGrid('costura', size)}>
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>Total a Pagar:</span>
                    <span>{formatCurrency(calculateTotal(prodForm.costura_grid, prodForm.costura_unit_price))}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right mt-1">
                    {Object.values(prodForm.costura_grid).reduce((a,b)=>a+(b||0),0)} peças totais
                  </div>

                  {costuraPayment && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lançamento Financeiro</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 font-semibold uppercase ${
                          costuraPayment.status === 'pago' ? 'bg-green-50 text-green-700 border-green-200' :
                          costuraPayment.status === 'atrasado' ? 'bg-red-50 text-red-700 border-red-200' :
                          costuraPayment.status === 'vence_hoje' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {costuraPayment.status === 'pago' ? 'Pago' : costuraPayment.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                        </Badge>
                        <span className="text-[10px] text-slate-500">Vencimento: <strong className="text-slate-700">{costuraPayment.due_date ? costuraPayment.due_date.split('-').reverse().join('/') : '—'}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
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
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </SheetContent>

    </Sheet>
  );
}
