import { useState, useEffect } from "react";
import { useInventoryBatches, useCreateInventoryEntryGrid, InventoryBatch, useProductVariants, useSuppliersCRM, useSoftDeleteInventoryBatches } from "@/lib/api/inventory";
import { useProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Loader2, FileBox, MinusCircle, Edit2, Trash2, CheckSquare, Columns3 } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAdjustInventoryBatch } from "@/lib/api/inventory";
import { getProductDisplayName } from "@/lib/utils/product-display";
import { supabase } from "@/lib/supabase";
import { EditBatchModal } from "@/components/inventory/EditBatchModal";

export function InventoryBatchesTab() {
  const { data: batchesRaw, isLoading, error } = useInventoryBatches();
  if (error) console.error('QUERY ERROR:', error);
  const [searchQuery, setSearchQuery] = useState("");
  const allBatches = (batchesRaw || []).filter((b:any) => b.active !== false);
  
  const batches = allBatches.filter((b:any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const v = b.product_variants || {};
    const searchString = `
      ${b.batch_code || ""} 
      ${v.sku_internal || ""} 
      ${v.models?.name || ""} 
      ${v.fabrics?.name || ""} 
      ${v.canonical_colors?.name || ""} 
      ${v.size || ""} 
      ${b.suppliers?.company_name || ""} 
      ${b.suppliers?.name || ""}
    `.toLowerCase();
    return searchString.includes(q);
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBatchForEdit, setSelectedBatchForEdit] = useState<any>(null);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["lote_data", "variante", "fornecedor", "min_stock", "total", "reservado", "disponivel", "acoes"]);
  const toggleColumn = (colId: string) => setVisibleColumns(prev => prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]);
  const deleteMutation = useSoftDeleteInventoryBatches();

  const toggleSelectAll = () => {
    if (selectedIds.length === batches.length && batches.length > 0) setSelectedIds([]);
    else setSelectedIds(batches.map((b:any) => b.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDeleteSelected = async () => {
    if (!deleteReason.trim()) return toast.error("Informe um motivo para a exclusão.");
    if (!confirm('Tem certeza que deseja excluir os lotes selecionados?')) return;
    
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({ batchIds: selectedIds, reason: deleteReason });
      toast.success("Lotes excluídos com sucesso!");
      setSelectedIds([]);
      setDeleteReason("");
    } catch (e:any) {
      toast.error("Erro ao excluir: " + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = () => {
    if (selectedIds.length !== 1) return;
    const b = batches.find((x:any) => x.id === selectedIds[0]);
    if (b) {
      setSelectedBatchForEdit(b);
      setEditModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar lote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
                  <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <Columns3 className="size-4" />
                  <span className="hidden sm:inline">Colunas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("lote_data")} onCheckedChange={() => toggleColumn("lote_data")}>Lote / Data</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("variante")} onCheckedChange={() => toggleColumn("variante")}>Variante Mestre</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("fornecedor")} onCheckedChange={() => toggleColumn("fornecedor")}>Fornecedor</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("min_stock")} onCheckedChange={() => toggleColumn("min_stock")}>Estoque Mínimo</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("total")} onCheckedChange={() => toggleColumn("total")}>Total</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("reservado")} onCheckedChange={() => toggleColumn("reservado")}>Reservado</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("disponivel")} onCheckedChange={() => toggleColumn("disponivel")}>Disponível</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("acoes")} onCheckedChange={() => toggleColumn("acoes")}>Ações</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setDrawerOpen(true)} className="h-9 inline-flex items-center gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="size-4" /> Nova Entrada (Lote)
            </Button>
          </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-slate-50 border p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="size-5 text-indigo-600" />
            <span className="text-sm font-medium">{selectedIds.length} lote(s) selecionado(s)</span>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length === 1 && (
              <Button onClick={openEdit} variant="outline" size="sm" className="h-8 gap-1.5">
                <Edit2 className="size-3.5" /> Editar
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Motivo da exclusão..." 
                value={deleteReason} 
                onChange={e => setDeleteReason(e.target.value)} 
                className="h-8 w-48 text-xs" 
              />
              <Button onClick={handleDeleteSelected} disabled={isDeleting} variant="destructive" size="sm" className="h-8 gap-1.5">
                {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 w-10 text-center">
                <input type="checkbox" checked={batches.length > 0 && selectedIds.length === batches.length} onChange={toggleSelectAll} className="rounded border-slate-300" />
              </th>
              {visibleColumns.includes("lote_data") && <th className="text-left font-medium px-4 py-2.5">Lote / Data</th>}
              {visibleColumns.includes("variante") && <th className="text-left font-medium px-4 py-2.5">Variante Mestre</th>}
              {visibleColumns.includes("fornecedor") && <th className="text-left font-medium px-4 py-2.5">Fornecedor</th>}
                {visibleColumns.includes("min_stock") && <th className="text-right font-medium px-4 py-2.5">Est. Mínimo</th>}
              {visibleColumns.includes("total") && <th className="text-right font-medium px-4 py-2.5">Total</th>}
              {visibleColumns.includes("reservado") && <th className="text-right font-medium px-4 py-2.5 text-orange-600">Reservado</th>}
              {visibleColumns.includes("disponivel") && <th className="text-right font-medium px-4 py-2.5 text-green-600">Disponível</th>}
              {visibleColumns.includes("acoes") && <th className="text-right font-medium px-4 py-2.5">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={visibleColumns.length + 1} className="px-4 py-12 text-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin mx-auto" /></td></tr>
            )}
            {!isLoading && batches.map((b:any) => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" checked={selectedIds.includes(b.id)} onChange={() => toggleSelect(b.id)} className="rounded border-slate-300" />
                </td>
                {visibleColumns.includes("lote_data") && <td className="px-4 py-3"><div className="font-mono text-xs font-semibold">{b.batch_code}</div><div className="text-xs text-muted-foreground mt-0.5">{new Date(b.entry_date).toLocaleDateString()}</div></td>}
                {visibleColumns.includes("variante") && <td className="px-4 py-3"><div className="font-medium text-primary">{b.product_variants?.sku_internal || "Sem SKU"}</div><div className="text-xs text-muted-foreground line-clamp-1">{b.product_variants?.models?.name} · {b.product_variants?.fabrics?.name} · {b.product_variants?.canonical_colors?.name} · {b.product_variants?.size}</div></td>}
                {visibleColumns.includes("fornecedor") && <td className="px-4 py-3 text-muted-foreground">{b.suppliers?.company_name || b.suppliers?.name}</td>}
                  {visibleColumns.includes("min_stock") && <td className="px-4 py-3 text-right text-muted-foreground font-medium">{b.product_variants?.min_stock || 0}</td>}
                {visibleColumns.includes("total") && <td className="px-4 py-3 text-right font-medium">{b.quantity_total}</td>}
                {visibleColumns.includes("reservado") && <td className="px-4 py-3 text-right font-medium text-orange-600">{b.quantity_reserved}</td>}
                {visibleColumns.includes("disponivel") && <td className="px-4 py-3 text-right font-medium text-green-600">
                    <div className="flex flex-col items-end gap-1">
                      <span>{b.quantity_available}</span>
                      {Number(b.quantity_available) === 0 ? (
                        <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Esgotado</span>
                      ) : Number(b.quantity_available) <= (b.product_variants?.min_stock || 0) ? (
                        <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Estoque Crítico</span>
                      ) : null}
                    </div>
                  </td>}
                {visibleColumns.includes("acoes") && <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setAdjustmentOpen(b.id)} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <MinusCircle className="size-4 mr-1.5" /> Saída
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit()} className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <Edit2 className="size-4 mr-1.5" /> Editar
                    </Button>
                  </td>}
              </tr>
            ))}
            {!isLoading && batches.length === 0 && (
              <tr><td colSpan={visibleColumns.length + 1} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum lote em estoque.</td></tr>
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
      {editModalOpen && selectedBatchForEdit && (
        <EditBatchModal 
          batch={selectedBatchForEdit} 
          open={editModalOpen} 
          onOpenChange={(v) => { if(!v) setEditModalOpen(false); }} 
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
  const [nfNumber, setNfNumber] = useState<string>("");
  const [averageCost, setAverageCost] = useState<number>(0);
  const [qualityNotes, setQualityNotes] = useState<string>("");
  const [gradeType, setGradeType] = useState<"adulto" | "infantil">("adulto");
  const [grid, setGrid] = useState<Record<string, number>>({});

  const ADULT_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
  const CHILD_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

  useEffect(() => {
    const sizes = gradeType === "adulto" ? ADULT_SIZES : CHILD_SIZES;
    const initialGrid: Record<string, number> = {};
    sizes.forEach(s => {
      initialGrid[s] = 0;
    });
    setGrid(initialGrid);
  }, [gradeType]);

  useEffect(() => {
    if (open) {
      setProductId("");
      setSupplierId("");
      setBatchCode("");
      setGradeType("adulto");
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const prefix = `LT-${year}${month}${day}-`;

      supabase
        .from("inventory_batches")
        .select("batch_code")
        .like("batch_code", `${prefix}%`)
        .then(({ data }) => {
          let nextSeq = 1;
          if (data && data.length > 0) {
            const seqs = data.map((item) => {
              const parts = item.batch_code.split("-");
              const seqStr = parts[parts.length - 1];
              return parseInt(seqStr) || 0;
            });
            nextSeq = Math.max(...seqs) + 1;
          }
          setBatchCode(`${prefix}${String(nextSeq).padStart(2, "0")}`);
        })
        .catch(() => {
          setBatchCode(`${prefix}01`);
        });
      setAverageCost(0);
      setNfNumber("");
      setQualityNotes("");
    }
  }, [open]);

  const mpProducts = products.filter((p:any) => p.format === "MP");

  const handleProductChange = (val: string) => {
    setProductId(val);
    const selectedProd = mpProducts.find((p:any) => p.id === val);
    if (selectedProd) {
      setAverageCost(selectedProd.cost_price || 0);
    }
  };

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
        nf_number: nfNumber || undefined,
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
              <Select value={productId} onValueChange={handleProductChange}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto MP..." /></SelectTrigger>
                <SelectContent>
                  {mpProducts.map((p:any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {getProductDisplayName(p)} {p.sku ? `[${p.sku}]` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fornecedor de Origem *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger><SelectValue placeholder="Selecione o fornecedor..." /></SelectTrigger>
                <SelectContent>{suppliers.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.company_name || s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Código do Lote *</Label>
              <Input value={batchCode} onChange={e => setBatchCode(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Nota Fiscal (opcional)</Label>
              <Input
                value={nfNumber}
                onChange={e => setNfNumber(e.target.value)}
                placeholder="Ex: NF-001234"
              />
            </div>

            <div className="space-y-2">
              <Label>Custo Médio Unitário (R$)</Label>
              <CurrencyInput value={averageCost} onChange={setAverageCost} />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Grade *</Label>
              <Select value={gradeType} onValueChange={(v) => setGradeType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a grade..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adulto">Grade Adulto (PP ao G4)</SelectItem>
                  <SelectItem value="infantil">Grade Infantil (2 ao 16)</SelectItem>
                </SelectContent>
              </Select>
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
        adjustment: -quantity,
        reason: notes,
        movement_type: 'ajuste_saida'
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
