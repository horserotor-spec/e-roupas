import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, u as useBlocker, L as Link } from "./_libs/tanstack__react-router.mjs";
import { P as Popover, l as PopoverTrigger, B as Button, v as cn, k as PopoverContent, C as Command, c as CommandInput, e as CommandList, a as CommandEmpty, b as CommandGroup, d as CommandItem, q as Route$a, y as supabase, w as formatCurrency, D as Dialog, f as DialogContent, i as DialogHeader, j as DialogTitle, h as DialogFooter } from "./_ssr/router-C3pqRbRf.mjs";
import { I as Input } from "./_ssr/input-D7a6tjwM.mjs";
import { C as CurrencyInput } from "./_ssr/currency-input-CElMBE7V.mjs";
import { L as Label } from "./_ssr/label-DkxTpSdj.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import { T as Textarea } from "./_ssr/textarea-z4ZHWIWX.mjs";
import { u as useClients } from "./_ssr/clients-B1XUVlvf.mjs";
import { y as useSuppliers } from "./_ssr/inventory-OsZV1tNe.mjs";
import { S as Switch } from "./_ssr/switch-BF-Fjd0q.mjs";
import { C as ClientFormDrawer } from "./_ssr/ClientFormDrawer-BGVqmjp_.mjs";
import { b as useCreateProductFromBOM, f as useProducts, g as getProductDisplayName } from "./_ssr/product-display-B-S5rl9B.mjs";
import { u as useCreateOrder } from "./_ssr/orders-E2Xxa3Vy.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-D7wFeB2Q.mjs";
import { o as ChevronsUpDown, k as Check, c as ArrowLeft, V as LoaderCircle, a9 as Plus, az as WandSparkles, ac as Save, an as Trash2, N as Flame } from "./_libs/lucide-react.mjs";
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
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
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
import "./_libs/radix-ui__react-switch.mjs";
import "./_ssr/sheet-D2lt7x6C.mjs";
import "./_ssr/checkbox-fhMdhopN.mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];
function SearchableCombobox({
  items,
  value,
  onChange,
  placeholder,
  minChars = 1
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const displayItems = search.length >= minChars ? items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: cn("w-full justify-between h-9 px-3 bg-white font-normal", !value && "text-muted-foreground"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: value ? items.find((i) => i.id === value)?.name : placeholder }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-[300px] p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { shouldFilter: false, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: `Digite ${minChars} letra...`, onValueChange: setSearch, value: search }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
        search.length < minChars && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-center text-sm text-muted-foreground", children: [
          "Digite pelo menos ",
          minChars,
          " letra para buscar."
        ] }),
        search.length >= minChars && displayItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "Nenhum resultado." }),
        search.length >= minChars && /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: displayItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { value: item.id, onSelect: () => {
          onChange(item.id);
          setOpen(false);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-0") }),
          item.name
        ] }, item.id)) })
      ] })
    ] }) })
  ] });
}
function NewOrderPage() {
  const {
    type = "pedido"
  } = Route$a.useSearch();
  const navigate = useNavigate();
  const createMutation = useCreateOrder();
  const createProductMutation = useCreateProductFromBOM();
  const [clientDrawerOpen, setClientDrawerOpen] = reactExports.useState(false);
  const [editingClient, setEditingClient] = reactExports.useState(null);
  const {
    data: clients
  } = useClients();
  const {
    data: products
  } = useProducts();
  const {
    data: suppliers
  } = useSuppliers();
  const carriers = (clients || []).filter((c) => c.entity_type === "transportadora");
  const [brands, setBrands] = reactExports.useState([]);
  const [installmentsCount, setInstallmentsCount] = reactExports.useState(1);
  reactExports.useEffect(() => {
    supabase.from("brands").select("id, name, code").then(({
      data
    }) => {
      if (data) setBrands(data);
    });
  }, []);
  const [formData, setFormData] = reactExports.useState({
    client_id: "",
    brand_id: "",
    salesperson_id: "",
    store: "Matriz",
    business_unit: "",
    delivery_days: 0,
    other_expenses: 0,
    discount: 0,
    sale_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    departure_date: "",
    expected_date: "",
    purchase_order: "",
    payment_category: "Sem categoria",
    payment_condition: "",
    payment_method: "PIX",
    origin_channel: "Internet",
    carrier_name: "",
    freight_payer: "CIF",
    volumes_quantity: 0,
    gross_weight: 0,
    freight_cost: 0,
    logistics_integration: "",
    logistics_type: "Correios",
    delivery_name: "",
    delivery_document: "",
    delivery_phone: "",
    delivery_zip: "",
    delivery_street: "",
    delivery_number: "",
    delivery_complement: "",
    delivery_neighborhood: "",
    delivery_city: "",
    delivery_state: "",
    package_height: 0,
    package_width: 0,
    package_length: 0,
    notes: "",
    internal_notes: "",
    mix_fabrics_allowed: false,
    status: type === "orcamento" ? "orcamento" : "atendimento",
    seller_id: "",
    items: []
  });
  reactExports.useEffect(() => {
    if (formData.client_id && clients) {
      const selectedClient = clients.find((c) => c.id === formData.client_id);
      if (selectedClient && !formData.delivery_zip) {
        setFormData((prev) => ({
          ...prev,
          delivery_name: selectedClient.name || "",
          delivery_document: selectedClient.document || "",
          delivery_phone: selectedClient.phone || "",
          delivery_zip: selectedClient.zip_code || "",
          delivery_street: selectedClient.street || "",
          delivery_number: selectedClient.number || "",
          delivery_complement: selectedClient.complement || "",
          delivery_neighborhood: selectedClient.neighborhood || "",
          delivery_city: selectedClient.city || "",
          delivery_state: selectedClient.state || ""
        }));
      }
    }
  }, [formData.client_id, clients]);
  const emptySizes = {
    "2": 0,
    "4": 0,
    "6": 0,
    "8": 0,
    "10": 0,
    "12": 0,
    "14": 0,
    "16": 0,
    PP: 0,
    P: 0,
    M: 0,
    G: 0,
    GG: 0,
    XG: 0,
    G1: 0,
    G2: 0,
    G3: 0,
    G4: 0
  };
  const [items, setItems] = reactExports.useState([]);
  const [payments, setPayments] = reactExports.useState([{
    amount: 0,
    payment_method: "PIX",
    installments: 1,
    due_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    status: "pendente",
    notes: ""
  }]);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = reactExports.useState(null);
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  const isSubmittedRef = reactExports.useRef(false);
  const isDirty = !isSubmitted && (formData.client_id !== "" || formData.brand_id !== "" || items.length > 0 || formData.discount > 0 || formData.other_expenses > 0 || formData.purchase_order !== "");
  const blocker = useBlocker({
    shouldBlockFn: () => {
      if (isSubmittedRef.current) return false;
      return formData.client_id !== "" || formData.brand_id !== "" || items.length > 0 || formData.discount > 0 || formData.other_expenses > 0 || formData.purchase_order !== "";
    },
    withResolver: true
  });
  reactExports.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
  const addItem = () => {
    setItems([...items, {
      product_id: "",
      product_name: "",
      sku: "",
      gender: "Unissex",
      grid_type: "adulto",
      list_price: 0,
      discount_percent: 0,
      unit_price: 0,
      unit_cost: 0,
      art_code: "",
      customizations: [],
      active_sizes: [],
      sizes: {
        ...emptySizes
      }
    }]);
  };
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const item = {
      ...newItems[index]
    };
    if (field.startsWith("size_")) {
      const sz = field.substring(5);
      item.sizes = {
        ...item.sizes,
        [sz]: parseFloat(value) || 0
      };
    } else if (field === "grid_type") {
      item.grid_type = value;
      item.sizes = {
        ...emptySizes
      };
    } else {
      item[field] = value;
    }
    if (field === "product_id" && products) {
      const p = products.find((prod) => prod.id === value);
      if (p) {
        item.product_name = getProductDisplayName(p);
        item.sku = p.sku || "";
        item.list_price = p.price;
        item.unit_price = p.price;
        item.unit_cost = p.cost_price || 0;
      }
    }
    if (field === "customizations") {
      item.customizations = value;
    }
    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    const custSum = (item.customizations || []).reduce((acc, c) => acc + Number(c.price || 0) * Number(c.quantity || 1), 0);
    if (field === "list_price" || field === "discount_percent" || field === "customizations") {
      item.unit_price = lp - lp * (dp / 100) + custSum;
    }
    newItems[index] = item;
    setItems(newItems);
  };
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const getItemQuantity = (item) => {
    if (!item.sizes) return 0;
    return Object.values(item.sizes).reduce((acc, q) => acc + (Number(q) || 0), 0);
  };
  items.length;
  const sumQuantities = items.reduce((acc, item) => acc + getItemQuantity(item), 0);
  const itemsTotalNet = items.reduce((acc, item) => acc + Number(item.unit_price || 0) * getItemQuantity(item), 0);
  const itemsDiscountTotal = items.reduce((acc, item) => {
    const lp = Number(item.list_price || 0);
    const dp = Number(item.discount_percent || 0);
    return acc + lp * (dp / 100) * getItemQuantity(item);
  }, 0);
  const itemsTotalGross = itemsTotalNet + itemsDiscountTotal;
  const saleDiscount = itemsTotalNet * (Number(formData.discount || 0) / 100);
  const otherExpenses = Number(formData.other_expenses || 0);
  const freight = Number(formData.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;
  const totalCost = items.reduce((acc, item) => {
    const baseCost = Number(item.unit_cost || 0);
    const custCostSum = (item.customizations || []).reduce((sum, c) => sum + Number(c.cost || 0) * Number(c.quantity || 1), 0);
    return acc + (baseCost + custCostSum) * getItemQuantity(item);
  }, 0);
  const liquidRevenue = itemsTotalNet - saleDiscount;
  const grossMarginPct = totalCost > 0 && liquidRevenue > 0 ? (liquidRevenue - totalCost) / liquidRevenue * 100 : finalTotal > 0 ? 100 : 0;
  reactExports.useEffect(() => {
    if (payments.length !== installmentsCount) {
      if (installmentsCount < 1) return;
      const baseValue = finalTotal / installmentsCount;
      const newP = Array.from({
        length: installmentsCount
      }).map((_, i) => {
        const d = new Date(formData.sale_date || /* @__PURE__ */ new Date());
        d.setDate(d.getDate() + 30 * i);
        return {
          amount: Number(baseValue.toFixed(2)),
          payment_method: payments[0]?.payment_method || "PIX",
          installments: 1,
          due_date: d.toISOString().split("T")[0],
          status: "pendente",
          notes: ""
        };
      });
      const sum = newP.reduce((acc, p) => acc + p.amount, 0);
      if (sum !== finalTotal && installmentsCount > 0) {
        newP[installmentsCount - 1].amount = Number((newP[installmentsCount - 1].amount + (finalTotal - sum)).toFixed(2));
      }
      setPayments(newP);
    } else {
      const currentSum = payments.reduce((acc, p) => acc + p.amount, 0);
      if (Math.abs(currentSum - finalTotal) > 0.01 && payments.length > 0) {
        const newP = [...payments];
        newP[newP.length - 1].amount = Number((newP[newP.length - 1].amount + (finalTotal - currentSum)).toFixed(2));
        setPayments(newP);
      }
    }
  }, [installmentsCount, finalTotal]);
  const updatePaymentAmount = (idx, newAmount) => {
    const newPayments = [...payments];
    newPayments[idx].amount = newAmount;
    let previousSum = newPayments.slice(0, idx + 1).reduce((acc, p) => acc + p.amount, 0);
    const remaining = finalTotal - previousSum;
    const countRemaining = newPayments.length - 1 - idx;
    if (countRemaining > 0) {
      const dist = remaining / countRemaining;
      for (let i = idx + 1; i < newPayments.length; i++) {
        newPayments[i].amount = Number(dist.toFixed(2));
      }
      const newSum = newPayments.reduce((acc, p) => acc + p.amount, 0);
      if (Math.abs(newSum - finalTotal) > 1e-3) {
        newPayments[newPayments.length - 1].amount = Number((newPayments[newPayments.length - 1].amount + (finalTotal - newSum)).toFixed(2));
      }
    }
    setPayments(newPayments);
  };
  const updatePaymentField = (idx, field, value) => {
    const newPayments = [...payments];
    newPayments[idx] = {
      ...newPayments[idx],
      [field]: value
    };
    setPayments(newPayments);
  };
  const addPayment = () => {
    setInstallmentsCount((prev) => prev + 1);
  };
  const removePayment = (idx) => {
    if (payments.length <= 1) return;
    setInstallmentsCount((prev) => prev - 1);
  };
  const handleSubmit = async () => {
    if (!formData.client_id || !formData.brand_id) {
      toast.error("Cliente e Marca são obrigatórios.");
      return false;
    }
    const explodedItems = [];
    items.forEach((item) => {
      if (item.sizes) {
        const activeSizes = item.active_sizes || [];
        activeSizes.forEach((size) => {
          const qty = item.sizes[size];
          const quantity = Number(qty);
          if (quantity > 0) {
            if (!item.art_code) {
              toast.error(`O código da arte é obrigatório para o item ${item.product_name}`);
              throw new Error("Missing art code");
            }
            let itemSku = item.sku || "";
            if (itemSku.startsWith("PA-")) {
              itemSku = itemSku.replace("PA-", `${item.art_code}-`);
            } else {
              itemSku = `${item.art_code}-${itemSku}`;
            }
            const brandObj = brands.find((b) => b.id === formData.brand_id);
            const brandCode = brandObj?.code || "CLI";
            const finalSku = `${itemSku}-${size}-${brandCode}`.toUpperCase();
            const p = products?.find((prod) => prod.id === item.product_id);
            explodedItems.push({
              product_id: item.product_id,
              product_name: item.product_name,
              sku: finalSku,
              art_code: item.art_code,
              model: p?.models?.name || p?.model || "",
              fabric: p?.fabrics?.name || p?.fabric || "",
              color: p?.canonical_colors?.name || p?.color || "",
              size,
              gender: item.gender,
              quantity,
              unit_cost: item.unit_cost,
              list_price: item.list_price,
              discount_percent: item.discount_percent,
              unit_price: item.unit_price,
              customizations: item.customizations || [],
              notes: item.notes || ""
            });
          }
        });
      }
    });
    if (explodedItems.length === 0) {
      toast.error("O pedido deve conter pelo menos um item com quantidade na grade.");
      return false;
    }
    try {
      isSubmittedRef.current = true;
      setIsSubmitted(true);
      await createMutation.mutateAsync({
        ...formData,
        items_discount: itemsDiscountTotal,
        estimated_total: itemsTotalNet,
        final_total: finalTotal,
        items: explodedItems,
        payments: payments.map((p) => ({
          ...p,
          amount: Number(p.amount)
        }))
      });
      toast.success("Pedido criado com sucesso!");
      navigate({
        to: "/pedidos"
      });
      return true;
    } catch (err) {
      isSubmittedRef.current = false;
      setIsSubmitted(false);
      toast.error("Erro ao salvar: " + err.message);
      return false;
    }
  };
  const handleSaveSku = async (idx) => {
    const item = items[idx];
    if (!item.product_name) return toast.error("Selecione um produto base primeiro.");
    const sku = window.prompt("Digite o SKU para o novo produto composto:", item.sku + "-COMP");
    if (!sku) return;
    const name = window.prompt("Digite o nome do novo produto:", item.product_name + " (Personalizado)");
    if (!name) return;
    try {
      const baseCost = products?.find((p) => p.id === item.product_id)?.cost_price || 0;
      const custCostSum = (item.customizations || []).reduce((acc, c) => acc + Number(c.cost || 0) * Number(c.quantity || 1), 0);
      await createProductMutation.mutateAsync({
        name,
        sku,
        price: Number(item.unit_price || 0),
        cost_price: Number(baseCost) + custCostSum,
        customizations: item.customizations || []
      });
      toast.success("Produto composto criado com sucesso no cadastro!");
    } catch (err) {
      toast.error("Erro ao criar produto: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border-b sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos", className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-slate-800", children: formData.status === "orcamento" ? "Orçamento - Novo" : "Pedido de venda - Novo" }),
        formData.status === "orcamento" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4 px-3 py-1 bg-slate-100 rounded-md border text-xs flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-medium uppercase tracking-wider text-[10px]", children: "Margem Bruta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold ${grossMarginPct < 15 ? "text-red-600" : "text-emerald-600"}`, children: [
            grossMarginPct.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pedidos", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-7 px-4 text-xs rounded-full border-green-600 text-green-700 hover:bg-green-50", children: "Cancelar" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSubmit, disabled: createMutation.isPending, className: "h-7 px-5 text-xs rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm", children: [
          createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }),
          "Salvar"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "pedido", className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-[400px] grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pedido", children: "Dados do Pedido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "financeiro", children: "Financeiro / Interno" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "pedido", className: "space-y-8 mt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-4", children: "Dados do cliente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Cliente *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                      setEditingClient(null);
                      setClientDrawerOpen(true);
                    }, className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
                      " Cadastrar Novo"
                    ] }),
                    formData.client_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "|" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                        const matched = clients?.find((c) => c.id === formData.client_id);
                        if (matched) {
                          setEditingClient(matched);
                          setClientDrawerOpen(true);
                        }
                      }, className: "text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5", children: "Visualizar / Editar" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableCombobox, { items: (clients || []).map((c) => ({
                  id: c.id,
                  name: `${c.name} ${c.company_name ? `(${c.company_name})` : ""}`
                })), value: formData.client_id, onChange: (v) => setFormData({
                  ...formData,
                  client_id: v
                }), placeholder: "Selecione um cliente" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Vendedor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableCombobox, { items: (clients || []).filter((c) => c.entity_type === "vendedor").map((c) => ({
                  id: c.id,
                  name: c.name
                })), value: formData.salesperson_id || "", onChange: (v) => setFormData({
                  ...formData,
                  salesperson_id: v
                }), placeholder: "Selecione um vendedor" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Marca (Obrigatório) *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableCombobox, { items: brands.map((b) => ({
                  id: b.id,
                  name: b.name
                })), value: formData.brand_id, onChange: (v) => setFormData({
                  ...formData,
                  brand_id: v
                }), placeholder: "Selecione a marca" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Origem do Pedido *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.origin_channel, onValueChange: (v) => setFormData({
                  ...formData,
                  origin_channel: v
                }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a origem" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Internet", children: "Internet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Presencial", children: "Presencial" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Telefone", children: "Telefone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Reparação", children: "Reparação" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dropshipping", children: "Dropshipping" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Marketplace", children: "Marketplace" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "WhatsApp", children: "WhatsApp" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Representante Comercial", children: "Representante Comercial" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Outro", children: "Outro" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "mix_fabrics", checked: formData.mix_fabrics_allowed || false, onCheckedChange: (v) => setFormData({
                  ...formData,
                  mix_fabrics_allowed: v
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mix_fabrics", className: "text-xs text-slate-700 cursor-pointer font-medium", children: "Permitir misturar tecidos" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-6 border-b border-green-600/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 py-2 border-b-2 border-green-600 text-green-700 text-sm font-medium", children: "Itens do pedido de venda" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-lg overflow-x-auto overflow-y-visible mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium w-8 text-center", children: "#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium min-w-[280px]", children: "Produto / Identificação" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium min-w-[320px]", children: "Quantidades por Tamanho" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium w-16 text-center bg-slate-100/30", children: "Qtd" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium w-[290px] text-right", children: "Valores (Tabela / Desc / Unit / Total)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 font-medium w-10 text-center" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y text-xs", children: items.map((item, idx) => {
                  const qtyTotal = getItemQuantity(item);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-slate-400 bg-slate-100/50 text-center align-top pt-3", children: idx + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-2 space-y-2 align-top", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableCombobox, { items: (products || []).filter((p) => ["PA", "Serviço", "PF"].includes(p.format || "")).map((p) => ({
                        id: p.id,
                        name: getProductDisplayName(p)
                      })), value: item.product_id || "", onChange: (v) => updateItem(idx, "product_id", v), placeholder: "Selecione..." }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap items-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs font-mono border-green-500/50 bg-green-50/30 placeholder:text-green-600/40 w-24", placeholder: "Cód. Arte *", value: item.art_code || "", onChange: (e) => updateItem(idx, "art_code", e.target.value.toUpperCase()) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs font-mono w-28", placeholder: "Cód. Base (PA)", value: item.sku || "", onChange: (e) => updateItem(idx, "sku", e.target.value) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: item.gender || "Unissex", onValueChange: (v) => updateItem(idx, "gender", v), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 border bg-white shadow-sm p-1 px-2 text-xs w-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Masculino", children: "Masculino" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Feminino", children: "Feminino" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Unissex", children: "Unissex" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Infantil", children: "Infantil" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: item.grid_type || "adulto", onValueChange: (v) => updateItem(idx, "grid_type", v), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 border bg-white shadow-sm p-1 px-2 text-xs w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "adulto", children: "Adulto" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "infantil", children: "Infantil" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setActiveCustomizationIndex(idx), className: "h-8 text-[10px] border text-blue-600 hover:bg-blue-50 px-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "size-3 mr-1" }),
                            " ",
                            (item.customizations || []).length,
                            " pers."
                          ] }),
                          (item.customizations || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleSaveSku(idx), disabled: createProductMutation.isPending, className: "h-6 text-[9px] text-green-600 hover:bg-green-50 px-1.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-2.5 mr-1" }),
                            " SKU"
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-end mt-1", children: [
                      (item.active_sizes || []).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: sz }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, className: "h-7 px-1 text-center text-xs w-10 bg-white border border-slate-200 rounded focus:border-green-500", value: item.sizes?.[sz] === 0 ? "" : item.sizes?.[sz] || "", onChange: (e) => updateItem(idx, `size_${sz}`, e.target.value), placeholder: "0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateItem(idx, "active_sizes", (item.active_sizes || []).filter((s) => s !== sz)), className: "absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px]", children: "×" })
                      ] }, sz)),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 text-[10px] px-2 text-green-700 border-green-200 hover:bg-green-50", children: "+" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-48 p-2", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: (item.grid_type === "infantil" ? INFANTIL_SIZES : ADULTO_SIZES).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", disabled: (item.active_sizes || []).includes(sz), onClick: () => updateItem(idx, "active_sizes", [...item.active_sizes || [], sz]), children: sz }, sz)) }) })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center font-semibold text-slate-600 bg-slate-50/50 align-top pt-4", children: qtyTotal }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-2 space-y-1 align-top text-right w-[290px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 justify-end items-center flex-nowrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground uppercase", children: "Tabela" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { className: "h-8 text-right text-xs bg-white w-20 px-1", value: item.list_price || 0, onChange: (v) => updateItem(idx, "list_price", v) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground uppercase", children: "Desc (%)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "h-8 text-right text-xs bg-white w-14 px-1", value: item.discount_percent || "", onChange: (e) => updateItem(idx, "discount_percent", parseFloat(e.target.value)) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground uppercase", children: "Unit (R$)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { className: "h-8 text-right text-xs font-medium text-slate-700 bg-white w-20 px-1", value: item.unit_price || 0, onChange: (v) => updateItem(idx, "unit_price", v) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end items-center pt-1.5 border-t border-dashed mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs pr-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground uppercase font-bold", children: "Total:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900", children: new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        }).format(qtyTotal * Number(item.unit_price || 0)) })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center align-top pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-red-400 hover:text-red-600", onClick: () => removeItem(idx), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }) })
                  ] }, idx);
                }) })
              ] }),
              items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-slate-500", children: "Nenhum item adicionado." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: addItem, className: "text-green-700 border-green-600/30 hover:bg-green-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
              " Adicionar item"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-4", children: "Totais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-8 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wider truncate", title: "Soma das quantidades", children: "Soma Qtds" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-2 flex items-center bg-slate-100 rounded-md text-sm border text-slate-600", children: sumQuantities })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-blue-600 uppercase tracking-wider truncate", title: "Desconto total do pedido", children: "Desconto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "h-9 pr-7 text-xs", value: formData.discount || "", onChange: (e) => setFormData({
                    ...formData,
                    discount: parseFloat(e.target.value) || 0
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs", children: "%" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-blue-600 uppercase tracking-wider truncate", title: "Prazo de entrega (dias)", children: "Prazo (dias)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", className: "h-9 text-xs", value: formData.delivery_days || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_days: parseInt(e.target.value) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-blue-600 uppercase tracking-wider truncate", title: "Outras despesas", children: "Outras Desp." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs", children: "R$" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "h-9 pl-7 text-xs", value: formData.other_expenses || "", onChange: (e) => setFormData({
                    ...formData,
                    other_expenses: parseFloat(e.target.value) || 0
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wider truncate", title: "Desconto total dos itens", children: "Desc. Itens" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-2 flex items-center bg-slate-100 rounded-md text-xs border text-slate-600 truncate", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(itemsDiscountTotal) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wider truncate", title: "Desconto total da venda", children: "Desc. Venda" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-2 flex items-center bg-slate-100 rounded-md text-xs border text-slate-600 truncate", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(itemsDiscountTotal + saleDiscount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground uppercase tracking-wider truncate", title: "Total dos itens", children: "Total Itens" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-2 flex items-center font-medium bg-slate-100 rounded-md text-xs border text-slate-800 truncate", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(itemsTotalNet) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-bold text-slate-800 uppercase tracking-wider truncate", title: "Total da venda", children: "Total Venda" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-2 flex items-center font-bold bg-green-50 rounded-md text-xs border border-green-200 text-green-800 truncate", children: new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(finalTotal) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-4", children: "Detalhes da venda" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Data da venda" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9", value: formData.sale_date || "", onChange: (e) => setFormData({
                  ...formData,
                  sale_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Data saída" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9", value: formData.departure_date || "", onChange: (e) => setFormData({
                  ...formData,
                  departure_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Data prevista" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9", value: formData.expected_date || "", onChange: (e) => setFormData({
                  ...formData,
                  expected_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Pedido de compra" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-9", value: formData.purchase_order || "", onChange: (e) => setFormData({
                  ...formData,
                  purchase_order: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Status do Pedido *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status || "confirmado", onValueChange: (v) => setFormData({
                  ...formData,
                  status: v
                }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "atendimento", children: "Em Atendimento" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "confirmado", children: "Confirmado" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aguardando_financeiro", children: "Ag. Financeiro" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "liberado_producao", children: "Liberado Prod." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "separacao", children: "Separação" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "corte", children: "Corte" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "costura", children: "Costura" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bordado", children: "Bordado" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "impressao", children: "Impressão" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "expedicao", children: "Expedição" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-4", children: "Pagamento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Nº de Parcelas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", className: "h-9", value: installmentsCount, onChange: (e) => setInstallmentsCount(parseInt(e.target.value) || 1) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 md:col-span-3 text-xs text-muted-foreground flex items-end pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Altere o valor de uma parcela para que as demais se ajustem automaticamente." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b text-xs text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 w-16", children: "#" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 w-32", children: "Valor (R$)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 w-48", children: "Forma" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 w-36", children: "Data Venc." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Observação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 w-16 text-center", children: "Ações" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: payments.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center text-slate-400 bg-slate-100/50", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { className: "h-8 text-right px-1", value: p.amount || 0, onChange: (v) => updatePaymentAmount(idx, v) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: p.payment_method || "", onValueChange: (v) => updatePaymentField(idx, "payment_method", v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PIX", children: "PIX" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Débito", children: "Débito" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito à vista", children: "Crédito à vista" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito parcelado", children: "Crédito parcelado" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Boleto", children: "Boleto" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Transferência", children: "Transferência" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dinheiro", children: "Dinheiro" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-8", value: p.due_date, onChange: (e) => updatePaymentField(idx, "due_date", e.target.value) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: p.notes || "", onChange: (e) => updatePaymentField(idx, "notes", e.target.value) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-red-400 hover:text-red-600", onClick: () => removePayment(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }) })
              ] }, idx)) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: addPayment, className: "text-blue-700 border-blue-600/30 hover:bg-blue-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
                " Adicionar parcela"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 mr-2", children: "Soma pagamentos:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${payments.reduce((acc, p) => acc + (p.amount || 0), 0) === finalTotal ? "text-green-600" : "text-red-500"}`, children: formatCurrency(payments.reduce((acc, p) => acc + (p.amount || 0), 0)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 mx-1", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-600", children: [
                  "Total: ",
                  formatCurrency(finalTotal)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700", children: "Logística e Entrega" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-slate-200 ml-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Tipo Logístico" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.logistics_type || "Correios", onValueChange: (v) => setFormData({
                  ...formData,
                  logistics_type: v
                }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Correios", children: "Correios (SGP Web)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Transportadora", children: "Transportadora (SGP Web)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Motoboy", children: "Motoboy" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Retirada Local", children: "Retirada Local" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Entrega Própria", children: "Entrega Própria" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dropshipping", children: "Dropshipping Fornecedor" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Nome da Transportadora (Se aplicável)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableCombobox, { items: carriers.map((c) => ({
                  id: c.name,
                  name: c.name
                })), value: formData.carrier_name || "", onChange: (v) => setFormData({
                  ...formData,
                  carrier_name: v
                }), placeholder: "Selecione um transportador" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Frete por conta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.freight_payer || "", onValueChange: (v) => setFormData({
                  ...formData,
                  freight_payer: v
                }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CIF", children: "Remetente (CIF)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "FOB", children: "Destinatário (FOB)" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-12 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase text-slate-500", children: "Endereço de Entrega" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-12 md:col-span-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Nome / Destinatário" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_name || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_name: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "CPF / CNPJ" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_document || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_document: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Telefone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_phone || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_phone: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "CEP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_zip || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_zip: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-12 md:col-span-7", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rua / Logradouro" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_street || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_street: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Número" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_number || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_number: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Complemento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_complement || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_complement: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-6 md:col-span-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Bairro" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_neighborhood || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_neighborhood: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-8 md:col-span-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Cidade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", value: formData.delivery_city || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_city: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-4 md:col-span-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "UF" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 text-xs bg-white", maxLength: 2, value: formData.delivery_state || "", onChange: (e) => setFormData({
                  ...formData,
                  delivery_state: e.target.value.toUpperCase()
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-6 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 md:col-span-6 mb-[-10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase text-slate-500", children: "Volume e Dimensões (Cálculo Automático)" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Qtd (Vol)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", className: "h-9", value: formData.volumes_quantity ?? "", onChange: (e) => setFormData({
                  ...formData,
                  volumes_quantity: parseInt(e.target.value) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Peso (Kg)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "h-9", value: formData.gross_weight ?? "", onChange: (e) => setFormData({
                  ...formData,
                  gross_weight: parseFloat(e.target.value.replace(",", ".")) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Altura (cm)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", className: "h-9", value: formData.package_height ?? "", onChange: (e) => setFormData({
                  ...formData,
                  package_height: parseFloat(e.target.value.replace(",", ".")) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Largura (cm)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", className: "h-9", value: formData.package_width ?? "", onChange: (e) => setFormData({
                  ...formData,
                  package_width: parseFloat(e.target.value.replace(",", ".")) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Comp. (cm)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", className: "h-9", value: formData.package_length ?? "", onChange: (e) => setFormData({
                  ...formData,
                  package_length: parseFloat(e.target.value.replace(",", ".")) || 0
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Frete Cobrado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { className: "h-9 bg-white", value: formData.freight_cost || 0, onChange: (v) => setFormData({
                  ...formData,
                  freight_cost: v
                }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-4", children: "Dados adicionais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Observações (Impressas no pedido)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "min-h-[100px] resize-y", value: formData.notes || "", onChange: (e) => setFormData({
                  ...formData,
                  notes: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground text-blue-600", children: "Observações internas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "min-h-[100px] resize-y", value: formData.internal_notes || "", onChange: (e) => setFormData({
                  ...formData,
                  internal_notes: e.target.value
                }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "financeiro", className: "space-y-8 mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white p-6 rounded-xl border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 text-orange-500" }),
            " Detalhamento Financeiro (Restrito)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-4 rounded-lg border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3", children: "Custos e Acréscimos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Subtotal Produtos:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatCurrency(itemsTotalGross) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Desconto nos Itens" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500 font-medium", children: [
                    "- ",
                    formatCurrency(itemsDiscountTotal)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Desconto Adicional (Venda)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500 font-medium", children: [
                    "- ",
                    formatCurrency(saleDiscount)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Frete / Outras Despesas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 font-medium", children: [
                    "+ ",
                    formatCurrency(freight + otherExpenses)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t flex justify-between items-center font-bold text-slate-800", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Final Cobrado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(finalTotal) })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50 p-4 rounded-lg border border-purple-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-purple-700 mb-3", children: "Comissionamento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-800 font-medium", children: "Comissão Total Prevista" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-purple-900", children: "Calculada automaticamente" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-600 mt-2", children: "A comissão é calculada com base na taxa cadastrada no perfil do vendedor associado a este pedido (Representante). Ela incidirá sobre o valor final do pedido." })
              ] })
            ] }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: activeCustomizationIndex !== null, onOpenChange: (open) => {
        if (!open) setActiveCustomizationIndex(null);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Composição / Personalizações da Peça" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 space-y-4", children: activeCustomizationIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs font-semibold text-slate-500 mb-2 px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-[2]", children: "Insumo / Processo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: "Detalhes Adicionais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 text-center", children: "Custo un." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 text-center", children: "Venda un." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 text-center", children: "Qtd" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
          ] }),
          (items[activeCustomizationIndex]?.customizations || []).map((cust, cIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center bg-slate-50 p-2 rounded-md border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-[2]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", role: "combobox", className: cn("justify-between w-full font-normal h-8 text-xs", !cust.product_id && "text-muted-foreground"), children: [
                cust.product_id ? cust.name : "Buscar no cadastro...",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-3 w-3 shrink-0 opacity-50" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "p-0 w-[300px]", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Buscar por serviço ou material..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "Nenhum produto encontrado." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: (products || []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { value: `${p.sku || ""} ${p.name}`, onSelect: () => {
                    const newC = [...items[activeCustomizationIndex].customizations || []];
                    newC[cIdx].product_id = p.id;
                    newC[cIdx].name = p.name;
                    newC[cIdx].cost = p.cost_price || 0;
                    newC[cIdx].price = p.price || 0;
                    updateItem(activeCustomizationIndex, "customizations", newC);
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: cn("mr-2 h-4 w-4", cust.product_id === p.id ? "opacity-100" : "opacity-0") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                        "Custo: ",
                        formatCurrency(p.cost_price),
                        " | Venda: ",
                        formatCurrency(p.price)
                      ] })
                    ] })
                  ] }, p.id)) })
                ] })
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Local/Arte...", value: cust.details || "", onChange: (e) => {
              const newC = [...items[activeCustomizationIndex].customizations || []];
              newC[cIdx].details = e.target.value;
              updateItem(activeCustomizationIndex, "customizations", newC);
            }, className: "h-8 text-xs" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { placeholder: "Custo", value: cust.cost || 0, onChange: (v) => {
              const newC = [...items[activeCustomizationIndex].customizations || []];
              newC[cIdx].cost = v;
              updateItem(activeCustomizationIndex, "customizations", newC);
            }, className: "h-8 text-xs text-center px-1" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { placeholder: "Venda", value: cust.price || 0, onChange: (v) => {
              const newC = [...items[activeCustomizationIndex].customizations || []];
              newC[cIdx].price = v;
              updateItem(activeCustomizationIndex, "customizations", newC);
            }, className: "h-8 text-xs text-center font-medium text-blue-600 px-1" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", step: "any", placeholder: "Qtd", value: cust.quantity, onChange: (e) => {
              const newC = [...items[activeCustomizationIndex].customizations || []];
              newC[cIdx].quantity = parseFloat(e.target.value) || 1;
              updateItem(activeCustomizationIndex, "customizations", newC);
            }, className: "h-8 text-xs text-center" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-red-400 hover:text-red-600", onClick: () => {
              const newC = [...items[activeCustomizationIndex].customizations || []];
              newC.splice(cIdx, 1);
              updateItem(activeCustomizationIndex, "customizations", newC);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
          ] }, cIdx)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full border-dashed mt-2", onClick: () => {
            const newC = [...items[activeCustomizationIndex].customizations || [], {
              product_id: "",
              name: "",
              details: "",
              cost: 0,
              price: 0,
              quantity: 1
            }];
            updateItem(activeCustomizationIndex, "customizations", newC);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
            " Adicionar Material / Processo"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setActiveCustomizationIndex(null), children: "Concluído" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: blocker.status === "blocked", onOpenChange: (open) => {
        if (!open) blocker.reset();
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[380px] p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "text-center sm:text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-center w-full", children: "Alterações não salvas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 text-sm text-muted-foreground text-center", children: "Você tem alterações não salvas no pedido. O que deseja fazer?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex flex-col gap-2 sm:flex-col sm:justify-center w-full mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-green-600 hover:bg-green-700 text-white", onClick: async () => {
            const saved = await handleSubmit();
            if (saved) {
              blocker.proceed();
            } else {
              blocker.reset();
            }
          }, children: "Salvar e Sair" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "w-full", onClick: () => {
            isSubmittedRef.current = true;
            setIsSubmitted(true);
            blocker.proceed();
          }, children: "Descartar e Sair" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", onClick: () => blocker.reset(), children: "Continuar Editando" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClientFormDrawer, { open: clientDrawerOpen, onOpenChange: setClientDrawerOpen, client: editingClient, onSuccess: (newClient) => {
        setFormData((prev) => ({
          ...prev,
          client_id: newClient.id
        }));
      } })
    ] })
  ] });
}
export {
  SearchableCombobox,
  NewOrderPage as component
};
