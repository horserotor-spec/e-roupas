const fs = require('fs');

const path = 'src/components/pedidos/DrawerPedido.tsx';
let content = fs.readFileSync(path, 'utf8');

// Imports
const extraImports = `
import { useState, useEffect } from "react";
import { useUpdateOrder, useDeleteOrder } from "@/lib/api/orders";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Save, Factory } from "lucide-react";
`;

if (!content.includes('useUpdateOrder')) {
    content = content.replace('import { Separator } from "@/components/ui/separator";', 'import { Separator } from "@/components/ui/separator";\n' + extraImports);
}

// Inside the DrawerPedido component
const stateVars = `  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const [isSavingProd, setIsSavingProd] = useState(false);
  const [prodForm, setProdForm] = useState({
    corte_faction: "",
    corte_start_date: "",
    corte_end_date: "",
    costura_faction: "",
    costura_start_date: "",
    costura_end_date: ""
  });

  useEffect(() => {
    if (order) {
      setProdForm({
        corte_faction: order.corte_faction || "",
        corte_start_date: order.corte_start_date || "",
        corte_end_date: order.corte_end_date || "",
        costura_faction: order.costura_faction || "",
        costura_start_date: order.costura_start_date || "",
        costura_end_date: order.costura_end_date || ""
      });
    }
  }, [order]);

  const handleSaveProd = async () => {
    if (!order) return;
    setIsSavingProd(true);
    try {
      await updateOrder.mutateAsync({ id: order.id, ...prodForm });
      toast.success("Dados de produção salvos com sucesso!");
    } catch (e: any) {
      toast.error("Erro ao salvar dados: " + e.message);
    } finally {
      setIsSavingProd(false);
    }
  };
`;

if (!content.includes('const updateOrder = useUpdateOrder();')) {
    content = content.replace('const overdue = ', stateVars + '\n  const overdue = ');
}

// Production section
const prodSection = `            {/* Facções de Produção */}
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Factory className="size-4 text-muted-foreground" /> Produção (Facções)
                </h3>
                <Button size="sm" variant="secondary" onClick={handleSaveProd} disabled={isSavingProd}>
                  <Save className="size-3.5 mr-1.5" /> Salvar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Corte */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Corte</h4>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Facção / Responsável</Label>
                    <Input className="h-8 text-xs" value={prodForm.corte_faction} onChange={e => setProdForm({...prodForm, corte_faction: e.target.value})} placeholder="Nome da facção..." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs" value={prodForm.corte_start_date} onChange={e => setProdForm({...prodForm, corte_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs" value={prodForm.corte_end_date} onChange={e => setProdForm({...prodForm, corte_end_date: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Costura */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Costura</h4>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Facção / Responsável</Label>
                    <Input className="h-8 text-xs" value={prodForm.costura_faction} onChange={e => setProdForm({...prodForm, costura_faction: e.target.value})} placeholder="Nome da facção..." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs" value={prodForm.costura_start_date} onChange={e => setProdForm({...prodForm, costura_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs" value={prodForm.costura_end_date} onChange={e => setProdForm({...prodForm, costura_end_date: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
`;

if (!content.includes('Facções de Produção')) {
    content = content.replace('{/* Observações */}', prodSection + '\n            {/* Observações */}');
}

// Delete button at the bottom of the drawer
const footerSection = `
        {/* Footer actions */}
        <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="size-4 mr-1.5" /> Excluir Pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o pedido <strong>{order.code}</strong>? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => {
                  try {
                    await deleteOrder.mutateAsync(order.id);
                    toast.success("Pedido excluído!");
                    onOpenChange(false);
                  } catch (e: any) {
                    toast.error("Erro ao excluir: " + e.message);
                  }
                }}>
                  Sim, excluir pedido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </SheetContent>
`;

if (!content.includes('Footer actions')) {
    content = content.replace('</SheetContent>', footerSection);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done DrawerPedido!');
