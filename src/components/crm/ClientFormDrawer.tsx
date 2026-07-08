import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Client, useCreateClient, useUpdateClient } from "@/lib/api/clients";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ClientFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

const applyCpfCnpjMask = (value: string, isPj: boolean) => {
  const digits = value.replace(/\D/g, "");
  if (isPj) {
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  } else {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  }
};

const applyCepMask = (value: string) => {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3").slice(0, 15);
};

export function ClientFormDrawer({ open, onOpenChange, client }: ClientFormDrawerProps) {
  const isEditing = !!client;
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    entity_class: "pf",
    entity_type: "cliente",
    document: "",
    state_registration: "",
    phone: "",
    landline_phone: "",
    email: "",
    email_nfe: "",
    icms_contributor_type: "9",
    instagram: "",
    company_name: "",
    order_contact_name: "",
    order_contact_phone: "",
    lead_source: "Instagram",
    notes: "",
    credit_status: "bom",
    is_first_purchase: true,
    last_purchase_date: "",
    zip_code: "",
    street: "",
    number: "",
    city: "",
    state: "",
    active: true,
    commission_percent: 0,
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  useEffect(() => {
    if (open) {
      if (client) {
        setFormData({
          name: client.name || "",
          entity_class: client.entity_class || "pf",
          entity_type: client.entity_type || "cliente",
          document: client.document || "",
          state_registration: client.state_registration || "",
          phone: client.phone || "",
          landline_phone: client.landline_phone || "",
          email: client.email || "",
          email_nfe: client.email_nfe || "",
          icms_contributor_type: client.icms_contributor_type || "9",
          instagram: client.instagram || "",
          company_name: client.company_name || "",
          order_contact_name: client.order_contact_name || "",
          order_contact_phone: client.order_contact_phone || "",
          lead_source: client.lead_source || "Outros",
          notes: client.notes || "",
          credit_status: client.credit_status || "bom",
          is_first_purchase: client.is_first_purchase ?? true,
          last_purchase_date: client.last_purchase_date ? client.last_purchase_date.substring(0, 10) : "",
          zip_code: client.zip_code || "",
          street: client.street || "",
          number: client.number || "",
          complement: client.complement || "",
          city: client.city || "",
          state: client.state || "",
          active: client.active ?? true,
          commission_percent: client.commission_percent || 0,
        });
      } else {
        setFormData({
          name: "", 
          entity_class: "pf",
          entity_type: "cliente",
          document: "", 
          state_registration: "",
          phone: "", 
          landline_phone: "",
          email: "",
          email_nfe: "",
          icms_contributor_type: "9",
          instagram: "", 
          company_name: "", 
          order_contact_name: "",
          order_contact_phone: "",
          lead_source: "Instagram",
          notes: "", 
          credit_status: "bom",
          is_first_purchase: true,
          last_purchase_date: "",
          zip_code: "",
          street: "",
          number: "",
          complement: "",
          city: "",
          state: "",
          active: true,
          commission_percent: 0,
        });
      }
    }
  }, [open, client]);

  const handleDocumentChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      document: applyCpfCnpjMask(val, prev.entity_class === "pj")
    }));
  };

  const handleEntityClassChange = (v: "pf"|"pj") => {
    setFormData(prev => ({
      ...prev,
      entity_class: v,
      document: applyCpfCnpjMask(prev.document || "", v === "pj")
    }));
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || ""
        }));
        numberInputRef.current?.focus();
      } else {
        toast.error("CEP não encontrado.");
      }
    } catch (err) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = { 
        ...formData, 
        last_purchase_date: formData.last_purchase_date || null 
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: client.id, ...dataToSave });
        toast.success("Cadastro atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(dataToSave);
        toast.success("Cadastro criado com sucesso!");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{isEditing ? "Editar Cadastro" : "Novo Cadastro"}</SheetTitle>
                <SheetDescription>
                  {isEditing ? "Atualize os dados da pessoa ou empresa." : "Preencha os dados básicos do novo cadastro."}
                </SheetDescription>
              </div>
              <div className="flex items-center space-x-2 mr-6">
                <Label htmlFor="active" className="text-xs text-muted-foreground">{formData.active ? "Ativo" : "Inativo"}</Label>
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(v) => setFormData({ ...formData, active: v })}
                />
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-6">
            {/* DADOS PRINCIPAIS */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Dados Principais</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Pessoa</Label>
                  <Select value={formData.entity_class} onValueChange={handleEntityClassChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pf">Pessoa Física (PF)</SelectItem>
                      <SelectItem value="pj">Pessoa Jurídica (PJ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={formData.entity_type} onValueChange={(v: "cliente"|"fornecedor"|"colaborador"|"vendedor"|"socio"|"transportadora") => setFormData({ ...formData, entity_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="transportadora">Transportador</SelectItem>
                      <SelectItem value="colaborador">Colaborador</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.entity_type === "vendedor" && (
                  <div className="space-y-2">
                    <Label>Comissão (%)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.commission_percent || ""} 
                      onChange={e => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) || 0 })}
                      placeholder="Ex: 10"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Nome ou Razão Social *</Label>
                <Input 
                  required 
                  value={formData.name || ""} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maria Silva ou Empresa XYZ Ltda"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{formData.entity_class === "pj" ? "CNPJ" : "CPF"}</Label>
                  <Input 
                    value={formData.document || ""} 
                    onChange={e => handleDocumentChange(e.target.value)}
                    placeholder={formData.entity_class === "pj" ? "00.000.000/0000-00" : "000.000.000-00"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{formData.entity_class === "pj" ? "Inscrição Estadual" : "RG"}</Label>
                  <Input 
                    value={formData.state_registration || ""} 
                    onChange={e => setFormData({ ...formData, state_registration: e.target.value })}
                    placeholder={formData.entity_class === "pj" ? "IE" : "Número do RG"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contribuinte ICMS</Label>
                  <Select 
                    value={formData.icms_contributor_type} 
                    onValueChange={(v) => setFormData({ ...formData, icms_contributor_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Contribuinte ICMS</SelectItem>
                      <SelectItem value="2">2 - Contribuinte isento</SelectItem>
                      <SelectItem value="9">9 - Não contribuinte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contato / Nome Fantasia</Label>
                <Input 
                  value={formData.company_name || ""} 
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Nome fantasia ou nome do contato na empresa"
                />
              </div>

              {formData.entity_class === "pj" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl bg-muted/10">
                  <div className="space-y-2">
                    <Label>Responsável pelos Pedidos</Label>
                    <Input 
                      value={formData.order_contact_name || ""} 
                      onChange={e => setFormData({ ...formData, order_contact_name: e.target.value })}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp do Responsável</Label>
                    <Input 
                      value={formData.order_contact_phone || ""} 
                      onChange={e => setFormData({ ...formData, order_contact_phone: applyPhoneMask(e.target.value) })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-border my-2" />

            {/* CONTATO */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Contato</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Celular / WhatsApp</Label>
                  <Input 
                    value={formData.phone || ""} 
                    onChange={e => setFormData({ ...formData, phone: applyPhoneMask(e.target.value) })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone Fixo</Label>
                  <Input 
                    value={formData.landline_phone || ""} 
                    onChange={e => setFormData({ ...formData, landline_phone: applyPhoneMask(e.target.value) })}
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input 
                    type="email"
                    value={formData.email || ""} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail envio NF</Label>
                  <Input 
                    type="email"
                    value={formData.email_nfe || ""} 
                    onChange={e => setFormData({ ...formData, email_nfe: e.target.value })}
                    placeholder="nfe@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input 
                    value={formData.instagram || ""} 
                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@usuario"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-2" />

            {/* ENDEREÇO */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Endereço</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input 
                      value={formData.zip_code || ""} 
                      onChange={e => {
                        const val = applyCepMask(e.target.value);
                        setFormData({ ...formData, zip_code: val });
                        if (val.length === 9) fetchCep(val);
                      }}
                      onBlur={() => fetchCep(formData.zip_code || "")}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {isLoadingCep && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rua / Logradouro</Label>
                  <Input 
                    value={formData.street || ""} 
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Rua Exemplo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input 
                    ref={numberInputRef}
                    value={formData.number || ""} 
                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input 
                    value={formData.complement || ""} 
                    onChange={e => setFormData({ ...formData, complement: e.target.value })}
                    placeholder="Apto 4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input 
                    value={formData.neighborhood || ""} 
                    onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input 
                    value={formData.city || ""} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UF</Label>
                  <Input 
                    value={formData.state || ""} 
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    maxLength={2}
                    className="uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-2" />

            {/* INFORMAÇÕES EXTRAS */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Informações Extras</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origem do Lead</Label>
                  <Select value={formData.lead_source || ""} onValueChange={(v) => setFormData({ ...formData, lead_source: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status de Crédito</Label>
                  <Select value={formData.credit_status || ""} onValueChange={(v) => setFormData({ ...formData, credit_status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bom">Bom</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="ruim">Ruim (Inadimplente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.entity_type === "cliente" && (
                <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-4">
                  <h3 className="text-sm font-medium">Histórico de Compras</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="first_purchase" 
                      checked={formData.is_first_purchase} 
                      onCheckedChange={(checked) => setFormData({ ...formData, is_first_purchase: !!checked })}
                      disabled
                    />
                    <Label htmlFor="first_purchase" className="text-sm font-normal cursor-not-allowed opacity-70">
                      É a primeira compra deste cliente (Auto-calculado pelo sistema)
                    </Label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea 
                  value={formData.notes || ""} 
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalhes importantes..."
                  className="resize-none h-24"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Cadastro"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
