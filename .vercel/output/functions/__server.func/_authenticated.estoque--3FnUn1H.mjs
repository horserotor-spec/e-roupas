import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { x as useStockMovements, s as useProductVariants, q as useInventoryBatches, y as useSuppliers, r as useModels, c as useColors, p as useFabrics, t as useSaveProductVariant, g as useCreateInventoryEntryGrid, z as useSuppliersCRM, u as useAdjustInventoryBatch, v as useSaveSupplier } from "./_ssr/inventory-DH0foUP4.mjs";
import { y as supabase, B as Button, P as Popover, l as PopoverTrigger, k as PopoverContent } from "./_ssr/router-BxmJvJdu.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { T as Textarea } from "./_ssr/textarea-CZ4oHjug.mjs";
import { S as Sheet, a as SheetContent, d as SheetHeader, e as SheetTitle, b as SheetDescription, c as SheetFooter } from "./_ssr/sheet-BhiMmhDE.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { f as useProducts, g as getProductDisplayName } from "./_ssr/product-display-OekIbBbT.mjs";
import { C as CurrencyInput } from "./_ssr/currency-input-a4CB9tfC.mjs";
import { C as Checkbox } from "./_ssr/checkbox-J9E3BJfJ.mjs";
import { f as useOrders, h as useUpdateOrder } from "./_ssr/orders-CbTRcciT.mjs";
import { u as useClients } from "./_ssr/clients-Kv3wTwQs.mjs";
import { a as useQuery, b as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { V as LoaderCircle, h as Boxes, M as FileText, J as FileBox, a4 as Package, ar as Truck, af as Settings, aq as TriangleAlert, I as Factory, ao as TrendingDown, ad as Search, aa as Printer, ac as Save, a9 as Plus, an as Trash2, L as FileSpreadsheet, O as Funnel, ag as Settings2, a6 as Pen, t as CircleMinus, S as Layers } from "./_libs/lucide-react.mjs";
import { R as ResponsiveContainer, d as PieChart, P as Pie, c as Cell, T as Tooltip, L as Legend, b as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, B as Bar } from "./_libs/recharts.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/cmdk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_libs/lodash.mjs";
import "./_libs/react-smooth.mjs";
import "./_libs/prop-types.mjs";
import "./_libs/fast-equals.mjs";
import "./_libs/tiny-invariant.mjs";
import "./_libs/react-is.mjs";
import "./_libs/d3-shape.mjs";
import "./_libs/d3-path.mjs";
import "./_libs/victory-vendor.mjs";
import "./_libs/d3-scale.mjs";
import "./_libs/internmap.mjs";
import "./_libs/d3-array.mjs";
import "./_libs/d3-time-format.mjs";
import "./_libs/d3-time.mjs";
import "./_libs/d3-interpolate.mjs";
import "./_libs/d3-color.mjs";
import "./_libs/d3-format.mjs";
import "./_libs/recharts-scale.mjs";
import "./_libs/decimal.js-light.mjs";
import "./_libs/eventemitter3.mjs";
function SuppliersTab() {
  const [search, setSearch] = reactExports.useState("");
  const { data: suppliers = [], isLoading } = useSuppliers(search);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editingSupplier, setEditingSupplier] = reactExports.useState(null);
  const openNew = () => {
    setEditingSupplier({ active: true, lead_time_days: 0 });
    setDrawerOpen(true);
  };
  const openEdit = (s) => {
    setEditingSupplier(s);
    setDrawerOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Buscar fornecedor...",
            className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNew, className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Novo Fornecedor"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Fornecedor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Contato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Localização" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mx-auto" }) }) }),
        !isLoading && suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.company_name || s.document || "Sem dados fiscais" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: s.email || "Sem email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: s.phone || "Sem telefone" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: s.city || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(s), className: "h-8 w-8 text-muted-foreground hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }) })
        ] }, s.id)),
        !isLoading && suppliers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum fornecedor encontrado." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SupplierFormDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, supplier: editingSupplier })
  ] });
}
function SupplierFormDrawer({ open, onOpenChange, supplier }) {
  const isEditing = !!supplier?.id;
  const saveMutation = useSaveSupplier();
  const [formData, setFormData] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (open && supplier) {
      setFormData({
        ...supplier,
        cnpj: supplier.document || supplier.cnpj || "",
        whatsapp: supplier.phone || supplier.whatsapp || ""
      });
    }
  }, [open, supplier]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Nome é obrigatório.");
      return;
    }
    try {
      await saveMutation.mutateAsync(formData);
      toast.success(isEditing ? "Fornecedor atualizado!" : "Fornecedor criado!");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  const isPending = saveMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-md overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: isEditing ? "Editar Fornecedor" : "Novo Fornecedor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Preencha os dados do fornecedor." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome fantasia *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.name || "", onChange: (e) => setFormData({ ...formData, name: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Razão Social" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.company_name || "", onChange: (e) => setFormData({ ...formData, company_name: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CNPJ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.cnpj || "", onChange: (e) => setFormData({ ...formData, cnpj: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone || "", onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: formData.email || "", onChange: (e) => setFormData({ ...formData, email: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cidade / Estado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.city || "", onChange: (e) => setFormData({ ...formData, city: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.notes || "", onChange: (e) => setFormData({ ...formData, notes: e.target.value }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Salvar"
      ] })
    ] })
  ] }) }) });
}
const COLOR_CODES$1 = {
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
  "preto mescla": "2021"
};
function ConfigTab() {
  const { data: models = [], isLoading: loadModels } = useModels();
  const { data: colors = [], isLoading: loadColors } = useColors();
  const { data: fabrics = [], isLoading: loadFabrics } = useFabrics();
  const isLoading = loadModels || loadColors || loadFabrics;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-muted/40 border-b flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Cores Padrão" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y text-sm max-h-[570px] overflow-y-auto", children: [
        colors.map((m) => {
          const code = COLOR_CODES$1[m.name.toLowerCase()] || m.code;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-4 py-2.5 hover:bg-muted/50 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 rounded-full border flex-shrink-0", style: { backgroundColor: m.hex || "#ccc" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              m.name,
              " ",
              code ? `(COD. ${code})` : ""
            ] })
          ] }, m.id);
        }),
        colors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-4 py-4 text-center text-muted-foreground", children: "Nenhuma cor." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-muted/40 border-b flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Modelos (Models)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y text-sm max-h-64 overflow-y-auto", children: [
          models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-4 py-2 hover:bg-muted/50", children: m.name }, m.id)),
          models.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-4 py-4 text-center text-muted-foreground", children: "Nenhum modelo." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-muted/40 border-b flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Malhas (Fabrics)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y text-sm max-h-64 overflow-y-auto", children: [
          fabrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-4 py-2 hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
              m.grammage ? `Gramatura: ${m.grammage}` : "",
              " ",
              m.composition ? `· Comp: ${m.composition}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase mt-1 flex gap-1 text-slate-500", children: [
              m.supports_dtf && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-1 rounded", children: "DTF" }),
              m.supports_silk && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-1 rounded", children: "Silk" }),
              m.supports_embroidery && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-1 rounded", children: "Bordado" }),
              m.supports_sublimation && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-1 rounded", children: "Sublimação" })
            ] })
          ] }, m.id)),
          fabrics.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-4 py-4 text-center text-muted-foreground", children: "Nenhuma malha." })
        ] })
      ] })
    ] })
  ] });
}
function ProductVariantsTab() {
  const [search, setSearch] = reactExports.useState("");
  const { data: variants = [], isLoading } = useProductVariants(search);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editingVariant, setEditingVariant] = reactExports.useState(null);
  const openNew = () => {
    setEditingVariant({ active: true, size: "M", gender: "Unissex" });
    setDrawerOpen(true);
  };
  const openEdit = (v) => {
    setEditingVariant(v);
    setDrawerOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Buscar por SKU, modelo, malha, cor...",
            className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNew, className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Nova Variante"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "SKU / Modelo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Composição" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Tamanho / Gênero" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mx-auto" }) }) }),
        !isLoading && variants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs font-semibold text-primary", children: v.sku_internal || "SEM-SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-0.5", children: v.models?.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-normal bg-muted/50", children: v.fabrics?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "font-normal bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full border mr-1.5", style: { backgroundColor: v.canonical_colors?.hex || "#ccc" } }),
              v.canonical_colors?.name
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-lg", children: v.size }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: v.gender })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(v), className: "h-8 w-8 text-muted-foreground hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }) })
        ] }, v.id)),
        !isLoading && variants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhuma variante de produto cadastrada." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VariantFormDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, variant: editingVariant })
  ] });
}
function VariantFormDrawer({ open, onOpenChange, variant }) {
  const isEditing = !!variant?.id;
  const saveMutation = useSaveProductVariant();
  const [formData, setFormData] = reactExports.useState({});
  const { data: models = [] } = useModels();
  const { data: fabrics = [] } = useFabrics();
  const { data: colors = [] } = useColors();
  reactExports.useEffect(() => {
    if (open && variant) {
      setFormData(variant);
    }
  }, [open, variant]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.model_id || !formData.fabric_id || !formData.color_id || !formData.size || !formData.gender) {
      toast.error("Preencha todos os campos obrigatórios (Modelo, Malha, Cor, Tamanho, Gênero).");
      return;
    }
    try {
      await saveMutation.mutateAsync(formData);
      toast.success(isEditing ? "Variante atualizada!" : "Variante criada!");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  const isPending = saveMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-md overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-5 text-primary" }),
        " ",
        isEditing ? "Editar Variante" : "Nova Variante Mestre"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "O cadastro mestre que une modelo, malha, cor e grade." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "SKU Interno" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.sku_internal || "", onChange: (e) => setFormData({ ...formData, sku_internal: e.target.value }), placeholder: "Ex: CAM-REG-ALG-PRE-M" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Modelo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.model_id || "", onValueChange: (v) => setFormData({ ...formData, model_id: v }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.name }, m.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Malha *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.fabric_id || "", onValueChange: (v) => setFormData({ ...formData, fabric_id: v }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fabrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.name }, m.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cor Padrão *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.color_id || "", onValueChange: (v) => setFormData({ ...formData, color_id: v }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: colors.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full", style: { backgroundColor: m.hex || "#ccc" } }),
            m.name
          ] }) }, m.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tamanho (Grade) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.size || "", onValueChange: (v) => setFormData({ ...formData, size: v }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["2", "4", "6", "8", "10", "12", "14", "16", "PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gênero *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.gender || "", onValueChange: (v) => setFormData({ ...formData, gender: v }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Unissex", "Masculino", "Feminino", "Infantil"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Salvar Variante"
      ] })
    ] })
  ] }) }) });
}
function InventoryBatchesTab() {
  const { data: batches = [], isLoading } = useInventoryBatches();
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Buscar lote...",
            className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setDrawerOpen(true), className: "h-9 inline-flex items-center gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Nova Entrada (Lote)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Lote / Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Variante Mestre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Fornecedor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 text-orange-600", children: "Reservado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 text-green-600", children: "Disponível" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mx-auto" }) }) }),
        !isLoading && batches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs font-semibold", children: b.batch_code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(b.entry_date).toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-primary", children: b.product_variants?.sku_internal || "Sem SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground line-clamp-1", children: [
              b.product_variants?.models?.name,
              " · ",
              b.product_variants?.fabrics?.name,
              " · ",
              b.product_variants?.canonical_colors?.name,
              " · ",
              b.product_variants?.size
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: b.suppliers?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium", children: b.quantity_total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium text-orange-600", children: b.quantity_reserved }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium text-green-600", children: b.quantity_available }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setAdjustmentOpen(b.id), className: "h-8 text-red-600 hover:text-red-700 hover:bg-red-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "size-4 mr-1.5" }),
            " Saída"
          ] }) })
        ] }, b.id)),
        !isLoading && batches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum lote em estoque." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BatchFormDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen }),
    adjustmentOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchAdjustmentDrawer,
      {
        batchId: adjustmentOpen,
        open: !!adjustmentOpen,
        onOpenChange: (v) => {
          if (!v) setAdjustmentOpen(null);
        }
      }
    )
  ] });
}
function BatchFormDrawer({ open, onOpenChange }) {
  const saveMutation = useCreateInventoryEntryGrid();
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliersCRM();
  const [productId, setProductId] = reactExports.useState("");
  const [supplierId, setSupplierId] = reactExports.useState("");
  const [batchCode, setBatchCode] = reactExports.useState("");
  const [averageCost, setAverageCost] = reactExports.useState(0);
  const [qualityNotes, setQualityNotes] = reactExports.useState("");
  const [gradeType, setGradeType] = reactExports.useState("adulto");
  const [grid, setGrid] = reactExports.useState({});
  const ADULT_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
  const CHILD_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];
  reactExports.useEffect(() => {
    const sizes = gradeType === "adulto" ? ADULT_SIZES : CHILD_SIZES;
    const initialGrid = {};
    sizes.forEach((s) => {
      initialGrid[s] = 0;
    });
    setGrid(initialGrid);
  }, [gradeType]);
  reactExports.useEffect(() => {
    if (open) {
      setProductId("");
      setSupplierId("");
      setBatchCode("");
      setGradeType("adulto");
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const prefix = `LT-${year}${month}${day}-`;
      supabase.from("inventory_batches").select("batch_code").like("batch_code", `${prefix}%`).then(({ data }) => {
        let nextSeq = 1;
        if (data && data.length > 0) {
          const seqs = data.map((item) => {
            const parts = item.batch_code.split("-");
            const seqStr = parts[parts.length - 1];
            return parseInt(seqStr) || 0;
          });
          nextSeq = Math.max(...seqs) + 1;
        }
        setBatchCode(`${prefix}${String(nextSeq).padStart(2, "0")}`);
      }).catch(() => {
        setBatchCode(`${prefix}01`);
      });
      setAverageCost(0);
      setQualityNotes("");
    }
  }, [open]);
  const mpProducts = products.filter((p) => p.format === "MP");
  const handleProductChange = (val) => {
    setProductId(val);
    const selectedProd = mpProducts.find((p) => p.id === val);
    if (selectedProd) {
      setAverageCost(selectedProd.cost_price || 0);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !supplierId || !batchCode) {
      toast.error("Preencha Produto Pai, Fornecedor e Código do Lote.");
      return;
    }
    const hasQty = Object.values(grid).some((qty) => qty > 0);
    if (!hasQty) {
      toast.error("Informe a quantidade para pelo menos um tamanho na grade.");
      return;
    }
    try {
      await saveMutation.mutateAsync({
        product_id: productId,
        supplier_id: supplierId,
        batch_code: batchCode,
        average_cost: averageCost,
        quality_notes: qualityNotes,
        grid
      });
      toast.success("Entrada de estoque por grade realizada com sucesso!");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  const isPending = saveMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-md overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileBox, { className: "size-5 text-indigo-600" }),
        " Nova Entrada por Grade (MP)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Registrar entrada de lote físico gerando variantes automáticas." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Produto Pai MP *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: productId, onValueChange: handleProductChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o produto MP..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: mpProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: p.id, children: [
            getProductDisplayName(p),
            " ",
            p.sku ? `[${p.sku}]` : ""
          ] }, p.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fornecedor de Origem *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: supplierId, onValueChange: setSupplierId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o fornecedor..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.company_name || s.name }, s.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Código do Lote *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: batchCode, onChange: (e) => setBatchCode(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Custo Médio Unitário (R$)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: averageCost, onChange: setAverageCost })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tipo de Grade *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: gradeType, onValueChange: (v) => setGradeType(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a grade..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "adulto", children: "Grade Adulto (PP ao G4)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "infantil", children: "Grade Infantil (2 ao 16)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-700", children: "Grade de Entrada (Quantidades)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2 border p-3 rounded-lg bg-slate-50/50", children: Object.keys(grid).map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold text-slate-500", children: size }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              value: grid[size] || "",
              onChange: (e) => setGrid({ ...grid, [size]: parseInt(e.target.value) || 0 }),
              className: "h-8 text-center text-xs p-1 bg-white"
            }
          )
        ] }, size)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações de Qualidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Ex: Tecido com brilho conforme padrão...", value: qualityNotes, onChange: (e) => setQualityNotes(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Salvar Entrada"
      ] })
    ] })
  ] }) }) });
}
function BatchAdjustmentDrawer({ batchId, open, onOpenChange }) {
  const adjustMutation = useAdjustInventoryBatch();
  const [quantity, setQuantity] = reactExports.useState(1);
  const [notes, setNotes] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }
    if (!notes) {
      toast.error("Informe um motivo para a saída.");
      return;
    }
    try {
      await adjustMutation.mutateAsync({
        batch_id: batchId,
        quantity,
        notes,
        type: "saída"
      });
      toast.success("Saída registrada com sucesso!");
      onOpenChange(false);
      setQuantity(1);
      setNotes("");
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  const isPending = adjustMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2 text-red-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "size-5" }),
        " Saída / Baixa Manual"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Registre uma saída manual deste lote (brinde, defeito, perda, ajuste)." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade a Baixar *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", value: quantity, onChange: (e) => setQuantity(parseInt(e.target.value) || 0) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Motivo da Saída *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Ex: Peça descartada por defeito de fábrica...", value: notes, onChange: (e) => setNotes(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, className: "bg-red-600 hover:bg-red-700 text-white", children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Confirmar Saída"
      ] })
    ] })
  ] }) }) });
}
const COLUMNS_DEF = [
  { id: "date", label: "Data / Hora" },
  { id: "type", label: "Tipo" },
  { id: "user", label: "Usuário" },
  { id: "batch", label: "Lote" },
  { id: "product", label: "Produto" },
  { id: "technical_name", label: "Nome Técnico" },
  { id: "sku", label: "SKU / Tamanho" },
  { id: "qty_before", label: "Estoque Anterior" },
  { id: "qty_move", label: "Movimento" },
  { id: "qty_after", label: "Estoque Atual" },
  { id: "notes", label: "Motivo / Origem" }
];
function RelatorioEstoqueTab() {
  const { data: movements = [], isLoading } = useStockMovements();
  const [filterType, setFilterType] = reactExports.useState("todos");
  const [filterSearch, setFilterSearch] = reactExports.useState("");
  const [visibleColumns, setVisibleColumns] = reactExports.useState([
    "date",
    "product",
    "technical_name",
    "sku",
    "qty_before",
    "qty_move",
    "qty_after"
  ]);
  const filteredMovements = movements.filter((m) => {
    if (filterType !== "todos" && m.movement_type !== filterType) return false;
    if (filterSearch) {
      const searchStr = filterSearch.toLowerCase();
      const variant = m.inventory_batches?.product_variants;
      const matchSku = variant?.sku_internal?.toLowerCase().includes(searchStr);
      const matchBatch = m.inventory_batches?.batch_code?.toLowerCase().includes(searchStr);
      const matchUser = m.users?.name?.toLowerCase().includes(searchStr);
      const matchProduct = variant?.products?.name?.toLowerCase().includes(searchStr);
      const matchTech = variant?.products?.technical_name?.toLowerCase().includes(searchStr);
      if (!matchSku && !matchBatch && !matchUser && !matchProduct && !matchTech) return false;
    }
    return true;
  });
  const exportCSV = () => {
    const headers = ["Data", "Tipo", "Usuário", "Lote", "Produto", "Nome Técnico", "SKU", "Tamanho", "Estoque Anterior", "Movimento", "Estoque Atual", "Motivo"];
    const rows = filteredMovements.map((m) => [
      new Date(m.created_at).toLocaleString("pt-BR"),
      m.movement_type,
      m.users?.name || "Sistema",
      m.inventory_batches?.batch_code || "-",
      m.inventory_batches?.product_variants?.products?.name || "-",
      m.inventory_batches?.product_variants?.products?.technical_name || "-",
      m.inventory_batches?.product_variants?.sku_internal || "-",
      m.inventory_batches?.product_variants?.size || "-",
      m.quantity_before || 0,
      m.quantity,
      m.quantity_after || 0,
      m.notes || "-"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_estoque_${(/* @__PURE__ */ new Date()).getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold tracking-tight text-slate-800", children: "Rastreabilidade de Estoque" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Busque registros e exporte auditorias de movimentação." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportCSV, className: "bg-emerald-600 hover:bg-emerald-700 h-9", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "mr-2 h-4 w-4" }),
        " Exportar Planilha (CSV)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border shadow-sm rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }),
        " Filtros de Auditoria"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Busca Livre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "SKU, Lote, Produto...",
              value: filterSearch,
              onChange: (e) => setFilterSearch(e.target.value),
              className: "h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Tipo de Movimentação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterType, onValueChange: setFilterType, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Todos os tipos" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos os tipos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "compra", children: "Compra / Lote Inicial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ajuste_entrada", children: "Ajuste de Entrada" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ajuste_saida", children: "Ajuste de Saída" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "perda", children: "Perda / Avaria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "transferencia", children: "Transferência Interna" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "consumo", children: "Consumo de Produção" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex flex-col justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Colunas da Tabela" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 justify-start gap-2 border-slate-200 bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Selecionar Colunas (",
                visibleColumns.length,
                ")"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-56 p-3", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Exibir Colunas" }),
              COLUMNS_DEF.map((col) => {
                const checked = visibleColumns.includes(col.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked,
                      onCheckedChange: (isChecked) => {
                        if (isChecked) {
                          setVisibleColumns((prev) => [...prev, col.id]);
                        } else {
                          setVisibleColumns((prev) => prev.filter((c) => c !== col.id));
                        }
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: col.label })
                ] }, col.id);
              })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-xl shadow-sm flex-1 overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-slate-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto mb-3 text-slate-400" }),
      "Carregando log de auditoria..."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto max-h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs whitespace-nowrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-600 border-b sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        visibleColumns.includes("date") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Data / Hora" }),
        visibleColumns.includes("type") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Tipo" }),
        visibleColumns.includes("user") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Usuário" }),
        visibleColumns.includes("batch") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Lote" }),
        visibleColumns.includes("product") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Produto" }),
        visibleColumns.includes("technical_name") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Nome Técnico" }),
        visibleColumns.includes("sku") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "SKU / Tamanho" }),
        visibleColumns.includes("qty_before") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-right", children: "Estoque Anterior" }),
        visibleColumns.includes("qty_move") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-center", children: "Movimento" }),
        visibleColumns.includes("qty_after") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-right", children: "Estoque Atual" }),
        visibleColumns.includes("notes") && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Motivo / Origem" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: filteredMovements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: visibleColumns.length || 1, className: "p-8 text-center text-slate-500", children: "Nenhum registro atende aos filtros atuais." }) }) : filteredMovements.map((mov) => {
        const batch = mov.inventory_batches;
        const variant = batch?.product_variants;
        const isPositive = Number(mov.quantity) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
          visibleColumns.includes("date") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600", children: new Date(mov.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" }) }),
          visibleColumns.includes("type") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium uppercase text-[10px] tracking-wider", children: mov.movement_type.replace("_", " ") }) }),
          visibleColumns.includes("user") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-700 font-medium", children: mov.users?.name || "Sistema" }),
          visibleColumns.includes("batch") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600 font-mono text-[10px]", children: batch?.batch_code || "-" }),
          visibleColumns.includes("product") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-700 font-medium", children: variant?.products?.name || "-" }),
          visibleColumns.includes("technical_name") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600", children: variant?.products?.technical_name || "-" }),
          visibleColumns.includes("sku") && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800", children: variant?.sku_internal || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500", children: [
              "Tam: ",
              variant?.size || "-"
            ] })
          ] }),
          visibleColumns.includes("qty_before") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right font-medium text-slate-500", children: Number(mov.quantity_before || 0) }),
          visibleColumns.includes("qty_move") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold ${isPositive ? "text-blue-600" : "text-red-600"}`, children: [
            isPositive ? "+" : "",
            mov.quantity
          ] }) }),
          visibleColumns.includes("qty_after") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right font-medium text-slate-800", children: Number(mov.quantity_after || 0) }),
          visibleColumns.includes("notes") && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600 max-w-[300px] truncate", title: mov.notes || "-", children: mov.notes || "-" })
        ] }, mov.id);
      }) })
    ] }) }) })
  ] });
}
const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];
const COLOR_CODES = {
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
  "preto mescla": "2021"
};
const defaultSheet = () => ({
  isCorte: true,
  isCostura: true,
  dataEntrada: "",
  entregaPrevista: "",
  malha: "",
  empresa: "",
  corteFaccao: "",
  costuraFaccao: "",
  molde: "",
  modelo: "",
  ribana: "",
  ribanaWidth: "",
  cobreGola: "",
  cobreGolaWidth: "",
  debrum: "",
  debrumWidth: "",
  pedido: "",
  responsavelPedido: "",
  telefoneContato: "",
  pedidoExato: false,
  cortarTudo: false,
  retiradoPor: "",
  aPagarCorte: 0,
  aPagarCostura: 0,
  gradePedido: [],
  rendimentoCorte: [],
  rendimentoCorteEntrada: "",
  rendimentoCorteEntrega: "",
  quantidadeCosturada: [],
  quantidadeCosturadaEntrada: "",
  quantidadeCosturadaEntrega: ""
});
const syncTableRows = (source, target) => {
  return source.map((srcRow) => {
    const existingTargetRow = target.find((t) => t.id === srcRow.id);
    return {
      id: srcRow.id,
      cor: srcRow.cor,
      kg: srcRow.kg,
      modelo: srcRow.modelo,
      activeSizes: srcRow.activeSizes || [],
      quantities: existingTargetRow ? existingTargetRow.quantities : {}
    };
  });
};
function CorteCosturaTab() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const { data: clients = [] } = useClients();
  const suppliers = clients.filter((c) => c.entity_type === "fornecedor");
  const updateOrder = useUpdateOrder();
  const [activeMode, setActiveMode] = reactExports.useState("pedido");
  const [selectedOrderId, setSelectedOrderId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const deferredSearchQuery = reactExports.useDeferredValue(searchQuery);
  const [popoverOpen, setPopoverOpen] = reactExports.useState(false);
  const [sheet, setSheet] = reactExports.useState(defaultSheet());
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const { data: models = [] } = useQuery({
    queryKey: ["product_models"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_models").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });
  const { data: fabrics = [] } = useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fabrics").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });
  const { data: colors = [] } = useQuery({
    queryKey: ["canonical_colors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("canonical_colors").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });
  const { data: cmvCosts = {} } = useQuery({
    queryKey: ["cmv_costs_config"],
    queryFn: async () => {
      const { data } = await supabase.from("system_settings").select("value").eq("key", "cmv_costs_config").maybeSingle();
      return data?.value || {};
    }
  });
  const getCostForModel = (type, modelName) => {
    if (!modelName) return 0;
    const cleanModel = modelName.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, val] of Object.entries(cmvCosts)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanKey === `${type}${cleanModel}`) {
        return Number(val) || 0;
      }
    }
    for (const [key, val] of Object.entries(cmvCosts)) {
      const keyLower = key.toLowerCase();
      if (keyLower.startsWith(type) && keyLower.includes(cleanModel)) {
        return Number(val) || 0;
      }
    }
    for (const [key, val] of Object.entries(cmvCosts)) {
      const keyLower = key.toLowerCase();
      if (keyLower === type || keyLower === `${type}_default` || keyLower === `${type}default` || keyLower === `${type}_peca`) {
        return Number(val) || 0;
      }
    }
    return 0;
  };
  const selectedOrder = reactExports.useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);
  reactExports.useEffect(() => {
    if (activeMode === "pedido" && selectedOrder) {
      let loadedSheet = null;
      if (selectedOrder.internal_notes) {
        try {
          if (selectedOrder.internal_notes.trim().startsWith("{")) {
            loadedSheet = JSON.parse(selectedOrder.internal_notes);
            if (loadedSheet && loadedSheet.gradePedido) {
              loadedSheet.gradePedido = loadedSheet.gradePedido.map((r) => ({
                ...r,
                kg: r.kg !== void 0 ? r.kg : r.rolos !== void 0 ? r.rolos : ""
              }));
            }
            if (loadedSheet && loadedSheet.aPagar !== void 0 && loadedSheet.aPagarCorte === void 0) {
              loadedSheet.aPagarCorte = loadedSheet.aPagar;
            }
          }
        } catch (e) {
          console.warn("Notes are not JSON format:", selectedOrder.internal_notes);
        }
      }
      if (loadedSheet && loadedSheet.gradePedido) {
        loadedSheet.rendimentoCorte = syncTableRows(loadedSheet.gradePedido, loadedSheet.rendimentoCorte || []);
        loadedSheet.quantidadeCosturada = syncTableRows(loadedSheet.gradePedido, loadedSheet.quantidadeCosturada || []);
        setSheet(loadedSheet);
      } else {
        const fresh = defaultSheet();
        fresh.pedido = selectedOrder.code;
        if (selectedOrder.items && selectedOrder.items.length > 0) {
          const groups = {};
          selectedOrder.items.forEach((item) => {
            const modelName = item.model || selectedOrder.items[0]?.product_name?.split(" - ")[0] || "";
            const colorName = item.color || "";
            const size = item.size || "";
            const qty = item.quantity || 0;
            const key = `${modelName}||${colorName}`;
            if (!groups[key]) {
              groups[key] = {
                model: modelName,
                color: colorName,
                quantities: {},
                activeSizes: []
              };
            }
            groups[key].quantities[size] = (groups[key].quantities[size] || 0) + qty;
            if (size && !groups[key].activeSizes.includes(size)) {
              groups[key].activeSizes.push(size);
            }
          });
          const gradePedidoRows = Object.values(groups).map((g) => ({
            id: Math.random().toString(36).substring(7),
            cor: g.color,
            kg: "",
            modelo: g.model,
            quantities: g.quantities,
            activeSizes: g.activeSizes.length > 0 ? g.activeSizes : ["P", "M", "G", "GG"]
          }));
          fresh.gradePedido = gradePedidoRows;
          fresh.rendimentoCorte = syncTableRows(gradePedidoRows, []);
          fresh.quantidadeCosturada = syncTableRows(gradePedidoRows, []);
          if (gradePedidoRows[0]?.modelo) {
            fresh.modelo = gradePedidoRows[0].modelo;
            const lower = fresh.modelo.toLowerCase();
            if (lower.includes("oversized")) {
              fresh.ribana = "6.5";
              fresh.ribanaWidth = "2.5";
            } else {
              fresh.ribana = "4";
              fresh.ribanaWidth = "1.5";
            }
          }
        }
        setSheet(fresh);
      }
    } else if (activeMode === "reposicao") {
      setSheet(defaultSheet());
    }
  }, [selectedOrder, activeMode]);
  reactExports.useEffect(() => {
    if (!cmvCosts || Object.keys(cmvCosts).length === 0) return;
    let calculatedCorte = 0;
    sheet.rendimentoCorte.forEach((row) => {
      const totalPecas = getRowTotal(row);
      const costPerPiece = getCostForModel("corte", row.modelo || sheet.modelo);
      calculatedCorte += totalPecas * costPerPiece;
    });
    let calculatedCostura = 0;
    sheet.quantidadeCosturada.forEach((row) => {
      const totalPecas = getRowTotal(row);
      const costPerPiece = getCostForModel("costura", row.modelo || sheet.modelo);
      calculatedCostura += totalPecas * costPerPiece;
    });
    setSheet((prev) => {
      const finalCorte = Math.round(calculatedCorte * 100) / 100;
      const finalCostura = Math.round(calculatedCostura * 100) / 100;
      if (prev.aPagarCorte !== finalCorte || prev.aPagarCostura !== finalCostura) {
        return {
          ...prev,
          aPagarCorte: finalCorte,
          aPagarCostura: finalCostura
        };
      }
      return prev;
    });
  }, [sheet.rendimentoCorte, sheet.quantidadeCosturada, cmvCosts, sheet.modelo]);
  const filteredOrders = reactExports.useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = deferredSearchQuery === "" || o.code.toLowerCase().includes(deferredSearchQuery.toLowerCase()) || o.client_name.toLowerCase().includes(deferredSearchQuery.toLowerCase());
      const isClientOrder = o.client_name !== "REPOSIÇÃO DE ESTOQUE";
      return matchesSearch && isClientOrder;
    });
  }, [orders, deferredSearchQuery]);
  const addGridRow = (target) => {
    const isInf = sheet.modelo?.toLowerCase().includes("infantil");
    const defaultSizes = isInf ? ["2", "4", "6", "8", "10"] : ["P", "M", "G", "GG"];
    const newRow = {
      id: Math.random().toString(36).substring(7),
      cor: "",
      kg: "",
      modelo: sheet.modelo || "",
      quantities: {},
      activeSizes: defaultSizes
    };
    setSheet((prev) => {
      const updatedGrade = [...prev.gradePedido, newRow];
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade
      };
    });
  };
  const removeGridRow = (target, id) => {
    setSheet((prev) => {
      const updatedGrade = prev.gradePedido.filter((r) => r.id !== id);
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade
      };
    });
  };
  const updateRowField = (target, id, field, value) => {
    setSheet((prev) => {
      const updatedGrade = prev.gradePedido.map((r) => {
        if (r.id === id) {
          const isInf = field === "modelo" ? value.toLowerCase().includes("infantil") : r.modelo?.toLowerCase().includes("infantil");
          const defaultSizes = isInf ? ["2", "4", "6", "8", "10"] : ["P", "M", "G", "GG"];
          return {
            ...r,
            [field]: value,
            ...field === "modelo" && { activeSizes: defaultSizes }
          };
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade
      };
    });
  };
  const addRowSize = (rowId, size) => {
    setSheet((prev) => {
      const updatedGrade = prev.gradePedido.map((r) => {
        if (r.id === rowId) {
          const current = r.activeSizes || [];
          if (!current.includes(size)) {
            return { ...r, activeSizes: [...current, size] };
          }
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade
      };
    });
  };
  const removeRowSize = (rowId, size) => {
    setSheet((prev) => {
      const updatedGrade = prev.gradePedido.map((r) => {
        if (r.id === rowId) {
          const current = r.activeSizes || [];
          return { ...r, activeSizes: current.filter((s) => s !== size) };
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade
      };
    });
  };
  const updateRowQuantity = (target, id, size, value) => {
    setSheet((prev) => ({
      ...prev,
      [target]: prev[target].map((r) => {
        if (r.id === id) {
          const qs = { ...r.quantities, [size]: value };
          return { ...r, quantities: qs };
        }
        return r;
      })
    }));
  };
  const getRowTotal = (row) => {
    return (row.activeSizes || []).reduce((sum, size) => sum + (row.quantities[size] || 0), 0);
  };
  const getTableTotal = (target) => {
    return sheet[target].reduce((sum, row) => sum + getRowTotal(row), 0);
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const jsonStr = JSON.stringify(sheet);
      if (activeMode === "pedido") {
        if (!selectedOrderId) {
          toast.error("Por favor, selecione um pedido.");
          setIsSaving(false);
          return;
        }
        await updateOrder.mutateAsync({
          id: selectedOrderId,
          internal_notes: jsonStr
        });
        let categoryId = null;
        try {
          const { data: cat } = await supabase.from("financial_categories").select("id").eq("name", "Produção").maybeSingle();
          if (cat) {
            categoryId = cat.id;
          } else {
            const { data: newCat } = await supabase.from("financial_categories").insert([{ name: "Produção", type: "pagar" }]).select("id").single();
            categoryId = newCat?.id || null;
          }
        } catch (e) {
          console.warn("Could not load financial category", e);
        }
        if (sheet.aPagarCorte > 0 && sheet.corteFaccao) {
          const corteDesc = `Corte - Pedido ${sheet.pedido || ""} (${sheet.corteFaccao})`;
          const due = sheet.rendimentoCorteEntrega || sheet.entregaPrevista || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const { data: existing } = await supabase.from("financial_transactions").select("id").eq("type", "pagar").eq("description", corteDesc).maybeSingle();
          if (!existing) {
            await supabase.from("financial_transactions").insert([{
              type: "pagar",
              status: "pendente",
              description: corteDesc,
              amount: sheet.aPagarCorte,
              original_amount: sheet.aPagarCorte,
              due_date: due,
              category_id: categoryId,
              notes: `Gerado via Ficha de Corte e Costura para o fornecedor de Corte. Pedido: ${sheet.pedido || ""}`,
              cost_center: "Produção"
            }]);
          }
        }
        if (sheet.aPagarCostura > 0 && sheet.costuraFaccao) {
          const costuraDesc = `Costura - Pedido ${sheet.pedido || ""} (${sheet.costuraFaccao})`;
          const due = sheet.quantidadeCosturadaEntrega || sheet.entregaPrevista || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const { data: existing } = await supabase.from("financial_transactions").select("id").eq("type", "pagar").eq("description", costuraDesc).maybeSingle();
          if (!existing) {
            await supabase.from("financial_transactions").insert([{
              type: "pagar",
              status: "pendente",
              description: costuraDesc,
              amount: sheet.aPagarCostura,
              original_amount: sheet.aPagarCostura,
              due_date: due,
              category_id: categoryId,
              notes: `Gerado via Ficha de Corte e Costura para o fornecedor de Costura. Pedido: ${sheet.pedido || ""}`,
              cost_center: "Produção"
            }]);
          }
        }
        toast.success("Ficha Corte-Costura salva e lançamentos financeiros gerados!");
      } else {
        let { data: repClient, error: clientErr } = await supabase.from("clients").select("id").eq("name", "REPOSIÇÃO DE ESTOQUE").maybeSingle();
        if (clientErr) throw clientErr;
        if (!repClient) {
          const { data: newClient, error: createClientErr } = await supabase.from("clients").insert({
            name: "REPOSIÇÃO DE ESTOQUE",
            entity_type: "cliente",
            document: "00000000000",
            email: "reposicao@e-roupas.com"
          }).select().single();
          if (createClientErr) throw createClientErr;
          repClient = newClient;
        }
        const code = `REP-${Date.now().toString().slice(-6)}`;
        const { data: newOrder, error: orderErr } = await supabase.from("orders").insert({
          code,
          client_id: repClient.id,
          status: "corte",
          internal_notes: jsonStr,
          final_total: 0
        }).select().single();
        if (orderErr) throw orderErr;
        toast.success(`Ficha de Reposição de Estoque criada com sucesso! Código: ${code}`);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    } catch (e) {
      toast.error("Erro ao salvar ficha: " + e.message);
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-[1400px] mx-auto font-sans pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm !important;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, footer, .print\\:hidden, [role="tablist"] {
            display: none !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force standard multi-column grid layouts in print */
          .grid {
            display: grid !important;
          }
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          .grid-cols-2, .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .lg\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .lg\\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
          /* Make spacing tighter to fit on a single A4 page */
          .space-y-8 > * + * {
            margin-top: 6px !important;
          }
          .space-y-6 > * + * {
            margin-top: 4px !important;
          }
          .space-y-4 > * + * {
            margin-top: 4px !important;
          }
          .space-y-3 > * + * {
            margin-top: 3px !important;
          }
          .p-6 {
            padding: 8px !important;
          }
          .p-4 {
            padding: 6px !important;
          }
          .h-9 {
            height: 22px !important;
          }
          .h-10 {
            height: 26px !important;
          }
          .h-8 {
            height: 20px !important;
          }
          /* Ensure text and inputs are legible and compact */
          input, select, textarea {
            pointer-events: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 9px !important;
            height: 22px !important;
            padding: 1px 4px !important;
          }
          th, td {
            padding: 2px 4px !important;
            font-size: 9px !important;
          }
          label, span, div, h1, h3 {
            font-size: 9px !important;
          }
          h1.text-3xl {
            font-size: 14px !important;
          }
          h3.text-sm {
            font-size: 10px !important;
          }
          .gap-6 {
            gap: 8px !important;
          }
          .gap-4 {
            gap: 6px !important;
          }
          .pr-6 {
            padding-right: 8px !important;
          }
          .pb-4 {
            padding-bottom: 4px !important;
          }
          .pt-4 {
            padding-top: 4px !important;
          }
          /* Hide interactive hover close button on size items */
          .relative.group button {
            display: none !important;
          }
        }
      ` } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: activeMode === "pedido" ? "default" : "outline",
            onClick: () => setActiveMode("pedido"),
            className: "rounded-full",
            children: "Atrelada a um Pedido"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: activeMode === "reposicao" ? "default" : "outline",
            onClick: () => setActiveMode("reposicao"),
            className: "rounded-full",
            children: "Reposição de Estoque"
          }
        )
      ] }),
      activeMode === "pedido" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold shrink-0 text-muted-foreground", children: "Selecionar Pedido:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: popoverOpen, onOpenChange: setPopoverOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full md:w-64 justify-between bg-white h-9 font-normal border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: selectedOrder ? `${selectedOrder.code} - ${selectedOrder.client_name}` : "Buscar pedido..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 opacity-50 ml-2 shrink-0" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-80 p-2", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Digitar código ou cliente...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "h-8 text-xs",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-1", children: filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 italic p-2 text-center", children: "Nenhum pedido encontrado" }) : filteredOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setSelectedOrderId(o.id);
                  setPopoverOpen(false);
                },
                className: `w-full text-left text-xs p-2 rounded hover:bg-slate-100 transition-colors flex flex-col ${selectedOrderId === o.id ? "bg-slate-50 font-semibold text-primary" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: o.code }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[10px]", children: o.client_name })
                ]
              },
              o.id
            )) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0 w-full md:w-auto justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.print(), variant: "outline", className: "gap-2 border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
          "Imprimir Ficha"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: isSaving, className: "gap-2", children: [
          isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
          "Salvar Ficha CORTE - COSTURA"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-2xl shadow-sm p-6 space-y-8 print-area", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b pb-4 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.png", alt: "Logo", className: "h-10 object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-widest text-slate-900 uppercase", children: "CORTE - COSTURA" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-r pr-4 border-slate-100 print:border-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 font-bold text-xs text-slate-700 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: sheet.isCorte,
                  onCheckedChange: (checked) => setSheet({ ...sheet, isCorte: !!checked })
                }
              ),
              "CORTE"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 font-bold text-xs text-slate-700 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: sheet.isCostura,
                  onCheckedChange: (checked) => setSheet({ ...sheet, isCostura: !!checked })
                }
              ),
              "COSTURA"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Data Entrada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.dataEntrada, onChange: (e) => setSheet({ ...sheet, dataEntrada: e.target.value }), className: "h-9 bg-slate-50/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Entrega Prevista" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.entregaPrevista, onChange: (e) => setSheet({ ...sheet, entregaPrevista: e.target.value }), className: "h-9 bg-slate-50/50" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-r pr-4 border-slate-100 print:border-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Empresa (Fornecedor)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sheet.empresa, onValueChange: (v) => setSheet({ ...sheet, empresa: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: s.name }, s.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Facção de Corte" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sheet.corteFaccao, onValueChange: (v) => setSheet({ ...sheet, corteFaccao: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: s.name }, s.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Facção de Costura" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sheet.costuraFaccao, onValueChange: (v) => setSheet({ ...sheet, costuraFaccao: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: s.name }, s.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-r pr-4 border-slate-100 print:border-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Modelo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sheet.modelo,
                onValueChange: (v) => {
                  const lower = v.toLowerCase();
                  let ribana = "4";
                  let ribanaWidth = "1.5";
                  if (lower.includes("oversized")) {
                    ribana = "6.5";
                    ribanaWidth = "2.5";
                  }
                  setSheet({
                    ...sheet,
                    modelo: v,
                    ribana,
                    ribanaWidth
                  });
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Modelo..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.name, children: m.name }, m.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Malha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sheet.malha, onValueChange: (v) => setSheet({ ...sheet, malha: v }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fabrics.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.name, children: f.name }, f.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Retirado Por" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.retiradoPor, onChange: (e) => setSheet({ ...sheet, retiradoPor: e.target.value }), className: "h-9 bg-slate-50/50", placeholder: "Quem retirou..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-r pr-4 border-slate-100 print:border-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Corte Ribana" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.ribana, onChange: (e) => setSheet({ ...sheet, ribana: e.target.value }), className: "h-9 bg-slate-50/50", placeholder: "Ribana..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Ribana Acabada" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.ribanaWidth, onChange: (e) => setSheet({ ...sheet, ribanaWidth: e.target.value }), className: "h-9 bg-slate-50/50 text-center", placeholder: "cm" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Cobre Gola" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.cobreGola, onChange: (e) => setSheet({ ...sheet, cobreGola: e.target.value }), className: "h-9 bg-slate-50/50", placeholder: "Cobre gola..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Cobre Gola Larg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.cobreGolaWidth, onChange: (e) => setSheet({ ...sheet, cobreGolaWidth: e.target.value }), className: "h-9 bg-slate-50/50 text-center", placeholder: "cm" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Debrum" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.debrum, onChange: (e) => setSheet({ ...sheet, debrum: e.target.value }), className: "h-9 bg-slate-50/50", placeholder: "Debrum..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap", children: "Debrum Larg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.debrumWidth, onChange: (e) => setSheet({ ...sheet, debrumWidth: e.target.value }), className: "h-9 bg-slate-50/50 text-center", placeholder: "cm" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-400", children: "Pedido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.pedido, onChange: (e) => setSheet({ ...sheet, pedido: e.target.value }), className: "h-9 bg-slate-50/50", placeholder: "Código..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400", children: "Responsável" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.responsavelPedido, onChange: (e) => setSheet({ ...sheet, responsavelPedido: e.target.value }), className: "h-9 bg-slate-50/50 text-xs px-1.5", placeholder: "Nome..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[9px] font-bold uppercase text-slate-400", children: "Contato" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: sheet.telefoneContato, onChange: (e) => setSheet({ ...sheet, telefoneContato: e.target.value }), className: "h-9 bg-slate-50/50 text-xs px-1.5", placeholder: "Tel..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: sheet.pedidoExato,
                  onCheckedChange: (checked) => setSheet({ ...sheet, pedidoExato: !!checked })
                }
              ),
              "PEDIDO EXATO"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: sheet.cortarTudo,
                  onCheckedChange: (checked) => setSheet({ ...sheet, cortarTudo: !!checked })
                }
              ),
              "CORTAR TUDO"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pt-4 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-slate-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold uppercase tracking-wider", children: "Grade do Pedido (Planejado)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => addGridRow(), className: "h-7 text-xs bg-slate-800 border-none hover:bg-slate-700 text-white print:hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
              " Add Linha"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border rounded-xl bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-medium text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[10px] uppercase text-slate-500 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Cor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center font-bold w-20", children: "KG" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Modelo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold min-w-[280px]", children: "Tamanhos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-bold w-24", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center w-12 print:hidden", children: "Ações" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
              sheet.gradePedido.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.cor, onValueChange: (v) => updateRowField("gradePedido", row.id, "cor", v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 bg-white text-xs border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione...", children: row.cor && (() => {
                    const selectedCol = colors.find((c) => c.name === row.cor);
                    const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full border shrink-0", style: { backgroundColor: selectedCol?.hex || "#ccc" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        row.cor,
                        " ",
                        code ? `(COD. ${code})` : ""
                      ] })
                    ] });
                  })() }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: colors.map((c) => {
                    const code = COLOR_CODES[c.name.toLowerCase()] || c.code;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.name, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3.5 rounded-full border shrink-0", style: { backgroundColor: c.hex || "#ccc" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        c.name,
                        " ",
                        code ? `(COD. ${code})` : ""
                      ] })
                    ] }) }, c.id);
                  }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    step: "any",
                    value: row.kg,
                    onChange: (e) => updateRowField("gradePedido", row.id, "kg", e.target.value),
                    className: "h-8 text-center border-slate-200"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.modelo, onValueChange: (v) => updateRowField("gradePedido", row.id, "modelo", v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 bg-white text-xs border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Modelo..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.name, children: m.name }, m.id)) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-end", children: [
                  (row.activeSizes || []).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 relative group", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: sz }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: 0,
                        className: "h-8 px-1 text-center text-xs w-10 bg-white border border-slate-200 rounded focus:border-green-500",
                        value: row.quantities[sz] === 0 ? "" : row.quantities[sz] || "",
                        onChange: (e) => updateRowQuantity("gradePedido", row.id, sz, parseInt(e.target.value) || 0),
                        placeholder: "0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => removeRowSize(row.id, sz),
                        className: "absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full w-3.5 h-3.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] print:hidden",
                        children: "×"
                      }
                    )
                  ] }, sz)),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-8 text-xs px-2.5 text-green-700 border-green-200 hover:bg-green-50 print:hidden", children: "+" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-48 p-2", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: (row.modelo?.toLowerCase().includes("infantil") ? INFANTIL_SIZES : ADULTO_SIZES).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 text-xs",
                        disabled: (row.activeSizes || []).includes(sz),
                        onClick: () => addRowSize(row.id, sz),
                        children: sz
                      },
                      sz
                    )) }) })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4", children: getRowTotal(row) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-center align-top pt-3 print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeGridRow("gradePedido", row.id), className: "h-8 w-8 text-red-500 hover:bg-red-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
              ] }, row.id)),
              sheet.gradePedido.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "py-8 text-center text-slate-400 italic", children: 'Nenhuma linha adicionada. Clique em "Add Linha" para iniciar.' }) })
            ] }),
            sheet.gradePedido.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-slate-50 font-bold border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-3 text-left", children: "TOTAL GERAL (PLANEJADO):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-primary text-sm font-bold bg-slate-100", children: getTableTotal("gradePedido") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "print:hidden" })
            ] }) })
          ] }) })
        ] }),
        sheet.isCorte && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-blue-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold uppercase tracking-wider font-semibold", children: "Rendimento do Corte (Preenchido pelo Cortador)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-200 print:hidden", children: "Campos de Cor, KG e Modelo sincronizados da grade acima" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border rounded-xl bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-medium text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[10px] uppercase text-slate-500 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Cor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center font-bold w-20", children: "KG" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Modelo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold min-w-[280px]", children: "Tamanhos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-bold w-24", children: "Total" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
              sheet.rendimentoCorte.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-semibold text-slate-700 bg-slate-50/30 align-top", children: (() => {
                  const selectedCol = colors.find((c) => c.name === row.cor);
                  const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full border shrink-0", style: { backgroundColor: selectedCol?.hex || "#ccc" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      row.cor,
                      " ",
                      code ? `(COD. ${code})` : ""
                    ] })
                  ] });
                })() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center text-slate-600 align-top", children: row.kg || "0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-slate-700 align-top", children: row.modelo || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 items-end", children: (row.activeSizes || []).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: sz }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      className: "h-8 px-1 text-center text-xs w-10 bg-white border border-slate-200 rounded focus:border-blue-500",
                      value: row.quantities[sz] === 0 ? "" : row.quantities[sz] || "",
                      onChange: (e) => updateRowQuantity("rendimentoCorte", row.id, sz, parseInt(e.target.value) || 0),
                      placeholder: "0"
                    }
                  )
                ] }, sz)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4", children: getRowTotal(row) })
              ] }, row.id)),
              sheet.rendimentoCorte.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "py-8 text-center text-slate-400 italic", children: "Nenhuma linha sincronizada. Adicione cores na Grade do Pedido para visualizar." }) })
            ] }),
            sheet.rendimentoCorte.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-slate-50 font-bold border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-normal", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs whitespace-nowrap", children: "A Pagar (R$):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.01",
                    className: "w-24 h-7 text-xs bg-white text-right border-slate-300 print:border-slate-200",
                    value: sheet.aPagarCorte || "",
                    onChange: (e) => setSheet({ ...sheet, aPagarCorte: parseFloat(e.target.value) || 0 }),
                    placeholder: "0.00"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-nowrap uppercase", children: "TOTAL RENDIMENTO DO CORTE:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-3 py-1 rounded border border-slate-200 min-w-16 text-center", children: getTableTotal("rendimentoCorte") })
              ] })
            ] }) }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-dashed print:border-none print:bg-transparent print:p-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-500", children: "Data Entrada (Corte)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.rendimentoCorteEntrada, onChange: (e) => setSheet({ ...sheet, rendimentoCorteEntrada: e.target.value }), className: "h-9 bg-white border-slate-200" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-500", children: "Data Entrega (Corte)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.rendimentoCorteEntrega, onChange: (e) => setSheet({ ...sheet, rendimentoCorteEntrega: e.target.value }), className: "h-9 bg-white border-slate-200" })
            ] })
          ] })
        ] }),
        sheet.isCostura && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-indigo-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold uppercase tracking-wider", children: "Quantidade Costurada (Preenchido pela Costureira)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-indigo-200 print:hidden", children: "Campos de Cor, KG e Modelo sincronizados da grade acima" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border rounded-xl bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-medium text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[10px] uppercase text-slate-500 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Cor Original" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center font-bold w-20", children: "KG" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold w-44", children: "Modelo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-bold min-w-[280px]", children: "Tamanhos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-bold w-24", children: "Total" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
              sheet.quantidadeCosturada.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-semibold text-slate-700 bg-slate-50/30 align-top", children: (() => {
                  const selectedCol = colors.find((c) => c.name === row.cor);
                  const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full border shrink-0", style: { backgroundColor: selectedCol?.hex || "#ccc" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      row.cor,
                      " ",
                      code ? `(COD. ${code})` : ""
                    ] })
                  ] });
                })() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center text-slate-600 align-top", children: row.kg || "0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-slate-700 align-top", children: row.modelo || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 items-end", children: (row.activeSizes || []).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: sz }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      className: "h-8 px-1 text-center text-xs w-10 bg-white border border-slate-200 rounded focus:border-indigo-500",
                      value: row.quantities[sz] === 0 ? "" : row.quantities[sz] || "",
                      onChange: (e) => updateRowQuantity("quantidadeCosturada", row.id, sz, parseInt(e.target.value) || 0),
                      placeholder: "0"
                    }
                  )
                ] }, sz)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4", children: getRowTotal(row) })
              ] }, row.id)),
              sheet.quantidadeCosturada.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "py-8 text-center text-slate-400 italic", children: "Nenhuma linha sincronizada. Adicione cores na Grade do Pedido para visualizar." }) })
            ] }),
            sheet.quantidadeCosturada.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-slate-50 font-bold border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-normal", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs whitespace-nowrap", children: "A Pagar (R$):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.01",
                    className: "w-24 h-7 text-xs bg-white text-right border-slate-300 print:border-slate-200",
                    value: sheet.aPagarCostura || "",
                    onChange: (e) => setSheet({ ...sheet, aPagarCostura: parseFloat(e.target.value) || 0 }),
                    placeholder: "0.00"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-nowrap uppercase", children: "TOTAL QUANTIDADE COSTURADA:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-100 px-3 py-1 rounded border border-slate-200 min-w-16 text-center", children: getTableTotal("quantidadeCosturada") })
              ] })
            ] }) }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-dashed print:border-none print:bg-transparent print:p-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-500", children: "Data Entrada (Costura)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.quantidadeCosturadaEntrada, onChange: (e) => setSheet({ ...sheet, quantidadeCosturadaEntrada: e.target.value }), className: "h-9 bg-white border-slate-200" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold uppercase text-slate-500", children: "Data Entrega (Costura)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: sheet.quantidadeCosturadaEntrega, onChange: (e) => setSheet({ ...sheet, quantidadeCosturadaEntrega: e.target.value }), className: "h-9 bg-white border-slate-200" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const TABS = [{
  id: "dashboard",
  label: "Dashboard",
  icon: Boxes
}, {
  id: "corte_costura",
  label: "Ficha de Corte e Costura",
  icon: FileText
}, {
  id: "relatorios",
  label: "Relatórios & Exportação",
  icon: FileBox
}, {
  id: "variantes",
  label: "Variantes (Cadastro)",
  icon: Package
}, {
  id: "lotes",
  label: "Lotes (Entrada)",
  icon: FileBox
}, {
  id: "fornecedores",
  label: "Fornecedores",
  icon: Truck
}, {
  id: "config",
  label: "Configurações",
  icon: Settings
}];
function EstoquePage() {
  const [activeTab, setActiveTab] = reactExports.useState(TABS[0].id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-8 flex-wrap gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Estoque" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Estoque Inteligente" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-1 border-b mb-6 overflow-x-auto pb-px", children: TABS.map((tab) => {
      const active = activeTab === tab.id;
      const Icon = tab.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
        tab.label
      ] }, tab.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      activeTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardTab, {}),
      activeTab === "corte_costura" && /* @__PURE__ */ jsxRuntimeExports.jsx(CorteCosturaTab, {}),
      activeTab === "relatorios" && /* @__PURE__ */ jsxRuntimeExports.jsx(RelatorioEstoqueTab, {}),
      activeTab === "variantes" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductVariantsTab, {}),
      activeTab === "lotes" && /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryBatchesTab, {}),
      activeTab === "fornecedores" && /* @__PURE__ */ jsxRuntimeExports.jsx(SuppliersTab, {}),
      activeTab === "config" && /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigTab, {})
    ] })
  ] });
}
function DashboardTab() {
  const {
    data: batches = [],
    isLoading: isLoadingBatches
  } = useQuery({
    queryKey: ["dashboard_batches"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("inventory_batches").select(`
          *,
          product_variants (
            *,
            models:product_models(*),
            fabrics(*),
            canonical_colors(*)
          )
        `).eq("active", true);
      if (error) throw error;
      return data || [];
    }
  });
  const {
    data: soldItems = [],
    isLoading: isLoadingSold
  } = useQuery({
    queryKey: ["dashboard_sold_items"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("order_items").select("*");
      if (error) throw error;
      return data || [];
    }
  });
  const {
    data: movements = [],
    isLoading: isLoadingMovements
  } = useQuery({
    queryKey: ["dashboard_movements"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("inventory_movements").select(`
          *,
          inventory_batches (
            *,
            product_variants (
              *,
              fabrics(*),
              canonical_colors(*)
            )
          )
        `).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data || [];
    }
  });
  if (isLoadingBatches || isLoadingSold || isLoadingMovements) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-muted-foreground gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin size-8 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Carregando métricas dinâmicas do estoque..." })
    ] });
  }
  const variantBalances = {};
  batches.forEach((b) => {
    const v = b.product_variants;
    if (!v) return;
    if (!variantBalances[v.id]) {
      variantBalances[v.id] = {
        available: 0,
        reserved: 0,
        variant: v
      };
    }
    variantBalances[v.id].available += Number(b.quantity_available) || 0;
    variantBalances[v.id].reserved += Number(b.quantity_reserved) || 0;
  });
  const variantList = Object.values(variantBalances);
  const ruptures = variantList.filter((v) => v.available === 0).length;
  const lowStock = variantList.filter((v) => v.available > 0 && v.available < 15).length;
  const reservedTotal = batches.reduce((acc, b) => acc + (Number(b.quantity_reserved) || 0), 0);
  const activeProducts = variantList.length;
  const colorSales = {};
  const sizeSales = {};
  soldItems.forEach((item) => {
    if (item.color) {
      colorSales[item.color] = (colorSales[item.color] || 0) + (Number(item.quantity) || 0);
    }
    if (item.size) {
      sizeSales[item.size] = (sizeSales[item.size] || 0) + (Number(item.quantity) || 0);
    }
  });
  const colorsData = Object.entries(colorSales).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  const sizesData = Object.entries(sizeSales).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  const fabricConsumption = {};
  const batchConsumption = {};
  const consumptionMovements = movements.filter((m) => Number(m.quantity) < 0);
  consumptionMovements.forEach((m) => {
    const qty = Math.abs(Number(m.quantity));
    const batch = m.inventory_batches;
    const variant = batch?.product_variants;
    const fabricName = variant?.fabrics?.name;
    const batchCode = batch?.batch_code;
    if (fabricName) {
      fabricConsumption[fabricName] = (fabricConsumption[fabricName] || 0) + qty;
    }
    if (batchCode) {
      batchConsumption[batchCode] = (batchConsumption[batchCode] || 0) + qty;
    }
  });
  const fabricsData = Object.entries(fabricConsumption).map(([name, consumo]) => ({
    name,
    consumo
  })).sort((a, b) => b.consumo - a.consumo).slice(0, 7);
  const batchesData = Object.entries(batchConsumption).map(([name, consumo]) => ({
    name,
    consumo
  })).sort((a, b) => b.consumo - a.consumo).slice(0, 7);
  const variantDailyConsumption = {};
  consumptionMovements.forEach((m) => {
    const v = m.inventory_batches?.product_variants;
    if (v) {
      const qty = Math.abs(Number(m.quantity));
      variantDailyConsumption[v.id] = (variantDailyConsumption[v.id] || 0) + qty / 30;
    }
  });
  const rupturePredictions = [];
  variantList.forEach((item) => {
    const dailyUse = variantDailyConsumption[item.variant.id] || 0;
    if (dailyUse > 0) {
      const daysRemaining = item.available / dailyUse;
      if (daysRemaining <= 15) {
        rupturePredictions.push({
          name: `${item.variant.models?.name || "Modelo"} ${item.variant.fabrics?.name || "Malha"} ${item.variant.canonical_colors?.name || "Cor"} (${item.variant.size})`,
          available: item.available,
          dailyUse: dailyUse.toFixed(2),
          daysRemaining: Math.ceil(daysRemaining)
        });
      }
    }
  });
  rupturePredictions.sort((a, b) => a.daysRemaining - b.daysRemaining);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-2xl border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-muted-foreground flex items-center justify-between", children: [
          "Baixo Estoque ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-amber-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-bold text-amber-600", children: lowStock }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Variantes abaixo do estoque de segurança (< 15)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-2xl border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-muted-foreground flex items-center justify-between", children: [
          "Ruptura ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-bold text-red-600", children: ruptures }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Variantes com saldo físico zerado" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-2xl border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-muted-foreground flex items-center justify-between", children: [
          "Estoque Reservado ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Factory, { className: "size-4 text-indigo-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-bold text-indigo-600", children: reservedTotal.toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Matéria-prima alocada para produção" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-2xl border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-muted-foreground flex items-center justify-between", children: [
          "Variantes Ativas ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-slate-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-bold text-slate-700", children: activeProducts }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Total de SKUs físicos cadastrados" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-4 text-slate-800", children: "Top 5 Cores Mais Vendidas" }),
        colorsData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-muted-foreground", children: "Sem dados de venda registrados." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: colorsData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: colorsData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value} un` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-4 text-slate-800", children: "Top 5 Tamanhos Mais Vendidos" }),
        sizesData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-muted-foreground", children: "Sem dados de venda registrados." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: sizesData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: sizesData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value} un` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-4 text-slate-800", children: "Consumo por Malha (Insumos de Produção)" }),
        fabricsData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-muted-foreground", children: "Sem histórico de consumo de malhas." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: fabricsData, margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value} un` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "consumo", fill: "#6366f1", radius: [4, 4, 0, 0], name: "Consumido (un)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-4 text-slate-800", children: "Consumo por Lote de Entrada" }),
        batchesData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-muted-foreground", children: "Sem histórico de consumo de lotes." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: batchesData, margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value} un` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "consumo", fill: "#f43f5e", radius: [4, 4, 0, 0], name: "Consumido (un)" })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b bg-muted/20 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-slate-800", children: "Previsão Inteligente de Ruptura (Próximos 15 dias)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-3.5" }),
          " Análise Preditiva"
        ] })
      ] }),
      rupturePredictions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-xs text-muted-foreground", children: "Excelente! Nenhuma ruptura iminente prevista para os próximos 15 dias com base no histórico de consumo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-medium", children: "Variante (Modelagem + Malha + Cor + Tamanho)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-medium text-center", children: "Saldo Disponível" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-medium text-center", children: "Consumo Diário Médio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-medium text-center text-red-600", children: "Previsão de Esgotamento" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y text-slate-700", children: rupturePredictions.map((pred, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-semibold", children: pred.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-center", children: [
            pred.available,
            " un"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-center text-slate-500", children: [
            pred.dailyUse,
            " un / dia"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-center font-bold text-red-600 bg-red-50/20", children: pred.daysRemaining === 0 ? "Esgota hoje" : `Em ${pred.daysRemaining} dias` })
        ] }, i)) })
      ] }) })
    ] })
  ] });
}
function MovementsTab() {
  const {
    data: movements = [],
    isLoading
  } = useStockMovements();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-slate-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto mb-2" }),
    "Carregando histórico..."
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-xl shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b bg-slate-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-800", children: "Histórico de Movimentações (Auditoria)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs mt-1", children: "Registro imutável de todas as entradas, saídas e ajustes no estoque industrial." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-600 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Data / Hora" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Tipo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Usuário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Lote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "SKU / Tamanho" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-right", children: "Qtd Antes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-center", children: "Movimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4 text-right", children: "Qtd Depois" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-4", children: "Motivo" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: movements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "p-8 text-center text-slate-500", children: "Nenhuma movimentação registrada." }) }) : movements.map((mov) => {
        const batch = mov.inventory_batches;
        const variant = batch?.product_variants;
        const isPositive = Number(mov.quantity) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600", children: new Date(mov.created_at).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium uppercase text-[10px] tracking-wider", children: mov.movement_type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-700 font-medium", children: mov.users?.name || "Sistema" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600 font-mono text-[10px]", children: batch?.batch_code || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800", children: variant?.sku_internal || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500", children: [
              "Tam: ",
              variant?.size || "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right font-medium text-slate-500", children: Number(mov.quantity_before || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold ${isPositive ? "text-blue-600" : "text-red-600"}`, children: [
            isPositive ? "+" : "",
            mov.quantity
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right font-medium text-slate-800", children: Number(mov.quantity_after || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-slate-600 max-w-[200px] truncate", title: mov.notes || "-", children: mov.notes || "-" })
        ] }, mov.id);
      }) })
    ] }) })
  ] });
}
export {
  MovementsTab,
  EstoquePage as component
};
