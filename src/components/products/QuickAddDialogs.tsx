import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { 
  useCreateModel, 
  useCreateFabric, 
  useCreateColor, 
  useCreateSizeGrid,
  useCreateCategory,
  useCreateSupplierCRM
} from "@/lib/api/inventory";

// ─── QuickAdd Modelagem ───────────────────────────────────────────────────────
interface QuickAddModelagemProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddModelagem({ open, onOpenChange, onCreated }: QuickAddModelagemProps) {
  const [name, setName] = useState("");
  const mutation = useCreateModel();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name });
      toast.success("Modelagem cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Nova Modelagem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome da Modelagem *</Label>
            <Input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: CAMISETA POLO" className="h-9" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickAdd Tecido / Malha ──────────────────────────────────────────────────
interface QuickAddTecidoProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddTecido({ open, onOpenChange, onCreated }: QuickAddTecidoProps) {
  const COMPOSICOES = [
    '100% ALGODAO FIO 30.1 PENTEADO',
    '100% ALGODAO FIO 26.1 PENTEADO',
    '100% ALGODAO',
    '67% POLIESTER 33% VISCOSE',
    '67% POLIESTER 33% ALGODAO',
    '50% POLIESTER 50% ALGODAO',
    '58% POLIESTER 42% ALGODAO',
  ];
  const defaultForm = { name: "", grammage: "", composition: "", compositionCustom: "", supports_dtf: true, supports_embroidery: true, supports_silk: true, supports_sublimation: false };
  const [form, setForm] = useState(defaultForm);
  const [useCustomComp, setUseCustomComp] = useState(false);
  const mutation = useCreateFabric();
  const finalComposition = useCustomComp ? form.compositionCustom : form.composition;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const result = await mutation.mutateAsync({
        name: form.name.trim(),
        grammage: form.grammage || null,
        composition: finalComposition || null,
        supports_dtf: form.supports_dtf,
        supports_embroidery: form.supports_embroidery,
        supports_silk: form.supports_silk,
        supports_sublimation: form.supports_sublimation,
      });
      toast.success("Tecido cadastrado com sucesso!");
      onCreated(result.id, result.name);
      setForm(defaultForm);
      setUseCustomComp(false);
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  const compatibilidades = [
    { key: "supports_dtf", label: "DTF" },
    { key: "supports_embroidery", label: "Bordado" },
    { key: "supports_silk", label: "Silk" },
    { key: "supports_sublimation", label: "Sublimacao" },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Novo Tecido / Malha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome da Malha *</Label>
            <Input required autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: PIQUET PA" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-slate-500">Composição</Label>
              <button type="button" onClick={() => setUseCustomComp(!useCustomComp)} className="text-xs text-blue-600 hover:text-blue-700">
                {useCustomComp ? 'Usar lista' : '+ Nova composição'}
              </button>
            </div>
            {useCustomComp ? (
              <Input value={form.compositionCustom} onChange={e => setForm({ ...form, compositionCustom: e.target.value })} placeholder="Ex: 80% Poliéster 20% Algodão" className="h-9" />
            ) : (
              <select
                value={form.composition}
                onChange={e => setForm({ ...form, composition: e.target.value })}
                className="w-full h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Selecione a composição...</option>
                {COMPOSICOES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Gramatura</Label>
            <Input value={form.grammage} onChange={e => setForm({ ...form, grammage: e.target.value })} placeholder="Ex: 160g/m2" className="h-9" />
          </div>
          <div className="space-y-2 border rounded-lg p-3 bg-slate-50">
            <p className="text-xs font-medium text-slate-600">Compatibilidades</p>
            {compatibilidades.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-xs text-slate-600">{label}</Label>
                <Switch
                  checked={form[key as keyof typeof form] as boolean}
                  onCheckedChange={v => setForm({ ...form, [key]: v })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickAdd Cor ─────────────────────────────────────────────────────────────
interface QuickAddCorProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddCor({ open, onOpenChange, onCreated }: QuickAddCorProps) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#3B82F6");
  const mutation = useCreateColor();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name, hex });
      toast.success("Cor cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName(""); setHex("#3B82F6");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Nova Cor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome da Cor *</Label>
            <Input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Azul Petroleo" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Cor (Hex)</Label>
            <div className="flex items-center gap-3">
              <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="h-9 w-16 rounded-lg border cursor-pointer p-0.5" />
              <Input value={hex} onChange={e => setHex(e.target.value)} placeholder="#000000" className="h-9 flex-1 font-mono text-sm" maxLength={7} />
              <div className="h-9 w-9 rounded-lg border shadow-sm flex-shrink-0" style={{ backgroundColor: hex }} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickAdd Grade de Tamanho ────────────────────────────────────────────────
interface QuickAddGradeProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddGrade({ open, onOpenChange, onCreated }: QuickAddGradeProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>(["P", "M", "G", "GG", "XG"]);
  const [newSize, setNewSize] = useState("");
  const mutation = useCreateSizeGrid();
  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (s && !sizes.includes(s)) { setSizes([...sizes, s]); setNewSize(""); }
  };
  const removeSize = (s: string) => setSizes(sizes.filter(x => x !== s));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || sizes.length === 0) return;
    try {
      const result = await mutation.mutateAsync({ name, sizes, description });
      toast.success("Grade cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName(""); setDescription(""); setSizes(["P","M","G","GG","XG"]); setNewSize("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Nova Grade de Tamanho</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome da Grade *</Label>
            <Input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Europa" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Descricao</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: XS, S, M, L, XL, XXL" className="h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Tamanhos *</Label>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border rounded-lg bg-slate-50">
              {sizes.map(s => (
                <span key={s} className="inline-flex items-center gap-1 bg-slate-800 text-white text-xs px-2 py-0.5 rounded-full">
                  {s}
                  <button type="button" onClick={() => removeSize(s)} className="hover:opacity-70 leading-none">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newSize} onChange={e => setNewSize(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSize(); } }}
                placeholder="Adicionar tamanho (Enter)" className="h-8 text-xs" />
              <Button type="button" size="sm" variant="outline" onClick={addSize} className="h-8 px-2">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending || sizes.length === 0}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickAdd Categoria ───────────────────────────────────────────────────────
export interface QuickAddCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddCategoria({ open, onOpenChange, onCreated }: QuickAddCategoriaProps) {
  const [name, setName] = useState("");
  const mutation = useCreateCategory();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name: name.trim(), active: true });
      toast.success("Categoria cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-base">Nova Família / Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome *</Label>
            <Input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Camisetas" className="h-9" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickAdd Fornecedor ──────────────────────────────────────────────────────
interface QuickAddFornecedorProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string, name: string) => void;
}
export function QuickAddFornecedor({ open, onOpenChange, onCreated }: QuickAddFornecedorProps) {
  const [name, setName] = useState("");
  const mutation = useCreateSupplierCRM();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name });
      toast.success("Fornecedor cadastrado com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Novo Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Nome do Fornecedor *</Label>
            <Input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Têxtil Silva" className="h-9" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
