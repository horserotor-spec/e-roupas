import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useSuppliersCRM, useEditInventoryBatch } from "@/lib/api/inventory";

export function EditBatchModal({ batch, open, onOpenChange }: { batch: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { data: suppliers = [] } = useSuppliersCRM();
  const editMutation = useEditInventoryBatch();

  const [supplierId, setSupplierId] = useState("");
  const [quantityTotal, setQuantityTotal] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open && batch) {
      setSupplierId(batch.supplier_id || "");
      setQuantityTotal(batch.quantity_total || 0);
      setMinStock(batch.product_variants?.min_stock || 0);
      setReason("");
    }
  }, [open, batch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) return toast.error("Fornecedor obrigat�rio.");
    if (!reason.trim()) return toast.error("Motivo obrigat�rio para registrar a auditoria.");
    if (quantityTotal < (batch?.quantity_reserved || 0)) {
      return toast.error("A quantidade total n�o pode ser menor que a quantidade j� reservada (" + batch?.quantity_reserved + ").");
    }

    try {
      await editMutation.mutateAsync({
        batch_id: batch.id,
        supplier_id: supplierId,
        quantity_total: quantityTotal,
        min_stock: minStock,
        reason: reason,
        variant_id: batch.product_variant_id,
        old_quantity: batch.quantity_total
      });
      toast.success("Lote atualizado com sucesso!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const isPending = editMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><Edit2 className="size-5 text-indigo-600" /> Editar Lote</SheetTitle>
            <SheetDescription>Edite as informações iniciais e limites do lote.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-4">
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {suppliers.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.company_name || s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quantidade Inicial (Total)</Label>
              <Input type="number" min="0" value={quantityTotal} onChange={e => setQuantityTotal(parseInt(e.target.value) || 0)} />
            </div>

            <div className="space-y-2">
              <Label>Estoque Mínimo (Variante)</Label>
              <Input type="number" min="0" value={minStock} onChange={e => setMinStock(parseInt(e.target.value) || 0)} />
            </div>

            <div className="space-y-2">
              <Label>Motivo da Edição *</Label>
              <Textarea required placeholder="Ex: Correção de digitação na nota fiscal..." value={reason} onChange={e => setReason(e.target.value)} />
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
