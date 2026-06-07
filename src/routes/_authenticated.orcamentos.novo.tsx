import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/lib/api/clients";
import { useProducts, Product } from "@/lib/api/products";
import { useCreateQuote, QuoteItem } from "@/lib/api/quotes";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, ArrowLeft, Wand2, Check, ChevronsUpDown, AlertTriangle, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/orcamentos/novo")({
  head: () => ({ meta: [{ title: "Novo Orçamento · e-roupas OS" }] }),
  component: NewQuotePage,
});

function NewQuotePage() {
  const navigate = useNavigate();
  const createMutation = useCreateQuote();
  const { data: clients } = useClients();
  const { data: products } = useProducts();
  const [brands, setBrands] = useState<{id: string, name: string, code: string}[]>([]);

  useEffect(() => {
    supabase.from("brands").select("id, name, code").then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  const [formData, setFormData] = useState({
    client_id: "",
    brand_id: "",
    seller_id: "",
    discount: 0,
    other_expenses: 0,
    freight_cost: 0,
    validity_days: 15,
    payment_condition: "",
    payment_method: "PIX",
    notes: "",
    internal_notes: "",
  });

  const [items, setItems] = useState<Partial<QuoteItem>[]>([]);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);

  const addItem = () => {
    setItems([...items, { product_name: "", sku: "", quantity: 1, unit_cost: 0, list_price: 0, discount_percent: 0, unit_price: 0, customizations: [] }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    if (field === "product_id" && products) {
      const p = products.find(prod => prod.id === value);
      if (p) {
        item.product_name = p.name;
        item.sku = p.sku || "";
        item.list_price = p.price;
        item.unit_price = p.price;
        item.unit_cost = p.cost_price || 0;
        // Add customizations cost from product BOM
        if (p.customizations && p.customizations.length > 0) {
          item.customizations = p.customizations;
          const custCost = p.customizations.reduce((acc: number, c: any) => acc + (Number(c.cost || 0) * Number(c.quantity || 1)), 0);
          item.unit_cost = (p.cost_price || 0) + custCost;
        }
      }
    }
    if (field === "customizations") item.customizations = value;

    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    const custSum = (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.price || 0) * Number(c.quantity || 1)), 0);
    if (field !== "unit_price") {
      item.unit_price = lp - (lp * (dp / 100)) + custSum;
    }

    // Recalc unit_cost from customizations
    if (field === "customizations") {
      const baseCost = products?.find(p => p.id === item.product_id)?.cost_price || 0;
      const custCost = (item.customizations || []).reduce((acc: number, c: any) => acc + (Number(c.cost || 0) * Number(c.quantity || 1)), 0);
      item.unit_cost = baseCost + custCost;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  // Calculations
  const itemsTotalList = items.reduce((acc, item) => acc + (Number(item.list_price || 0) * Number(item.quantity || 0)), 0);
  const itemsTotalNet = items.reduce((acc, item) => acc + (Number(item.unit_price || 0) * Number(item.quantity || 0)), 0);
  const totalCost = items.reduce((acc, item) => acc + (Number(item.unit_cost || 0) * Number(item.quantity || 0)), 0);
  const saleDiscount = Number(formData.discount || 0);
  const otherExpenses = Number(formData.other_expenses || 0);
  const freight = Number(formData.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;
  const grossMargin = finalTotal > 0 ? ((finalTotal - totalCost) / finalTotal) * 100 : 0;

  const handleSubmit = async (status: string = "rascunho") => {
    if (!formData.client_id) { toast.error("Cliente é obrigatório."); return; }
    try {
      await createMutation.mutateAsync({
        ...formData,
        status: status as any,
        estimated_total: itemsTotalList,
        total_cost: totalCost,
        final_total: finalTotal,
        gross_margin_pct: grossMargin,
        items: items as QuoteItem[],
      });
      toast.success(status === "enviado" ? "Orçamento enviado!" : "Orçamento salvo como rascunho!");
      navigate({ to: "/orcamentos" });
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/orcamentos" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></Link>
            <h1 className="text-xl font-semibold text-slate-800">Novo Orçamento</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/orcamentos"><Button variant="outline" className="h-9 px-6 rounded-full">Cancelar</Button></Link>
            <Button variant="outline" onClick={() => handleSubmit("rascunho")} disabled={createMutation.isPending} className="h-9 px-6 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50">
              Salvar Rascunho
            </Button>
            <Button onClick={() => handleSubmit("enviado")} disabled={createMutation.isPending} className="h-9 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Enviar ao Cliente
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* MARGIN INTELLIGENCE PANEL */}
        <div className={cn(
          "rounded-2xl border-2 p-5 flex items-center justify-between gap-6",
          grossMargin < 0 ? "border-red-400 bg-red-50" : grossMargin < 15 ? "border-amber-400 bg-amber-50" : "border-emerald-400 bg-emerald-50"
        )}>
          <div className="flex items-center gap-3">
            {grossMargin < 15 ? <AlertTriangle className={cn("size-6", grossMargin < 0 ? "text-red-600" : "text-amber-600")} /> : <TrendingUp className="size-6 text-emerald-600" />}
            <div>
              <p className="text-sm font-semibold">Margem Bruta Estimada</p>
              <p className="text-xs text-muted-foreground">Custo total: {formatCurrency(totalCost)} | Venda: {formatCurrency(finalTotal)}</p>
            </div>
          </div>
          <div className={cn("text-3xl font-bold tracking-tight", grossMargin < 0 ? "text-red-600" : grossMargin < 15 ? "text-amber-600" : "text-emerald-600")}>
            {grossMargin.toFixed(1)}%
          </div>
        </div>

        {/* CLIENT DATA */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Dados do cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Cliente *</Label>
              <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
                <SelectContent>{clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vendedor</Label>
              <Input className="h-9 bg-white" placeholder="Nome do vendedor" value={formData.seller_id} onChange={e => setFormData({ ...formData, seller_id: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Marca</Label>
              <Select value={formData.brand_id} onValueChange={(v) => setFormData({ ...formData, brand_id: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Selecione a marca" /></SelectTrigger>
                <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* ITEMS */}
        <section>
          <div className="flex items-center gap-6 border-b border-blue-600/20 mb-4">
            <div className="px-1 py-2 border-b-2 border-blue-600 text-blue-700 text-sm font-medium">Itens do orçamento</div>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden mb-3">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium w-8">#</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium w-28">Composição</th>
                  <th className="px-4 py-3 font-medium w-20">Qtd</th>
                  <th className="px-4 py-3 font-medium w-24">Custo un.</th>
                  <th className="px-4 py-3 font-medium w-24">Preço lista</th>
                  <th className="px-4 py-3 font-medium w-20">Desc%</th>
                  <th className="px-4 py-3 font-medium w-24">Preço un.</th>
                  <th className="px-4 py-3 font-medium w-24">Total</th>
                  <th className="px-4 py-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-400 bg-slate-100/50 text-center">{idx + 1}</td>
                    <td className="px-4 py-2">
                      <Select value={item.product_id || ""} onValueChange={(v) => updateItem(idx, "product_id", v)}>
                        <SelectTrigger className="h-8 border-transparent hover:border-input bg-transparent shadow-none"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>{products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="outline" size="sm" onClick={() => setActiveCustomizationIndex(idx)} className="h-8 text-xs border-dashed text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full">
                        <Wand2 className="size-3 mr-1" /> {(item.customizations || []).length}
                      </Button>
                    </td>
                    <td className="px-4 py-2"><Input type="number" className="h-8 text-right" value={item.quantity || ""} onChange={e => updateItem(idx, "quantity", parseFloat(e.target.value))} /></td>
                    <td className="px-4 py-2 text-right text-xs text-muted-foreground font-mono">{(item.unit_cost || 0).toFixed(2)}</td>
                    <td className="px-4 py-2"><Input type="number" step="0.01" className="h-8 text-right" value={item.list_price || ""} onChange={e => updateItem(idx, "list_price", parseFloat(e.target.value))} /></td>
                    <td className="px-4 py-2"><Input type="number" step="0.01" className="h-8 text-right" value={item.discount_percent || ""} onChange={e => updateItem(idx, "discount_percent", parseFloat(e.target.value))} /></td>
                    <td className="px-4 py-2"><Input type="number" step="0.01" className="h-8 text-right" value={item.unit_price || ""} onChange={e => updateItem(idx, "unit_price", parseFloat(e.target.value))} /></td>
                    <td className="px-4 py-2 text-right font-medium">{(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right"><Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeItem(idx)}><Trash2 className="size-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <div className="text-center py-8 text-sm text-slate-500">Nenhum item adicionado.</div>}
          </div>
          <Button variant="outline" size="sm" onClick={addItem} className="text-blue-700 border-blue-600/30 hover:bg-blue-50"><Plus className="size-4 mr-1.5" /> Adicionar item</Button>
        </section>

        {/* TOTALS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Totais</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Desconto R$</Label>
              <Input type="number" className="h-9" value={formData.discount || ""} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Outras despesas</Label>
              <Input type="number" className="h-9" value={formData.other_expenses || ""} onChange={e => setFormData({...formData, other_expenses: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Frete R$</Label>
              <Input type="number" className="h-9" value={formData.freight_cost || ""} onChange={e => setFormData({...formData, freight_cost: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Validade (dias)</Label>
              <Input type="number" className="h-9" value={formData.validity_days || ""} onChange={e => setFormData({...formData, validity_days: parseInt(e.target.value) || 15})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Total do orçamento</Label>
              <div className="h-9 px-3 flex items-center font-bold bg-slate-100 rounded-md text-sm border text-slate-800">{finalTotal.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* PAYMENT & NOTES */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Pagamento e Observações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Condição de pagamento</Label>
              <Input className="h-9" value={formData.payment_condition || ""} onChange={e => setFormData({...formData, payment_condition: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Forma de pagamento</Label>
              <Select value={formData.payment_method || ""} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="PIX">PIX</SelectItem><SelectItem value="Boleto">Boleto</SelectItem><SelectItem value="Cartão">Cartão</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Observações (impressas no orçamento)</Label>
              <Textarea className="min-h-[80px] resize-y" value={formData.notes || ""} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Observações internas</Label>
              <Textarea className="min-h-[80px] resize-y" value={formData.internal_notes || ""} onChange={e => setFormData({...formData, internal_notes: e.target.value})} />
            </div>
          </div>
        </section>

        {/* CUSTOMIZATIONS MODAL */}
        <Dialog open={activeCustomizationIndex !== null} onOpenChange={(open) => { if (!open) setActiveCustomizationIndex(null); }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader><DialogTitle>Composição / Personalizações da Peça</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
              {activeCustomizationIndex !== null && (
                <>
                  <div className="flex gap-2 text-xs font-semibold text-slate-500 mb-2 px-2">
                    <div className="flex-[2]">Insumo / Processo</div>
                    <div className="flex-1">Detalhes</div>
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
                              <CommandInput placeholder="Buscar..." />
                              <CommandList>
                                <CommandEmpty>Nenhum produto.</CommandEmpty>
                                <CommandGroup>
                                  {(products || []).map((p) => (
                                    <CommandItem key={p.id} value={`${p.sku || ""} ${p.name}`} onSelect={() => {
                                      const newC = [...(items[activeCustomizationIndex].customizations || [])];
                                      newC[cIdx] = { ...newC[cIdx], product_id: p.id, name: p.name, cost: p.cost_price || 0, price: p.price || 0 };
                                      updateItem(activeCustomizationIndex, "customizations", newC);
                                    }}>
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
                      <div className="flex-1"><Input placeholder="Local/Arte..." value={cust.details || ""} onChange={e => { const newC = [...(items[activeCustomizationIndex].customizations || [])]; newC[cIdx].details = e.target.value; updateItem(activeCustomizationIndex, "customizations", newC); }} className="h-8 text-xs" /></div>
                      <div className="w-20"><Input type="number" step="0.01" value={cust.cost} onChange={e => { const newC = [...(items[activeCustomizationIndex].customizations || [])]; newC[cIdx].cost = parseFloat(e.target.value) || 0; updateItem(activeCustomizationIndex, "customizations", newC); }} className="h-8 text-xs text-center" /></div>
                      <div className="w-20"><Input type="number" step="0.01" value={cust.price} onChange={e => { const newC = [...(items[activeCustomizationIndex].customizations || [])]; newC[cIdx].price = parseFloat(e.target.value) || 0; updateItem(activeCustomizationIndex, "customizations", newC); }} className="h-8 text-xs text-center font-medium text-blue-600" /></div>
                      <div className="w-16"><Input type="number" min="1" value={cust.quantity} onChange={e => { const newC = [...(items[activeCustomizationIndex].customizations || [])]; newC[cIdx].quantity = parseFloat(e.target.value) || 1; updateItem(activeCustomizationIndex, "customizations", newC); }} className="h-8 text-xs text-center" /></div>
                      <div className="w-8 flex justify-center"><Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => { const newC = [...(items[activeCustomizationIndex].customizations || [])]; newC.splice(cIdx, 1); updateItem(activeCustomizationIndex, "customizations", newC); }}><Trash2 className="size-4" /></Button></div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full border-dashed mt-2" onClick={() => {
                    const newC = [...(items[activeCustomizationIndex].customizations || []), { product_id: "", name: "", details: "", cost: 0, price: 0, quantity: 1 }];
                    updateItem(activeCustomizationIndex, "customizations", newC);
                  }}><Plus className="size-4 mr-2" /> Adicionar Material / Processo</Button>
                </>
              )}
            </div>
            <DialogFooter><Button onClick={() => setActiveCustomizationIndex(null)}>Concluído</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
