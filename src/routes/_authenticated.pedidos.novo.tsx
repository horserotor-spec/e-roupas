import { createFileRoute, useNavigate, Link, useBlocker } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useClients } from "@/lib/api/clients";
import { useSuppliers } from "@/lib/api/inventory";
import { Switch } from "@/components/ui/switch";
import { ClientFormDrawer } from "@/components/crm/ClientFormDrawer";
import { useProducts, Product } from "@/lib/api/products";
import { useCreateOrder, OrderItem, OrderPayload, OrderPayment } from "@/lib/api/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, ArrowLeft, Wand2, Save, Check, ChevronsUpDown, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreateProductFromBOM } from "@/lib/api/products";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getProductDisplayName } from "@/lib/utils/product-display";

const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

export function SearchableCombobox({ items, value, onChange, placeholder, minChars = 1 }: { items: {id: string, name: string}[], value: string, onChange: (v: string) => void, placeholder: string, minChars?: number }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const displayItems = search.length >= minChars 
    ? items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-9 px-3 bg-white font-normal", !value && "text-muted-foreground")}>
          <span className="truncate">{value ? items.find((i) => i.id === value)?.name : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={`Digite ${minChars} letra...`} onValueChange={setSearch} value={search} />
          <CommandList>
            {search.length < minChars && <div className="p-4 text-center text-sm text-muted-foreground">Digite pelo menos {minChars} letra para buscar.</div>}
            {search.length >= minChars && displayItems.length === 0 && <CommandEmpty>Nenhum resultado.</CommandEmpty>}
            {search.length >= minChars && (
              <CommandGroup>
                {displayItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-0")} />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const Route = createFileRoute("/_authenticated/pedidos/novo")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as string) || "pedido",
    };
  },
  head: () => ({ meta: [{ title: "Novo Pedido · e-roupas OS" }] }),
  component: NewOrderPage,
});

function NewOrderPage() {
  const { type = "pedido" } = Route.useSearch() as { type?: string };
  const navigate = useNavigate();
  const createMutation = useCreateOrder();
  const createProductMutation = useCreateProductFromBOM();
  
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  
  const { data: clients } = useClients();
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();

  const carriers = (clients || []).filter(c => c.entity_type === "transportadora");
  const [brands, setBrands] = useState<{id: string, name: string, code: string}[]>([]);
  const [installmentsCount, setInstallmentsCount] = useState(1);

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
    origin_channel: "Internet",
    carrier_name: "",
    freight_payer: "CIF",
    volumes_quantity: 0,
    gross_weight: 0,
    freight_cost: 0,
    logistics_integration: "",
    logistics_type: "Correios",
    delivery_name: "",
    delivery_document: "",
    delivery_phone: "",
    delivery_zip: "",
    delivery_street: "",
    delivery_number: "",
    delivery_complement: "",
    delivery_neighborhood: "",
    delivery_city: "",
    delivery_state: "",
    package_height: 0,
    package_width: 0,
    package_length: 0,
    notes: "",
    internal_notes: "",
    mix_fabrics_allowed: false,
    status: type === "orcamento" ? "orcamento" : "atendimento",
    seller_id: "",
    items: [],
  });

  useEffect(() => {
    if (formData.client_id && clients) {
      const selectedClient = clients.find(c => c.id === formData.client_id);
      if (selectedClient && !formData.delivery_zip) {
        setFormData(prev => ({
          ...prev,
          delivery_name: selectedClient.name || "",
          delivery_document: selectedClient.document || "",
          delivery_phone: selectedClient.phone || "",
          delivery_zip: selectedClient.zip_code || "",
          delivery_street: selectedClient.street || "",
          delivery_number: selectedClient.number || "",
          delivery_complement: selectedClient.complement || "",
          delivery_neighborhood: selectedClient.neighborhood || "",
          delivery_city: selectedClient.city || "",
          delivery_state: selectedClient.state || ""
        }));
      }
    }
  }, [formData.client_id, clients]);

  const emptySizes = {
    "2": 0, "4": 0, "6": 0, "8": 0, "10": 0, "12": 0, "14": 0, "16": 0,
    PP: 0, P: 0, M: 0, G: 0, GG: 0, XG: 0, G1: 0, G2: 0, G3: 0, G4: 0
  };

  const [items, setItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<OrderPayment[]>([{ amount: 0, payment_method: "PIX", installments: 1, due_date: new Date().toISOString().split("T")[0], status: "pendente", notes: "" }]);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isSubmittedRef = useRef(false);

  const isDirty = 
    !isSubmitted && (
      formData.client_id !== "" || 
      formData.brand_id !== "" || 
      items.length > 0 || 
      formData.discount > 0 || 
      formData.other_expenses > 0 || 
      formData.purchase_order !== ""
    );

  const blocker = useBlocker({
    shouldBlockFn: () => {
      if (isSubmittedRef.current) return false;
      return (
        formData.client_id !== "" || 
        formData.brand_id !== "" || 
        items.length > 0 || 
        formData.discount > 0 || 
        formData.other_expenses > 0 || 
        formData.purchase_order !== ""
      );
    },
    withResolver: true
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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
      unit_cost: 0,
      art_code: "",
      customizations: [],
      active_sizes: [],
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
        item.product_name = getProductDisplayName(p);
        item.sku = p.sku || "";
        item.list_price = p.price;
        item.unit_price = p.price;
        item.unit_cost = p.cost_price || 0;
      }
    }

    if (field === "customizations") {
      item.customizations = value;
    }

    // Auto-calc unit price if list price or discount or customizations change
    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    const custSum = (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.price || 0) * Number(c.quantity || 1)), 0);
    
    if (field === "list_price" || field === "discount_percent" || field === "customizations") {
      item.unit_price = lp - (lp * (dp / 100)) + custSum;
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
  
  const getCustSum = (item: any) => (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.price || 0) * Number(c.quantity || 1)), 0);

  // itemsTotalNet is the sum of the manual or calculated UNIT price
  const itemsTotalNet = items.reduce((acc, item) => acc + (Number(item.unit_price || 0) * getItemQuantity(item)), 0);

  // itemsDiscountTotal is strictly the explicit discount_percent applied to list_price
  const itemsDiscountTotal = items.reduce((acc, item) => {
    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    return acc + (lp * (dp / 100) * getItemQuantity(item));
  }, 0);

  const itemsTotalGross = itemsTotalNet + itemsDiscountTotal;

  const saleDiscount = itemsTotalNet * (Number(formData.discount || 0) / 100);
  const otherExpenses = Number(formData.other_expenses || 0);
  const freight = Number(formData.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;

  const totalCost = items.reduce((acc, item) => {
    const baseCost = Number(item.unit_cost || 0);
    const custCostSum = (item.customizations || []).reduce((sum: number, c: any) => sum + (Number(c.cost || 0) * Number(c.quantity || 1)), 0);
    return acc + ((baseCost + custCostSum) * getItemQuantity(item));
  }, 0);
  
  const liquidRevenue = itemsTotalNet - saleDiscount;
  const grossMarginPct = (totalCost > 0 && liquidRevenue > 0) ? ((liquidRevenue - totalCost) / liquidRevenue) * 100 : (finalTotal > 0 ? 100 : 0);

  useEffect(() => {
    if (payments.length !== installmentsCount) {
      if (installmentsCount < 1) return;
      const baseValue = finalTotal / installmentsCount;
      const newP = Array.from({ length: installmentsCount }).map((_, i) => {
        const d = new Date(formData.sale_date || new Date());
        d.setDate(d.getDate() + (30 * i));
        return {
          amount: Number(baseValue.toFixed(2)),
          payment_method: payments[0]?.payment_method || "PIX",
          installments: 1,
          due_date: d.toISOString().split("T")[0],
          status: "pendente" as const,
          notes: ""
        };
      });
      const sum = newP.reduce((acc, p) => acc + p.amount, 0);
      if (sum !== finalTotal && installmentsCount > 0) {
        newP[installmentsCount - 1].amount = Number((newP[installmentsCount - 1].amount + (finalTotal - sum)).toFixed(2));
      }
      setPayments(newP);
    } else {
      const currentSum = payments.reduce((acc, p) => acc + p.amount, 0);
      if (Math.abs(currentSum - finalTotal) > 0.01 && payments.length > 0) {
        const newP = [...payments];
        newP[newP.length - 1].amount = Number((newP[newP.length - 1].amount + (finalTotal - currentSum)).toFixed(2));
        setPayments(newP);
      }
    }
  }, [installmentsCount, finalTotal]);

  const updatePaymentAmount = (idx: number, newAmount: number) => {
    const newPayments = [...payments];
    newPayments[idx].amount = newAmount;
    
    let previousSum = newPayments.slice(0, idx + 1).reduce((acc, p) => acc + p.amount, 0);
    const remaining = finalTotal - previousSum;
    const countRemaining = newPayments.length - 1 - idx;
    
    if (countRemaining > 0) {
      const dist = remaining / countRemaining;
      for (let i = idx + 1; i < newPayments.length; i++) {
        newPayments[i].amount = Number(dist.toFixed(2));
      }
      const newSum = newPayments.reduce((acc, p) => acc + p.amount, 0);
      if (Math.abs(newSum - finalTotal) > 0.001) {
        newPayments[newPayments.length - 1].amount = Number((newPayments[newPayments.length - 1].amount + (finalTotal - newSum)).toFixed(2));
      }
    }
    setPayments(newPayments);
  };

  const updatePaymentField = (idx: number, field: keyof OrderPayment, value: any) => {
    const newPayments = [...payments];
    newPayments[idx] = { ...newPayments[idx], [field]: value };
    setPayments(newPayments);
  };

  const addPayment = () => {
    setInstallmentsCount(prev => prev + 1);
  };
  
  const removePayment = (idx: number) => {
    if (payments.length <= 1) return;
    setInstallmentsCount(prev => prev - 1);
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!formData.client_id || !formData.brand_id) {
      toast.error("Cliente e Marca são obrigatórios.");
      return false;
    }

    const explodedItems: any[] = [];
    items.forEach((item) => {
      if (item.sizes) {
        const activeSizes = item.active_sizes || [];
        activeSizes.forEach((size) => {
          const qty = item.sizes[size];
          const quantity = Number(qty);
          if (quantity > 0) {
            if (!item.art_code) {
              toast.error(`O código da arte é obrigatório para o item ${item.product_name}`);
              throw new Error("Missing art code");
            }
            
            let itemSku = item.sku || "";
            if (itemSku.startsWith("PA-")) {
              itemSku = itemSku.replace("PA-", `${item.art_code}-`);
            } else {
              itemSku = `${item.art_code}-${itemSku}`;
            }
            const brandObj = brands.find(b => b.id === formData.brand_id);
            const brandCode = brandObj?.code || "CLI";
            const finalSku = `${itemSku}-${size}-${brandCode}`.toUpperCase();

            const p = products?.find(prod => prod.id === item.product_id);

            explodedItems.push({
              product_id: item.product_id,
              product_name: item.product_name,
              sku: finalSku,
              art_code: item.art_code,
              model: p?.models?.name || p?.model || "",
              fabric: p?.fabrics?.name || p?.fabric || "",
              color: p?.canonical_colors?.name || p?.color || "",
              size,
              gender: item.gender,
              quantity,
              unit_cost: item.unit_cost,
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
      return false;
    }
    
    try {
      isSubmittedRef.current = true;
      setIsSubmitted(true);
      await createMutation.mutateAsync({
        ...formData,
        items_discount: itemsDiscountTotal,
        estimated_total: itemsTotalNet,
        final_total: finalTotal,
        items: explodedItems,
        payments: payments.map(p => ({
          ...p,
          amount: Number(p.amount)
        }))
      });
      toast.success("Pedido criado com sucesso!");
      navigate({ to: "/pedidos" });
      return true;
    } catch (err: any) {
      isSubmittedRef.current = false;
      setIsSubmitted(false);
      toast.error("Erro ao salvar: " + err.message);
      return false;
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
            <h1 className="text-xl font-semibold text-slate-800">
              {formData.status === "orcamento" ? "Orçamento - Novo" : "Pedido de venda - Novo"}
            </h1>
            {formData.status === "orcamento" && (
              <div className="ml-4 px-3 py-1 bg-slate-100 rounded-md border text-xs flex items-center gap-2">
                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Margem Bruta</span>
                <span className={`font-bold ${grossMarginPct < 15 ? "text-red-600" : "text-emerald-600"}`}>
                  {grossMarginPct.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/pedidos">
              <Button variant="outline" className="h-7 px-4 text-xs rounded-full border-green-600 text-green-700 hover:bg-green-50">Cancelar</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={createMutation.isPending} className="h-7 px-5 text-xs rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
              {createMutation.isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Tabs defaultValue="pedido" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="pedido">Dados do Pedido</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro / Interno</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pedido" className="space-y-8 mt-0">
            {/* DADOS DO CLIENTE */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Dados do cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Cliente *</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClient(null);
                      setClientDrawerOpen(true);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="size-3" /> Cadastrar Novo
                  </button>
                  {formData.client_id && (
                    <>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          const matched = clients?.find(c => c.id === formData.client_id);
                          if (matched) {
                            setEditingClient(matched);
                            setClientDrawerOpen(true);
                          }
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
                      >
                        Visualizar / Editar
                      </button>
                    </>
                  )}
                </div>
              </div>
              <SearchableCombobox
                items={(clients || []).map(c => ({ id: c.id, name: `${c.name} ${c.company_name ? `(${c.company_name})` : ''}` }))}
                value={formData.client_id}
                onChange={(v) => setFormData({ ...formData, client_id: v })}
                placeholder="Selecione um cliente"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vendedor</Label>
              <SearchableCombobox
                items={(clients || []).filter(c => c.entity_type === "vendedor").map(c => ({ id: c.id, name: c.name }))}
                value={formData.salesperson_id || ""}
                onChange={(v) => setFormData({ ...formData, salesperson_id: v })}
                placeholder="Selecione um vendedor"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Marca (Obrigatório) *</Label>
              <SearchableCombobox
                items={brands.map(b => ({ id: b.id, name: b.name }))}
                value={formData.brand_id}
                onChange={(v) => setFormData({ ...formData, brand_id: v })}
                placeholder="Selecione a marca"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Origem do Pedido *</Label>
              <Select value={formData.origin_channel} onValueChange={(v) => setFormData({ ...formData, origin_channel: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione a origem" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internet">Internet</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                  <SelectItem value="Reparação">Reparação</SelectItem>
                  <SelectItem value="Dropshipping">Dropshipping</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Representante Comercial">Representante Comercial</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
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
          
          <div className="bg-white border rounded-lg overflow-x-auto overflow-y-visible mb-3">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-3 font-medium w-8 text-center">#</th>
                  <th className="px-2 py-3 font-medium min-w-[280px]">Produto / Identificação</th>
                  <th className="px-2 py-3 font-medium min-w-[320px]">Quantidades por Tamanho</th>
                  <th className="px-2 py-3 font-medium w-16 text-center bg-slate-100/30">Qtd</th>
                  <th className="px-2 py-3 font-medium w-[290px] text-right">Valores (Tabela / Desc / Unit / Total)</th>
                  <th className="px-2 py-3 font-medium w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {items.map((item, idx) => {
                  const qtyTotal = getItemQuantity(item);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-2 py-2 text-slate-400 bg-slate-100/50 text-center align-top pt-3">{idx + 1}</td>
                      <td className="px-2 py-2 space-y-2 align-top">
                        <div>
                          <SearchableCombobox
                            items={(products || []).filter(p => ['PA', 'Serviço', 'PF'].includes(p.format || '')).map(p => ({ id: p.id, name: getProductDisplayName(p) }))}
                            value={item.product_id || ""}
                            onChange={(v) => updateItem(idx, "product_id", v)}
                            placeholder="Selecione..."
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                          <Input className="h-8 text-xs font-mono border-green-500/50 bg-green-50/30 placeholder:text-green-600/40 w-24" placeholder="Cód. Arte *" value={item.art_code || ""} onChange={e => updateItem(idx, "art_code", e.target.value.toUpperCase())} />
                          <Input className="h-8 text-xs font-mono w-28" placeholder="Cód. Base (PA)" value={item.sku || ""} onChange={e => updateItem(idx, "sku", e.target.value)} />
                          <Select value={item.gender || "Unissex"} onValueChange={(v) => updateItem(idx, "gender", v)}>
                            <SelectTrigger className="h-8 border bg-white shadow-sm p-1 px-2 text-xs w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                              <SelectItem value="Unissex">Unissex</SelectItem>
                              <SelectItem value="Infantil">Infantil</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={item.grid_type || "adulto"} onValueChange={(v) => updateItem(idx, "grid_type", v)}>
                            <SelectTrigger className="h-8 border bg-white shadow-sm p-1 px-2 text-xs w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adulto">Adulto</SelectItem>
                              <SelectItem value="infantil">Infantil</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1 items-center">
                            <Button variant="outline" size="sm" onClick={() => setActiveCustomizationIndex(idx)} className="h-8 text-[10px] border text-blue-600 hover:bg-blue-50 px-2">
                              <Wand2 className="size-3 mr-1" /> {(item.customizations || []).length} pers.
                            </Button>
                            {(item.customizations || []).length > 0 && (
                              <Button variant="ghost" size="sm" onClick={() => handleSaveSku(idx)} disabled={createProductMutation.isPending} className="h-6 text-[9px] text-green-600 hover:bg-green-50 px-1.5">
                                <Save className="size-2.5 mr-1" /> SKU
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="flex flex-wrap gap-1 items-end mt-1">
                          {(item.active_sizes || []).map((sz: string) => (
                            <div key={sz} className="flex flex-col items-center gap-0.5 relative group">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">{sz}</span>
                              <Input
                                type="number"
                                min={0}
                                className="h-7 px-1 text-center text-xs w-10 bg-white border border-slate-200 rounded focus:border-green-500"
                                value={item.sizes?.[sz] === 0 ? "" : (item.sizes?.[sz] || "")}
                                onChange={e => updateItem(idx, `size_${sz}`, e.target.value)}
                                placeholder="0"
                              />
                              <button 
                                onClick={() => updateItem(idx, "active_sizes", (item.active_sizes || []).filter((s: string) => s !== sz))}
                                className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px]"
                              >×</button>
                            </div>
                          ))}
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 text-green-700 border-green-200 hover:bg-green-50">+</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="start">
                              <div className="grid grid-cols-4 gap-1">
                                {(item.grid_type === "infantil" ? INFANTIL_SIZES : ADULTO_SIZES).map((sz) => (
                                  <Button 
                                    key={sz} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    disabled={(item.active_sizes || []).includes(sz)}
                                    onClick={() => updateItem(idx, "active_sizes", [...(item.active_sizes || []), sz])}
                                  >
                                    {sz}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center font-semibold text-slate-600 bg-slate-50/50 align-top pt-4">{qtyTotal}</td>
                      <td className="px-2 py-2 space-y-1 align-top text-right w-[290px]">
                        <div className="flex gap-1.5 justify-end items-center flex-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-muted-foreground uppercase">Tabela</span>
                            <CurrencyInput className="h-8 text-right text-xs bg-white w-20 px-1" value={item.list_price || 0} onChange={v => updateItem(idx, "list_price", v)} />
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-muted-foreground uppercase">Desc (%)</span>
                            <Input type="number" step="0.01" className="h-8 text-right text-xs bg-white w-14 px-1" value={item.discount_percent || ""} onChange={e => updateItem(idx, "discount_percent", parseFloat(e.target.value))} />
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-muted-foreground uppercase">Unit (R$)</span>
                            <CurrencyInput className="h-8 text-right text-xs font-medium text-slate-700 bg-white w-20 px-1" value={item.unit_price || 0} onChange={v => updateItem(idx, "unit_price", v)} />
                          </div>
                        </div>
                        <div className="flex justify-end items-center pt-1.5 border-t border-dashed mt-1.5">
                          <div className="flex items-center gap-1.5 text-xs pr-1">
                            <span className="text-[9px] text-muted-foreground uppercase font-bold">Total:</span>
                            <span className="font-bold text-slate-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(qtyTotal * Number(item.unit_price || 0))}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center align-top pt-4">
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
          <div className="grid grid-cols-2 md:grid-cols-8 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider truncate" title="Soma das quantidades">Soma Qtds</Label>
              <div className="h-9 px-2 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600">{sumQuantities}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-blue-600 uppercase tracking-wider truncate" title="Desconto total do pedido">Desconto</Label>
              <div className="relative">
                <Input type="number" step="0.01" className="h-9 pr-7 text-xs" value={formData.discount || ""} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-blue-600 uppercase tracking-wider truncate" title="Prazo de entrega (dias)">Prazo (dias)</Label>
              <Input type="number" className="h-9 text-xs" value={formData.delivery_days || ""} onChange={e => setFormData({...formData, delivery_days: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-blue-600 uppercase tracking-wider truncate" title="Outras despesas">Outras Desp.</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                <Input type="number" step="0.01" className="h-9 pl-7 text-xs" value={formData.other_expenses || ""} onChange={e => setFormData({...formData, other_expenses: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider truncate" title="Desconto total dos itens">Desc. Itens</Label>
              <div className="h-9 px-2 flex items-center bg-slate-100 rounded-md text-xs border text-slate-600 truncate">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemsDiscountTotal)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider truncate" title="Desconto total da venda">Desc. Venda</Label>
              <div className="h-9 px-2 flex items-center bg-slate-100 rounded-md text-xs border text-slate-600 truncate">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemsDiscountTotal + saleDiscount)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider truncate" title="Total dos itens">Total Itens</Label>
              <div className="h-9 px-2 flex items-center font-medium bg-slate-100 rounded-md text-xs border text-slate-800 truncate">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemsTotalNet)}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider truncate" title="Total da venda">Total Venda</Label>
              <div className="h-9 px-2 flex items-center font-bold bg-green-50 rounded-md text-xs border border-green-200 text-green-800 truncate">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalTotal)}</div>
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
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground text-blue-600">Pedido de compra</Label>
              <Input className="h-9" value={formData.purchase_order || ""} onChange={e => setFormData({...formData, purchase_order: e.target.value})} />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground">Status do Pedido *</Label>
              <Select value={formData.status || "confirmado"} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="aguardando_financeiro">Ag. Financeiro</SelectItem>
                  <SelectItem value="liberado_producao">Liberado Prod.</SelectItem>
                  <SelectItem value="separacao">Separação</SelectItem>
                  <SelectItem value="corte">Corte</SelectItem>
                  <SelectItem value="costura">Costura</SelectItem>
                  <SelectItem value="bordado">Bordado</SelectItem>
                  <SelectItem value="impressao">Impressão</SelectItem>
                  <SelectItem value="expedicao">Expedição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* PAGAMENTO */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Pagamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground text-blue-600">Nº de Parcelas</Label>
              <Input type="number" min="1" className="h-9" value={installmentsCount} onChange={e => setInstallmentsCount(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5 md:col-span-3 text-xs text-muted-foreground flex items-end pb-2">
              <span>Altere o valor de uma parcela para que as demais se ajustem automaticamente.</span>
            </div>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-xs text-slate-500">
                <tr><th className="px-4 py-2 w-16">#</th><th className="px-4 py-2 w-32">Valor (R$)</th><th className="px-4 py-2 w-48">Forma</th><th className="px-4 py-2 w-36">Data Venc.</th><th className="px-4 py-2">Observação</th><th className="px-4 py-2 w-16 text-center">Ações</th></tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-center text-slate-400 bg-slate-100/50">{idx + 1}</td>
                    <td className="px-4 py-2"><CurrencyInput className="h-8 text-right px-1" value={p.amount || 0} onChange={v => updatePaymentAmount(idx, v)} /></td>
                    <td className="px-4 py-2">
                      <Select value={p.payment_method || ""} onValueChange={(v) => updatePaymentField(idx, "payment_method", v)}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Débito">Débito</SelectItem>
                          <SelectItem value="Crédito à vista">Crédito à vista</SelectItem>
                          <SelectItem value="Crédito parcelado">Crédito parcelado</SelectItem>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2"><Input type="date" className="h-8" value={p.due_date} onChange={e => updatePaymentField(idx, "due_date", e.target.value)} /></td>
                    <td className="px-4 py-2"><Input className="h-8" value={p.notes || ""} onChange={e => updatePaymentField(idx, "notes", e.target.value)} /></td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => removePayment(idx)}><Trash2 className="size-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={addPayment} className="text-blue-700 border-blue-600/30 hover:bg-blue-50"><Plus className="size-4 mr-1.5" /> Adicionar parcela</Button>
            
            <div className="text-xs">
              <span className="text-slate-500 mr-2">Soma pagamentos:</span>
              <span className={`font-bold ${payments.reduce((acc, p) => acc + (p.amount || 0), 0) === finalTotal ? 'text-green-600' : 'text-red-500'}`}>
                {formatCurrency(payments.reduce((acc, p) => acc + (p.amount || 0), 0))}
              </span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-600">Total: {formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </section>

        {/* LOGÍSTICA E ENTREGA */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Logística e Entrega</h2>
            <div className="h-px flex-1 bg-slate-200 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground text-blue-600">Tipo Logístico</Label>
              <Select value={formData.logistics_type || "Correios"} onValueChange={(v) => setFormData({ ...formData, logistics_type: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Correios">Correios (SGP Web)</SelectItem>
                  <SelectItem value="Transportadora">Transportadora (SGP Web)</SelectItem>
                  <SelectItem value="Motoboy">Motoboy</SelectItem>
                  <SelectItem value="Retirada Local">Retirada Local</SelectItem>
                  <SelectItem value="Entrega Própria">Entrega Própria</SelectItem>
                  <SelectItem value="Dropshipping">Dropshipping Fornecedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Nome da Transportadora (Se aplicável)</Label>
              <SearchableCombobox
                items={carriers.map(c => ({ id: c.name, name: c.name }))}
                value={formData.carrier_name || ""}
                onChange={(v) => setFormData({ ...formData, carrier_name: v })}
                placeholder="Selecione um transportador"
              />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground">Frete por conta</Label>
              <Select value={formData.freight_payer || ""} onValueChange={(v) => setFormData({ ...formData, freight_payer: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="CIF">Remetente (CIF)</SelectItem><SelectItem value="FOB">Destinatário (FOB)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="col-span-12 mb-2"><h3 className="text-xs font-semibold uppercase text-slate-500">Endereço de Entrega</h3></div>
            
            <div className="space-y-1.5 col-span-12 md:col-span-4">
              <Label className="text-xs text-muted-foreground">Nome / Destinatário</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_name || ""} onChange={e => setFormData({...formData, delivery_name: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-6 md:col-span-4">
              <Label className="text-xs text-muted-foreground">CPF / CNPJ</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_document || ""} onChange={e => setFormData({...formData, delivery_document: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-6 md:col-span-4">
              <Label className="text-xs text-muted-foreground">Telefone</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_phone || ""} onChange={e => setFormData({...formData, delivery_phone: e.target.value})} />
            </div>
            
            <div className="space-y-1.5 col-span-6 md:col-span-3">
              <Label className="text-xs text-muted-foreground">CEP</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_zip || ""} onChange={e => setFormData({...formData, delivery_zip: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-12 md:col-span-7">
              <Label className="text-xs text-muted-foreground">Rua / Logradouro</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_street || ""} onChange={e => setFormData({...formData, delivery_street: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-6 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Número</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_number || ""} onChange={e => setFormData({...formData, delivery_number: e.target.value})} />
            </div>
            
            <div className="space-y-1.5 col-span-6 md:col-span-3">
              <Label className="text-xs text-muted-foreground">Complemento</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_complement || ""} onChange={e => setFormData({...formData, delivery_complement: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-6 md:col-span-4">
              <Label className="text-xs text-muted-foreground">Bairro</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_neighborhood || ""} onChange={e => setFormData({...formData, delivery_neighborhood: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-8 md:col-span-4">
              <Label className="text-xs text-muted-foreground">Cidade</Label>
              <Input className="h-8 text-xs bg-white" value={formData.delivery_city || ""} onChange={e => setFormData({...formData, delivery_city: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-4 md:col-span-1">
              <Label className="text-xs text-muted-foreground">UF</Label>
              <Input className="h-8 text-xs bg-white" maxLength={2} value={formData.delivery_state || ""} onChange={e => setFormData({...formData, delivery_state: e.target.value.toUpperCase()})} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-6">
            <div className="col-span-2 md:col-span-6 mb-[-10px]"><h3 className="text-xs font-semibold uppercase text-slate-500">Volume e Dimensões (Cálculo Automático)</h3></div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Qtd (Vol)</Label>
              <Input type="number" className="h-9" value={formData.volumes_quantity ?? ""} onChange={e => setFormData({...formData, volumes_quantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Peso (Kg)</Label>
              <Input type="number" step="0.01" className="h-9" value={formData.gross_weight ?? ""} onChange={e => setFormData({...formData, gross_weight: parseFloat(e.target.value.replace(',', '.')) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Altura (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_height ?? ""} onChange={e => setFormData({...formData, package_height: parseFloat(e.target.value.replace(',', '.')) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Largura (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_width ?? ""} onChange={e => setFormData({...formData, package_width: parseFloat(e.target.value.replace(',', '.')) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Comp. (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_length ?? ""} onChange={e => setFormData({...formData, package_length: parseFloat(e.target.value.replace(',', '.')) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Frete Cobrado</Label>
              <CurrencyInput className="h-9 bg-white" value={formData.freight_cost || 0} onChange={v => setFormData({...formData, freight_cost: v})} />
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
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-8 mt-0">
          <section className="bg-white p-6 rounded-xl border">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Flame className="size-4 text-orange-500" /> Detalhamento Financeiro (Restrito)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Custos e Acréscimos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">Subtotal Produtos:</span> 
                      <span className="font-medium">{formatCurrency(itemsTotalGross)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Desconto nos Itens</span>
                      <span className="text-red-500 font-medium">- {formatCurrency(itemsDiscountTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Desconto Adicional (Venda)</span>
                      <span className="text-red-500 font-medium">- {formatCurrency(saleDiscount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Frete / Outras Despesas</span>
                      <span className="text-emerald-600 font-medium">+ {formatCurrency((freight + otherExpenses))}</span>
                    </div>
                    <div className="pt-3 border-t flex justify-between items-center font-bold text-slate-800">
                      <span>Total Final Cobrado</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-700 mb-3">Comissionamento</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-800 font-medium">Comissão Total Prevista</span>
                      <span className="font-bold text-purple-900">Calculada automaticamente</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">A comissão é calculada com base na taxa cadastrada no perfil do vendedor associado a este pedido (Representante). Ela incidirá sobre o valor final do pedido.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        </Tabs>
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
                                        <span className="text-[10px] text-muted-foreground">Custo: {formatCurrency(p.cost_price)} | Venda: {formatCurrency(p.price)}</span>
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
                        <CurrencyInput placeholder="Custo" value={cust.cost || 0} onChange={v => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].cost = v;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs text-center px-1" />
                      </div>
                      
                      <div className="w-20">
                        <CurrencyInput placeholder="Venda" value={cust.price || 0} onChange={v => {
                          const newC = [...(items[activeCustomizationIndex].customizations || [])];
                          newC[cIdx].price = v;
                          updateItem(activeCustomizationIndex, "customizations", newC);
                        }} className="h-8 text-xs text-center font-medium text-blue-600 px-1" />
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

        <Dialog open={blocker.status === "blocked"} onOpenChange={(open) => { if (!open) blocker.reset(); }}>
          <DialogContent className="sm:max-w-[380px] p-6 text-center">
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-center w-full">Alterações não salvas</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-sm text-muted-foreground text-center">
              Você tem alterações não salvas no pedido. O que deseja fazer?
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:justify-center w-full mt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  const saved = await handleSubmit();
                  if (saved) {
                    blocker.proceed();
                  } else {
                    blocker.reset();
                  }
                }}
              >
                Salvar e Sair
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  isSubmittedRef.current = true;
                  setIsSubmitted(true);
                  blocker.proceed();
                }}
              >
                Descartar e Sair
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => blocker.reset()}
              >
                Continuar Editando
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ClientFormDrawer
          open={clientDrawerOpen}
          onOpenChange={setClientDrawerOpen}
          client={editingClient}
          onSuccess={(newClient) => {
            setFormData(prev => ({ ...prev, client_id: newClient.id }));
          }}
        />
      </div>
    </div>
  );
}
