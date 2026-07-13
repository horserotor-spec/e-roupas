import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CurrencyInput } from "../ui/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Product, ProductVariation, useCreateProduct, useUpdateProduct, useProductRelationships } from "@/lib/api/products";
import { useModels, useFabrics, useColors, useSuppliersCRM, useSizeGrids, useCategories, useDeleteModel, useDeleteFabric, useDeleteColor, useDeleteSizeGrid, useDeleteCategory, useCreateInventoryEntryGrid } from "@/lib/api/inventory";
import { QuickAddModelagem, QuickAddTecido, QuickAddCor, QuickAddGrade, QuickAddCategoria, QuickAddFornecedor } from "./QuickAddDialogs";
import { ProductStockTab } from "./ProductStockTab";
import { useSkuRules } from "@/lib/api/skuRules";
import { generateSku, generateTechnicalName } from "@/lib/skuGenerator";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Wand2, Edit3 } from "lucide-react";

const COLOR_CODES: Record<string, string> = {
  "branco": "100",
  "natural": "101",
  "off white": "101",
  "off-white": "101",
  "verde agua": "102",
  "verde água": "102",
  "celeste": "103",
  "cinza claro": "105",
  "areia": "106",
  "lilás": "107",
  "lilas": "107",
  "rosa bb": "108",
  "creme": "109",
  "salmão": "114",
  "salmao": "114",
  "marinho": "201",
  "preto": "202",
  "limão": "203",
  "limao": "203",
  "seleção": "204",
  "selecao": "204",
  "chumbo": "206",
  "laranja": "207",
  "pink": "210",
  "barbie": "213",
  "ocre": "214",
  "royal": "301",
  "vermelho": "302",
  "bandeira": "303",
  "musgo": "304",
  "militar": "306",
  "turquesa": "307",
  "vinho": "308",
  "petróleo": "309",
  "petroleo": "309",
  "marrom": "310",
  "pitanga": "311",
  "jade": "312",
  "caramelo": "313",
  "roxo": "315",
  "botonê": "1101",
  "botone": "1101",
  "cinza mescla": "1001",
  "bananinha": "1100",
  "marinho mescla": "2011",
  "preto mescla": "2021",
};

interface ProductFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormDrawer({ open, onOpenChange, product }: ProductFormDrawerProps) {
  const isEditing = !!product;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const createGridMutation = useCreateInventoryEntryGrid();

  const { data: paRelationships = [] } = useProductRelationships(product?.id);

  const { data: models = [] } = useModels();
  const { data: fabrics = [] } = useFabrics();
  const { data: colors = [] } = useColors();
  const { data: suppliers = [] } = useSuppliersCRM();
  const { data: sizeGrids = [] } = useSizeGrids();
  const { data: categories = [] } = useCategories();

  const delModel = useDeleteModel();
  const delFabric = useDeleteFabric();
  const delColor = useDeleteColor();
  const delGrid = useDeleteSizeGrid();
  const delCategory = useDeleteCategory();

  const [qaModelagem, setQaModelagem] = useState(false);
  const [qaTecido, setQaTecido] = useState(false);
  const [qaCor, setQaCor] = useState(false);
  const [qaGrade, setQaGrade] = useState(false);
  const [qaCategoria, setQaCategoria] = useState(false);
  const [qaFornecedor, setQaFornecedor] = useState(false);

  const { data: skuRules = [] } = useSkuRules();
  const [customSkuMode, setCustomSkuMode] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: 0,
    cost_price: 0,
    format: "MP",
    unit: "UN",
    brand: "",
    category: "",
    condition: "Novo",
    net_weight: 0,
    gross_weight: 0,
    gtin_ean: "",
    ncm: "",
    cest: "",
    min_stock: 0,
    max_stock: 0,
    model_id: null,
    fabric_id: null,
    color_id: null,
    fabric_family: "",
    size_grid: "Adulto",
    supplier_id: null,
    supports_dtf: true,
    supports_embroidery: true,
    supports_silk: true,
    supports_sublimation: false,
    lead_time_minutes: 0,
    production_sla_days: 0,
    origin: 0,
    icms_cst: "102",
    icms_percent: 0,
    pis_cst: "07",
    pis_percent: 0,
    cofins_cst: "07",
    cofins_percent: 0,
    ipi_percent: 0,
    cfop: "5102",
    active: true,
    technical_name: "",
    mix_allowed: false,
  });

  const [variations, setVariations] = useState<Partial<ProductVariation>[]>([]);
  const [initialStockGrid, setInitialStockGrid] = useState<Record<string, number>>({});
  const [minStockGrid, setMinStockGrid] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          price: product.price || 0,
          cost_price: product.cost_price || 0,
          format: product.format || "MP",
          unit: product.unit || "UN",
          brand: product.brand || "",
          category: product.category || "",
          condition: product.condition || "Novo",
          net_weight: product.net_weight || 0,
          gross_weight: product.gross_weight || 0,
          gtin_ean: product.gtin_ean || "",
          ncm: product.ncm || "",
          cest: product.cest || "",
          min_stock: product.min_stock || 0,
          max_stock: product.max_stock || 0,
          model_id: product.model_id || null,
          fabric_id: product.fabric_id || null,
          color_id: product.color_id || null,
          fabric_family: product.fabric_family || "",
          size_grid: product.size_grid || "Adulto",
          supplier_id: product.supplier_id || null,
          supports_dtf: product.supports_dtf ?? true,
          supports_embroidery: product.supports_embroidery ?? true,
          supports_silk: product.supports_silk ?? true,
          supports_sublimation: product.supports_sublimation ?? false,
          lead_time_minutes: product.lead_time_minutes ?? 0,
          production_sla_days: product.production_sla_days ?? 0,
          origin: product.origin ?? 0,
          icms_cst: product.icms_cst || "102",
          icms_percent: product.icms_percent ?? 0,
          pis_cst: product.pis_cst || "07",
          pis_percent: product.pis_percent ?? 0,
          cofins_cst: product.cofins_cst || "07",
          cofins_percent: product.cofins_percent ?? 0,
          ipi_cst: product.ipi_cst || "99",
          ipi_percent: product.ipi_percent ?? 0,
          cfop: product.cfop || "5102",
          active: product.active ?? true,
          technical_name: product.technical_name || "",
          mix_allowed: product.mix_allowed || false,
        });
      } else {
        setFormData({
          name: "",
          sku: "",
          price: 0,
          cost_price: 0,
          format: "MP",
          unit: "UN",
          brand: "",
          category: "",
          condition: "Novo",
          net_weight: 0,
          gross_weight: 0,
          gtin_ean: "",
          ncm: "",
          cest: "",
          min_stock: 0,
          max_stock: 0,
          model_id: null,
          fabric_id: null,
          color_id: null,
          fabric_family: "",
          size_grid: "Adulto",
          supplier_id: null,
          supports_dtf: true,
          supports_embroidery: true,
          supports_silk: true,
          supports_sublimation: false,
          lead_time_minutes: 0,
          production_sla_days: 0,
          origin: 0,
          icms_cst: "102",
          icms_percent: 0,
          pis_cst: "07",
          pis_percent: 0,
          cofins_cst: "07",
          cofins_percent: 0,
          ipi_cst: "99",
          ipi_percent: 0,
          cfop: "5102",
          active: true,
          technical_name: "",
          mix_allowed: false,
        });
        setCustomSkuMode(false);
        setInitialStockGrid({});
        setMinStockGrid({});
      }
    }
  }, [open, product]);

  // Efeito para auto-gerar SKU e Nome Técnico
  useEffect(() => {
    if (!open) return;
    
    // Nome Técnico (se MP ou PA)
    const tName = generateTechnicalName({
      format: formData.format || "",
      modelName: models.find(m => m.id === formData.model_id)?.name,
      fabricName: fabrics.find(f => f.id === formData.fabric_id)?.name,
      colorName: colors.find(c => c.id === formData.color_id)?.name,
    });
    
    // Atualiza Nome Técnico se estiver vazio ou formos alterar
    if (tName && formData.technical_name !== tName) {
      setFormData(prev => ({ ...prev, technical_name: tName }));
    }

    // Gerar SKU Automático
    if (!customSkuMode) {
      const generated = generateSku({
        format: formData.format || "",
        modelName: models.find(m => m.id === formData.model_id)?.name,
        fabricName: fabrics.find(f => f.id === formData.fabric_id)?.name,
        colorName: colors.find(c => c.id === formData.color_id)?.name,
      }, skuRules);

      if (generated && formData.sku !== generated) {
        setFormData(prev => ({ ...prev, sku: generated }));
      }
    }
  }, [
    open, 
    formData.format, 
    formData.model_id, 
    formData.fabric_id, 
    formData.color_id, 
    customSkuMode, 
    skuRules,
    models,
    fabrics,
    colors
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { fabric_family, ...restFormData } = formData;
      const dataToSave = { 
        ...restFormData,
        variations: [] 
      };

      let productId = "";
      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, ...dataToSave });
        productId = product.id;
        toast.success("Produto atualizado com sucesso!");
      } else {
        const newProduct = await createMutation.mutateAsync(dataToSave);
        productId = newProduct.id;
        toast.success("Produto criado com sucesso!");
      }

      // Registra estoque inicial se MP e grade preenchida
      const hasStock = Object.values(initialStockGrid).some(v => v > 0);
      if (hasStock && productId && dataToSave.format === "MP") {
        if (!dataToSave.supplier_id) {
          toast.warning("Estoque inicial ignorado: É necessário selecionar um fornecedor para registrar o lote.");
        } else {
          await createGridMutation.mutateAsync({
            product_id: productId,
            supplier_id: dataToSave.supplier_id,
            batch_code: `EST-INICIAL-${new Date().getTime().toString().slice(-6)}`,
            average_cost: dataToSave.cost_price || 0,
            quality_notes: "Estoque Inicial Cadastro",
            grid: initialStockGrid,
            minStockGrid: minStockGrid
          });
          toast.success("Variações geradas e estoque registrado!");
        }
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error("ERRO COMPLETO:", error);
      
      let msg = "";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === 'object' && error !== null) {
        msg = error.message || "Erro desconhecido do banco de dados";
        if (error.code === '23503') {
          msg = "Conflito de referência (Chave Estrangeira inválida). Verifique os campos selecionados.";
        }
      } else {
        msg = String(error);
      }
      
      toast.error(msg);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || createGridMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[50vw] overflow-y-auto w-full p-0 bg-slate-50/50">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                  {isEditing ? "Editar Produto" : "Novo Produto"}
                  {formData.format === 'PA' && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      Gerado pelo sistema
                    </span>
                  )}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 mt-1">
                  Configure as informações do produto seguindo a engenharia industrial.
                </SheetDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="active" className="text-xs font-medium text-slate-500">
                  {formData.active ? "Ativo" : "Inativo"}
                </Label>
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(v) => setFormData({ ...formData, active: v })}
                />
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="geral" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 border-b">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="geral">Detalhes</TabsTrigger>
                {isEditing && (formData.format === 'MP' || formData.format === 'Insumo') && (
                  <TabsTrigger value="estoque">Estoque</TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="geral" className="flex-1 overflow-y-auto p-6 space-y-6 m-0 outline-none">
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Dados Gerais</h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Nome do Produto *</Label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Camiseta Básica Algodão"
                    className="h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Formato / Tipo *</Label>
                    <Select disabled={formData.format === 'PA' || formData.format === 'PF'} value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MP">MP (Matéria-Prima)</SelectItem>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                        <SelectItem value="Insumo">Insumo</SelectItem>
                        {formData.format === 'PA' && <SelectItem value="PA">PA (Produto Acabável)</SelectItem>}
                        {formData.format === 'PF' && <SelectItem value="PF">PF (Produto Final)</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Unidade de Medida</Label>
                    <Input 
                      value={formData.unit || "UN"} 
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="UN, PC, KG"
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-500">Família / Categoria</Label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setQaCategoria(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                          <Plus className="h-3 w-3" /> Nova
                        </button>
                        <button 
                          type="button" 
                          disabled={!formData.category || formData.category === "none_category"}
                          onClick={async () => {
                            if(confirm('Excluir esta categoria?')) {
                              try { 
                                const cat = categories.find(c => c.name === formData.category);
                                if(cat) await delCategory.mutateAsync(cat.id);
                                setFormData({...formData, category: null});
                              } catch(e:any) { toast.error(e.message); }
                            }
                          }} 
                          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <Select value={formData.category || "none_category"} onValueChange={(v) => setFormData({ ...formData, category: v === "none_category" ? null : v })}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none_category">Nenhuma</SelectItem>
                        {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.format === "MP" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">Grade Aplicável</Label>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setQaGrade(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                            <Plus className="h-3 w-3" /> Nova
                          </button>
                          <button 
                            type="button" 
                            disabled={!formData.size_grid || formData.size_grid === "none_grid"}
                            onClick={async () => {
                              if(confirm('Excluir grade?')) {
                                try { 
                                  const grid = sizeGrids.find(g => g.name === formData.size_grid);
                                  if(grid) await delGrid.mutateAsync(grid.id);
                                  setFormData({...formData, size_grid: ""});
                                } catch(e:any) { toast.error(e.message); }
                              }
                            }} 
                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <Select value={formData.size_grid || "none_grid"} onValueChange={(v) => setFormData({ ...formData, size_grid: v === "none_grid" ? "" : v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione a grade..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none_grid">Nenhuma</SelectItem>
                          {sizeGrids.map(g => (
                            <SelectItem key={g.id} value={g.name}>
                              {g.name} ({g.sizes.join(", ")})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.format === "MP" && formData.size_grid && sizeGrids.find(g => g.name === formData.size_grid) && (
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Estoque Inicial (Opcional)</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                    Gera Variações Automaticamente
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Preencha a quantidade inicial para cada tamanho. O sistema criará as variações (P, M, G, etc.) e o lote de estoque inicial automaticamente ao salvar. Necessita fornecedor selecionado.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                  {sizeGrids.find(g => g.name === formData.size_grid)!.sizes.map(size => (
                    <div key={size} className="space-y-1.5 p-2 bg-slate-50 border border-slate-100 rounded-md">
                      <Label className="text-xs text-slate-600 text-center block font-medium mb-2">{size}</Label>
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-medium">Estoque Inicial</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-8 text-center bg-white text-xs"
                            value={initialStockGrid[size] || ""}
                            onChange={e => setInitialStockGrid({ ...initialStockGrid, [size]: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-medium">Estoque Mínimo</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-8 text-center bg-white text-xs border-orange-200 focus-visible:ring-orange-500"
                            value={minStockGrid[size] || ""}
                            onChange={e => setMinStockGrid({ ...minStockGrid, [size]: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">SKU Automático</h3>
                <button
                  type="button"
                  onClick={() => setCustomSkuMode(!customSkuMode)}
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {customSkuMode ? "Voltar ao Automático" : "Personalizar SKU"}
                  {customSkuMode ? <Wand2 className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">SKU Gerado</Label>
                    <Input 
                      value={formData.sku || ""} 
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="Ex: MP-REG-PEL-PTO"
                      className={`h-9 font-mono text-sm ${!customSkuMode ? 'bg-slate-50 text-slate-600' : ''}`}
                      readOnly={!customSkuMode}
                    />
                    {!customSkuMode && formData.format !== 'Serviço' && formData.format !== 'Insumo' && (
                      <p className="text-[10px] text-slate-400">Gerado a partir do formato, modelagem, malha e cor.</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Nome Técnico (Interno)</Label>
                    <Input 
                      value={formData.technical_name || ""} 
                      readOnly
                      placeholder="Ex: Camiseta Regular Poliamida Preto"
                      className="h-9 bg-slate-50 text-slate-600 text-xs"
                    />
                  </div>
                </div>
                
                {/* Visual Chips */}
                {!customSkuMode && (formData.format === 'MP' || formData.format === 'PA') && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                      TIPO: {formData.format}
                    </span>
                    {formData.model_id && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                        MOD: {models.find(m => m.id === formData.model_id)?.name}
                      </span>
                    )}
                    {formData.fabric_id && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                        TEC: {fabrics.find(f => f.id === formData.fabric_id)?.name}
                      </span>
                    )}
                    {formData.color_id && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                        {(() => {
                          const c = colors.find(col => col.id === formData.color_id);
                          const code = c ? (COLOR_CODES[c.name.toLowerCase()] || c.code) : "";
                          return `COR: ${c?.name || ""}${code ? ` (COD. ${code})` : ""}`;
                        })()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(formData.format === "MP" || formData.format === "PA") && (
              <>
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Engenharia Têxtil</h3>
                  {formData.format === 'PA' && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      Herdado do MP
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">Modelagem</Label>
                        {formData.format !== 'PA' && (
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setQaModelagem(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                              <Plus className="h-3 w-3" /> Nova
                            </button>
                            <button 
                              type="button" 
                              disabled={!formData.model_id || formData.model_id === "none_model"}
                              onClick={async () => {
                                if(confirm('Excluir modelagem?')) {
                                  try { await delModel.mutateAsync(formData.model_id!); setFormData({...formData, model_id: null}); } catch(e:any) { toast.error(e.message); }
                                }
                              }} 
                              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <Select disabled={formData.format === 'PA'} value={formData.model_id || "none_model"} onValueChange={(v) => setFormData({ ...formData, model_id: v === "none_model" ? null : v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none_model">Nenhum</SelectItem>
                          {models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">Tecido / Malha</Label>
                        {formData.format !== 'PA' && (
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setQaTecido(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                              <Plus className="h-3 w-3" /> Novo
                            </button>
                            <button 
                              type="button" 
                              disabled={!formData.fabric_id || formData.fabric_id === "none_fabric"}
                              onClick={async () => {
                                if(confirm('Excluir tecido?')) {
                                  try { await delFabric.mutateAsync(formData.fabric_id!); setFormData({...formData, fabric_id: null}); } catch(e:any) { toast.error(e.message); }
                                }
                              }} 
                              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <Select
                        disabled={formData.format === 'PA'}
                        value={formData.fabric_id || "none_fabric"}
                        onValueChange={(v) => {
                          const selected = fabrics.find(f => f.id === v);
                          setFormData({
                            ...formData,
                            fabric_id: v === "none_fabric" ? null : v,
                            fabric_family: selected?.composition || formData.fabric_family || "",
                          });
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none_fabric">Nenhum</SelectItem>
                          {fabrics.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Cor Oficial</h3>
                  {formData.format === 'PA' && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      Herdado do MP
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-500">Cor Oficial</Label>
                      {formData.format !== 'PA' && (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setQaCor(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                            <Plus className="h-3 w-3" /> Nova
                          </button>
                          <button 
                            type="button" 
                            disabled={!formData.color_id || formData.color_id === "none_color"}
                            onClick={async () => {
                              if(confirm('Excluir cor?')) {
                                try { await delColor.mutateAsync(formData.color_id!); setFormData({...formData, color_id: null}); } catch(e:any) { toast.error(e.message); }
                              }
                            }} 
                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <Select disabled={formData.format === 'PA'} value={formData.color_id || "none_color"} onValueChange={(v) => setFormData({ ...formData, color_id: v === "none_color" ? null : v })}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none_color">Nenhuma</SelectItem>
                        {colors.map(c => {
                          const code = COLOR_CODES[c.name.toLowerCase()] || c.code;
                          return (
                            <SelectItem key={c.id} value={c.id}>
                              <div className="flex items-center gap-1.5">
                                <div className="size-2.5 rounded-full border" style={{ backgroundColor: c.hex || '#ccc' }}></div>
                                <span>{c.name} {code ? `(COD. ${code})` : ""}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.format === "MP" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">Fornecedor Principal (Estoque)</Label>
                        <button type="button" onClick={() => setQaFornecedor(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                          <Plus className="h-3 w-3" /> Novo
                        </button>
                      </div>
                      <Select value={formData.supplier_id || "none_supplier"} onValueChange={(v) => setFormData({ ...formData, supplier_id: v === "none_supplier" ? null : v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none_supplier">Nenhum</SelectItem>
                          {suppliers.length === 0 && (
                            <SelectItem value="_empty" disabled>Nenhum fornecedor cadastrado</SelectItem>
                          )}
                          {suppliers.map(s => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.company_name || s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              </>
            )}

            {formData.format === "MP" && (
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Compatibilidade de Personalizações</h3>
                
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex items-center justify-between border-b pb-2">
                    <Label className="text-xs text-slate-600">Compatível com DTF</Label>
                    <Switch 
                      checked={formData.supports_dtf ?? true} 
                      onCheckedChange={(v) => setFormData({ ...formData, supports_dtf: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <Label className="text-xs text-slate-600">Compatível com Bordado</Label>
                    <Switch 
                      checked={formData.supports_embroidery ?? true} 
                      onCheckedChange={(v) => setFormData({ ...formData, supports_embroidery: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Label className="text-xs text-slate-600">Compatível com Silk</Label>
                    <Switch 
                      checked={formData.supports_silk ?? true} 
                      onCheckedChange={(v) => setFormData({ ...formData, supports_silk: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Label className="text-xs text-slate-600">Compatível com Sublimação</Label>
                    <Switch 
                      checked={formData.supports_sublimation ?? false} 
                      onCheckedChange={(v) => setFormData({ ...formData, supports_sublimation: v })}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.format === "Serviço" && (
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Operações de Serviço</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Tempo Médio (Minutos)</Label>
                    <Input 
                      type="number" min="0"
                      value={formData.lead_time_minutes || ""} 
                      onChange={e => setFormData({ ...formData, lead_time_minutes: parseInt(e.target.value) || 0 })}
                      placeholder="Ex: 15"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">SLA de Produção (Dias)</Label>
                    <Input 
                      type="number" min="0"
                      value={formData.production_sla_days || ""} 
                      onChange={e => setFormData({ ...formData, production_sla_days: parseInt(e.target.value) || 0 })}
                      placeholder="Ex: 2"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}

              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Preços & Controle de Estoque</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Preço de Venda (R$)</Label>
                      <CurrencyInput 
                        value={formData.price || 0} 
                        onChange={v => setFormData({ ...formData, price: v })}
                        placeholder="0,00"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Preço de Custo (R$)</Label>
                      <CurrencyInput 
                        value={formData.cost_price || 0} 
                        onChange={v => setFormData({ ...formData, cost_price: v })}
                        placeholder="0,00"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

            <details className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 group">
              <summary className="text-sm font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                <span>Tributação & Detalhes Fiscais (NFe)</span>
                <span className="text-xs text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Código NCM</Label>
                    <Input 
                      value={formData.ncm || ""} 
                      onChange={e => setFormData({ ...formData, ncm: e.target.value })}
                      placeholder="Ex: 6109.10.00"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Código CEST</Label>
                    <Input 
                      value={formData.cest || ""} 
                      onChange={e => setFormData({ ...formData, cest: e.target.value })}
                      placeholder="Ex: 28.038.00"
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Origem da Mercadoria</Label>
                  <Select 
                    value={formData.origin?.toString() ?? "0"} 
                    onValueChange={(v) => setFormData({ ...formData, origin: parseInt(v) })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione a Origem" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="0">0 - Nacional</SelectItem>
                      <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                      <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                      <SelectItem value="3">3 - Nacional - Conteúdo de Importação &gt; 40%</SelectItem>
                      <SelectItem value="4">4 - Nacional - Produção conf. processos básicos</SelectItem>
                      <SelectItem value="5">5 - Nacional - Conteúdo de Importação &lt;= 40%</SelectItem>
                      <SelectItem value="6">6 - Estrangeira - Importação direta, sem similar nac.</SelectItem>
                      <SelectItem value="7">7 - Estrangeira - Adq. mercado interno, sem similar nac.</SelectItem>
                      <SelectItem value="8">8 - Nacional - Conteúdo de Importação &gt; 70%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs text-slate-500">CST/CSOSN do ICMS</Label>
                    <Select 
                      value={formData.icms_cst || "102"} 
                      onValueChange={(v) => setFormData({ ...formData, icms_cst: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o CST/CSOSN" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="101">101 - Simples Nac. com permissão de crédito</SelectItem>
                        <SelectItem value="102">102 - Simples Nac. sem permissão de crédito</SelectItem>
                        <SelectItem value="103">103 - Simples Nac. (Isenção por faixa)</SelectItem>
                        <SelectItem value="201">201 - Simples Nac. perm. crédito e ICMS ST</SelectItem>
                        <SelectItem value="202">202 - Simples Nac. sem perm. crédito e ICMS ST</SelectItem>
                        <SelectItem value="300">300 - Simples Nac. (Imune)</SelectItem>
                        <SelectItem value="400">400 - Simples Nac. (Não tributada)</SelectItem>
                        <SelectItem value="500">500 - Simples Nac. (ICMS ST cobrado antes)</SelectItem>
                        <SelectItem value="900">900 - Simples Nac. (Outros)</SelectItem>
                        <SelectItem value="00">00 - Normal (Tributada integralmente)</SelectItem>
                        <SelectItem value="10">10 - Normal (Tributada e com ICMS ST)</SelectItem>
                        <SelectItem value="20">20 - Normal (Com redução de BC)</SelectItem>
                        <SelectItem value="30">30 - Normal (Isenta/Não trib. e com ICMS ST)</SelectItem>
                        <SelectItem value="40">40 - Normal (Isenta)</SelectItem>
                        <SelectItem value="41">41 - Normal (Não tributada)</SelectItem>
                        <SelectItem value="50">50 - Normal (Suspensão)</SelectItem>
                        <SelectItem value="51">51 - Normal (Diferimento)</SelectItem>
                        <SelectItem value="60">60 - Normal (ICMS ST cobrado antes)</SelectItem>
                        <SelectItem value="70">70 - Normal (Redução BC e ICMS ST)</SelectItem>
                        <SelectItem value="90">90 - Normal (Outras)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">ICMS (%)</Label>
                    <Input 
                      type="number" step="0.01" min="0"
                      value={formData.icms_percent?.toString() ?? "0"} 
                      onChange={e => setFormData({ ...formData, icms_percent: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs text-slate-500">CST do PIS</Label>
                    <Select 
                      value={formData.pis_cst || "07"} 
                      onValueChange={(v) => setFormData({ ...formData, pis_cst: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o CST" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="01">01 - Tributável (Básica)</SelectItem>
                        <SelectItem value="02">02 - Tributável (Diferenciada)</SelectItem>
                        <SelectItem value="03">03 - Tributável (por Unidade)</SelectItem>
                        <SelectItem value="04">04 - Tributável Monofásica</SelectItem>
                        <SelectItem value="05">05 - Tributável ICMS ST</SelectItem>
                        <SelectItem value="06">06 - Tributável (Alíquota Zero)</SelectItem>
                        <SelectItem value="07">07 - Operação Isenta</SelectItem>
                        <SelectItem value="08">08 - Sem Incidência</SelectItem>
                        <SelectItem value="09">09 - Com Suspensão</SelectItem>
                        <SelectItem value="49">49 - Outras Saídas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">PIS (%)</Label>
                    <Input 
                      type="number" step="0.01" min="0"
                      value={formData.pis_percent?.toString() ?? "0"} 
                      onChange={e => setFormData({ ...formData, pis_percent: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs text-slate-500">CST do COFINS</Label>
                    <Select 
                      value={formData.cofins_cst || "07"} 
                      onValueChange={(v) => setFormData({ ...formData, cofins_cst: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o CST" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="01">01 - Tributável (Básica)</SelectItem>
                        <SelectItem value="02">02 - Tributável (Diferenciada)</SelectItem>
                        <SelectItem value="03">03 - Tributável (por Unidade)</SelectItem>
                        <SelectItem value="04">04 - Tributável Monofásica</SelectItem>
                        <SelectItem value="05">05 - Tributável ICMS ST</SelectItem>
                        <SelectItem value="06">06 - Tributável (Alíquota Zero)</SelectItem>
                        <SelectItem value="07">07 - Operação Isenta</SelectItem>
                        <SelectItem value="08">08 - Sem Incidência</SelectItem>
                        <SelectItem value="09">09 - Com Suspensão</SelectItem>
                        <SelectItem value="49">49 - Outras Saídas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">COFINS (%)</Label>
                    <Input 
                      type="number" step="0.01" min="0"
                      value={formData.cofins_percent?.toString() ?? "0"} 
                      onChange={e => setFormData({ ...formData, cofins_percent: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs text-slate-500">CST do IPI</Label>
                    <Select 
                      value={formData.ipi_cst || "99"} 
                      onValueChange={(v) => setFormData({ ...formData, ipi_cst: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione o CST" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="50">50 - Saída Tributada</SelectItem>
                        <SelectItem value="51">51 - Saída (Alíquota Zero)</SelectItem>
                        <SelectItem value="52">52 - Saída Isenta</SelectItem>
                        <SelectItem value="53">53 - Saída Não-Tributada</SelectItem>
                        <SelectItem value="54">54 - Saída Imune</SelectItem>
                        <SelectItem value="55">55 - Saída com Suspensão</SelectItem>
                        <SelectItem value="99">99 - Outras Saídas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">IPI (%)</Label>
                    <Input 
                      type="number" step="0.01" min="0"
                      value={formData.ipi_percent?.toString() ?? "0"} 
                      onChange={e => setFormData({ ...formData, ipi_percent: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">CFOP Padrão</Label>
                  <Input 
                    value={formData.cfop || "5102"} 
                    onChange={e => setFormData({ ...formData, cfop: e.target.value })}
                    placeholder="Ex: 5102"
                    className="h-9"
                  />
                </div>
              </div>
            </details>

            {isEditing && formData.format === 'MP' && paRelationships.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Produtos Acabáveis Gerados (PA)</h3>
                <p className="text-xs text-slate-500">
                  Estes são os produtos de venda gerados automaticamente pelo sistema a partir desta Matéria-Prima.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {paRelationships.map((rel: any) => (
                    <div key={rel.id} className="flex flex-col p-3 border rounded-lg bg-slate-50 border-slate-100">
                      <span className="font-medium text-slate-700 text-sm">{rel.pa_variant?.sku}</span>
                      <span className="text-xs text-slate-500">{rel.pa_variant?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </TabsContent>
            
            {isEditing && (formData.format === 'MP' || formData.format === 'Insumo') && (
              <TabsContent value="estoque" className="flex-1 overflow-y-auto p-6 m-0 outline-none">
                <ProductStockTab product={product} />
              </TabsContent>
            )}
          </Tabs>

          <SheetFooter className="p-6 border-t mt-auto bg-white">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Salvar Produto"}
            </Button>
          </SheetFooter>
        </form>

        {/* Modais de Cadastro Rápido */}
        <QuickAddModelagem
          open={qaModelagem}
          onOpenChange={setQaModelagem}
          onCreated={(id) => setFormData(prev => ({ ...prev, model_id: id }))}
        />
        <QuickAddTecido
          open={qaTecido}
          onOpenChange={setQaTecido}
          onCreated={(id) => setFormData(prev => ({ ...prev, fabric_id: id }))}
        />
        <QuickAddCor
          open={qaCor}
          onOpenChange={setQaCor}
          onCreated={(id) => setFormData(prev => ({ ...prev, color_id: id }))}
        />
        <QuickAddGrade
          open={qaGrade}
          onOpenChange={setQaGrade}
          onCreated={(_id, name) => setFormData(prev => ({ ...prev, size_grid: name }))}
        />
        <QuickAddCategoria
          open={qaCategoria}
          onOpenChange={setQaCategoria}
          onCreated={(_id, name) => setFormData(prev => ({ ...prev, category: name }))}
        />
        <QuickAddFornecedor 
          open={qaFornecedor} 
          onOpenChange={setQaFornecedor} 
          onCreated={(id) => setFormData({ ...formData, supplier_id: id })}
        />
      </SheetContent>
    </Sheet>
  );
}
