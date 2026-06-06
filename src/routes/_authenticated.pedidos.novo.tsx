import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/lib/api/clients";
import { Switch } from "@/components/ui/switch";
import { useProducts, Product } from "@/lib/api/products";
import { useCreateOrder, OrderItem, OrderPayload } from "@/lib/api/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, ArrowLeft, Wand2, Check, ChevronsUpDown, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreateProductFromBOM } from "@/lib/api/products";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

export const Route = createFileRoute("/_authenticated/pedidos/novo")({
  head: () => ({ meta: [{ title: "Novo Pedido · e-roupas OS" }] }),
  component: NewOrderPage,
});

function NewOrderPage() {
  const navigate = useNavigate();
  const createMutation = useCreateOrder();
  const createProductMutation = useCreateProductFromBOM();
  
  const { data: clients } = useClients();
  const { data: products } = useProducts();
  const [brands, setBrands] = useState<{id: string, name: string, code: string}[]>([]);

  useEffect(() => {
    supabase.from("brands").select("id, name, code").then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  const [formData, setFormData] = useState<OrderPayload>({
    client_id: "",
    brand_id: "",
    salesperson_id: "",
    store: "Matriz",
    business_unit: "",
    delivery_days: 0,
    other_expenses: 0,
    discount: 0,
    sale_date: new Date().toISOString().split("T")[0],
    departure_date: "",
    expected_date: "",
    purchase_order: "",
    payment_category: "Sem categoria",
    payment_condition: "",
    payment_method: "PIX",
    carrier_name: "",
    freight_payer: "CIF",
    volumes_quantity: 0,
    gross_weight: 0,
    freight_cost: 0,
    logistics_integration: "",
    notes: "",
    internal_notes: "",
    mix_fabrics_allowed: false,
    items: [],
  });

  const emptySizes = {
    "2": 0, "4": 0, "6": 0, "8": 0, "10": 0, "12": 0, "14": 0, "16": 0,
    PP: 0, P: 0, M: 0, G: 0, GG: 0, XG: 0, G1: 0, G2: 0, G3: 0, G4: 0
  };

  const [items, setItems] = useState<any[]>([]);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);

  const addItem = () => {
    setItems([...items, {
      product_id: "",
      product_name: "",
      sku: "",
      gender: "Unissex",
      grid_type: "adulto",
      list_price: 0,
      discount_percent: 0,
      unit_price: 0,
      customizations: [],
      sizes: { ...emptySizes }
    }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field.startsWith("size_")) {
      const sz = field.substring(5);
      item.sizes = {
        ...item.sizes,
        [sz]: parseFloat(value) || 0
      };
    } else if (field === "grid_type") {
      item.grid_type = value;
      // Limpa os tamanhos ao trocar de grade para evitar misturar quantidades
      item.sizes = { ...emptySizes };
    } else {
      (item as any)[field] = value;
    }

    // Auto-fill from product selection
    if (field === "product_id" && products) {
      const p = products.find(prod => prod.id === value);
      if (p) {
        item.product_name = p.name;
        item.sku = p.sku || "";
        item.list_price = p.price;
        item.unit_price = p.price;
      }
    }

    if (field === "customizations") {
      item.customizations = value;
    }

    // Auto-calc unit price if list price or discount or customizations change
    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    const custSum = (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.price || 0) * Number(c.quantity || 1)), 0);
    
    if (field !== "unit_price") {
      item.unit_price = lp - (lp * (dp / 100)) + custSum;
    } else {
      // Auto-calc discount if unit price changes manually (ignoring customizations for the discount calc to avoid confusion)
      const up = Number(item.unit_price || 0) - custSum;
      if (lp > 0) {
        item.discount_percent = ((lp - up) / lp) * 100;
      }
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getItemQuantity = (item: any) => {
    if (!item.sizes) return 0;
    return Object.values(item.sizes).reduce((acc: number, q: any) => acc + (Number(q) || 0), 0);
  };

  // Calculations
  const numItems = items.length;
  const sumQuantities = items.reduce((acc, item) => acc + getItemQuantity(item), 0);
  const itemsTotalList = items.reduce((acc, item) => acc + (Number(item.list_price || 0) * getItemQuantity(item)), 0);
  const itemsTotalNet = items.reduce((acc, item) => acc + (Number(item.unit_price || 0) * getItemQuantity(item)), 0);
  const itemsDiscountTotal = itemsTotalList - itemsTotalNet;
  
  const saleDiscount = Number(formData.discount || 0);
  const otherExpenses = Number(formData.other_expenses || 0);
  const freight = Number(formData.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;

  const handleSubmit = async () => {
    if (!formData.client_id || !formData.brand_id) {
      toast.error("Cliente e Marca são obrigatórios.");
      return;
    }

    const explodedItems: any[] = [];
    items.forEach((item) => {
      if (item.sizes) {
        const activeSizes = item.grid_type === "infantil" ? INFANTIL_SIZES : ADULTO_SIZES;
        activeSizes.forEach((size) => {
          const qty = item.sizes[size];
          const quantity = Number(qty);
          if (quantity > 0) {
            let itemSku = item.sku || "";
            if (itemSku.startsWith("PA-")) {
              itemSku = itemSku.replace("PA-", "PF-");
            } else if (!itemSku.startsWith("PF-")) {
              itemSku = `PF-${itemSku}`;
            }
            const brandObj = brands.find(b => b.id === formData.brand_id);
            const brandCode = brandObj?.code || "CLI";
            const finalSku = `${itemSku}-${size}-${brandCode}`.toUpperCase();

            const p = products?.find(prod => prod.id === item.product_id);

            explodedItems.push({
              product_id: item.product_id,
              product_name: item.product_name,
              sku: finalSku,
              model: p?.models?.name || p?.model || "",
              fabric: p?.fabrics?.name || p?.fabric || "",
              color: p?.canonical_colors?.name || p?.color || "",
              size,
              gender: item.gender,
              quantity,
              list_price: item.list_price,
              discount_percent: item.discount_percent,
              unit_price: item.unit_price,
              customizations: item.customizations || [],
              notes: item.notes || ""
            });
          }
        });
      }
    });

    if (explodedItems.length === 0) {
      toast.error("O pedido deve conter pelo menos um item com quantidade na grade.");
      return;
    }
    
    try {
      await createMutation.mutateAsync({
        ...formData,
        items_discount: itemsDiscountTotal,
        estimated_total: itemsTotalList,
        final_total: finalTotal,
        items: explodedItems
      });
      toast.success("Pedido criado com sucesso!");
      navigate({ to: "/pedidos" });
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    }
  };

  const handleSaveSku = async (idx: number) => {
    const item = items[idx];
    if (!item.product_name) return toast.error("Selecione um produto base primeiro.");
    
    const sku = window.prompt("Digite o SKU para o novo produto composto:", item.sku + "-COMP");
    if (!sku) return;
    
    const name = window.prompt("Digite o nome do novo produto:", item.product_name + " (Personalizado)");
    if (!name) return;

    try {
      const baseCost = products?.find(p => p.id === item.product_id)?.cost_price || 0;
      const custCostSum = (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.cost || 0) * Number(c.quantity || 1)), 0);
      
      await createProductMutation.mutateAsync({
        name,
        sku,
        price: Number(item.unit_price || 0),
        cost_price: Number(baseCost) + custCostSum,
        customizations: item.customizations || []
      });
      toast.success("Produto composto criado com sucesso no cadastro!");
    } catch (err: any) {
      toast.error("Erro ao criar produto: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/pedidos" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-xl font-semibold text-slate-800">Pedido de venda - Novo</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/pedidos">
              <Button variant="outline" className="h-9 px-6 rounded-full border-green-600 text-green-700 hover:bg-green-50">Cancelar</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={createMutation.isPending} className="h-9 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* DADOS DO CLIENTE */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Dados do cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Cliente *</Label>
              <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
                <SelectContent>
                  {clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vendedor</Label>
              <Select value={formData.salesperson_id || ""} onValueChange={(v) => setFormData({ ...formData, salesperson_id: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione um vendedor" /></SelectTrigger>
                <SelectContent>
                  {clients?.filter(c => c.entity_type === "vendedor").map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Marca (Obrigatório) *</Label>
              <Select value={formData.brand_id} onValueChange={(v) => setFormData({ ...formData, brand_id: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione a marca" /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch 
                id="mix_fabrics"
                checked={formData.mix_fabrics_allowed || false}
                onCheckedChange={(v) => setFormData({ ...formData, mix_fabrics_allowed: v })}
              />
              <Label htmlFor="mix_fabrics" className="text-xs text-slate-700 cursor-pointer font-medium">Permitir misturar tecidos</Label>
            </div>
          </div>
        </section>

        {/* ITENS DO PEDIDO */}
        <section>
          <div className="flex items-center gap-6 border-b border-green-600/20 mb-4">
            <div className="px-1 py-2 border-b-2 border-green-600 text-green-700 text-sm font-medium">Itens do pedido de venda</div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden mb-3">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-3 font-medium w-8 text-center">#</th>
                  <th className="px-2 py-3 font-medium min-w-[150px]">Descrição</th>
                  <th className="px-2 py-3 font-medium w-28">Código</th>
                  <th className="px-2 py-3 font-medium w-24">Gênero</th>
                  <th className="px-2 py-3 font-medium w-20 text-center">Pers.</th>
                  <th className="px-2 py-3 font-medium w-24">Grade</th>
                  <th className="px-2 py-3 font-medium min-w-[280px]">Quantidades por Tamanho</th>
                  <th className="px-2 py-3 font-medium w-14 text-center bg-slate-100/30">Qtd</th>
                  <th className="px-2 py-3 font-medium w-24 text-right">Lista</th>
                  <th className="px-2 py-3 font-medium w-16 text-right">Desc%</th>
                  <th className="px-2 py-3 font-medium w-24 text-right font-semibold">Unit</th>
                  <th className="px-2 py-3 font-medium w-24 text-right font-bold">Total</th>
                  <th className="px-2 py-3 font-medium w-8 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {items.map((item, idx) => {
                  const qtyTotal = getItemQuantity(item);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-2 py-2 text-slate-400 bg-slate-100/50 text-center">{idx + 1}</td>
                      <td className="px-2 py-2">
                        <Select value={item.product_id || ""} onValueChange={(v) => updateItem(idx, "product_id", v)}>
                          <SelectTrigger className="h-8 border-transparent hover:border-input bg-transparent shadow-none p-1 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                            {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2"><Input className="h-8 text-xs font-mono" value={item.sku || ""} onChange={e => updateItem(idx, "sku", e.target.value)} /></td>
                      <td className="px-2 py-2">
                        <Select value={item.gender || "Unissex"} onValueChange={(v) => updateItem(idx, "gender", v)}>
                          <SelectTrigger className="h-8 border-transparent hover:border-input bg-transparent shadow-none p-1 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Unissex">Unissex</SelectItem>
                            <SelectItem value="Infantil">Infantil</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                          <Button variant="outline" size="sm" onClick={() => setActiveCustomizationIndex(idx)} className="h-7 text-[10px] border-dashed text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full px-1">
                            <Wand2 className="size-3 mr-1" /> {(item.customizations || []).length} pr.
                          </Button>
                          {(item.customizations || []).length > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => handleSaveSku(idx)} disabled={createProductMutation.isPending} className="h-5 text-[9px] text-green-600 hover:bg-green-50 w-full px-1">
                              <Save className="size-2.5 mr-1" /> SKU
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <Select value={item.grid_type || "adulto"} onValueChange={(v) => updateItem(idx, "grid_type", v)}>
                          <SelectTrigger className="h-8 border-transparent hover:border-input bg-transparent shadow-none p-1 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adulto">Adulto</SelectItem>
                            <SelectItem value="infantil">Infantil</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          {(item.grid_type === "infantil" ? INFANTIL_SIZES : ADULTO_SIZES).map((sz) => (
                            <div key={sz} className="flex flex-col items-center gap-0.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">{sz}</span>
                              <Input
                                type="number"
                                min={0}
                                className="h-7 px-1 text-center text-xs w-9 bg-white border border-slate-200 rounded"
                                value={item.sizes?.[sz] === 0 ? "" : (item.sizes?.[sz] || "")}
                                onChange={e => updateItem(idx, `size_${sz}`, e.target.value)}
                                placeholder="0"
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center font-semibold text-slate-600 bg-slate-50/50">{qtyTotal}</td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs bg-white" value={item.list_price || ""} onChange={e => updateItem(idx, "list_price", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs bg-white" value={item.discount_percent || ""} onChange={e => updateItem(idx, "discount_percent", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs font-medium text-slate-700 bg-white" value={item.unit_price || ""} onChange={e => updateItem(idx, "unit_price", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2 text-right font-bold text-slate-900 bg-slate-50/30">{(qtyTotal * Number(item.unit_price || 0)).toFixed(2)}</td>
                      <td className="px-2 py-2 text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => removeItem(idx)}><Trash2 className="size-3.5" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {items.length === 0 && <div className="text-center py-8 text-sm text-slate-500">Nenhum item adicionado.</div>}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="text-green-700 border-green-600/30 hover:bg-green-50"><Plus className="size-4 mr-1.5" /> Adicionar item</Button>
        </section>

        {/* TOTAIS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Totais</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nº de itens</Label>
              <div className="h-9 px-3 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">{numItems}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Soma das quantidades</Label>
              <div className="h-9 px-3 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">{sumQuantities}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Desconto R$</Label>
              <Input type="number" className="h-9" value={formData.discount || ""} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Prazo de entrega</Label>
              <Input type="number" className="h-9" value={formData.delivery_days || ""} onChange={e => setFormData({...formData, delivery_days: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Outras despesas</Label>
              <Input type="number" className="h-9" value={formData.other_expenses || ""} onChange={e => setFormData({...formData, other_expenses: parseFloat(e.target.value) || 0})} />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Desconto total da venda</Label>
              <div className="h-9 px-3 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">{saleDiscount.toFixed(2)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Total de comissões</Label>
              <div className="h-9 px-3 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">0.00</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Desconto total dos itens</Label>
              <div className="h-9 px-3 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">{itemsDiscountTotal.toFixed(2)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Total dos itens</Label>
              <div className="h-9 px-3 flex items-center font-medium bg-slate-100 rounded-md text-sm border text-slate-800">{itemsTotalList.toFixed(2)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Total da venda</Label>
              <div className="h-9 px-3 flex items-center font-bold bg-slate-100 rounded-md text-sm border text-slate-800">{finalTotal.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* DETALHES DA VENDA */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Detalhes da venda</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Data da venda</Label>
              <Input type="date" className="h-9" value={formData.sale_date || ""} onChange={e => setFormData({...formData, sale_date: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Data saída</Label>
              <Input type="date" className="h-9" value={formData.departure_date || ""} onChange={e => setFormData({...formData, departure_date: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Data prevista</Label>
              <Input type="date" className="h-9" value={formData.expected_date || ""} onChange={e => setFormData({...formData, expected_date: e.target.value})} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground text-blue-600">Pedido de compra</Label>
              <Input className="h-9" value={formData.purchase_order || ""} onChange={e => setFormData({...formData, purchase_order: e.target.value})} />
            </div>
          </div>
        </section>

        {/* PAGAMENTO */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Pagamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground text-blue-600">Condição de pagamento</Label>
              <Input className="h-9" value={formData.payment_condition || ""} onChange={e => setFormData({...formData, payment_condition: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Categoria</Label>
              <Select value={formData.payment_category || ""} onValueChange={(v) => setFormData({ ...formData, payment_category: v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Sem categoria" /></SelectTrigger>
                <SelectContent><SelectItem value="Sem categoria">Sem categoria</SelectItem><SelectItem value="Venda Produtos">Venda Produtos</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-xs text-slate-500">
                <tr><th className="px-4 py-2 w-16">Parcela</th><th className="px-4 py-2 w-24">Dias</th><th className="px-4 py-2 w-36">Data</th><th className="px-4 py-2 w-32">Valor</th><th className="px-4 py-2 w-48">Forma</th><th className="px-4 py-2">Observação</th></tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 text-center text-slate-400 bg-slate-100/50">1</td>
                  <td className="px-4 py-2"><Input className="h-8" value="0" readOnly /></td>
                  <td className="px-4 py-2"><Input type="date" className="h-8" value={formData.sale_date || ""} readOnly /></td>
                  <td className="px-4 py-2"><Input className="h-8" value={finalTotal.toFixed(2)} readOnly /></td>
                  <td className="px-4 py-2">
                    <Select value={formData.payment_method || ""} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="PIX">PIX</SelectItem><SelectItem value="Boleto">Boleto</SelectItem><SelectItem value="Cartão">Cartão</SelectItem></SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2"><Input className="h-8" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* TRANSPORTADOR */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Transportador</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input className="h-9" value={formData.carrier_name || ""} onChange={e => setFormData({...formData, carrier_name: e.target.value})} />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground">Frete por conta</Label>
              <Select value={formData.freight_payer || ""} onValueChange={(v) => setFormData({ ...formData, freight_payer: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="CIF">Remetente (CIF)</SelectItem><SelectItem value="FOB">Destinatário (FOB)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Quantidade (Vol)</Label>
              <Input type="number" className="h-9" value={formData.volumes_quantity || ""} onChange={e => setFormData({...formData, volumes_quantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Frete</Label>
              <Input type="number" step="0.01" className="h-9" value={formData.freight_cost || ""} onChange={e => setFormData({...formData, freight_cost: parseFloat(e.target.value) || 0})} />
            </div>
          </div>
        </section>

        {/* DADOS ADICIONAIS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Dados adicionais</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Observações (Impressas no pedido)</Label>
              <Textarea className="min-h-[100px] resize-y" value={formData.notes || ""} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Observações internas</Label>
              <Textarea className="min-h-[100px] resize-y" value={formData.internal_notes || ""} onChange={e => setFormData({...formData, internal_notes: e.target.value})} />
            </div>
          </div>
        </section>
        {/* CUSTOMIZATIONS MODAL */}
        <Dialog open={activeCustomizationIndex !== null} onOpenChange={(open) => { if (!open) setActiveCustomizationIndex(null); }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Composição / Personalizações da Peça</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {activeCustomizationIndex !== null && (
                <>
                  <div className="flex gap-2 text-xs font-semibold text-slate-500 mb-2 px-2">
                    <div className="flex-[2]">Insumo / Processo</div>
                    <div className="flex-1">Detalhes Adicionais</div>
                    <div className="w-20 text-center">Custo un.</div>
                    <div className="w-20 text-center">Venda un.</div>
                    <div className="w-16 text-center">Qtd</div>
                    <div className="w-8"></div>
                  </div>
                  {(items[activeCustomizationIndex]?.customizations || []).map((cust: any, cIdx: number) => (
                    <div key={cIdx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-md border">
                      <div className="flex-[2]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className={cn("justify-between w-full font-normal h-8 text-xs", !cust.product_id && "text-muted-foreground")}>
                              {cust.product_id ? cust.name : "Buscar no cadastro..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[300px]" align="start">
                            <Command>
                              <CommandInput placeholder="Buscar por serviço ou material..." />
                              <CommandList>
                                <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                                <CommandGroup>
                                  {(products || []).map((p) => (
                                    <CommandItem
                                      key={p.id}
                                      value={`${p.sku || ""} ${p.name}`}
                                      onSelect={() => {
                                        const newC = [...(items[activeCustomizationIndex].customizations || [])];
                                        newC[cIdx].product_id = p.id;
                                        newC[cIdx].name = p.name;
                                        newC[cIdx].cost = p.cost_price || 0;
                                        newC[cIdx].price = p.price || 0;
                                        updateItem(activeCustomizationIndex, "customizations", newC);
                                      }}
                                    >
                                      <Check className={cn("mr-2 h-4 w-4", cust.product_id === p.id ? "opacity-100" : "opacity-0")} />
                                      <div className="flex flex-col">
                                        <span>{p.name}</span>
                                        <span className="text-[10px] text-muted-foreground">Custo: R${p.cost_price} | Venda: R${p.price}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="flex-1">
                        <Input placeholder="Local/Arte..." value={cust.details || ""} onChange={e => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].details = e.target.value;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs" />
                      </div>
                      
                      <div className="w-20">
                        <Input type="number" step="0.01" placeholder="Custo" value={cust.cost} onChange={e => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].cost = parseFloat(e.target.value) || 0;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs text-center" />
                      </div>
                      
                      <div className="w-20">
                        <Input type="number" step="0.01" placeholder="Venda" value={cust.price} onChange={e => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].price = parseFloat(e.target.value) || 0;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs text-center font-medium text-blue-600" />
                      </div>
                      
                      <div className="w-16">
                        <Input type="number" min="1" step="any" placeholder="Qtd" value={cust.quantity} onChange={e => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].quantity = parseFloat(e.target.value) || 1;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs text-center" />
                      </div>
                      
                      <div className="w-8 flex justify-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC.splice(cIdx, 1);
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }}><Trash2 className="size-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full border-dashed mt-2" onClick={() => {
                    const newC = [...(items[activeCustomizationIndex].customizations || []), { product_id: "", name: "", details: "", cost: 0, price: 0, quantity: 1 }];
                    updateItem(activeCustomizationIndex, "customizations", newC);
                  }}><Plus className="size-4 mr-2" /> Adicionar Material / Processo</Button>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setActiveCustomizationIndex(null)}>Concluído</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
