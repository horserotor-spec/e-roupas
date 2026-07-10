import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { f as useProducts, d as useImportProducts, u as useCloneProduct, c as useDeleteProduct, g as getProductDisplayName, a as useCreateProduct, h as useUpdateProduct, e as useProductRelationships } from "./_ssr/product-display-B-S5rl9B.mjs";
import { a as useAllProductsStockSummary, g as useCreateInventoryEntryGrid, r as useModels, p as useFabrics, c as useColors, z as useSuppliersCRM, w as useSizeGrids, b as useCategories, n as useDeleteModel, m as useDeleteFabric, l as useDeleteColor, o as useDeleteSizeGrid, k as useDeleteCategory, q as useInventoryBatches, h as useCreateModel, f as useCreateFabric, e as useCreateColor, i as useCreateSizeGrid, d as useCreateCategory, j as useCreateSupplierCRM, u as useAdjustInventoryBatch } from "./_ssr/inventory-OsZV1tNe.mjs";
import { B as Button, v as cn, y as supabase, D as Dialog, f as DialogContent, i as DialogHeader, j as DialogTitle, h as DialogFooter, g as DialogDescription } from "./_ssr/router-C3pqRbRf.mjs";
import { c as Root2, T as Trigger, P as Portal2, a as Content2, C as CheckboxItem2, b as ItemIndicator2, e as SubTrigger2, d as SubContent2, I as Item2, R as RadioItem2, L as Label2, S as Separator2 } from "./_libs/radix-ui__react-dropdown-menu.mjs";
import { S as Sheet, a as SheetContent, d as SheetHeader, e as SheetTitle, b as SheetDescription, c as SheetFooter } from "./_ssr/sheet-D2lt7x6C.mjs";
import { I as Input } from "./_ssr/input-D7a6tjwM.mjs";
import { L as Label } from "./_ssr/label-DkxTpSdj.mjs";
import { C as CurrencyInput } from "./_ssr/currency-input-CElMBE7V.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import { S as Switch } from "./_ssr/switch-BF-Fjd0q.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-D7wFeB2Q.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { P as Papa } from "./_libs/papaparse.mjs";
import { L as FileSpreadsheet, V as LoaderCircle, at as Upload, z as Download, a9 as Plus, ad as Search, w as Columns3, g as Box, x as Copy, a6 as Pen, an as Trash2, k as Check, az as WandSparkles, a7 as PenLine, ag as Settings2, aA as X, m as ChevronRight, p as Circle } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function QuickAddModelagem({ open, onOpenChange, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const mutation = useCreateModel();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name });
      toast.success("Modelagem cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Nova Modelagem" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome da Modelagem *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: CAMISETA POLO", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function QuickAddTecido({ open, onOpenChange, onCreated }) {
  const COMPOSICOES = [
    "100% ALGODAO FIO 30.1 PENTEADO",
    "100% ALGODAO FIO 26.1 PENTEADO",
    "100% ALGODAO",
    "67% POLIESTER 33% VISCOSE",
    "67% POLIESTER 33% ALGODAO",
    "50% POLIESTER 50% ALGODAO",
    "58% POLIESTER 42% ALGODAO"
  ];
  const defaultForm = { name: "", grammage: "", composition: "", compositionCustom: "", supports_dtf: true, supports_embroidery: true, supports_silk: true, supports_sublimation: false };
  const [form, setForm] = reactExports.useState(defaultForm);
  const [useCustomComp, setUseCustomComp] = reactExports.useState(false);
  const mutation = useCreateFabric();
  const finalComposition = useCustomComp ? form.compositionCustom : form.composition;
  const handleSubmit = async (e) => {
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
        supports_sublimation: form.supports_sublimation
      });
      toast.success("Tecido cadastrado com sucesso!");
      onCreated(result.id, result.name);
      setForm(defaultForm);
      setUseCustomComp(false);
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  const compatibilidades = [
    { key: "supports_dtf", label: "DTF" },
    { key: "supports_embroidery", label: "Bordado" },
    { key: "supports_silk", label: "Silk" },
    { key: "supports_sublimation", label: "Sublimacao" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Novo Tecido / Malha" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome da Malha *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), placeholder: "Ex: PIQUET PA", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Composição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setUseCustomComp(!useCustomComp), className: "text-xs text-blue-600 hover:text-blue-700", children: useCustomComp ? "Usar lista" : "+ Nova composição" })
        ] }),
        useCustomComp ? /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.compositionCustom, onChange: (e) => setForm({ ...form, compositionCustom: e.target.value }), placeholder: "Ex: 80% Poliéster 20% Algodão", className: "h-9" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: form.composition,
            onChange: (e) => setForm({ ...form, composition: e.target.value }),
            className: "w-full h-9 text-xs rounded-md border border-input bg-background px-3 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione a composição..." }),
              COMPOSICOES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Gramatura" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.grammage, onChange: (e) => setForm({ ...form, grammage: e.target.value }), placeholder: "Ex: 160g/m2", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border rounded-lg p-3 bg-slate-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600", children: "Compatibilidades" }),
        compatibilidades.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: form[key],
              onCheckedChange: (v) => setForm({ ...form, [key]: v })
            }
          )
        ] }, key))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function QuickAddCor({ open, onOpenChange, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const [hex, setHex] = reactExports.useState("#3B82F6");
  const mutation = useCreateColor();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name, hex });
      toast.success("Cor cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      setHex("#3B82F6");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Nova Cor" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome da Cor *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Azul Petroleo", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Cor (Hex)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: hex, onChange: (e) => setHex(e.target.value), className: "h-9 w-16 rounded-lg border cursor-pointer p-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: hex, onChange: (e) => setHex(e.target.value), placeholder: "#000000", className: "h-9 flex-1 font-mono text-sm", maxLength: 7 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg border shadow-sm flex-shrink-0", style: { backgroundColor: hex } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function QuickAddGrade({ open, onOpenChange, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [sizes, setSizes] = reactExports.useState(["P", "M", "G", "GG", "XG"]);
  const [newSize, setNewSize] = reactExports.useState("");
  const mutation = useCreateSizeGrid();
  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (s && !sizes.includes(s)) {
      setSizes([...sizes, s]);
      setNewSize("");
    }
  };
  const removeSize = (s) => setSizes(sizes.filter((x) => x !== s));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || sizes.length === 0) return;
    try {
      const result = await mutation.mutateAsync({ name, sizes, description });
      toast.success("Grade cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      setDescription("");
      setSizes(["P", "M", "G", "GG", "XG"]);
      setNewSize("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Nova Grade de Tamanho" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome da Grade *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Europa", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Descricao" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Ex: XS, S, M, L, XL, XXL", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Tamanhos *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 min-h-[40px] p-2 border rounded-lg bg-slate-50", children: sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-slate-800 text-white text-xs px-2 py-0.5 rounded-full", children: [
          s,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeSize(s), className: "hover:opacity-70 leading-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
        ] }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newSize,
              onChange: (e) => setNewSize(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              },
              placeholder: "Adicionar tamanho (Enter)",
              className: "h-8 text-xs"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: addSize, className: "h-8 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending || sizes.length === 0, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function QuickAddCategoria({ open, onOpenChange, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const mutation = useCreateCategory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name: name.trim(), active: true });
      toast.success("Categoria cadastrada com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[320px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Nova Família / Categoria" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Camisetas", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function QuickAddFornecedor({ open, onOpenChange, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const mutation = useCreateSupplierCRM();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await mutation.mutateAsync({ name });
      toast.success("Fornecedor cadastrado com sucesso!");
      onCreated(result.id, result.name);
      setName("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Erro: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Novo Fornecedor" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome do Fornecedor *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Têxtil Silva", className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
          "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
function MovementModal({ open, onOpenChange, batchId, variantInfo }) {
  const [movementType, setMovementType] = reactExports.useState("ajuste_entrada");
  const [quantity, setQuantity] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const adjustMutation = useAdjustInventoryBatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      toast.warning("Informe uma quantidade válida maior que zero.");
      return;
    }
    if (!reason.trim()) {
      toast.warning("O motivo da movimentação é obrigatório no modelo industrial.");
      return;
    }
    try {
      const isExit = movementType === "ajuste_saida" || movementType === "perda";
      const adjustAmount = isExit ? -quantity : quantity;
      await adjustMutation.mutateAsync({
        batch_id: batchId,
        adjustment: adjustAmount,
        reason: `${movementType.toUpperCase()}: ${reason}`
      });
      toast.success("Movimentação registrada com sucesso!");
      onOpenChange(false);
      setQuantity("");
      setReason("");
    } catch (err) {
      toast.error(err.message || "Erro ao registrar movimentação.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg", children: "Nova Movimentação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-slate-500", children: variantInfo })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-slate-700", children: "Tipo da Movimentação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: movementType, onValueChange: (v) => setMovementType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ajuste_entrada", children: "Entrada (Ajuste)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ajuste_saida", children: "Saída (Ajuste)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "perda", children: "Saída (Perda/Avaria)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "transferencia", children: "Transferência Interna" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-slate-700", children: "Quantidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "1",
              value: quantity,
              onChange: (e) => setQuantity(parseInt(e.target.value) || ""),
              placeholder: "Ex: 5",
              className: "h-9"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-slate-700", children: "Motivo / Observação *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            required: true,
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: "Ex: Amostra enviada ao cliente XYZ",
            className: "h-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: adjustMutation.isPending, className: "bg-slate-900 text-white", children: [
          adjustMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Registrar"
        ] })
      ] })
    ] })
  ] }) });
}
function ProductStockTab({ product }) {
  const { data: batches = [], isLoading } = useInventoryBatches();
  const productBatches = batches.filter((b) => b.product_variants?.product_id === product.id);
  const [movementModalOpen, setMovementModalOpen] = reactExports.useState(false);
  const [selectedBatch, setSelectedBatch] = reactExports.useState(null);
  const [selectedVariantInfo, setSelectedVariantInfo] = reactExports.useState("");
  const handleOpenMovement = (batchId, sku, size) => {
    setSelectedBatch(batchId);
    setSelectedVariantInfo(`SKU: ${sku} | Tamanho: ${size}`);
    setMovementModalOpen(true);
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-xs text-slate-500", children: "Carregando estoque..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 flex flex-col h-full min-h-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800", children: "Controle Industrial de Estoque" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Visualização por Lote e Fornecedor" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 bg-blue-600 hover:bg-blue-700 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
        " Entrada por Grade"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-600 sticky top-0 z-10 border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3", children: "Tecido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3", children: "Cor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3", children: "Fornecedor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3 text-center", children: "Tamanho" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3 text-right", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3 text-right", children: "Reservado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3 text-right text-blue-600", children: "Disponível" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-medium p-3 text-center", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: productBatches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "p-8 text-center text-slate-500", children: "Nenhum lote de estoque encontrado para este produto." }) }) : productBatches.map((batch) => {
        const variant = batch.product_variants;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-slate-700", children: variant?.fabrics?.name || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full border", style: { backgroundColor: variant?.canonical_colors?.hex || "#ccc" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700", children: variant?.canonical_colors?.name || "-" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-slate-700", children: batch.suppliers?.company_name || batch.suppliers?.name || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center font-bold text-slate-800", children: variant?.size }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-medium text-slate-600", children: Number(batch.quantity_total).toFixed(0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-orange-600 font-medium", children: Number(batch.quantity_reserved).toFixed(0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-blue-600 font-bold", children: Number(batch.quantity_available).toFixed(0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50",
              onClick: () => handleOpenMovement(batch.id, variant?.sku_internal || "", variant?.size || ""),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5 mr-1" }),
                " Ajustar"
              ]
            }
          ) })
        ] }, batch.id);
      }) })
    ] }) }),
    selectedBatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MovementModal,
      {
        open: movementModalOpen,
        onOpenChange: setMovementModalOpen,
        batchId: selectedBatch,
        variantInfo: selectedVariantInfo
      }
    )
  ] });
}
function useSkuRules() {
  return useQuery({
    queryKey: ["sku_rules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sku_rules").select("*").eq("active", true);
      if (error) {
        console.error("Failed to fetch sku rules", error);
        return [];
      }
      return data;
    },
    staleTime: 1e3 * 60 * 60
    // 1 hour caching
  });
}
function generateSku(context, rules) {
  const getAbbr = (type, name) => {
    if (!name) return "XXX";
    const rule = rules.find((r) => r.rule_type === type && r.name === name);
    if (rule) return rule.abbreviation;
    const consonants = name.replace(/[^A-Za-z]/g, "").replace(/[aeiouAEIOU]/g, "").toUpperCase();
    return (consonants.length >= 3 ? consonants : name.replace(/[^A-Za-z]/g, "").toUpperCase()).slice(0, 3).padEnd(3, "X");
  };
  const { format, modelName, fabricName, colorName, artCode } = context;
  if (format === "PF") {
    const paCode = `PA-${getAbbr("model", modelName)}-${getAbbr("fabric", fabricName)}-${getAbbr("color", colorName)}`;
    return `${artCode || "ARTEXXX"}-${paCode}`;
  }
  if (format === "MP" || format === "PA") {
    return `${format}-${getAbbr("model", modelName)}-${getAbbr("fabric", fabricName)}-${getAbbr("color", colorName)}`;
  }
  return "";
}
function generateTechnicalName(context) {
  const { format, modelName, fabricName, colorName } = context;
  if (format !== "MP" && format !== "PA" && format !== "PF") {
    return "";
  }
  const parts = [];
  if (modelName) parts.push(modelName);
  if (fabricName) parts.push(fabricName);
  if (colorName) parts.push(colorName);
  return parts.join(" ");
}
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
function ProductFormDrawer({ open, onOpenChange, product }) {
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
  const [qaModelagem, setQaModelagem] = reactExports.useState(false);
  const [qaTecido, setQaTecido] = reactExports.useState(false);
  const [qaCor, setQaCor] = reactExports.useState(false);
  const [qaGrade, setQaGrade] = reactExports.useState(false);
  const [qaCategoria, setQaCategoria] = reactExports.useState(false);
  const [qaFornecedor, setQaFornecedor] = reactExports.useState(false);
  const { data: skuRules = [] } = useSkuRules();
  const [customSkuMode, setCustomSkuMode] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
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
    mix_allowed: false
  });
  const [variations, setVariations] = reactExports.useState([]);
  const [initialStockGrid, setInitialStockGrid] = reactExports.useState({});
  reactExports.useEffect(() => {
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
          mix_allowed: product.mix_allowed || false
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
          mix_allowed: false
        });
        setCustomSkuMode(false);
        setInitialStockGrid({});
      }
    }
  }, [open, product]);
  reactExports.useEffect(() => {
    if (!open) return;
    const tName = generateTechnicalName({
      format: formData.format || "",
      modelName: models.find((m) => m.id === formData.model_id)?.name,
      fabricName: fabrics.find((f) => f.id === formData.fabric_id)?.name,
      colorName: colors.find((c) => c.id === formData.color_id)?.name
    });
    if (tName && formData.technical_name !== tName) {
      setFormData((prev) => ({ ...prev, technical_name: tName }));
    }
    if (!customSkuMode) {
      const generated = generateSku({
        format: formData.format || "",
        modelName: models.find((m) => m.id === formData.model_id)?.name,
        fabricName: fabrics.find((f) => f.id === formData.fabric_id)?.name,
        colorName: colors.find((c) => c.id === formData.color_id)?.name
      }, skuRules);
      if (generated && formData.sku !== generated) {
        setFormData((prev) => ({ ...prev, sku: generated }));
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
  const handleSubmit = async (e) => {
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
      const hasStock = Object.values(initialStockGrid).some((v) => v > 0);
      if (hasStock && productId && dataToSave.format === "MP") {
        if (!dataToSave.supplier_id) {
          toast.warning("Estoque inicial ignorado: É necessário selecionar um fornecedor para registrar o lote.");
        } else {
          await createGridMutation.mutateAsync({
            product_id: productId,
            supplier_id: dataToSave.supplier_id,
            batch_code: `EST-INICIAL-${(/* @__PURE__ */ new Date()).getTime().toString().slice(-6)}`,
            average_cost: dataToSave.cost_price || 0,
            quality_notes: "Estoque Inicial Cadastro",
            grid: initialStockGrid
          });
          toast.success("Variações geradas e estoque registrado!");
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error("ERRO COMPLETO:", error);
      let msg = "";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "object" && error !== null) {
        msg = error.message || "Erro desconhecido do banco de dados";
        if (error.code === "23503") {
          msg = "Conflito de referência (Chave Estrangeira inválida). Verifique os campos selecionados.";
        }
      } else {
        msg = String(error);
      }
      toast.error(msg);
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending || createGridMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "sm:max-w-[50vw] overflow-y-auto w-full p-0 bg-slate-50/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "p-6 pb-4 border-b bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2", children: [
            isEditing ? "Editar Produto" : "Novo Produto",
            formData.format === "PA" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100", children: "Gerado pelo sistema" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { className: "text-xs text-slate-500 mt-1", children: "Configure as informações do produto seguindo a engenharia industrial." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "active", className: "text-xs font-medium text-slate-500", children: formData.active ? "Ativo" : "Inativo" }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "geral", className: "flex-1 flex flex-col min-h-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full max-w-[400px] grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "geral", children: "Detalhes" }),
          isEditing && (formData.format === "MP" || formData.format === "Insumo") && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "estoque", children: "Estoque" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "geral", className: "flex-1 overflow-y-auto p-6 space-y-6 m-0 outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Dados Gerais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome do Produto *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    required: true,
                    value: formData.name,
                    onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                    placeholder: "Ex: Camiseta Básica Algodão",
                    className: "h-9"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Formato / Tipo *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { disabled: formData.format === "PA" || formData.format === "PF", value: formData.format, onValueChange: (v) => setFormData({ ...formData, format: v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MP", children: "MP (Matéria-Prima)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Serviço", children: "Serviço" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Insumo", children: "Insumo" }),
                      formData.format === "PA" && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PA", children: "PA (Produto Acabável)" }),
                      formData.format === "PF" && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PF", children: "PF (Produto Final)" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Unidade de Medida" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: formData.unit || "UN",
                      onChange: (e) => setFormData({ ...formData, unit: e.target.value }),
                      placeholder: "UN, PC, KG",
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Família / Categoria" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaCategoria(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                        " Nova"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: !formData.category || formData.category === "none_category",
                          onClick: async () => {
                            if (confirm("Excluir esta categoria?")) {
                              try {
                                const cat = categories.find((c) => c.name === formData.category);
                                if (cat) await delCategory.mutateAsync(cat.id);
                                setFormData({ ...formData, category: null });
                              } catch (e) {
                                toast.error(e.message);
                              }
                            }
                          },
                          className: "text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category || "none_category", onValueChange: (v) => setFormData({ ...formData, category: v === "none_category" ? null : v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_category", children: "Nenhuma" }),
                      categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.name, children: c.name }, c.id))
                    ] })
                  ] })
                ] }),
                formData.format === "MP" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Grade Aplicável" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaGrade(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                        " Nova"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: !formData.size_grid || formData.size_grid === "none_grid",
                          onClick: async () => {
                            if (confirm("Excluir grade?")) {
                              try {
                                const grid = sizeGrids.find((g) => g.name === formData.size_grid);
                                if (grid) await delGrid.mutateAsync(grid.id);
                                setFormData({ ...formData, size_grid: "" });
                              } catch (e) {
                                toast.error(e.message);
                              }
                            }
                          },
                          className: "text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.size_grid || "none_grid", onValueChange: (v) => setFormData({ ...formData, size_grid: v === "none_grid" ? "" : v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a grade..." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_grid", children: "Nenhuma" }),
                      sizeGrids.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: g.name, children: [
                        g.name,
                        " (",
                        g.sizes.join(", "),
                        ")"
                      ] }, g.id))
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          formData.format === "MP" && formData.size_grid && sizeGrids.find((g) => g.name === formData.size_grid) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Estoque Inicial (Opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100", children: "Gera Variações Automaticamente" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Preencha a quantidade inicial para cada tamanho. O sistema criará as variações (P, M, G, etc.) e o lote de estoque inicial automaticamente ao salvar. Necessita fornecedor selecionado." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2", children: sizeGrids.find((g) => g.name === formData.size_grid).sizes.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600 text-center block font-medium", children: size }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  placeholder: "0",
                  className: "h-9 text-center bg-slate-50",
                  value: initialStockGrid[size] || "",
                  onChange: (e) => setInitialStockGrid({ ...initialStockGrid, [size]: parseInt(e.target.value) || 0 })
                }
              )
            ] }, size)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "SKU Automático" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCustomSkuMode(!customSkuMode),
                  className: "text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1",
                  children: [
                    customSkuMode ? "Voltar ao Automático" : "Personalizar SKU",
                    customSkuMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3 w-3" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "SKU Gerado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: formData.sku || "",
                      onChange: (e) => setFormData({ ...formData, sku: e.target.value }),
                      placeholder: "Ex: MP-REG-PEL-PTO",
                      className: `h-9 font-mono text-sm ${!customSkuMode ? "bg-slate-50 text-slate-600" : ""}`,
                      readOnly: !customSkuMode
                    }
                  ),
                  !customSkuMode && formData.format !== "Serviço" && formData.format !== "Insumo" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400", children: "Gerado a partir do formato, modelagem, malha e cor." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Nome Técnico (Interno)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: formData.technical_name || "",
                      readOnly: true,
                      placeholder: "Ex: Camiseta Regular Poliamida Preto",
                      className: "h-9 bg-slate-50 text-slate-600 text-xs"
                    }
                  )
                ] })
              ] }),
              !customSkuMode && (formData.format === "MP" || formData.format === "PA") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200", children: [
                  "TIPO: ",
                  formData.format
                ] }),
                formData.model_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200", children: [
                  "MOD: ",
                  models.find((m) => m.id === formData.model_id)?.name
                ] }),
                formData.fabric_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200", children: [
                  "TEC: ",
                  fabrics.find((f) => f.id === formData.fabric_id)?.name
                ] }),
                formData.color_id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200", children: (() => {
                  const c = colors.find((col) => col.id === formData.color_id);
                  const code = c ? COLOR_CODES[c.name.toLowerCase()] || c.code : "";
                  return `COR: ${c?.name || ""}${code ? ` (COD. ${code})` : ""}`;
                })() })
              ] })
            ] })
          ] }),
          (formData.format === "MP" || formData.format === "PA") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Engenharia Têxtil" }),
                formData.format === "PA" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200", children: "Herdado do MP" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Modelagem" }),
                    formData.format !== "PA" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaModelagem(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                        " Nova"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: !formData.model_id || formData.model_id === "none_model",
                          onClick: async () => {
                            if (confirm("Excluir modelagem?")) {
                              try {
                                await delModel.mutateAsync(formData.model_id);
                                setFormData({ ...formData, model_id: null });
                              } catch (e) {
                                toast.error(e.message);
                              }
                            }
                          },
                          className: "text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { disabled: formData.format === "PA", value: formData.model_id || "none_model", onValueChange: (v) => setFormData({ ...formData, model_id: v === "none_model" ? null : v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_model", children: "Nenhum" }),
                      models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.name }, m.id))
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Tecido / Malha" }),
                    formData.format !== "PA" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaTecido(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                        " Novo"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: !formData.fabric_id || formData.fabric_id === "none_fabric",
                          onClick: async () => {
                            if (confirm("Excluir tecido?")) {
                              try {
                                await delFabric.mutateAsync(formData.fabric_id);
                                setFormData({ ...formData, fabric_id: null });
                              } catch (e) {
                                toast.error(e.message);
                              }
                            }
                          },
                          className: "text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      disabled: formData.format === "PA",
                      value: formData.fabric_id || "none_fabric",
                      onValueChange: (v) => {
                        const selected = fabrics.find((f) => f.id === v);
                        setFormData({
                          ...formData,
                          fabric_id: v === "none_fabric" ? null : v,
                          fabric_family: selected?.composition || formData.fabric_family || ""
                        });
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_fabric", children: "Nenhum" }),
                          fabrics.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.id, children: f.name }, f.id))
                        ] })
                      ]
                    }
                  )
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Cor Oficial" }),
                formData.format === "PA" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200", children: "Herdado do MP" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Cor Oficial" }),
                    formData.format !== "PA" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaCor(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                        " Nova"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: !formData.color_id || formData.color_id === "none_color",
                          onClick: async () => {
                            if (confirm("Excluir cor?")) {
                              try {
                                await delColor.mutateAsync(formData.color_id);
                                setFormData({ ...formData, color_id: null });
                              } catch (e) {
                                toast.error(e.message);
                              }
                            }
                          },
                          className: "text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { disabled: formData.format === "PA", value: formData.color_id || "none_color", onValueChange: (v) => setFormData({ ...formData, color_id: v === "none_color" ? null : v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_color", children: "Nenhuma" }),
                      colors.map((c) => {
                        const code = COLOR_CODES[c.name.toLowerCase()] || c.code;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full border", style: { backgroundColor: c.hex || "#ccc" } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            c.name,
                            " ",
                            code ? `(COD. ${code})` : ""
                          ] })
                        ] }) }, c.id);
                      })
                    ] })
                  ] })
                ] }),
                formData.format === "MP" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Fornecedor Principal (Estoque)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setQaFornecedor(true), className: "text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                      " Novo"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.supplier_id || "none_supplier", onValueChange: (v) => setFormData({ ...formData, supplier_id: v === "none_supplier" ? null : v }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none_supplier", children: "Nenhum" }),
                      suppliers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_empty", disabled: true, children: "Nenhum fornecedor cadastrado" }),
                      suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.company_name || s.name }, s.id))
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          formData.format === "MP" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Compatibilidade de Personalizações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Compatível com DTF" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: formData.supports_dtf ?? true,
                    onCheckedChange: (v) => setFormData({ ...formData, supports_dtf: v })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Compatível com Bordado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: formData.supports_embroidery ?? true,
                    onCheckedChange: (v) => setFormData({ ...formData, supports_embroidery: v })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Compatível com Silk" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: formData.supports_silk ?? true,
                    onCheckedChange: (v) => setFormData({ ...formData, supports_silk: v })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Compatível com Sublimação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: formData.supports_sublimation ?? false,
                    onCheckedChange: (v) => setFormData({ ...formData, supports_sublimation: v })
                  }
                )
              ] })
            ] })
          ] }),
          formData.format === "Serviço" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Operações de Serviço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Tempo Médio (Minutos)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: formData.lead_time_minutes || "",
                    onChange: (e) => setFormData({ ...formData, lead_time_minutes: parseInt(e.target.value) || 0 }),
                    placeholder: "Ex: 15",
                    className: "h-9"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "SLA de Produção (Dias)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: formData.production_sla_days || "",
                    onChange: (e) => setFormData({ ...formData, production_sla_days: parseInt(e.target.value) || 0 }),
                    placeholder: "Ex: 2",
                    className: "h-9"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Preços & Controle de Estoque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Preço de Venda (R$)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CurrencyInput,
                    {
                      value: formData.price || 0,
                      onChange: (v) => setFormData({ ...formData, price: v }),
                      placeholder: "0,00",
                      className: "h-9"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Preço de Custo (R$)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CurrencyInput,
                    {
                      value: formData.cost_price || 0,
                      onChange: (v) => setFormData({ ...formData, cost_price: v }),
                      placeholder: "0,00",
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              (formData.format === "MP" || formData.format === "Insumo") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Estoque Mínimo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: "0",
                      value: formData.min_stock?.toString() || (formData.min_stock === 0 ? "0" : ""),
                      onChange: (e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 }),
                      placeholder: "Ex: 50",
                      className: "h-9"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Estoque Máximo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: "0",
                      value: formData.max_stock?.toString() || (formData.max_stock === 0 ? "0" : ""),
                      onChange: (e) => setFormData({ ...formData, max_stock: parseInt(e.target.value) || 0 }),
                      placeholder: "Ex: 500",
                      className: "h-9"
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "text-sm font-semibold text-slate-800 cursor-pointer list-none flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tributação & Detalhes Fiscais (NFe)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 group-open:rotate-180 transition-transform", children: "▼" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Código NCM" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: formData.ncm || "",
                      onChange: (e) => setFormData({ ...formData, ncm: e.target.value }),
                      placeholder: "Ex: 6109.10.00",
                      className: "h-9"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Código CEST" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: formData.cest || "",
                      onChange: (e) => setFormData({ ...formData, cest: e.target.value }),
                      placeholder: "Ex: 28.038.00",
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "Origem da Mercadoria" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: formData.origin?.toString() ?? "0",
                    onValueChange: (v) => setFormData({ ...formData, origin: parseInt(v) }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a Origem" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[200px]", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "0", children: "0 - Nacional" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1", children: "1 - Estrangeira - Importação direta" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "2", children: "2 - Estrangeira - Adquirida no mercado interno" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "3", children: "3 - Nacional - Conteúdo de Importação > 40%" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "4", children: "4 - Nacional - Produção conf. processos básicos" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "5", children: "5 - Nacional - Conteúdo de Importação <= 40%" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", children: "6 - Estrangeira - Importação direta, sem similar nac." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "7", children: "7 - Estrangeira - Adq. mercado interno, sem similar nac." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "8", children: "8 - Nacional - Conteúdo de Importação > 70%" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "CST/CSOSN do ICMS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.icms_cst || "102",
                      onValueChange: (v) => setFormData({ ...formData, icms_cst: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o CST/CSOSN" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[200px]", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "101", children: "101 - Simples Nac. com permissão de crédito" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "102", children: "102 - Simples Nac. sem permissão de crédito" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "103", children: "103 - Simples Nac. (Isenção por faixa)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "201", children: "201 - Simples Nac. perm. crédito e ICMS ST" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "202", children: "202 - Simples Nac. sem perm. crédito e ICMS ST" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "300", children: "300 - Simples Nac. (Imune)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "400", children: "400 - Simples Nac. (Não tributada)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "500", children: "500 - Simples Nac. (ICMS ST cobrado antes)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "900", children: "900 - Simples Nac. (Outros)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "00", children: "00 - Normal (Tributada integralmente)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", children: "10 - Normal (Tributada e com ICMS ST)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", children: "20 - Normal (Com redução de BC)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "30", children: "30 - Normal (Isenta/Não trib. e com ICMS ST)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "40", children: "40 - Normal (Isenta)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "41", children: "41 - Normal (Não tributada)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", children: "50 - Normal (Suspensão)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "51", children: "51 - Normal (Diferimento)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "60", children: "60 - Normal (ICMS ST cobrado antes)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "70", children: "70 - Normal (Redução BC e ICMS ST)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "90", children: "90 - Normal (Outras)" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "ICMS (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      value: formData.icms_percent?.toString() ?? "0",
                      onChange: (e) => setFormData({ ...formData, icms_percent: parseFloat(e.target.value.replace(",", ".")) || 0 }),
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "CST do PIS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.pis_cst || "07",
                      onValueChange: (v) => setFormData({ ...formData, pis_cst: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o CST" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[200px]", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "01", children: "01 - Tributável (Básica)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "02", children: "02 - Tributável (Diferenciada)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "03", children: "03 - Tributável (por Unidade)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "04", children: "04 - Tributável Monofásica" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "05", children: "05 - Tributável ICMS ST" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "06", children: "06 - Tributável (Alíquota Zero)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "07", children: "07 - Operação Isenta" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "08", children: "08 - Sem Incidência" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "09", children: "09 - Com Suspensão" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "49", children: "49 - Outras Saídas" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "PIS (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      value: formData.pis_percent?.toString() ?? "0",
                      onChange: (e) => setFormData({ ...formData, pis_percent: parseFloat(e.target.value.replace(",", ".")) || 0 }),
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "CST do COFINS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.cofins_cst || "07",
                      onValueChange: (v) => setFormData({ ...formData, cofins_cst: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o CST" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[200px]", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "01", children: "01 - Tributável (Básica)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "02", children: "02 - Tributável (Diferenciada)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "03", children: "03 - Tributável (por Unidade)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "04", children: "04 - Tributável Monofásica" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "05", children: "05 - Tributável ICMS ST" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "06", children: "06 - Tributável (Alíquota Zero)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "07", children: "07 - Operação Isenta" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "08", children: "08 - Sem Incidência" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "09", children: "09 - Com Suspensão" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "49", children: "49 - Outras Saídas" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "COFINS (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      value: formData.cofins_percent?.toString() ?? "0",
                      onChange: (e) => setFormData({ ...formData, cofins_percent: parseFloat(e.target.value.replace(",", ".")) || 0 }),
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "CST do IPI" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.ipi_cst || "99",
                      onValueChange: (v) => setFormData({ ...formData, ipi_cst: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o CST" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[200px]", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", children: "50 - Saída Tributada" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "51", children: "51 - Saída (Alíquota Zero)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "52", children: "52 - Saída Isenta" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "53", children: "53 - Saída Não-Tributada" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "54", children: "54 - Saída Imune" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "55", children: "55 - Saída com Suspensão" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "99", children: "99 - Outras Saídas" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "IPI (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      value: formData.ipi_percent?.toString() ?? "0",
                      onChange: (e) => setFormData({ ...formData, ipi_percent: parseFloat(e.target.value.replace(",", ".")) || 0 }),
                      className: "h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-500", children: "CFOP Padrão" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: formData.cfop || "5102",
                    onChange: (e) => setFormData({ ...formData, cfop: e.target.value }),
                    placeholder: "Ex: 5102",
                    className: "h-9"
                  }
                )
              ] })
            ] })
          ] }),
          isEditing && formData.format === "MP" && paRelationships.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 tracking-tight", children: "Produtos Acabáveis Gerados (PA)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Estes são os produtos de venda gerados automaticamente pelo sistema a partir desta Matéria-Prima." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2", children: paRelationships.map((rel) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col p-3 border rounded-lg bg-slate-50 border-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 text-sm", children: rel.pa_variant?.sku }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: rel.pa_variant?.name })
            ] }, rel.id)) })
          ] })
        ] }),
        isEditing && (formData.format === "MP" || formData.format === "Insumo") && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "estoque", className: "flex-1 overflow-y-auto p-6 m-0 outline-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductStockTab, { product }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "p-6 border-t mt-auto bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "h-9 text-xs", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, className: "h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium", children: [
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          isEditing ? "Salvar Alterações" : "Salvar Produto"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddModelagem,
      {
        open: qaModelagem,
        onOpenChange: setQaModelagem,
        onCreated: (id) => setFormData((prev) => ({ ...prev, model_id: id }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddTecido,
      {
        open: qaTecido,
        onOpenChange: setQaTecido,
        onCreated: (id) => setFormData((prev) => ({ ...prev, fabric_id: id }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddCor,
      {
        open: qaCor,
        onOpenChange: setQaCor,
        onCreated: (id) => setFormData((prev) => ({ ...prev, color_id: id }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddGrade,
      {
        open: qaGrade,
        onOpenChange: setQaGrade,
        onCreated: (_id, name) => setFormData((prev) => ({ ...prev, size_grid: name }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddCategoria,
      {
        open: qaCategoria,
        onOpenChange: setQaCategoria,
        onCreated: (_id, name) => setFormData((prev) => ({ ...prev, category: name }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickAddFornecedor,
      {
        open: qaFornecedor,
        onOpenChange: setQaFornecedor,
        onCreated: (id) => setFormData({ ...formData, supplier_id: id })
      }
    )
  ] }) });
}
function ProductsPage() {
  const [q, setQ] = reactExports.useState("");
  const deferredQ = reactExports.useDeferredValue(q);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const {
    data: products = [],
    isLoading
  } = useProducts(deferredQ);
  const importMutation = useImportProducts();
  const cloneMutation = useCloneProduct();
  const deleteMutation = useDeleteProduct();
  const [columns, setColumns] = reactExports.useState({
    category: true,
    format: true,
    price: true,
    stock: true,
    status: true
  });
  const openNewProduct = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };
  const openEditProduct = (product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };
  const {
    data: stockSummary = []
  } = useAllProductsStockSummary();
  const stockByProduct = reactExports.useMemo(() => {
    const acc = {};
    stockSummary.forEach((s) => {
      acc[s.product_id] = (acc[s.product_id] || 0) + Number(s.available_qty || 0);
    });
    return acc;
  }, [stockSummary]);
  const calculateTotalStock = (p) => {
    if (p.format === "MP") {
      return stockByProduct[p.id] || p.stock || 0;
    }
    return p.stock || 0;
  };
  const handleExportCSV = () => {
    if (!products.length) {
      toast.info("Nenhum produto para exportar.");
      return;
    }
    const dataToExport = products.map((p) => ({
      Nome: p.name,
      SKU: p.sku || "",
      Preço: p.price || 0,
      Estoque: p.format === "PA" ? "Herdado do MP" : calculateTotalStock(p),
      "Preço Custo": p.cost_price || 0,
      Formato: p.format || "MP",
      Unidade: p.unit || "UN",
      Marca: p.brand || "",
      Categoria: p.category || "",
      Condição: p.condition || "Novo",
      "EAN": p.gtin_ean || "",
      NCM: p.ncm || "",
      CEST: p.cest || "",
      Origem: p.origin ?? 0,
      "CST ICMS": p.icms_cst || "102",
      "Alíquota ICMS": p.icms_percent ?? 0,
      "CST PIS": p.pis_cst || "07",
      "Alíquota PIS": p.pis_percent ?? 0,
      "CST COFINS": p.cofins_cst || "07",
      "Alíquota COFINS": p.cofins_percent ?? 0,
      "CST IPI": p.ipi_cst || "99",
      "Alíquota IPI": p.ipi_percent ?? 0,
      CFOP: p.cfop || "5102",
      Ativo: p.active ? "Sim" : "Não"
    }));
    const csv = Papa.unparse(dataToExport, {
      header: true
    });
    const blob = new Blob([new Uint8Array([239, 187, 191]), csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `produtos_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleDownloadTemplate = () => {
    const templateData = [{
      Nome: "Camiseta Classic Oversized",
      SKU: "CAM-OVER-001",
      Preço: 89.9,
      "Preço Custo": 35,
      Formato: "PA",
      Unidade: "UN",
      Marca: "e-roupas",
      Categoria: "Camisetas",
      Condição: "Novo",
      EAN: "7891234567890",
      NCM: "6109.10.00",
      CEST: "28.038.00",
      Origem: 0,
      "CST ICMS": "102",
      "Alíquota ICMS": 0,
      "CST PIS": "07",
      "Alíquota PIS": 0,
      "CST COFINS": "07",
      "Alíquota COFINS": 0,
      "CST IPI": "99",
      "Alíquota IPI": 0,
      CFOP: "5102"
    }, {
      Nome: "Tecido Meia Malha Fio 30.1 Penteado",
      SKU: "TEC-MALHA-301",
      Preço: 45,
      "Preço Custo": 20,
      Formato: "MP",
      Unidade: "KG",
      Marca: "Tecelagem Fina",
      Categoria: "Tecidos",
      Condição: "Novo",
      EAN: "",
      NCM: "5208.11.00",
      CEST: "",
      Origem: 0,
      "CST ICMS": "102",
      "Alíquota ICMS": 0,
      "CST PIS": "07",
      "Alíquota PIS": 0,
      "CST COFINS": "07",
      "Alíquota COFINS": 0,
      "CST IPI": "99",
      "Alíquota IPI": 0,
      CFOP: "5102"
    }];
    const csv = Papa.unparse(templateData, {
      header: true
    });
    const blob = new Blob([new Uint8Array([239, 187, 191]), csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `modelo_importacao_produtos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;
          if (!rows.length) {
            toast.error("O arquivo CSV está vazio.");
            return;
          }
          const parsedProducts = rows.map((row) => ({
            name: row.Nome || row.name || "Sem Nome",
            sku: row.SKU || row.sku || null,
            price: parseFloat(row.Preço || row.price || 0),
            cost_price: parseFloat(row["Preço Custo"] || row.cost_price || 0),
            format: row.Formato || row.format || "MP",
            unit: row.Unidade || row.unit || "UN",
            brand: row.Marca || row.brand || null,
            category: row.Categoria || row.category || null,
            condition: row.Condição || row.condition || "Novo",
            gtin_ean: row.EAN || row.gtin_ean || null,
            ncm: row.NCM || row.ncm || null,
            cest: row.CEST || row.cest || null,
            origin: parseInt(row.Origem || row.origin || 0),
            icms_cst: row["CST ICMS"] || row.icms_cst || "102",
            icms_percent: parseFloat(row["Alíquota ICMS"] || row.icms_percent || 0),
            pis_cst: row["CST PIS"] || row.pis_cst || "07",
            pis_percent: parseFloat(row["Alíquota PIS"] || row.pis_percent || 0),
            cofins_cst: row["CST COFINS"] || row.cofins_cst || "07",
            cofins_percent: parseFloat(row["Alíquota COFINS"] || row.cofins_percent || 0),
            ipi_cst: row["CST IPI"] || row.ipi_cst || "99",
            ipi_percent: parseFloat(row["Alíquota IPI"] || row.ipi_percent || 0),
            cfop: row.CFOP || row.cfop || "5102",
            active: true
          }));
          const res = await importMutation.mutateAsync(parsedProducts);
          toast.success(`Importação concluída: ${res.imported} adicionados, ${res.skipped} ignorados.`);
        } catch (error) {
          toast.error("Erro na importação: " + error.message);
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        toast.error("Erro ao ler arquivo: " + error.message);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "CADASTROS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Produtos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".csv", className: "hidden", ref: fileInputRef, onChange: handleImportCSV }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5 text-blue-600 hover:text-blue-700 border-blue-200", onClick: handleDownloadTemplate, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4" }),
          "Planilha Modelo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5", onClick: () => fileInputRef.current?.click(), disabled: importMutation.isPending, children: [
          importMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4" }),
          "Importar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5", onClick: handleExportCSV, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
          " Exportar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNewProduct, className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          " Novo Produto"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px] max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Buscar por nome ou SKU...", value: q, onChange: (e) => setQ(e.target.value), className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5 shrink-0 text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Columns3, { className: "size-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Colunas" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuCheckboxItem, { checked: columns.category, onCheckedChange: (v) => setColumns({
            ...columns,
            category: v
          }), children: "Categoria / Marca" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuCheckboxItem, { checked: columns.format, onCheckedChange: (v) => setColumns({
            ...columns,
            format: v
          }), children: "Formato" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuCheckboxItem, { checked: columns.price, onCheckedChange: (v) => setColumns({
            ...columns,
            price: v
          }), children: "Preço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuCheckboxItem, { checked: columns.stock, onCheckedChange: (v) => setColumns({
            ...columns,
            stock: v
          }), children: "Estoque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuCheckboxItem, { checked: columns.status, onCheckedChange: (v) => setColumns({
            ...columns,
            status: v
          }), children: "Situação" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Produto" }),
        columns.category && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Categoria / Marca" }),
        columns.format && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Formato" }),
        columns.price && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Preço (R$)" }),
        columns.stock && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Estoque" }),
        columns.status && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Situação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          " Carregando produtos..."
        ] }) }) }),
        !isLoading && products.map((p) => {
          const totalStock = calculateTotalStock(p);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-900", children: getProductDisplayName(p) }),
              p.sku && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-slate-500 mt-0.5", children: p.sku }),
              p.technical_name && p.technical_name !== getProductDisplayName(p) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 mt-0.5", children: p.technical_name })
            ] }) }),
            columns.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: p.category || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: p.brand || "—" })
            ] }),
            columns.format && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "size-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.format })
            ] }) }),
            columns.price && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right number font-medium", children: p.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            }) }),
            columns.stock && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right number", children: p.format === "MP" ? `${totalStock} (Soma da Grade)` : p.format === "PA" ? "— (Herdado do MP)" : totalStock }),
            columns.status && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`, children: p.active ? "Ativo" : "Inativo" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              p.format === "MP" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                cloneMutation.mutateAsync(p.id).then((cloned) => {
                  if (cloned) {
                    setEditingProduct(cloned);
                    setDrawerOpen(true);
                    toast.success("Produto clonado! Edite e salve.");
                  }
                }).catch((e) => toast.error("Erro ao clonar: " + e.message));
              }, disabled: cloneMutation.isPending, className: "h-8 w-8 text-muted-foreground hover:text-purple-600", title: "Clonar Produto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEditProduct(p), className: "h-8 w-8 text-muted-foreground hover:text-primary", title: "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                if (confirm("Tem certeza que deseja excluir este produto?")) {
                  deleteMutation.mutateAsync(p.id).then(() => toast.success("Produto excluído com sucesso!")).catch((e) => toast.error("Erro ao excluir: " + e.message));
                }
              }, disabled: deleteMutation.isPending, className: "h-8 w-8 text-muted-foreground hover:text-red-600", title: "Excluir Produto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] }) })
          ] }, p.id);
        }),
        !isLoading && products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum produto encontrado." }) })
      ] })
    ] }) }),
    drawerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductFormDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, product: editingProduct })
  ] });
}
export {
  ProductsPage as component
};
