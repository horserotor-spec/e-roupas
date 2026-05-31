import { useState, useEffect } from "react";
import { useSuppliers, useSaveSupplier, Supplier } from "@/lib/api/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Search, Plus, Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function SuppliersTab() {
  const [search, setSearch] = useState("");
  const { data: suppliers = [], isLoading } = useSuppliers(search);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier> | null>(null);

  const openNew = () => {
    setEditingSupplier({ active: true, lead_time_days: 0 });
    setDrawerOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar fornecedor..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <Button onClick={openNew} className="h-9 inline-flex items-center gap-1.5 px-3">
          <Plus className="size-4" /> Novo Fornecedor
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Fornecedor</th>
              <th className="text-left font-medium px-4 py-2.5">Contato</th>
              <th className="text-left font-medium px-4 py-2.5">Localização</th>
              <th className="text-right font-medium px-4 py-2.5">Lead Time</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin mx-auto" /></td></tr>
            )}
            {!isLoading && suppliers.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.company_name || s.cnpj || "Sem dados fiscais"}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div>{s.email || "Sem email"}</div>
                  <div className="text-xs">{s.whatsapp || s.phone || "Sem telefone"}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.city || "—"}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{s.lead_time_days} dias</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && suppliers.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum fornecedor encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <SupplierFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} supplier={editingSupplier} />
    </div>
  );
}

function SupplierFormDrawer({ open, onOpenChange, supplier }: { open: boolean, onOpenChange: (open: boolean) => void, supplier: Partial<Supplier> | null }) {
  const isEditing = !!supplier?.id;
  const saveMutation = useSaveSupplier();
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  // Update formData when supplier prop changes

  useEffect(() => {
    if (open && supplier) {
      setFormData(supplier);
    }
  }, [open, supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Nome é obrigatório.");
      return;
    }
    
    try {
      await saveMutation.mutateAsync(formData);
      toast.success(isEditing ? "Fornecedor atualizado!" : "Fornecedor criado!");
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
            <SheetTitle>{isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}</SheetTitle>
            <SheetDescription>Preencha os dados do fornecedor.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-4">
            <div className="space-y-2">
              <Label>Nome fantasia *</Label>
              <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input value={formData.company_name || ""} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={formData.cnpj || ""} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={formData.whatsapp || ""} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cidade / Estado</Label>
              <Input value={formData.city || ""} onChange={e => setFormData({ ...formData, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Lead Time Médio (Dias)</Label>
              <Input type="number" value={formData.lead_time_days || 0} onChange={e => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={formData.notes || ""} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
