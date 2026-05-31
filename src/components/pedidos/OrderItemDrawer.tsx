import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { OrderItem, useCreateOrderItem, useUpdateOrderItem } from "@/lib/api/order_items";
import { logTimelineEvent } from "@/lib/api/timeline";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OrderItemDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  item?: OrderItem | null;
}

export function OrderItemDrawer({ open, onOpenChange, orderId, item }: OrderItemDrawerProps) {
  const isEditing = !!item;
  const createMutation = useCreateOrderItem();
  const updateMutation = useUpdateOrderItem();

  const [formData, setFormData] = useState<Partial<OrderItem>>({
    product_name: "",
    model: "",
    line: "",
    fabric: "",
    color: "",
    size: "",
    gender: "",
    quantity: 1,
    unit_price: 0,
    unit_cost: 0,
    notes: "",
  });

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          product_name: item.product_name || "",
          model: item.model || "",
          line: item.line || "",
          fabric: item.fabric || "",
          color: item.color || "",
          size: item.size || "",
          gender: item.gender || "",
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          unit_cost: item.unit_cost || 0,
          notes: item.notes || "",
        });
      } else {
        setFormData({
          product_name: "", model: "", line: "", fabric: "",
          color: "", size: "", gender: "", quantity: 1,
          unit_price: 0, unit_cost: 0, notes: "",
        });
      }
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: item.id, ...formData });
        await logTimelineEvent({
          orderId,
          action: "item_editado",
          description: `Item ${formData.product_name} atualizado.`,
        }).catch(console.error);
        toast.success("Item atualizado!");
      } else {
        await createMutation.mutateAsync({ ...formData, order_id: orderId });
        await logTimelineEvent({
          orderId,
          action: "item_criado",
          description: `Item ${formData.product_name} adicionado ao pedido.`,
        }).catch(console.error);
        toast.success("Item adicionado!");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Editar Item" : "Novo Item"}</SheetTitle>
            <SheetDescription>
              Preencha os detalhes do produto para este pedido.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-4">
            <div className="space-y-2">
              <Label>Nome do Produto *</Label>
              <Input 
                required 
                value={formData.product_name || ""} 
                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="Ex: Camiseta Estonada"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input value={formData.model || ""} onChange={e => setFormData({ ...formData, model: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Linha</Label>
                <Input value={formData.line || ""} onChange={e => setFormData({ ...formData, line: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Malha / Tecido</Label>
                <Input value={formData.fabric || ""} onChange={e => setFormData({ ...formData, fabric: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <Input value={formData.color || ""} onChange={e => setFormData({ ...formData, color: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tamanho</Label>
                <Input value={formData.size || ""} onChange={e => setFormData({ ...formData, size: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Gênero</Label>
                <Input value={formData.gender || ""} onChange={e => setFormData({ ...formData, gender: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantidade *</Label>
                <Input type="number" min={1} required value={formData.quantity || 1} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço Unitário (Venda)</Label>
                <Input type="number" step="0.01" value={formData.unit_price || 0} onChange={e => setFormData({ ...formData, unit_price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Custo Unitário (R$)</Label>
                <Input type="number" step="0.01" value={formData.unit_cost || 0} onChange={e => setFormData({ ...formData, unit_cost: Number(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações do Item</Label>
              <Textarea 
                value={formData.notes || ""} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalhes específicos deste item..."
                className="resize-none h-24"
              />
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Item" : "Adicionar Item"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
