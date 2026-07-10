import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { r as Route$9, y as supabase, B as Button, w as formatCurrency } from "./_ssr/router-BxmJvJdu.mjs";
import { s as statusLabel } from "./_ssr/constants-B8Sd5U_d.mjs";
import { e as useOrder, h as useUpdateOrder, d as useDeleteOrder, g as useOverrideStockBatch, c as consumeStockForOrder } from "./_ssr/orders-CbTRcciT.mjs";
import { a as useQuery, b as useQueryClient, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { S as Sheet, a as SheetContent, d as SheetHeader, e as SheetTitle, b as SheetDescription, c as SheetFooter } from "./_ssr/sheet-BhiMmhDE.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { T as Textarea } from "./_ssr/textarea-CZ4oHjug.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { r as useModels, p as useFabrics, c as useColors } from "./_ssr/inventory-DH0foUP4.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { V as LoaderCircle, c as ArrowLeft, N as Flame, C as Calendar, au as User, a4 as Package, k as Check, ar as Truck, ab as RefreshCw, Z as MapPin, F as ExternalLink, a9 as Plus, A as Activity, s as CircleDashed, W as Lock, r as CircleCheck } from "./_libs/lucide-react.mjs";
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
function useOrderItems(orderId) {
  return useQuery({
    queryKey: ["order_items", orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId).eq("active", true).order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });
}
function useCreateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item) => {
      const { data, error } = await supabase.from("order_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", variables.order_id] });
    }
  });
}
function useUpdateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("order_items").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", data.order_id] });
    }
  });
}
async function logTimelineEvent({
  orderId,
  action,
  description,
  oldStatus,
  newStatus
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("order_timeline").insert({
    order_id: orderId,
    action,
    description,
    old_status: oldStatus,
    new_status: newStatus,
    created_by: user.id
  });
  if (error) {
    console.error("Erro ao registrar timeline:", error);
  }
}
function useOrderTimeline(orderId) {
  return useQuery({
    queryKey: ["timeline", orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_timeline").select(`
          id, created_at, action, description, old_status, new_status,
          users:created_by(id, name)
        `).eq("order_id", orderId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });
}
function OrderItemDrawer({ open, onOpenChange, orderId, item }) {
  const isEditing = !!item;
  const createMutation = useCreateOrderItem();
  const updateMutation = useUpdateOrderItem();
  const { data: models = [] } = useModels();
  const { data: fabrics = [] } = useFabrics();
  const { data: colors = [] } = useColors();
  const [formData, setFormData] = reactExports.useState({
    product_name: "",
    model: "",
    line: "",
    fabric: "",
    color: "",
    size: "",
    gender: "",
    quantity: 1,
    unit_price: 0,
    unit_cost: 0,
    notes: ""
  });
  reactExports.useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          product_name: item.product_name || "",
          model: item.model || "",
          line: item.line || "",
          fabric: item.fabric || "",
          color: item.color || "",
          size: item.size || "",
          gender: item.gender || "",
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          unit_cost: item.unit_cost || 0,
          notes: item.notes || ""
        });
      } else {
        setFormData({
          product_name: "",
          model: "",
          line: "",
          fabric: "",
          color: "",
          size: "",
          gender: "",
          quantity: 1,
          unit_price: 0,
          unit_cost: 0,
          notes: ""
        });
      }
    }
  }, [open, item]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: item.id, ...formData });
        await logTimelineEvent({
          orderId,
          action: "item_editado",
          description: `Item ${formData.product_name} atualizado.`
        }).catch(console.error);
        toast.success("Item atualizado!");
      } else {
        await createMutation.mutateAsync({ ...formData, order_id: orderId });
        await logTimelineEvent({
          orderId,
          action: "item_criado",
          description: `Item ${formData.product_name} adicionado ao pedido.`
        }).catch(console.error);
        toast.success("Item adicionado!");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "sm:max-w-md overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: isEditing ? "Editar Item" : "Novo Item" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Preencha os detalhes do produto para este pedido." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome do Produto *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            required: true,
            value: formData.product_name || "",
            onChange: (e) => setFormData({ ...formData, product_name: e.target.value }),
            placeholder: "Ex: Camiseta Estonada"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Modelo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formData.model || "",
              onValueChange: (v) => setFormData({ ...formData, model: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o modelo" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.name, children: m.name }, m.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Linha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.line || "", onChange: (e) => setFormData({ ...formData, line: e.target.value }), placeholder: "Ex: Premium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Malha / Tecido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formData.fabric || "",
              onValueChange: (v) => setFormData({ ...formData, fabric: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a malha" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fabrics.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.name, children: f.name }, f.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formData.color || "",
              onValueChange: (v) => setFormData({ ...formData, color: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a cor" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.name, children: c.name }, c.id)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tamanho" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formData.size || "",
              onValueChange: (v) => setFormData({ ...formData, size: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tamanho" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-[300px]", children: ["2", "4", "6", "8", "10", "12", "14", "16", "PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"].map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: sz, children: sz }, sz)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gênero" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: formData.gender || "",
              onValueChange: (v) => setFormData({ ...formData, gender: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Gênero" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Masculino", "Feminino", "Unissex", "Infantil"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, required: true, value: formData.quantity || 1, onChange: (e) => setFormData({ ...formData, quantity: Number(e.target.value) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Preço Unitário (Venda)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: formData.unit_price || 0, onChange: (e) => setFormData({ ...formData, unit_price: Number(e.target.value) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Custo Unitário (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: formData.unit_cost || 0, onChange: (e) => setFormData({ ...formData, unit_cost: Number(e.target.value) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações do Item" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: formData.notes || "",
            onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
            placeholder: "Detalhes específicos deste item...",
            className: "resize-none h-24"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending, children: [
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        isEditing ? "Salvar Item" : "Adicionar Item"
      ] })
    ] })
  ] }) }) });
}
function useOrderItemProcesses(orderItemId) {
  return useQuery({
    queryKey: ["item_processes", orderItemId],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_item_processes").select(`
          *,
          production_processes(name)
        `).eq("order_item_id", orderItemId).order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!orderItemId
  });
}
function OrderPage() {
  const {
    orderId
  } = Route$9.useParams();
  const {
    data: order,
    isLoading: isLoadingOrder
  } = useOrder(orderId);
  const {
    data: items = [],
    isLoading: isLoadingItems
  } = useOrderItems(orderId);
  const {
    data: timeline = [],
    isLoading: isLoadingTimeline
  } = useOrderTimeline(orderId);
  const updateOrder = useUpdateOrder();
  useDeleteOrder();
  useNavigate();
  const overrideStock = useOverrideStockBatch();
  const {
    data: isFirstPurchase = false
  } = useQuery({
    queryKey: ["order_client_first_purchase", order?.client_id, order?.id],
    queryFn: async () => {
      if (!order?.client_id) return false;
      const {
        data: clientData
      } = await supabase.from("clients").select("document, entity_type").eq("id", order.client_id).maybeSingle();
      if (!clientData || clientData.entity_type !== "cliente") {
        return false;
      }
      const document = clientData.document;
      let clientIds = [order.client_id];
      if (document && document !== "—" && document.trim() !== "") {
        const {
          data: siblingClients
        } = await supabase.from("clients").select("id").eq("document", document);
        if (siblingClients && siblingClients.length > 0) {
          clientIds = siblingClients.map((c) => c.id);
        }
      }
      const {
        data: otherOrders,
        error
      } = await supabase.from("orders").select("id, created_at").in("client_id", clientIds);
      if (error || !otherOrders) return true;
      const currentOrder = otherOrders.find((o) => o.id === order.id);
      if (!currentOrder) {
        return otherOrders.length === 0;
      }
      const currentCreatedAt = new Date(currentOrder.created_at);
      const hasPriorOrder = otherOrders.some((o) => o.id !== order.id && new Date(o.created_at) < currentCreatedAt);
      return !hasPriorOrder;
    },
    enabled: !!order?.client_id && !!order?.id
  });
  const SIZES = ["2", "4", "6", "8", "10", "12", "14", "16", "PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
  const groupedItems = [];
  (items || []).forEach((item) => {
    const existing = groupedItems.find((g) => g.product_id === item.product_id && g.gender === item.gender && JSON.stringify(g.customizations) === JSON.stringify(item.customizations) && g.unit_price === item.unit_price && g.list_price === item.list_price);
    if (existing) {
      existing.totalQty += item.quantity || 0;
      if (!existing.sizes[item.size]) existing.sizes[item.size] = 0;
      existing.sizes[item.size] += item.quantity || 0;
      existing.itemIds.push(item.id);
    } else {
      const sizes = {};
      sizes[item.size] = item.quantity || 0;
      groupedItems.push({
        product_id: item.product_id,
        product_name: item.product_name,
        gender: item.gender,
        model: item.model,
        line: item.line,
        fabric: item.fabric,
        color: item.color,
        sku: item.sku,
        unit_price: item.unit_price || 0,
        list_price: item.list_price || 0,
        customizations: item.customizations || [],
        notes: item.notes,
        sizes,
        totalQty: item.quantity || 0,
        itemIds: [item.id]
      });
    }
  });
  const {
    data: reservations = [],
    refetch: refetchReservations
  } = useQuery({
    queryKey: ["stock_reservations", orderId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("stock_reservations").select(`
          *,
          inventory_batches (
            *,
            product_variants (
              *,
              models:product_models(*),
              fabrics(*),
              canonical_colors(*)
            )
          )
        `).eq("order_id", orderId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId
  });
  const [itemDrawerOpen, setItemDrawerOpen] = reactExports.useState(false);
  const [editingItem, setEditingItem] = reactExports.useState(null);
  if (isLoadingOrder) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 flex items-center gap-2 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin size-4" }),
      " Carregando pedido..."
    ] });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-sm text-muted-foreground", children: "Pedido não encontrado." });
  }
  const openNewItem = () => {
    setEditingItem(null);
    setItemDrawerOpen(true);
  };
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        status: newStatus
      });
      await logTimelineEvent({
        orderId: order.id,
        action: "status_alterado",
        description: `Status alterado de "${statusLabel[order.status]}" para "${statusLabel[newStatus]}"`,
        oldStatus: order.status,
        newStatus
      });
      if (newStatus === "liberado_producao") {
        try {
          await consumeStockForOrder(order.id);
          toast.success("Estoque consumido com sucesso!");
        } catch (consumeErr) {
          toast.error("Erro ao consumir estoque: " + consumeErr.message);
        }
      }
      toast.success("Status atualizado!");
    } catch (e) {
      toast.error("Erro ao atualizar status.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pedidos", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
      " Pedidos"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: order.code }),
          order.urgent && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--destructive)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
            " Urgente"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 text-3xl font-semibold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/crm", className: "hover:text-primary", children: order.client_name }),
          isFirstPurchase && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider", children: "PRIMEIRA COMPRA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5" }),
            " Prazo ",
            order.deadline ? new Date(order.deadline).toLocaleDateString("pt-BR") : "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", title: "Responsável", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5" }),
            " ",
            order.owner_name
          ] }),
          order.salesperson_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full", title: "Vendedor", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5" }),
            " ",
            order.salesperson_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-3.5" }),
            " ",
            order.brand_code
          ] }),
          order.mix_fabrics_allowed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium", title: "Mistura de tecidos autorizada pelo cliente", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
            " Mistura Autorizada"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase text-muted-foreground mb-1", children: "Status Atual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: order.status, onValueChange: (v) => handleStatusChange(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs bg-surface border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(statusLabel).map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: val, children: label }, val)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right ml-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-semibold number", children: [
            "R$ ",
            order.final_total.toLocaleString("pt-BR")
          ] }),
          order.commissions_total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1", children: [
            "Comissão: R$ ",
            Number(order.commissions_total).toLocaleString("pt-BR")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 space-y-4", children: [
        order.status === "expedicao" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-blue-200 bg-blue-50/30 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold mb-1 flex items-center gap-2 text-blue-900", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "size-4 text-blue-600" }),
                " Logística e Expedição"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-700/80", children: "Integração SGP Web para geração de etiquetas e postagem." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1" }),
              " Cotar Frete"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-blue-100 p-3 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-semibold text-slate-400 mb-1", children: "Dados de Envio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-slate-700", children: order.logistics_type || "Correios" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 mt-0.5", children: [
                order.volumes_quantity || 1,
                " volume(s) · ",
                order.gross_weight || 0,
                " kg"
              ] }),
              order.freight_cost > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-emerald-600 font-medium mt-1", children: [
                "Frete cobrado: ",
                formatCurrency(order.freight_cost)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-blue-100 p-3 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-semibold text-slate-400 mb-1", children: "Endereço de Entrega" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-slate-700 truncate", title: order.delivery_name || order.client_name, children: order.delivery_name || order.client_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 mt-0.5 flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", title: `${order.delivery_street || ""}, ${order.delivery_number || ""}`, children: [
                  order.delivery_street || "Endereço não informado",
                  ", ",
                  order.delivery_number || ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 mt-0.5 ml-4", children: [
                "CEP: ",
                order.delivery_zip || "—",
                " · ",
                order.delivery_city || "",
                "/",
                order.delivery_state || ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-blue-100 p-3 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-semibold text-slate-400 mb-1", children: "Rastreamento SGP" }),
              order.tracking_code ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono font-medium text-slate-800 flex items-center justify-between", children: [
                  order.tracking_code,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "size-5 hover:bg-blue-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3 text-blue-600" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded-full inline-flex bg-amber-100 text-amber-700", children: order.logistics_status || "Aguardando Postagem" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 italic mt-1", children: "Etiqueta não gerada." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-1", children: "Itens do pedido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Produtos e processos vinculados agrupados em grade." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openNewItem, className: "h-8 gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Novo Item"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: isLoadingItems ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin size-4 inline mr-2" }),
            " Carregando itens..."
          ] }) : groupedItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl", children: "Nenhum item adicionado a este pedido." }) : groupedItems.map((group, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-4 bg-surface hover:border-primary/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: group.product_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: [group.model, group.line, group.fabric, group.color, group.gender].filter(Boolean).join(" · ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-muted-foreground mt-1", children: [
                  "SKU Base: ",
                  group.sku || "—"
                ] }),
                group.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 italic", children: [
                  "“",
                  group.notes,
                  "”"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-800", children: formatCurrency((group.unit_price || 0) * group.totalQty) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  formatCurrency(group.unit_price),
                  " un."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
                  "Total: ",
                  group.totalQty,
                  " peças"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5", children: "Grade de Quantidades" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: SIZES.map((sz) => {
                const qty = group.sizes[sz] || 0;
                if (qty === 0) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center bg-white border rounded px-2.5 py-0.5 text-xs text-slate-700 shadow-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-400 mr-1", children: [
                    sz,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: qty })
                ] }, sz);
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-2", children: "Etapas e Processos Produtivos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: group.itemIds.map((itemId) => {
                const originalItem = items.find((it) => it.id === itemId);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-500 shrink-0 w-8", children: [
                    originalItem?.size,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ItemProcesses, { orderItemId: itemId })
                ] }, itemId);
              }) })
            ] })
          ] }, idx)) })
        ] }),
        reservations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-1", children: "Alocação Física de Lotes (Override FIFO)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rastreabilidade completa de matérias-primas por lote e override manual." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Item / Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-center w-20", children: "Qtd Reservada" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Lote Alocado (FIFO)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium w-64", children: "Alterar Lote (Override)" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y text-slate-700", children: reservations.map((res) => {
              const item = items.find((it) => it.id === res.order_item_id);
              const batch = res.inventory_batches;
              const variant = batch?.product_variants;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800", children: item?.product_name || "Produto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: [item?.model, item?.fabric, item?.color, item?.size, item?.gender].filter(Boolean).join(" · ") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-bold text-slate-800", children: res.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-slate-800", children: batch?.batch_code || "Sem Lote" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                    "Fornecedor: ",
                    batch?.suppliers?.name || "Interno",
                    " | Entrou em: ",
                    batch?.entry_date ? new Date(batch.entry_date).toLocaleDateString("pt-BR") : "—"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BatchSelector, { productVariantId: variant?.id, currentBatchId: res.batch_id, qty: res.quantity, onOverride: async (newBatchId) => {
                  try {
                    await overrideStock.mutateAsync({
                      reservationId: res.id,
                      newBatchId
                    });
                    toast.success("Lote alterado com sucesso!");
                    refetchReservations();
                  } catch (err) {
                    toast.error(err.message || "Erro ao alterar lote");
                  }
                } }) })
              ] }, res.id);
            }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-2xl border border-border bg-card p-5 flex flex-col h-[600px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-1", children: "Timeline do Pedido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Auditoria e histórico de ações." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar", children: isLoadingTimeline ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin size-4 inline mr-2" }),
          " Carregando timeline..."
        ] }) : timeline.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-4 text-xs text-muted-foreground", children: "Nenhum evento registrado." }) : timeline.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0 border border-border", children: t.action.includes("criado") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }) : t.action.includes("status") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDashed, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t.users?.name || "Sistema" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                " · ",
                new Date(t.created_at).toLocaleString("pt-BR")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-0.5 leading-relaxed text-foreground/90", children: t.description })
          ] })
        ] }, t.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrderItemDrawer, { open: itemDrawerOpen, onOpenChange: setItemDrawerOpen, orderId, item: editingItem })
  ] });
}
function ItemProcesses({
  orderItemId
}) {
  const {
    data: processes = [],
    isLoading
  } = useOrderItemProcesses(orderItemId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Carregando processos..." });
  if (processes.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Sem processos produtivos vinculados." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-2", children: "Processos" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: processes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProcessChip, { p }, p.id)) })
  ] });
}
function ProcessChip({
  p
}) {
  const map = {
    pendente: {
      Icon: CircleDashed,
      cls: "text-muted-foreground bg-muted border-border"
    },
    em_andamento: {
      Icon: LoaderCircle,
      cls: "text-primary bg-primary-soft border-transparent"
    },
    concluido: {
      Icon: CircleCheck,
      cls: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)] border-transparent"
    },
    bloqueado: {
      Icon: Lock,
      cls: "text-muted-foreground bg-muted/60 border-dashed border-border opacity-70"
    }
  }[p.status] || {
    Icon: CircleDashed,
    cls: "text-muted-foreground bg-muted border-border"
  };
  const {
    Icon,
    cls
  } = map;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-flex items-center gap-1.5 rounded-lg border px-2.5 h-7 text-xs font-medium ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-3.5 ${p.status === "em_andamento" ? "animate-spin" : ""}` }),
    p.production_processes?.name || "Processo"
  ] });
}
function BatchSelector({
  productVariantId,
  currentBatchId,
  onOverride,
  qty
}) {
  const [batches, setBatches] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (productVariantId) {
      setLoading(true);
      supabase.from("inventory_batches").select("id, batch_code, quantity_available, suppliers(name)").eq("product_variant_id", productVariantId).eq("active", true).then(({
        data
      }) => {
        if (data) setBatches(data);
        setLoading(false);
      });
    }
  }, [productVariantId]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground animate-pulse", children: "Carregando lotes..." });
  const options = batches.filter((b) => b.id === currentBatchId || Number(b.quantity_available) >= qty);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: currentBatchId, onValueChange: onOverride, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs bg-white border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione outro lote..." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
      options.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: b.id, className: "text-xs", children: [
        b.batch_code,
        " (",
        b.suppliers?.name || "Interno",
        ") — Disp: ",
        b.quantity_available,
        " un"
      ] }, b.id)),
      options.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: currentBatchId, disabled: true, className: "text-xs", children: "Nenhum outro lote disponível com saldo" })
    ] })
  ] });
}
export {
  OrderPage as component
};
