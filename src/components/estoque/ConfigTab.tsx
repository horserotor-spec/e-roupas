import { useState } from "react";
import {
  useModels, useColors, useFabrics,
  useCreateModel, useCreateFabric, useCreateColor,
  useDeleteModel, useDeleteFabric, useDeleteColor,
} from "@/lib/api/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, Palette, Layers, Shirt } from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Color code lookup (unchanged)
// ---------------------------------------------------------------------------
const COLOR_CODES: Record<string, string> = {
  "branco": "100", "natural": "101", "off white": "101", "off-white": "101",
  "verde agua": "102", "verde água": "102", "celeste": "103", "cinza claro": "105",
  "areia": "106", "lilás": "107", "lilas": "107", "rosa bb": "108", "creme": "109",
  "salmão": "114", "salmao": "114", "marinho": "201", "preto": "202",
  "limão": "203", "limao": "203", "seleção": "204", "selecao": "204",
  "chumbo": "206", "laranja": "207", "pink": "210", "barbie": "213", "ocre": "214",
  "royal": "301", "vermelho": "302", "bandeira": "303", "musgo": "304",
  "militar": "306", "turquesa": "307", "vinho": "308", "petróleo": "309",
  "petroleo": "309", "marrom": "310", "pitanga": "311", "jade": "312",
  "caramelo": "313", "roxo": "315", "botonê": "1101", "botone": "1101",
  "cinza mescla": "1001", "bananinha": "1100", "marinho mescla": "2011",
  "preto mescla": "2021",
};

// ---------------------------------------------------------------------------
// Main Tab
// ---------------------------------------------------------------------------
export function ConfigTab() {
  const { data: models = [], isLoading: loadModels } = useModels();
  const { data: colors = [], isLoading: loadColors } = useColors();
  const { data: fabrics = [], isLoading: loadFabrics } = useFabrics();

  const deleteModel   = useDeleteModel();
  const deleteFabric  = useDeleteFabric();
  const deleteColor   = useDeleteColor();

  const [modelModal,  setModelModal]  = useState(false);
  const [fabricModal, setFabricModal] = useState(false);
  const [colorModal,  setColorModal]  = useState(false);

  const isLoading = loadModels || loadColors || loadFabrics;

  const confirmDelete = async (
    id: string,
    label: string,
    deleteFn: (id: string) => Promise<any>
  ) => {
    if (!confirm(`Excluir "${label}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteFn(id);
      toast.success(`"${label}" excluído com sucesso.`);
    } catch (e: any) {
      toast.error("Erro ao excluir: " + e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* ── Cores ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden h-full">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Palette className="size-4 text-primary" /> Cores Padrão
            <span className="text-xs font-normal text-muted-foreground ml-1">({colors.length})</span>
          </h3>
          <Button size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={() => setColorModal(true)}>
            <Plus className="size-3.5" /> Nova Cor
          </Button>
        </div>
        <ul className="divide-y text-sm max-h-[570px] overflow-y-auto">
          {colors.map((c) => {
            const code = COLOR_CODES[c.name.toLowerCase()] || c.code;
            return (
              <li key={c.id} className="px-4 py-2.5 hover:bg-muted/50 flex items-center gap-2 group">
                <div className="size-4 rounded-full border flex-shrink-0" style={{ backgroundColor: c.hex || "#ccc" }} />
                <span className="flex-1">{c.name} {code ? `(COD. ${code})` : ""}</span>
                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => confirmDelete(c.id, c.name, (id) => deleteColor.mutateAsync(id))}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            );
          })}
          {colors.length === 0 && (
            <li className="px-4 py-8 text-center text-muted-foreground text-sm">
              Nenhuma cor cadastrada.
            </li>
          )}
        </ul>
      </div>

      {/* ── Modelos + Malhas ───────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* Modelos */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="size-4 text-primary" /> Modelos
              <span className="text-xs font-normal text-muted-foreground ml-1">({models.length})</span>
            </h3>
            <Button size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={() => setModelModal(true)}>
              <Plus className="size-3.5" /> Novo Modelo
            </Button>
          </div>
          <ul className="divide-y text-sm max-h-64 overflow-y-auto">
            {models.map((m) => (
              <li key={m.id} className="px-4 py-2 hover:bg-muted/50 flex items-center group">
                <span className="flex-1">{m.name}</span>
                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => confirmDelete(m.id, m.name, (id) => deleteModel.mutateAsync(id))}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
            {models.length === 0 && (
              <li className="px-4 py-4 text-center text-muted-foreground">Nenhum modelo.</li>
            )}
          </ul>
        </div>

        {/* Malhas */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Shirt className="size-4 text-primary" /> Malhas
              <span className="text-xs font-normal text-muted-foreground ml-1">({fabrics.length})</span>
            </h3>
            <Button size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={() => setFabricModal(true)}>
              <Plus className="size-3.5" /> Nova Malha
            </Button>
          </div>
          <ul className="divide-y text-sm max-h-64 overflow-y-auto">
            {fabrics.map((f) => (
              <li key={f.id} className="px-4 py-2 hover:bg-muted/50 group">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="font-medium">{f.name} {f.code ? <span className="text-muted-foreground text-xs ml-1">(CÓD. {f.code})</span> : null}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {f.grammage ? `Gramatura: ${f.grammage}` : ""}
                      {f.composition ? ` · ${f.composition}` : ""}
                    </div>
                    <div className="text-[10px] uppercase mt-1 flex gap-1 text-slate-500">
                      {f.supports_dtf        && <span className="bg-slate-100 px-1 rounded">DTF</span>}
                      {f.supports_silk       && <span className="bg-slate-100 px-1 rounded">Silk</span>}
                      {f.supports_embroidery && <span className="bg-slate-100 px-1 rounded">Bordado</span>}
                      {f.supports_sublimation && <span className="bg-slate-100 px-1 rounded">Sublimação</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                    onClick={() => confirmDelete(f.id, f.name, (id) => deleteFabric.mutateAsync(id))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
            {fabrics.length === 0 && (
              <li className="px-4 py-4 text-center text-muted-foreground">Nenhuma malha.</li>
            )}
          </ul>
        </div>

      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <ModelModal   open={modelModal}  onOpenChange={setModelModal} />
      <FabricModal  open={fabricModal} onOpenChange={setFabricModal} />
      <ColorModal   open={colorModal}  onOpenChange={setColorModal} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Model Modal
// ---------------------------------------------------------------------------
function ModelModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const mutation = useCreateModel();
  const [name, setName] = useState("");

  const reset = () => setName("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Informe o nome do modelo.");
    try {
      await mutation.mutateAsync({ name: name.trim() });
      toast.success(`Modelo "${name}" criado!`);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="size-5 text-primary" /> Novo Modelo
          </DialogTitle>
          <DialogDescription>Camiseta, Regata, Boné, Moletom…</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Nome *</Label>
            <Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Camiseta Gola V" />
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Fabric Modal
// ---------------------------------------------------------------------------
function FabricModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const mutation = useCreateFabric();
  const [form, setForm] = useState({
    name: "", code: "", grammage: "", composition: "",
    supports_dtf: false, supports_silk: false,
    supports_embroidery: false, supports_sublimation: false,
  });

  const reset = () => setForm({
    name: "", code: "", grammage: "", composition: "",
    supports_dtf: false, supports_silk: false,
    supports_embroidery: false, supports_sublimation: false,
  });

  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Informe o nome da malha.");
    try {
      await mutation.mutateAsync({
        name: form.name.trim(),
        code: form.code.trim() || null,
        grammage: form.grammage.trim() || null,
        composition: form.composition.trim() || null,
        supports_dtf: form.supports_dtf,
        supports_silk: form.supports_silk,
        supports_embroidery: form.supports_embroidery,
        supports_sublimation: form.supports_sublimation,
      } as any);
      toast.success(`Malha "${form.name}" criada!`);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shirt className="size-5 text-primary" /> Nova Malha
          </DialogTitle>
          <DialogDescription>Meia Malha, Ribana, Moletom…</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Nome *</Label>
              <Input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Meia Malha Fio 30.1" />
            </div>
            <div className="space-y-1.5">
              <Label>Código (opcional)</Label>
              <Input value={form.code} onChange={e => set("code", e.target.value)} placeholder="MML" />
            </div>
            <div className="space-y-1.5">
              <Label>Gramatura (opcional)</Label>
              <Input value={form.grammage} onChange={e => set("grammage", e.target.value)} placeholder="160g/m²" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Composição (opcional)</Label>
              <Input value={form.composition} onChange={e => set("composition", e.target.value)} placeholder="88% algodão / 12% poliéster" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Técnicas de Personalização</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "supports_dtf",         label: "DTF" },
                { key: "supports_silk",        label: "Silk Screen" },
                { key: "supports_embroidery",  label: "Bordado" },
                { key: "supports_sublimation", label: "Sublimação" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg border hover:bg-muted/40">
                  <Switch
                    checked={(form as any)[key]}
                    onCheckedChange={val => set(key, val)}
                    className="scale-75"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Color Modal
// ---------------------------------------------------------------------------
function ColorModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const mutation = useCreateColor();
  const [name, setName] = useState("");
  const [hex,  setHex]  = useState("#000000");

  const reset = () => { setName(""); setHex("#000000"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Informe o nome da cor.");
    try {
      await mutation.mutateAsync({ name: name.trim(), hex });
      toast.success(`Cor "${name}" criada!`);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="size-5 text-primary" /> Nova Cor
          </DialogTitle>
          <DialogDescription>Defina o nome e a cor visual para usar nas variantes.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Nome *</Label>
            <Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Azul Royal" />
          </div>

          <div className="space-y-1.5">
            <Label>Cor Visual</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={e => setHex(e.target.value)}
                className="h-10 w-16 rounded-lg border cursor-pointer p-0.5"
              />
              <Input
                value={hex}
                onChange={e => setHex(e.target.value)}
                placeholder="#000000"
                className="font-mono"
              />
              <div className="size-9 rounded-full border-2 flex-shrink-0" style={{ backgroundColor: hex }} />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
