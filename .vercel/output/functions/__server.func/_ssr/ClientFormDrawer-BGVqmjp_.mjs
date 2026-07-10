import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Sheet, a as SheetContent, d as SheetHeader, e as SheetTitle, b as SheetDescription, c as SheetFooter } from "./sheet-D2lt7x6C.mjs";
import { B as Button } from "./router-C3pqRbRf.mjs";
import { I as Input } from "./input-D7a6tjwM.mjs";
import { L as Label } from "./label-DkxTpSdj.mjs";
import { T as Textarea } from "./textarea-z4ZHWIWX.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-B4kfgWOA.mjs";
import { S as Switch } from "./switch-BF-Fjd0q.mjs";
import { C as Checkbox } from "./checkbox-fhMdhopN.mjs";
import { a as useCreateClient, c as useUpdateClient } from "./clients-B1XUVlvf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { V as LoaderCircle } from "../_libs/lucide-react.mjs";
const applyCpfCnpjMask = (value, isPj) => {
  const digits = value.replace(/\D/g, "");
  if (isPj) {
    return digits.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 18);
  } else {
    return digits.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2").slice(0, 14);
  }
};
const applyCepMask = (value) => {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
};
const applyPhoneMask = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3").slice(0, 15);
};
function ClientFormDrawer({ open, onOpenChange, client, onSuccess }) {
  const isEditing = !!client;
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const numberInputRef = reactExports.useRef(null);
  const [formData, setFormData] = reactExports.useState({
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
    commission_percent: 0
  });
  const [isLoadingCep, setIsLoadingCep] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
          commission_percent: client.commission_percent || 0
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
          commission_percent: 0
        });
      }
    }
  }, [open, client]);
  const handleDocumentChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      document: applyCpfCnpjMask(val, prev.entity_class === "pj")
    }));
  };
  const handleEntityClassChange = (v) => {
    setFormData((prev) => ({
      ...prev,
      entity_class: v,
      document: applyCpfCnpjMask(prev.document || "", v === "pj")
    }));
  };
  const fetchCep = async (cep) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        last_purchase_date: formData.last_purchase_date || null
      };
      if (isEditing) {
        const updated = await updateMutation.mutateAsync({ id: client.id, ...dataToSave });
        toast.success("Cadastro atualizado com sucesso!");
        if (onSuccess) onSuccess(updated);
      } else {
        const created = await createMutation.mutateAsync(dataToSave);
        toast.success("Cadastro criado com sucesso!");
        if (onSuccess) onSuccess(created);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-2xl overflow-y-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: isEditing ? "Editar Cadastro" : "Novo Cadastro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: isEditing ? "Atualize os dados da pessoa ou empresa." : "Preencha os dados básicos do novo cadastro." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mr-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "active", className: "text-xs text-muted-foreground", children: formData.active ? "Ativo" : "Inativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "active",
            checked: formData.active,
            onCheckedChange: (v) => setFormData({ ...formData, active: v })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase text-muted-foreground", children: "Dados Principais" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo de Pessoa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.entity_class, onValueChange: handleEntityClassChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pf", children: "Pessoa Física (PF)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pj", children: "Pessoa Jurídica (PJ)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.entity_type, onValueChange: (v) => setFormData({ ...formData, entity_type: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cliente", children: "Cliente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fornecedor", children: "Fornecedor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "transportadora", children: "Transportador" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "colaborador", children: "Colaborador" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "vendedor", children: "Vendedor" })
              ] })
            ] })
          ] }),
          formData.entity_type === "vendedor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Comissão (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: formData.commission_percent || "",
                onChange: (e) => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) || 0 }),
                placeholder: "Ex: 10"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome ou Razão Social *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              required: true,
              value: formData.name || "",
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "Ex: Maria Silva ou Empresa XYZ Ltda"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: formData.entity_class === "pj" ? "CNPJ" : "CPF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.document || "",
                onChange: (e) => handleDocumentChange(e.target.value),
                placeholder: formData.entity_class === "pj" ? "00.000.000/0000-00" : "000.000.000-00"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: formData.entity_class === "pj" ? "Inscrição Estadual" : "RG" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.state_registration || "",
                onChange: (e) => setFormData({ ...formData, state_registration: e.target.value }),
                placeholder: formData.entity_class === "pj" ? "IE" : "Número do RG"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contribuinte ICMS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.icms_contributor_type,
                onValueChange: (v) => setFormData({ ...formData, icms_contributor_type: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1", children: "1 - Contribuinte ICMS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "2", children: "2 - Contribuinte isento" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "9", children: "9 - Não contribuinte" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contato / Nome Fantasia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formData.company_name || "",
              onChange: (e) => setFormData({ ...formData, company_name: e.target.value }),
              placeholder: "Nome fantasia ou nome do contato na empresa"
            }
          )
        ] }),
        formData.entity_class === "pj" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Responsável pelos Pedidos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.order_contact_name || "",
                onChange: (e) => setFormData({ ...formData, order_contact_name: e.target.value }),
                placeholder: "Ex: João da Silva"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "WhatsApp do Responsável" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.order_contact_phone || "",
                onChange: (e) => setFormData({ ...formData, order_contact_phone: applyPhoneMask(e.target.value) }),
                placeholder: "(00) 00000-0000"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border my-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase text-muted-foreground", children: "Contato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Celular / WhatsApp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.phone || "",
                onChange: (e) => setFormData({ ...formData, phone: applyPhoneMask(e.target.value) }),
                placeholder: "(00) 00000-0000"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone Fixo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.landline_phone || "",
                onChange: (e) => setFormData({ ...formData, landline_phone: applyPhoneMask(e.target.value) }),
                placeholder: "(00) 0000-0000"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "email",
                value: formData.email || "",
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                placeholder: "email@exemplo.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail envio NF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "email",
                value: formData.email_nfe || "",
                onChange: (e) => setFormData({ ...formData, email_nfe: e.target.value }),
                placeholder: "nfe@exemplo.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Instagram" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.instagram || "",
                onChange: (e) => setFormData({ ...formData, instagram: e.target.value }),
                placeholder: "@usuario"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border my-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase text-muted-foreground", children: "Endereço" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CEP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.zip_code || "",
                  onChange: (e) => {
                    const val = applyCepMask(e.target.value);
                    setFormData({ ...formData, zip_code: val });
                    if (val.length === 9) fetchCep(val);
                  },
                  onBlur: () => fetchCep(formData.zip_code || ""),
                  placeholder: "00000-000",
                  maxLength: 9
                }
              ),
              isLoadingCep && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rua / Logradouro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.street || "",
                onChange: (e) => setFormData({ ...formData, street: e.target.value }),
                placeholder: "Rua Exemplo"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Número" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ref: numberInputRef,
                value: formData.number || "",
                onChange: (e) => setFormData({ ...formData, number: e.target.value }),
                placeholder: "123"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Complemento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.complement || "",
                onChange: (e) => setFormData({ ...formData, complement: e.target.value }),
                placeholder: "Apto 4"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bairro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.neighborhood || "",
                onChange: (e) => setFormData({ ...formData, neighborhood: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.city || "",
                onChange: (e) => setFormData({ ...formData, city: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "UF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.state || "",
                onChange: (e) => setFormData({ ...formData, state: e.target.value }),
                maxLength: 2,
                className: "uppercase"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border my-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase text-muted-foreground", children: "Informações Extras" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Origem do Lead" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.lead_source || "", onValueChange: (v) => setFormData({ ...formData, lead_source: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Instagram", children: "Instagram" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "WhatsApp", children: "WhatsApp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Indicação", children: "Indicação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Site", children: "Site" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Outros", children: "Outros" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status de Crédito" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.credit_status || "", onValueChange: (v) => setFormData({ ...formData, credit_status: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "excelente", children: "Excelente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bom", children: "Bom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "regular", children: "Regular" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ruim", children: "Ruim (Inadimplente)" })
              ] })
            ] })
          ] })
        ] }),
        formData.entity_type === "cliente" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4 bg-muted/30 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Histórico de Compras" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "first_purchase",
                checked: formData.is_first_purchase,
                onCheckedChange: (checked) => setFormData({ ...formData, is_first_purchase: !!checked }),
                disabled: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "first_purchase", className: "text-sm font-normal cursor-not-allowed opacity-70", children: "É a primeira compra deste cliente (Auto-calculado pelo sistema)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: formData.notes || "",
              onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
              placeholder: "Detalhes importantes...",
              className: "resize-none h-24"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        isEditing ? "Salvar Alterações" : "Criar Cadastro"
      ] })
    ] })
  ] }) }) });
}
export {
  ClientFormDrawer as C
};
