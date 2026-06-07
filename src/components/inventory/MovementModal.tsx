import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdjustInventoryBatch } from "@/lib/api/inventory";

interface MovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  variantInfo: string;
}

export function MovementModal({ open, onOpenChange, batchId, variantInfo }: MovementModalProps) {
  const [movementType, setMovementType] = useState<"ajuste_entrada" | "ajuste_saida" | "perda" | "transferencia">("ajuste_entrada");
  const [quantity, setQuantity] = useState<number | "">("");
  const [reason, setReason] = useState("");
  
  const adjustMutation = useAdjustInventoryBatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      toast.warning("Informe uma quantidade válida maior que zero.");
      return;
    }
    if (!reason.trim()) {
      toast.warning("O motivo da movimentação é obrigatório no modelo industrial.");
      return;
    }

    try {
      const isExit = movementType === "ajuste_saida" || movementType === "perda";
      const adjustAmount = isExit ? -quantity : quantity;

      await adjustMutation.mutateAsync({
        batch_id: batchId,
        adjustment: adjustAmount,
        reason: `${movementType.toUpperCase()}: ${reason}`
      });

      toast.success("Movimentação registrada com sucesso!");
      onOpenChange(false);
      setQuantity("");
      setReason("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar movimentação.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Nova Movimentação</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {variantInfo}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Tipo da Movimentação</Label>
              <Select value={movementType} onValueChange={(v: any) => setMovementType(v)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ajuste_entrada">Entrada (Ajuste)</SelectItem>
                  <SelectItem value="ajuste_saida">Saída (Ajuste)</SelectItem>
                  <SelectItem value="perda">Saída (Perda/Avaria)</SelectItem>
                  <SelectItem value="transferencia">Transferência Interna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Quantidade</Label>
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={e => setQuantity(parseInt(e.target.value) || "")}
                placeholder="Ex: 5"
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Motivo / Observação *</Label>
            <Input 
              required
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="Ex: Amostra enviada ao cliente XYZ"
              className="h-9"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={adjustMutation.isPending} className="bg-slate-900 text-white">
              {adjustMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
