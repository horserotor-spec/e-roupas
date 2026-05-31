import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Product, ProductVariation, useCreateProduct, useUpdateProduct } from "@/lib/api/products";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface ProductFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormDrawer({ open, onOpenChange, product }: ProductFormDrawerProps) {
  const isEditing = !!product;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: 0,
    cost_price: 0,
    format: "Simples",
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
    active: true,
  });

  const [variations, setVariations] = useState<Partial<ProductVariation>[]>([]);

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          price: product.price || 0,
          cost_price: product.cost_price || 0,
          format: product.format || "Simples",
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
          active: product.active ?? true,
        });
        setVariations(product.variations || []);
      } else {
        setFormData({
          name: "",
          sku: "",
          price: 0,
          cost_price: 0,
          format: "Simples",
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
          active: true,
        });
        setVariations([]);
      }
    }
  }, [open, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = { 
        ...formData,
        variations: formData.format === "Com Variação" ? variations as ProductVariation[] : [] 
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: product.id, ...dataToSave });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(dataToSave);
        toast.success("Produto criado com sucesso!");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const addVariation = () => {
    let baseSku = formData.sku;
    if (!baseSku && formData.name) {
      baseSku = formData.name.substring(0, 3).toUpperCase();
    }
    const newSku = baseSku ? `${baseSku}-VAR${variations.length + 1}` : "";

    setVariations([
      ...variations,
      { name: "", sku: newSku, price: null, stock: 0 }
    ]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const newVars = [...variations];
    newVars[index] = { ...newVars[index], [field]: value };
    setVariations(newVars);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto w-full p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-2 border-b">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</SheetTitle>
                <SheetDescription>
                  Configure as informações do produto, preços e estoque.
                </SheetDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="active" className="text-xs text-muted-foreground">
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

          <Tabs defaultValue="basico" className="flex-1 flex flex-col">
            <div className="px-6 pt-4 border-b bg-muted/20">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6 rounded-none">
                <TabsTrigger value="basico" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3">Dados Básicos</TabsTrigger>
                <TabsTrigger value="caract" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3">Características</TabsTrigger>
                <TabsTrigger value="trib" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3">Tributação</TabsTrigger>
                <TabsTrigger value="estoque" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3">Estoque</TabsTrigger>
                {formData.format === "Com Variação" && (
                  <TabsTrigger value="var" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3 text-primary">Variações</TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* DADOS BÁSICOS */}
              <TabsContent value="basico" className="m-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Produto *</Label>
                    <Input 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Camiseta Básica Algodão"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Código (SKU)</Label>
                      <Input 
                        value={formData.sku || ""} 
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="CAM-BAS-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Formato</Label>
                      <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simples">Simples</SelectItem>
                          <SelectItem value="Com Variação">Com Variação</SelectItem>
                          <SelectItem value="Composição">Composição</SelectItem>
                          <SelectItem value="Serviço">Serviço</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço de Venda (R$)</Label>
                      <Input 
                        type="number" step="0.01" min="0"
                        value={formData.price?.toString() || (formData.price === 0 ? "0" : "")} 
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço de Custo (R$)</Label>
                      <Input 
                        type="number" step="0.01" min="0"
                        value={formData.cost_price?.toString() || (formData.cost_price === 0 ? "0" : "")} 
                        onChange={e => setFormData({ ...formData, cost_price: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unidade</Label>
                      <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="UN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UN">Unidade (UN)</SelectItem>
                          <SelectItem value="PC">Peça (PC)</SelectItem>
                          <SelectItem value="CX">Caixa (CX)</SelectItem>
                          <SelectItem value="KG">Quilograma (KG)</SelectItem>
                          <SelectItem value="PR">Par (PR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* CARACTERÍSTICAS */}
              <TabsContent value="caract" className="m-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Input 
                      value={formData.brand || ""} 
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Marca do produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input 
                      value={formData.category || ""} 
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Camisetas"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Condição</Label>
                    <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Novo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Usado">Usado</SelectItem>
                        <SelectItem value="Recondicionado">Recondicionado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Peso Líquido (kg)</Label>
                    <Input 
                      type="number" step="0.001" min="0"
                      value={formData.net_weight?.toString() || (formData.net_weight === 0 ? "0" : "")} 
                      onChange={e => setFormData({ ...formData, net_weight: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Peso Bruto (kg)</Label>
                    <Input 
                      type="number" step="0.001" min="0"
                      value={formData.gross_weight?.toString() || (formData.gross_weight === 0 ? "0" : "")} 
                      onChange={e => setFormData({ ...formData, gross_weight: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TRIBUTAÇÃO */}
              <TabsContent value="trib" className="m-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>GTIN/EAN (Código de Barras)</Label>
                    <Input 
                      value={formData.gtin_ean || ""} 
                      onChange={e => setFormData({ ...formData, gtin_ean: e.target.value })}
                      placeholder="Sem GTIN"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NCM</Label>
                      <Input 
                        value={formData.ncm || ""} 
                        onChange={e => setFormData({ ...formData, ncm: e.target.value })}
                        placeholder="0000.00.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CEST</Label>
                      <Input 
                        value={formData.cest || ""} 
                        onChange={e => setFormData({ ...formData, cest: e.target.value })}
                        placeholder="00.000.00"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ESTOQUE */}
              <TabsContent value="estoque" className="m-0 space-y-6">
                {formData.format === "Com Variação" ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg text-sm">
                    O estoque de produtos com variação é controlado individualmente na aba "Variações".
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estoque Mínimo</Label>
                      <Input 
                        type="number" min="0"
                        value={formData.min_stock?.toString() || (formData.min_stock === 0 ? "0" : "")} 
                        onChange={e => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estoque Máximo</Label>
                      <Input 
                        type="number" min="0"
                        value={formData.max_stock?.toString() || (formData.max_stock === 0 ? "0" : "")} 
                        onChange={e => setFormData({ ...formData, max_stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* VARIAÇÕES */}
              {formData.format === "Com Variação" && (
                <TabsContent value="var" className="m-0 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Grade do Produto</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                      <Plus className="size-4 mr-2" /> Adicionar Variação
                    </Button>
                  </div>

                  {variations.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                      Nenhuma variação adicionada ainda.<br/>
                      Ex: Tamanho: M, Cor: Azul
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variations.map((v, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-lg relative group">
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5 md:col-span-2">
                              <Label className="text-[10px] uppercase text-muted-foreground">Nome (Ex: Cor:Preto;Tamanho:P)</Label>
                              <Input 
                                value={v.name || ""} 
                                onChange={e => updateVariation(idx, "name", e.target.value)} 
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase text-muted-foreground">Estoque</Label>
                              <Input 
                                type="number" min="0"
                                value={v.stock?.toString() || (v.stock === 0 ? "0" : "")} 
                                onChange={e => updateVariation(idx, "stock", parseInt(e.target.value) || 0)} 
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase text-muted-foreground">SKU (Opcional)</Label>
                              <Input 
                                value={v.sku || ""} 
                                onChange={e => updateVariation(idx, "sku", e.target.value)} 
                                className="h-8"
                              />
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 absolute top-2 right-2 md:relative md:top-auto md:right-auto md:mt-5" 
                            onClick={() => removeVariation(idx)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}
            </div>
          </Tabs>

          <SheetFooter className="p-6 pt-2 border-t mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Salvar Produto"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
