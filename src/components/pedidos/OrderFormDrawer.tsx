import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Order, useCreateOrder, useUpdateOrder } from "@/lib/api/orders";
import { logTimelineEvent } from "@/lib/api/timeline";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useClients } from "@/lib/api/clients";
import { supabase } from "@/lib/supabase";

interface OrderFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
}

export function OrderFormDrawer({ open, onOpenChange, order }: OrderFormDrawerProps) {
  const isEditing = !!order;
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const { data: clients } = useClients();
  const [brands, setBrands] = useState<{id: string, name: string, code: string}[]>([]);

  useEffect(() => {
    supabase.from("brands").select("id, name, code").then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  const [formData, setFormData] = useState<any>({
    client_id: "",
    brand_id: "",
    priority: "normal",
    deadline: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      if (order) {
        // Find client and brand IDs from references
        // Note: in a real robust app, the API would return the IDs as well. For now, since useOrders only returns string names, we might need to do a small fetch or pass the original IDs.
        // Actually, let's fetch the actual order details if editing.
        supabase.from("orders").select("client_id, brand_id, priority, deadline").eq("id", order.id).single().then(({data}) => {
          if (data) {
            setFormData({
              client_id: data.client_id || "",
              brand_id: data.brand_id || "",
              priority: data.priority || "normal",
              deadline: data.deadline ? data.deadline.substring(0, 10) : "", // yyyy-MM-dd
              notes: "", // If we had notes in order table
            });
          }
        });
      } else {
        setFormData({
          client_id: "",
          brand_id: "",
          priority: "normal",
          deadline: "",
          notes: "",
        });
      }
    }
  }, [open, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.brand_id) {
      toast.error("Selecione o cliente e a marca.");
      return;
    }
    
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ 
          id: order.id, 
          client_id: formData.client_id,
          brand_id: formData.brand_id,
          priority: formData.priority,
          deadline: formData.deadline || null
        });
        await logTimelineEvent({
          orderId: order.id,
          action: "pedido_editado",
          description: `Pedido ${order.code} atualizado.`,
        }).catch(console.error);
        toast.success("Pedido atualizado com sucesso!");
      } else {
        const newOrder = await createMutation.mutateAsync({
          client_id: formData.client_id,
          brand_id: formData.brand_id,
          priority: formData.priority,
          deadline: formData.deadline || null
        });
        await logTimelineEvent({
          orderId: newOrder.id,
          action: "pedido_criado",
          description: `Pedido ${newOrder.code} criado.`,
          newStatus: "atendimento"
        }).catch(console.error);
        toast.success("Pedido criado com sucesso!");
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
            <SheetTitle>{isEditing ? "Editar Pedido" : "Novo Pedido"}</SheetTitle>
            <SheetDescription>
              {isEditing ? "Altere as configurações principais do pedido." : "Inicie um novo pedido preenchendo as informações abaixo."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Marca *</Label>
              <Select value={formData.brand_id} onValueChange={(v) => setFormData({ ...formData, brand_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name} ({b.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta (Urgente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prazo (Opcional)</Label>
                <input 
                  type="date" 
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações Gerais</Label>
              <Textarea 
                value={formData.notes} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ex: Cliente quer a entrega até dia X..."
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
              {isEditing ? "Salvar Alterações" : "Criar Pedido"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
