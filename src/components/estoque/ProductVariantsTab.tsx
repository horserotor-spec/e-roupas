import { useState, useEffect, useMemo } from "react";
import {
  useProductVariants,
  useSaveProductVariant,
  ProductVariant,
  useModels,
  useFabrics,
  useColors,
  useAllVariantStockSummary,
  useAdjustInventoryBatch,
  useInventoryBatches,
} from "@/lib/api/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Loader2, Edit2, Layers, PackagePlus, PackageMinus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Main Tab
// ---------------------------------------------------------------------------
export function ProductVariantsTab() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"todos" | "esgotado" | "critico">("todos");
  const { data: variants = [], isLoading } = useProductVariants(search);
  const { data: stockSummary = [] } = useAllVariantStockSummary();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Partial<ProductVariant> | null>(null);

  // Adjustment modal state
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustVariant, setAdjustVariant] = useState<ProductVariant | null>(null);
  const [adjustDirection, setAdjustDirection] = useState<"entrada" | "saida">("entrada");

  const openNew = () => {
    setEditingVariant({ active: true, size: "M", gender: "Unissex" });
    setDrawerOpen(true);
  };

  const openEdit = (v: ProductVariant) => {
    setEditingVariant(v);
    setDrawerOpen(true);
  };

  const openAdjust = (v: ProductVariant, direction: "entrada" | "saida") => {
    setAdjustVariant(v);
    setAdjustDirection(direction);
    setAdjustOpen(true);
  };

  const filteredVariants = useMemo(() => {
    return variants.filter(v => {
      if (stockFilter === "todos") return true;
      
      const currentStock = (stockSummary as any[]).find((s: any) => s.variant_id === v.id)?.available_qty || 0;
      
      if (stockFilter === "esgotado") return currentStock === 0;
      if (stockFilter === "critico") {
        const minStock = Number(v.min_stock) || 0;
        return currentStock > 0 && currentStock < minStock;
      }
      return true;
    });
  }, [variants, stockFilter, stockSummary]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar SKU..."
              className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <Select value={stockFilter} onValueChange={(v: any) => setStockFilter(v)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filtro de Estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="esgotado">Esgotado (0)</SelectItem>
              <SelectItem value="critico">Estoque Crítico (Abaixo do Min)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openNew} className="h-9 inline-flex items-center gap-1.5 px-3">
          <Plus className="size-4" /> Nova Variante
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">SKU / Modelo</th>
              <th className="text-left font-medium px-4 py-2.5">Composição</th>
              <th className="text-left font-medium px-4 py-2.5">Tamanho / Gênero</th>
              <th className="text-right font-medium px-4 py-2.5">Estoque Atual</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                  Carregando variantes...
                </td>
              </tr>
            )}
            {!isLoading &&
              filteredVariants.map((v) => {
                const currentStock =
                  (stockSummary as any[]).find((s: any) => s.variant_id === v.id)?.available_qty || 0;
                return (
                  <tr key={v.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-semibold text-primary">
                        {v.sku_internal || "SEM-SKU"}
                      </div>
                      <div className="font-medium mt-0.5">{(v as any).models?.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="font-normal bg-muted/50">
                          {(v as any).fabrics?.name}
                        </Badge>
                        <Badge variant="outline" className="font-normal bg-muted/50">
                          <div
                            className="size-2.5 rounded-full border mr-1.5"
                            style={{ backgroundColor: (v as any).canonical_colors?.hex || "#ccc" }}
                          />
                          {(v as any).canonical_colors?.name}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-lg">{v.size}</div>
                      <div className="text-xs text-muted-foreground">{v.gender}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant="outline"
                        className={`font-bold text-sm px-2 py-1 ${
                          currentStock > 0
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {currentStock} un
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Inserir estoque */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openAdjust(v, "entrada")}
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-600"
                          title="Inserir estoque manualmente"
                        >
                          <PackagePlus className="size-4" />
                        </Button>
                        {/* Retirar estoque */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openAdjust(v, "saida")}
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          title="Retirar estoque manualmente"
                        >
                          <PackageMinus className="size-4" />
                        </Button>
                        {/* Editar variante */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(v)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Editar variante"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {!isLoading && variants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Nenhuma variante de produto cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VariantFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} variant={editingVariant} />

      {adjustVariant && (
        <StockAdjustModal
          open={adjustOpen}
          onOpenChange={setAdjustOpen}
          variant={adjustVariant}
          direction={adjustDirection}
          currentStock={
            (stockSummary as any[]).find((s: any) => s.variant_id === adjustVariant.id)?.available_qty || 0
          }
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stock Adjust Modal
// ---------------------------------------------------------------------------
interface StockAdjustModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ProductVariant;
  direction: "entrada" | "saida";
  currentStock: number;
}

function StockAdjustModal({ open, onOpenChange, variant, direction, currentStock }: StockAdjustModalProps) {
  const adjustMutation = useAdjustInventoryBatch();
  const { data: batches = [] } = useInventoryBatches(variant.id);

  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [movType, setMovType] = useState(direction === "entrada" ? "ajuste_entrada" : "ajuste_saida");
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const isEntrada = direction === "entrada";

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setQty("");
      setReason("");
      setMovType(isEntrada ? "ajuste_entrada" : "ajuste_saida");
      setSelectedBatchId("");
    }
  }, [open, direction]);

  // Auto-select the first active batch
  useEffect(() => {
    if (batches.length > 0 && !selectedBatchId) {
      setSelectedBatchId((batches[0] as any).id);
    }
  }, [batches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numQty = Number(qty);
    if (!numQty || numQty <= 0) return toast.error("Informe uma quantidade válida.");
    if (!reason.trim()) return toast.error("Informe o motivo do ajuste.");
    if (!selectedBatchId) return toast.error("Selecione um lote para o ajuste.");

    const adjustment = isEntrada ? numQty : -numQty;

    try {
      await adjustMutation.mutateAsync({
        batch_id: selectedBatchId,
        adjustment,
        reason,
        movement_type: movType,
      });
      toast.success(
        isEntrada
          ? `${numQty} un inseridas com sucesso!`
          : `${numQty} un retiradas com sucesso!`
      );
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const entradaTypes = [
    { value: "ajuste_entrada", label: "Ajuste de Entrada" },
    { value: "compra", label: "Compra" },
    { value: "producao", label: "Produção" },
    { value: "devolucao", label: "Devolução de Cliente" },
    { value: "transferencia_entrada", label: "Transferência (Entrada)" },
  ];

  const saidaTypes = [
    { value: "ajuste_saida", label: "Ajuste de Saída" },
    { value: "perda", label: "Perda / Avaria" },
    { value: "consumo", label: "Consumo de Produção" },
    { value: "amostra", label: "Amostra" },
    { value: "erro", label: "Erro de Cadastro" },
    { value: "transferencia_saida", label: "Transferência (Saída)" },
  ];

  const movTypes = isEntrada ? entradaTypes : saidaTypes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEntrada ? (
              <PackagePlus className="size-5 text-emerald-600" />
            ) : (
              <PackageMinus className="size-5 text-rose-600" />
            )}
            {isEntrada ? "Inserir Estoque" : "Retirar Estoque"}
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{(variant as any).models?.name}</span>
            {" — "}
            {(variant as any).canonical_colors?.name} · Tam {variant.size}
            <br />
            <span className="text-xs">
              Estoque atual:{" "}
              <span className="font-bold text-blue-600">{currentStock} un</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Lote */}
          <div className="space-y-1.5">
            <Label>Lote *</Label>
            {batches.length === 0 ? (
              <p className="text-xs text-rose-500">
                Nenhum lote ativo encontrado para esta variante. É necessário criar um lote antes de ajustar o
                estoque.
              </p>
            ) : (
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o lote..." />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b: any) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.batch_code} — {b.quantity_available} un disponíveis
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tipo de Movimento */}
          <div className="space-y-1.5">
            <Label>Tipo de Movimentação *</Label>
            <Select value={movType} onValueChange={setMovType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {movTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantidade */}
          <div className="space-y-1.5">
            <Label>Quantidade *</Label>
            <Input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Ex: 10"
              className={`border-2 ${isEntrada ? "focus:border-emerald-400" : "focus:border-rose-400"}`}
            />
            {!isEntrada && qty && Number(qty) > currentStock && (
              <p className="text-xs text-rose-500">
                ⚠ Quantidade maior que o estoque disponível ({currentStock} un).
              </p>
            )}
          </div>

          {/* Motivo */}
          <div className="space-y-1.5">
            <Label>Motivo / Observação *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo do ajuste..."
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={adjustMutation.isPending || batches.length === 0}
              className={isEntrada ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}
            >
              {adjustMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEntrada ? "Confirmar Entrada" : "Confirmar Saída"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Variant Form Drawer (unchanged)
// ---------------------------------------------------------------------------
function VariantFormDrawer({
  open,
  onOpenChange,
  variant,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: Partial<ProductVariant> | null;
}) {
  const isEditing = !!variant?.id;
  const saveMutation = useSaveProductVariant();
  const [formData, setFormData] = useState<Partial<ProductVariant>>({});

  const { data: models = [] } = useModels();
  const { data: fabrics = [] } = useFabrics();
  const { data: colors = [] } = useColors();

  useEffect(() => {
    if (open && variant) {
      setFormData(variant);
    }
  }, [open, variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model_id || !formData.fabric_id || !formData.color_id || !formData.size || !formData.gender) {
      toast.error("Preencha todos os campos obrigatórios (Modelo, Malha, Cor, Tamanho, Gênero).");
      return;
    }

    try {
      await saveMutation.mutateAsync(formData);
      toast.success(isEditing ? "Variante atualizada!" : "Variante criada!");
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
            <SheetTitle className="flex items-center gap-2">
              <Layers className="size-5 text-primary" />{" "}
              {isEditing ? "Editar Variante" : "Nova Variante Mestre"}
            </SheetTitle>
            <SheetDescription>O cadastro mestre que une modelo, malha, cor e grade.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-5">
            <div className="space-y-2">
              <Label>SKU Interno</Label>
              <Input
                value={formData.sku_internal || ""}
                onChange={(e) => setFormData({ ...formData, sku_internal: e.target.value })}
                placeholder="Ex: CAM-REG-ALG-PRE-M"
              />
            </div>

            <div className="space-y-2">
              <Label>Modelo *</Label>
              <Select
                value={formData.model_id || ""}
                onValueChange={(v) => setFormData({ ...formData, model_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Malha *</Label>
              <Select
                value={formData.fabric_id || ""}
                onValueChange={(v) => setFormData({ ...formData, fabric_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {fabrics.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor Padrão *</Label>
              <Select
                value={formData.color_id || ""}
                onValueChange={(v) => setFormData({ ...formData, color_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: m.hex || "#ccc" }} />
                        {m.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tamanho (Grade) *</Label>
                <Select
                  value={formData.size || ""}
                  onValueChange={(v) => setFormData({ ...formData, size: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "U","2","4","6","8","10","12","14","16",
                      "PP","P","M","G","GG","XG","G1","G2","G3","G4",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gênero *</Label>
                <Select
                  value={(formData.gender || "").toLowerCase()}
                  onValueChange={(v) => setFormData({ ...formData, gender: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { val: "unissex", label: "Unissex" },
                      { val: "masculino", label: "Masculino" },
                      { val: "feminino", label: "Feminino" },
                      { val: "infantil", label: "Infantil" },
                    ].map((s) => (
                      <SelectItem key={s.val} value={s.val}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Variante
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
