import { useState, useEffect } from "react";
import { useProductVariants, useSaveProductVariant, ProductVariant, useModels, useLines, useFabrics, useColors, useAllVariantStockSummary } from "@/lib/api/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Search, Plus, Loader2, Edit2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ProductVariantsTab() {
  const [search, setSearch] = useState("");
  const { data: variants = [], isLoading } = useProductVariants(search);
  const { data: stockSummary = [] } = useAllVariantStockSummary();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Partial<ProductVariant> | null>(null);

  const openNew = () => {
    setEditingVariant({ active: true, size: "M", gender: "Unissex" });
    setDrawerOpen(true);
  };

  const openEdit = (v: ProductVariant) => {
    setEditingVariant(v);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por SKU, modelo, malha, cor..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
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
              <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin mx-auto" /></td></tr>
            )}
            {!isLoading && variants.map(v => (
              <tr key={v.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-semibold text-primary">{v.sku_internal || "SEM-SKU"}</div>
                  <div className="font-medium mt-0.5">{v.models?.name}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="font-normal bg-muted/50">{v.fabrics?.name}</Badge>
                    <Badge variant="outline" className="font-normal bg-muted/50">
                      <div className="size-2.5 rounded-full border mr-1.5" style={{ backgroundColor: v.canonical_colors?.hex || '#ccc' }}></div>
                      {v.canonical_colors?.name}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-lg">{v.size}</div>
                  <div className="text-xs text-muted-foreground">{v.gender}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  {(() => {
                    const currentStock = stockSummary.find((s: any) => s.variant_id === v.id)?.available_qty || 0;
                    return (
                      <Badge variant="outline" className={`font-bold text-sm px-2 py-1 ${currentStock > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {currentStock} un
                      </Badge>
                    );
                  })()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && variants.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhuma variante de produto cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <VariantFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} variant={editingVariant} />
    </div>
  );
}

function VariantFormDrawer({ open, onOpenChange, variant }: { open: boolean, onOpenChange: (open: boolean) => void, variant: Partial<ProductVariant> | null }) {
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
            <SheetTitle className="flex items-center gap-2"><Layers className="size-5 text-primary" /> {isEditing ? "Editar Variante" : "Nova Variante Mestre"}</SheetTitle>
            <SheetDescription>O cadastro mestre que une modelo, malha, cor e grade.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-5">
            <div className="space-y-2">
              <Label>SKU Interno</Label>
              <Input value={formData.sku_internal || ""} onChange={e => setFormData({ ...formData, sku_internal: e.target.value })} placeholder="Ex: CAM-REG-ALG-PRE-M" />
            </div>

            <div className="space-y-2">
              <Label>Modelo *</Label>
              <Select value={formData.model_id || ""} onValueChange={(v) => setFormData({ ...formData, model_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <Label>Malha *</Label>
              <Select value={formData.fabric_id || ""} onValueChange={(v) => setFormData({ ...formData, fabric_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{fabrics.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor Padrão *</Label>
              <Select value={formData.color_id || ""} onValueChange={(v) => setFormData({ ...formData, color_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {colors.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: m.hex || '#ccc' }}></div>
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
                <Select value={formData.size || ""} onValueChange={(v) => setFormData({ ...formData, size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["2", "4", "6", "8", "10", "12", "14", "16", "PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gênero *</Label>
                <Select value={(formData.gender || "").toLowerCase()} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      { val: "unissex", label: "Unissex" }, 
                      { val: "masculino", label: "Masculino" }, 
                      { val: "feminino", label: "Feminino" }, 
                      { val: "infantil", label: "Infantil" }
                    ].map(s => <SelectItem key={s.val} value={s.val}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
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
