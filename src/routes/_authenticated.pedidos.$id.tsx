import { createFileRoute, useNavigate, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients, useBrands } from "@/lib/api/clients";
import { useSuppliers } from "@/lib/api/inventory";
import { Switch } from "@/components/ui/switch";
import { useProducts, Product } from "@/lib/api/products";
import { useUpdateOrder, OrderItem, OrderPayload } from "@/lib/api/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, ArrowLeft, Wand2, Check, ChevronsUpDown, Save, Printer, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreateProductFromBOM } from "@/lib/api/products";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

export function SearchableCombobox({ items, value, onChange, placeholder, minChars = 3 }: { items: {id: string, name: string}[], value: string, onChange: (v: string) => void, placeholder: string, minChars?: number }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const displayItems = search.length >= minChars ? items : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-9 px-3 bg-white font-normal", !value && "text-muted-foreground")}>
          <span className="truncate">{value ? items.find((i) => i.id === value)?.name : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Digite ${minChars} letras...`} onValueChange={setSearch} value={search} />
          <CommandList>
            {search.length < minChars && <div className="p-4 text-center text-sm text-muted-foreground">Digite pelo menos {minChars} letras para buscar.</div>}
            {search.length >= minChars && displayItems.length === 0 && <CommandEmpty>Nenhum resultado.</CommandEmpty>}
            {search.length >= minChars && (
              <CommandGroup>
                {displayItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
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

export const Route = createFileRoute("/_authenticated/pedidos/$id")({
  head: () => ({ meta: [{ title: "Editar Pedido · e-roupas OS" }] }),
  component: EditOrderPage,
});

function EditOrderPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateOrder();
  const createProductMutation = useCreateProductFromBOM();
  
  const { data: clients } = useClients();
  const carriers = (clients || []).filter((c: any) => c.entity_type === "transportadora");
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
    seller_id: "",
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
    items: [],
  });

  const [items, setItems] = useState<Partial<OrderItem>[]>([]);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);
  const [printLayout, setPrintLayout] = useState<"none" | "pedido" | "etiqueta">("none");
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [payments, setPayments] = useState<any[]>([]);
  const [installmentsCount, setInstallmentsCount] = useState(1);

  useEffect(() => {
    if (formData.client_id && clients && !loadingOrder) {
      const selectedClient = clients.find(c => c.id === formData.client_id);
      if (selectedClient && !formData.delivery_zip) {
        setFormData(prev => ({
          ...prev,
          delivery_name: prev.delivery_name || selectedClient.name || "",
          delivery_document: prev.delivery_document || selectedClient.document || "",
          delivery_phone: prev.delivery_phone || selectedClient.phone || "",
          delivery_zip: prev.delivery_zip || selectedClient.zip_code || "",
          delivery_street: prev.delivery_street || selectedClient.street || "",
          delivery_number: prev.delivery_number || selectedClient.number || "",
          delivery_complement: prev.delivery_complement || selectedClient.complement || "",
          delivery_neighborhood: prev.delivery_neighborhood || selectedClient.neighborhood || "",
          delivery_city: prev.delivery_city || selectedClient.city || "",
          delivery_state: prev.delivery_state || selectedClient.state || ""
        }));
      }
    }
  }, [formData.client_id, clients, loadingOrder]);

  useEffect(() => {
    supabase.from("orders").select("*, order_items(*), order_payments(*)").eq("id", id).single().then(({ data }) => {
      if (data) {
        setFormData({
          ...data,
          client_id: data.client_id || "",
          brand_id: data.brand_id || "",
          origin_channel: data.origin_channel || "Internet",
          sale_date: data.sale_date ? data.sale_date.substring(0, 10) : "",
          departure_date: data.departure_date ? data.departure_date.substring(0, 10) : "",
          expected_date: data.expected_date ? data.expected_date.substring(0, 10) : "",
          mix_fabrics_allowed: data.mix_fabrics_allowed || false,
        });
        
        if (data.order_payments && data.order_payments.length > 0) {
          setPayments(data.order_payments.map((p: any) => ({
            ...p,
            due_date: p.due_date ? p.due_date.substring(0, 10) : ""
          })));
          setInstallmentsCount(data.order_payments.length);
        } else {
          setPayments([{ amount: data.final_total || 0, payment_method: data.payment_method || "PIX", installments: 1, due_date: data.sale_date ? data.sale_date.substring(0, 10) : new Date().toISOString().split("T")[0], status: "pendente", notes: "" }]);
          setInstallmentsCount(1);
        }

        if (data.order_items) {
          const grouped: any[] = [];
          data.order_items.forEach((item: any) => {
            const existing = grouped.find(g => 
              g.product_id === item.product_id && 
              g.gender === item.gender && 
              g.art_code === item.art_code &&
              JSON.stringify(g.customizations) === JSON.stringify(item.customizations) &&
              g.unit_price === item.unit_price &&
              g.list_price === item.list_price
            );
            
            if (existing) {
              if (item.size) {
                existing.sizes[item.size] = (existing.sizes[item.size] || 0) + (item.quantity || 0);
                if (!existing.active_sizes.includes(item.size)) {
                  existing.active_sizes.push(item.size);
                }
                if (INFANTIL_SIZES.includes(item.size)) {
                  existing.grid_type = "infantil";
                }
              }
            } else {
              const sizes = {
                "2": 0, "4": 0, "6": 0, "8": 0, "10": 0, "12": 0, "14": 0, "16": 0,
                PP: 0, P: 0, M: 0, G: 0, GG: 0, XG: 0, G1: 0, G2: 0, G3: 0, G4: 0
              };
              let grid_type = "adulto";
              let active_sizes: string[] = [];
              if (item.size) {
                (sizes as any)[item.size] = item.quantity || 0;
                active_sizes.push(item.size);
                if (INFANTIL_SIZES.includes(item.size)) {
                  grid_type = "infantil";
                }
              }
              let baseSku = item.sku || "";
              if (item.art_code && baseSku.includes(item.art_code)) {
                // remove art_code from sku to show just the base sku in the input
                const parts = baseSku.split("-");
                if (parts[0] === item.art_code || parts[0] === "PF") {
                  parts.shift(); // remove PF or art_code
                  if (parts[0] === item.art_code) parts.shift(); // just in case it's PF-ART
                  baseSku = parts.join("-");
                }
                // strip size and brand from end
                const p = baseSku.split("-");
                if (p.length >= 3) {
                  baseSku = p.slice(0, -2).join("-");
                }
              } else {
                const parts = baseSku.split("-");
                if (parts.length >= 4 && parts[0] === "PF") {
                  baseSku = parts.slice(0, -2).join("-");
                  baseSku = baseSku.replace("PF-", "PA-");
                }
              }
              grouped.push({
                product_id: item.product_id,
                product_name: item.product_name,
                sku: baseSku,
                art_code: item.art_code || "",
                gender: item.gender || "Unissex",
                grid_type,
                list_price: item.list_price || 0,
                discount_percent: item.discount_percent || 0,
                unit_price: item.unit_price || 0,
                customizations: item.customizations || [],
                sizes,
                active_sizes
              });
            }
          });
          setItems(grouped);
        }
      }
      setLoadingOrder(false);
    });
  }, [id]);

  const emptySizes = {
    "2": 0, "4": 0, "6": 0, "8": 0, "10": 0, "12": 0, "14": 0, "16": 0,
    PP: 0, P: 0, M: 0, G: 0, GG: 0, XG: 0, G1: 0, G2: 0, G3: 0, G4: 0
  };

  const addItem = () => {
    setItems([...items, {
      product_id: "",
      product_name: "",
      sku: "",
      art_code: "",
      gender: "Unissex",
      grid_type: "adulto",
      list_price: 0,
      discount_percent: 0,
      unit_price: 0,
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
        item.product_name = p.name;
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
    if (loadingOrder) return;
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
  }, [installmentsCount, finalTotal, loadingOrder]);

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

  const updatePaymentField = (idx: number, field: string, value: any) => {
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
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        id,
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
      toast.success("Pedido atualizado com sucesso!");
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

  const handlePrint = (layout: "pedido" | "etiqueta") => {
    setPrintLayout(layout);
    setTimeout(() => {
      window.print();
      setPrintLayout("none");
    }, 100);
  };

  if (loadingOrder) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className={cn("min-h-screen bg-slate-50 pb-20", printLayout !== "none" && "no-print")}>
        <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/pedidos" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-xl font-semibold text-slate-800">
              {formData.status === "orcamento" ? "Orçamento -" : "Pedido de venda -"} {formData.code}
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
            {formData.status === "orcamento" && (
              <Button 
                variant="outline" 
                className="h-7 px-3 text-xs rounded-full border-primary text-primary hover:bg-primary/5" 
                onClick={() => {
                  setFormData({ ...formData, status: "atendimento" });
                  toast.info("Clique em Salvar Alterações para confirmar a transformação em pedido.");
                }}
              >
                Transformar em Pedido
              </Button>
            )}
            
            <Button variant="outline" className="h-7 px-3 text-xs rounded-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" onClick={() => {
              const url = `${window.location.origin}/print/${id}`;
              const text = `Olá! Segue o link para visualizar o ${formData.status === "orcamento" ? "orçamento" : "pedido"} ${formData.code}:\n\n${url}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}>
              WhatsApp
            </Button>

            <Button variant="outline" className="h-7 px-3 text-xs rounded-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => handlePrint("pedido")}>
              <Printer className="size-3.5 mr-1.5" /> Imprimir Pedido
            </Button>
            <Button variant="outline" className="h-7 px-3 text-xs rounded-full border-purple-600 text-purple-600 hover:bg-purple-50" onClick={() => handlePrint("etiqueta")}>
              <Tag className="size-3.5 mr-1.5" /> Etiqueta de Envio
            </Button>
            <Link to="/pedidos">
              <Button variant="outline" className="h-7 px-4 text-xs rounded-full border-green-600 text-green-700 hover:bg-green-50">Cancelar</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-7 px-5 text-xs rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
              {updateMutation.isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Salvar Alterações
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
              <SearchableCombobox
                items={(clients || []).map(c => ({ id: c.id, name: `${c.name} ${c.company_name ? `(${c.company_name})` : ''}` }))}
                value={formData.client_id}
                onChange={(v) => setFormData({ ...formData, client_id: v })}
                placeholder="Selecione um cliente"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Canal de Origem *</Label>
              <Select value={formData.origin_channel || "Internet"} onValueChange={(v) => setFormData({ ...formData, origin_channel: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internet">Internet</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                  <SelectItem value="Reparação">Reparação</SelectItem>
                  <SelectItem value="Dropshipping">Dropshipping</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Representante">Representante</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vendedor</Label>
              <SearchableCombobox
                items={(clients || []).filter(c => c.entity_type === "vendedor").map(c => ({ id: c.id, name: c.name }))}
                value={formData.seller_id || ""}
                onChange={(v) => setFormData({ ...formData, seller_id: v })}
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
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-3 font-medium w-8 text-center">#</th>
                  <th className="px-2 py-3 font-medium min-w-[150px]">Descrição</th>
                  <th className="px-2 py-3 font-medium w-28">Cód. Arte</th>
                  <th className="px-2 py-3 font-medium w-32">Código Base</th>
                  <th className="px-2 py-3 font-medium w-28">Gênero</th>
                  <th className="px-2 py-3 font-medium w-24 text-center">Pers.</th>
                  <th className="px-2 py-3 font-medium w-28">Grade</th>
                  <th className="px-2 py-3 font-medium min-w-[320px]">Quantidades por Tamanho</th>
                  <th className="px-2 py-3 font-medium w-16 text-center bg-slate-100/30">Qtd</th>
                  <th className="px-2 py-3 font-medium w-28 text-right">Lista</th>
                  <th className="px-2 py-3 font-medium w-20 text-right">Desc%</th>
                  <th className="px-2 py-3 font-medium w-28 text-right font-semibold">Unit</th>
                  <th className="px-2 py-3 font-medium w-32 text-right font-bold">Total</th>
                  <th className="px-2 py-3 font-medium w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {items.map((item, idx) => {
                  const qtyTotal = getItemQuantity(item);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-2 py-2 text-slate-400 bg-slate-100/50 text-center">{idx + 1}</td>
                      <td className="px-2 py-2">
                        <SearchableCombobox
                          items={(products || []).map(p => ({ id: p.id, name: p.name }))}
                          value={item.product_id || ""}
                          onChange={(v) => updateItem(idx, "product_id", v)}
                          placeholder="Selecione..."
                        />
                      </td>
                      <td className="px-2 py-2"><Input className="h-8 text-xs font-mono border-green-500/50 bg-green-50/30 placeholder:text-green-600/40" placeholder="ex: CLV003" value={item.art_code || ""} onChange={e => updateItem(idx, "art_code", e.target.value.toUpperCase())} /></td>
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
                        <div className="flex flex-wrap gap-1 items-end">
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
                      <td className="px-2 py-2 text-center font-semibold text-slate-600 bg-slate-50/50">{qtyTotal}</td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs bg-white min-w-[90px] w-full" value={item.list_price || ""} onChange={e => updateItem(idx, "list_price", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs bg-white min-w-[80px] w-full" value={item.discount_percent || ""} onChange={e => updateItem(idx, "discount_percent", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2"><Input type="number" step="0.01" className="h-8 text-right text-xs font-medium text-slate-700 bg-white min-w-[90px] w-full" value={item.unit_price || ""} onChange={e => updateItem(idx, "unit_price", parseFloat(e.target.value))} /></td>
                      <td className="px-2 py-2 text-right font-bold text-slate-900 bg-slate-50/30">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(qtyTotal * Number(item.unit_price || 0))}</td>
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
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground text-blue-600">Pedido de compra</Label>
              <Input className="h-9" value={formData.purchase_order || ""} onChange={e => setFormData({...formData, purchase_order: e.target.value})} />
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
                    <td className="px-4 py-2"><Input type="number" step="0.01" className="h-8" value={p.amount || ""} onChange={e => updatePaymentAmount(idx, parseFloat(e.target.value) || 0)} /></td>
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
                 R$ {payments.reduce((acc, p) => acc + (p.amount || 0), 0).toFixed(2)}
               </span>
               <span className="text-slate-400 mx-1">/</span>
               <span className="text-slate-600">Total: R$ {finalTotal.toFixed(2)}</span>
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
                items={(carriers || []).map((c: any) => ({ id: c.name, name: c.name }))}
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
              <Input type="number" className="h-9" value={formData.volumes_quantity || ""} onChange={e => setFormData({...formData, volumes_quantity: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Peso (Kg)</Label>
              <Input type="number" step="0.01" className="h-9" value={formData.gross_weight || ""} onChange={e => setFormData({...formData, gross_weight: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Altura (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_height || ""} onChange={e => setFormData({...formData, package_height: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Largura (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_width || ""} onChange={e => setFormData({...formData, package_width: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Comp. (cm)</Label>
              <Input type="number" step="0.1" className="h-9" value={formData.package_length || ""} onChange={e => setFormData({...formData, package_length: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground text-blue-600">Frete Cobrado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                <Input type="number" step="0.01" className="h-9 pl-8" value={formData.freight_cost || ""} onChange={e => setFormData({...formData, freight_cost: parseFloat(e.target.value) || 0})} />
              </div>
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

      {/* PRINT LAYOUT: PEDIDO (A4) */}
      {printLayout === "pedido" && (
        <div className="print-only p-8 text-black bg-white max-w-[210mm] mx-auto min-h-[297mm]">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
            <div>
              <img src="/logo.png" alt="Logo" className="h-10 object-contain mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <p className="text-sm font-bold">E-roupas Lab Têxtil Ltda.</p>
              <p className="text-xs text-gray-600">CNPJ: 18.288.318/0001-85 | (43) 3357-0809</p>
              <p className="text-xs text-gray-600">Rua Etienne Lenoir, 71 - Industrial - Londrina - PR - CEP 86063-380</p>
              <p className="text-xs text-gray-600">Pedido de Venda / Ordem de Produção</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">{formData.code}</p>
              <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Dados do Cliente</h3>
              <p><strong>Nome:</strong> {clients?.find(c => c.id === formData.client_id)?.name}</p>
              <p><strong>Empresa:</strong> {clients?.find(c => c.id === formData.client_id)?.company_name || "-"}</p>
              <p><strong>Marca (Brand):</strong> {brands?.find(b => b.id === formData.brand_id)?.name}</p>
            </div>
            <div>
              <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Informações Comerciais</h3>
              <p><strong>Vendedor:</strong> {formData.seller_id || "Não informado"}</p>
              <p><strong>Previsão Entrega:</strong> {formData.expected_date ? new Date(formData.expected_date).toLocaleDateString("pt-BR") : "-"}</p>
              <p><strong>Frete:</strong> {formData.freight_payer} | <strong>Transp:</strong> {formData.carrier_name || "Correios/Retirada"}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Itens do Pedido (Ficha Técnica)</h3>
            <table className="w-full text-sm text-left border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 w-12">Qtd</th>
                  <th className="border border-gray-300 p-2">Produto Base</th>
                  <th className="border border-gray-300 p-2">Detalhes</th>
                  <th className="border border-gray-300 p-2 w-24 text-right">Unit R$</th>
                  <th className="border border-gray-300 p-2 w-24 text-right">Total R$</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const hasCustomizations = item.customizations && item.customizations.length > 0;
                  const sizesObj = item.sizes || {};
                  const sizesEntries = Object.entries(sizesObj).filter(([k, v]) => Number(v) > 0);
                  const qtyTotal = sizesEntries.length > 0 ? sizesEntries.reduce((acc, [_, v]) => acc + Number(v), 0) : Number(item.quantity || 0);
                  
                  return (
                    <tr key={i} className="print-break-inside-avoid">
                      <td className="border border-gray-300 p-2 align-top text-center font-bold">{qtyTotal}</td>
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-semibold">{item.product_name}</div>
                        {sizesEntries.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1">
                            {sizesEntries.map(([sz, q]) => {
                              let itemSku = item.sku || "";
                              if (itemSku.startsWith("PA-")) {
                                itemSku = itemSku.replace("PA-", `${item.art_code}-`);
                              } else {
                                itemSku = `${item.art_code}-${itemSku}`;
                              }
                              const brandObj = brands.find(b => b.id === formData.brand_id);
                              const brandCode = brandObj?.code || "CLI";
                              const finalSku = `${itemSku}-${sz}-${brandCode}`.toUpperCase();
                              
                              return (
                                <div key={sz} className="text-[10px] text-slate-600 font-mono">
                                  [{finalSku}] — <strong className="text-black">Qtd: {String(q)}</strong>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 align-top">
                        {hasCustomizations ? (
                          <div className="text-xs space-y-1">
                            {item.customizations?.map((cust: any, ci: number) => (
                              <div key={ci}>• {cust.quantity}x {cust.name} {cust.details ? `(${cust.details})` : ""}</div>
                            ))}
                          </div>
                        ) : <span className="text-gray-400 text-xs">Liso / Sem personalização</span>}
                      </td>
                      <td className="border border-gray-300 p-2 align-top text-right number">{(item.unit_price || 0).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td>
                      <td className="border border-gray-300 p-2 align-top text-right number">{((item.unit_price || 0) * qtyTotal).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-sm">
              <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Observações Impressas</h3>
              <p className="whitespace-pre-wrap">{formData.notes || "Nenhuma observação."}</p>
            </div>
            <div className="text-right text-sm">
              <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Subtotal Produtos:</span> <span>R$ {itemsTotalNet.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
              <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Descontos:</span> <span>- R$ {saleDiscount.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
              <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Frete/Outros:</span> <span>+ R$ {(freight + otherExpenses).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
              <div className="flex justify-between py-2 text-lg font-bold"><span>Total Final:</span> <span>R$ {finalTotal.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-16 border-t border-gray-300 pt-4">
            Documento gerado pelo sistema ERP em {new Date().toLocaleString("pt-BR")}
          </div>
        </div>
      )}

      {/* PRINT LAYOUT: ETIQUETA DE ENVIO (Térmica 100x150mm) */}
      {printLayout === "etiqueta" && (
        <div className="print-only text-black bg-white" style={{ width: "100mm", minHeight: "150mm", padding: "8mm", margin: "0 auto", border: "1px solid #ccc" }}>
          <div className="border-b-2 border-black pb-2 mb-2 flex flex-col items-center">
            <img src="/logo.png" alt="Logo" className="h-6 object-contain mb-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <p className="text-xs font-bold mt-1">E-roupas Lab Têxtil Ltda.</p>
            <p className="text-[10px] text-gray-600">CNPJ: 18.288.318/0001-85 | (43) 3357-0809</p>
            <p className="text-[10px] text-gray-600 text-center">Rua Etienne Lenoir, 71 - Industrial<br/>Londrina - PR - CEP 86063-380</p>
            <p className="text-center text-[10px] uppercase font-bold mt-2">Declaração de Conteúdo / Envio</p>
          </div>

          <div className="mb-4">
            <h2 className="text-[10px] uppercase text-gray-600 mb-1 border-b border-gray-300">Remetente</h2>
            <p className="text-xs font-bold">E-roupas Lab Têxtil Ltda.</p>
          </div>

          <div className="mb-4 border-2 border-black p-2 rounded">
            <h2 className="text-[10px] uppercase text-gray-600 mb-1 border-b border-gray-300">Destinatário</h2>
            <p className="text-sm font-bold uppercase">{clients?.find(c => c.id === formData.client_id)?.name}</p>
            {clients?.find(c => c.id === formData.client_id)?.company_name && (
              <p className="text-xs">A/C: {clients?.find(c => c.id === formData.client_id)?.company_name}</p>
            )}
            {/* If we had address fields in client we would print them here */}
            <p className="text-xs mt-1">(Verificar endereço no cadastro principal)</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="border border-black p-1">
              <p className="text-[10px] text-gray-600">Volumes:</p>
              <p className="font-bold text-center text-base">{formData.volumes_quantity || "1"} vol</p>
            </div>
            <div className="border border-black p-1">
              <p className="text-[10px] text-gray-600">Pedido nº:</p>
              <p className="font-bold text-center text-base">{formData.code}</p>
            </div>
            <div className="border border-black p-1 col-span-2">
              <p className="text-[10px] text-gray-600">Transportadora:</p>
              <p className="font-bold text-center uppercase">{formData.carrier_name || "Correios"}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            {/* Fake Barcode representation */}
            <div className="h-12 w-full bg-repeating-linear-gradient(to right, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px)"></div>
            <p className="text-[10px] mt-1 tracking-[0.2em]">{formData.code}</p>
          </div>
        </div>
      )}
    </>
  );
}
