import { useState, useEffect } from "react";
import { useInventoryBatches, useCreateInventoryEntryGrid, InventoryBatch, useProductVariants, useSuppliersCRM } from "@/lib/api/inventory";
import { useProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Loader2, FileBox, MinusCircle, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAdjustInventoryBatch } from "@/lib/api/inventory";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function InventoryBatchesTab() {
  const { data: batches = [], isLoading } = useInventoryBatches();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          {/* Simple filter placeholder, we might want to filter batches by variant in a robust way */}
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar lote..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <Button onClick={() => setDrawerOpen(true)} className="h-9 inline-flex items-center gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="size-4" /> Nova Entrada (Lote)
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Lote / Data</th>
              <th className="text-left font-medium px-4 py-2.5">Variante Mestre</th>
              <th className="text-left font-medium px-4 py-2.5">Fornecedor</th>
              <th className="text-right font-medium px-4 py-2.5">Total</th>
              <th className="text-right font-medium px-4 py-2.5 text-orange-600">Reservado</th>
              <th className="text-right font-medium px-4 py-2.5 text-green-600">Disponível</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin mx-auto" /></td></tr>
            )}
            {!isLoading && batches.map(b => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-semibold">{b.batch_code}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{new Date(b.entry_date).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-primary">{b.product_variants?.sku_internal || "Sem SKU"}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {b.product_variants?.models?.name} · {b.product_variants?.fabrics?.name} · {b.product_variants?.canonical_colors?.name} · {b.product_variants?.size}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.suppliers?.name}</td>
                <td className="px-4 py-3 text-right font-medium">{b.quantity_total}</td>
                <td className="px-4 py-3 text-right font-medium text-orange-600">{b.quantity_reserved}</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{b.quantity_available}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setAdjustmentOpen(b.id)} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <MinusCircle className="size-4 mr-1.5" /> Saída
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && batches.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum lote em estoque.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <BatchFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      {adjustmentOpen && (
        <BatchAdjustmentDrawer 
          batchId={adjustmentOpen} 
          open={!!adjustmentOpen} 
          onOpenChange={(v) => { if(!v) setAdjustmentOpen(null); }} 
        />
      )}
    </div>
  );
}

function BatchFormDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const saveMutation = useCreateInventoryEntryGrid();
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliersCRM();

  const [productId, setProductId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [batchCode, setBatchCode] = useState<string>("");
  const [averageCost, setAverageCost] = useState<number>(0);
  const [qualityNotes, setQualityNotes] = useState<string>("");
  const [grid, setGrid] = useState<Record<string, number>>({
    P: 0,
    M: 0,
    G: 0,
    GG: 0,
    XG: 0
  });

  useEffect(() => {
    if (open) {
      setProductId("");
      setSupplierId("");
      setBatchCode(`LT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
      setAverageCost(0);
      setQualityNotes("");
      setGrid({
        P: 0,
        M: 0,
        G: 0,
        GG: 0,
        XG: 0
      });
    }
  }, [open]);

  const mpProducts = products.filter(p => p.format === "MP");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !supplierId || !batchCode) {
      toast.error("Preencha Produto Pai, Fornecedor e Código do Lote.");
      return;
    }

    const hasQty = Object.values(grid).some(qty => qty > 0);
    if (!hasQty) {
      toast.error("Informe a quantidade para pelo menos um tamanho na grade.");
      return;
    }
    
    try {
      await saveMutation.mutateAsync({
        product_id: productId,
        supplier_id: supplierId,
        batch_code: batchCode,
        average_cost: averageCost,
        quality_notes: qualityNotes,
        grid
      });
      toast.success("Entrada de estoque por grade realizada com sucesso!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const isPending = saveMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><FileBox className="size-5 text-indigo-600" /> Nova Entrada por Grade (MP)</SheetTitle>
            <SheetDescription>Registrar entrada de lote físico gerando variantes automáticas.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-5">
            <div className="space-y-2">
              <Label>Produto Pai MP *</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto MP..." /></SelectTrigger>
                <SelectContent>
                  {mpProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} {p.sku ? `[${p.sku}]` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fornecedor de Origem *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger><SelectValue placeholder="Selecione o fornecedor..." /></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.company_name || s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Código do Lote *</Label>
              <Input value={batchCode} onChange={e => setBatchCode(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Custo Médio Unitário (R$)</Label>
              <Input type="number" step="0.01" value={averageCost || ""} onChange={e => setAverageCost(parseFloat(e.target.value) || 0)} />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-slate-700">Grade de Entrada (Quantidades)</Label>
              <div className="grid grid-cols-5 gap-2 border p-3 rounded-lg bg-slate-50/50">
                {Object.keys(grid).map((size) => (
                  <div key={size} className="flex flex-col items-center space-y-1">
                    <Label className="text-[10px] font-bold text-slate-500">{size}</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={grid[size] || ""}
                      onChange={(e) => setGrid({ ...grid, [size]: parseInt(e.target.value) || 0 })}
                      className="h-8 text-center text-xs p-1 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações de Qualidade</Label>
              <Textarea placeholder="Ex: Tecido com brilho conforme padrão..." value={qualityNotes} onChange={e => setQualityNotes(e.target.value)} />
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Entrada
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function BatchAdjustmentDrawer({ batchId, open, onOpenChange }: { batchId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const adjustMutation = useAdjustInventoryBatch();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }
    if (!notes) {
      toast.error("Informe um motivo para a saída.");
      return;
    }
    
    try {
      await adjustMutation.mutateAsync({
        batch_id: batchId,
        quantity: quantity,
        notes: notes,
        type: 'saída'
      });
      toast.success("Saída registrada com sucesso!");
      onOpenChange(false);
      setQuantity(1);
      setNotes("");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const isPending = adjustMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-red-600"><MinusCircle className="size-5" /> Saída / Baixa Manual</SheetTitle>
            <SheetDescription>Registre uma saída manual deste lote (brinde, defeito, perda, ajuste).</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-5">
            <div className="space-y-2">
              <Label>Quantidade a Baixar *</Label>
              <Input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
            </div>

            <div className="space-y-2">
              <Label>Motivo da Saída *</Label>
              <Textarea placeholder="Ex: Peça descartada por defeito de fábrica..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Saída
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
