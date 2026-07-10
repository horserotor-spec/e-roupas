import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { f as useOrders, h as useUpdateOrder, d as useDeleteOrder, a as allocateStockAndCreateProcesses } from "./_ssr/orders-CbTRcciT.mjs";
import { z as useAuth, B as Button, v as cn, y as supabase, w as formatCurrency, u as buttonVariants } from "./_ssr/router-BxmJvJdu.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { s as statusLabel, a as statusTone } from "./_ssr/constants-B8Sd5U_d.mjs";
import { b as useQueryClient, u as useMutation, a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { S as Sheet, a as SheetContent, e as SheetTitle, b as SheetDescription } from "./_ssr/sheet-BhiMmhDE.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "./_libs/radix-ui__react-scroll-area.mjs";
import { u as useClients } from "./_ssr/clients-Kv3wTwQs.mjs";
import { R as Root2, b as Trigger2, P as Portal2, a as Content2, T as Title2, D as Description2, C as Cancel, A as Action, O as Overlay2 } from "./_libs/radix-ui__react-alert-dialog.mjs";
import { S as Switch } from "./_ssr/switch-B1byUmMA.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { V as LoaderCircle, aq as TriangleAlert, ah as ShieldAlert, ad as Search, aa as Printer, B as Barcode, v as Clock, au as User, C as Calendar, y as CreditCard, a4 as Package, $ as MessageSquare, am as Tag, an as Trash2 } from "./_libs/lucide-react.mjs";
import { f as format, p as ptBR } from "./_libs/date-fns.mjs";
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
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-label.mjs";
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
function DrawerPedido({ order, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [isAllocating, setIsAllocating] = reactExports.useState(false);
  useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const { data: clients = [] } = useClients();
  clients.filter((c) => c.entity_type === "fornecedor");
  const { data: reservations = [] } = useQuery({
    queryKey: ["order_reservations", order?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("stock_reservations").select("*, inventory_batches(*)").eq("order_id", order?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!order?.id
  });
  const { data: productsDetails = [] } = useQuery({
    queryKey: ["order_products_suppliers", order?.id],
    queryFn: async () => {
      const productIds = order?.items?.map((i) => i.product_id).filter(Boolean) || [];
      if (productIds.length === 0) return [];
      const { data: prods, error } = await supabase.from("products").select("*, suppliers(*)").in("id", productIds);
      if (error) throw error;
      const results = [...prods || []];
      for (const prod of results) {
        if (!prod.suppliers && prod.format === "PA" && prod.model_id && prod.fabric_id && prod.color_id) {
          const { data: mpProd } = await supabase.from("products").select("*, suppliers(*)").eq("format", "MP").eq("model_id", prod.model_id).eq("fabric_id", prod.fabric_id).eq("color_id", prod.color_id).eq("active", true).maybeSingle();
          if (mpProd && mpProd.suppliers) {
            prod.suppliers = mpProd.suppliers;
          }
        }
      }
      return results;
    },
    enabled: !!order?.items && order.items.length > 0
  });
  const [addressForm, setAddressForm] = reactExports.useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipcode: ""
  });
  const [deadlinesForm, setDeadlinesForm] = reactExports.useState({
    corte_deadline: "",
    costura_deadline: "",
    acabamento_deadline: ""
  });
  const [isEditingAddress, setIsEditingAddress] = reactExports.useState(false);
  const [isEditingDeadlines, setIsEditingDeadlines] = reactExports.useState(false);
  const [deleteOpen, setDeleteOpen] = reactExports.useState(false);
  if (!order) return null;
  const handleForceAllocate = async () => {
    if (!order?.id) return;
    setIsAllocating(true);
    try {
      await allocateStockAndCreateProcesses(order.id);
      toast.success("Estoque recalculado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["order_reservations", order.id] });
    } catch (e) {
      toast.error(e.message || "Erro ao alocar estoque.");
    } finally {
      setIsAllocating(false);
    }
  };
  const overdue = order.deadline && new Date(order.deadline) < /* @__PURE__ */ new Date() && order.status !== "entregue" && order.status !== "finalizado";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "w-full sm:max-w-md lg:max-w-xl overflow-hidden flex flex-col p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50/50 p-6 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: order.brand_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: order.urgent ? "destructive" : "secondary", className: "text-[10px] px-1.5 py-0", children: order.urgent ? "Urgente" : "Normal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-2xl font-semibold tracking-tight", children: order.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetDescription, { className: "text-sm mt-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
          " ",
          order.client_name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `
                ${statusTone[order.status] === "info" ? "bg-blue-50 text-blue-700 border-blue-200" : statusTone[order.status] === "warning" ? "bg-orange-50 text-orange-700 border-orange-200" : statusTone[order.status] === "success" ? "bg-green-50 text-green-700 border-green-200" : statusTone[order.status] === "primary" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-slate-50 text-slate-700 border-slate-200"}
              `, children: statusLabel[order.status] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-xl border shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase", children: "Prazo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-medium ${overdue ? "text-destructive" : "text-foreground"}`, children: order.deadline ? format(new Date(order.deadline), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Não definido" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-xl border shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase", children: "Valor Total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: formatCurrency(order.final_total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-muted-foreground" }),
            " Itens do Pedido (",
            order.items?.length || 0,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleForceAllocate, disabled: isAllocating, className: "h-7 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200", children: isAllocating ? "Recalculando..." : "🔄 Recalcular Estoque" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          order.items?.map((item) => {
            const itemReservations = reservations.filter((r) => r.order_item_id === item.id);
            const qtyReserved = itemReservations.reduce((acc, r) => acc + Number(r.quantity), 0);
            const qtyMissing = Math.max(0, Number(item.quantity) - qtyReserved);
            const prodDetail = productsDetails.find((p) => p.id === item.product_id);
            const supplier = prodDetail?.suppliers;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-sm", children: [
                  item.quantity,
                  "x ",
                  item.product_name,
                  " ",
                  item.size ? `(Tam: ${item.size})` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: item.sku || "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: qtyMissing > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-600 font-semibold flex items-center gap-1", children: [
                "⚠️ Falta de Estoque (",
                qtyMissing,
                " un. em falta)"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-semibold flex items-center gap-1", children: "✓ Estoque Alocado" }) }) }),
              qtyMissing > 0 && supplier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-red-800 uppercase text-[9px] mb-1", children: "Fornecedor da Matéria-Prima (Insumo)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-700 font-semibold", children: supplier.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 mt-0.5", children: [
                  "Prazo de Entrega: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-700", children: [
                    supplier.lead_time_days,
                    " dias"
                  ] })
                ] }),
                (supplier.phone || supplier.whatsapp) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "icon",
                      className: "h-6 w-6 border-red-200 text-red-600 hover:bg-red-50",
                      onClick: () => {
                        const num = (supplier.whatsapp || supplier.phone).replace(/\D/g, "");
                        const msg = encodeURIComponent(`Olá, precisamos de matéria-prima para o pedido ${order.code}. Você tem o tecido do item "${item.product_name}" com prazo para entrega?`);
                        window.open(`https://wa.me/55${num}?text=${msg}`, "_blank");
                      },
                      title: "Enviar mensagem no WhatsApp",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500 font-mono", children: [
                    "Contato: ",
                    supplier.whatsapp || supplier.phone
                  ] })
                ] })
              ] }),
              item.customizations && item.customizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 space-y-1.5 pt-2.5 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-muted-foreground uppercase", children: "Personalizações" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: item.customizations.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px] bg-slate-100 font-normal", children: [
                  c.name,
                  " ",
                  c.details ? `(${c.details})` : ""
                ] }, i)) })
              ] })
            ] }, item.id);
          }),
          (!order.items || order.items.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground italic", children: "Nenhum item adicionado." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-4 text-muted-foreground" }),
          " Observações"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-dashed", children: order.notes || "Nenhuma observação registrada." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t bg-slate-50 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 mr-1.5" }),
          " Excluir Pedido"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir Pedido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Tem certeza que deseja excluir o pedido ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: order.code }),
              "? Esta ação não pode ser desfeita."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-red-600 hover:bg-red-700 text-white", onClick: async () => {
              try {
                await deleteOrder.mutateAsync(order.id);
                toast.success("Pedido excluído!");
                onOpenChange(false);
              } catch (e) {
                toast.error("Erro ao excluir: " + e.message);
              }
            }, children: "Sim, excluir pedido" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Fechar" })
    ] })
  ] }) });
}
const KANBAN_STAGES = [{
  id: "confirmado",
  label: "Confirmado",
  tone: "bg-blue-50 text-blue-700 border-blue-200"
}, {
  id: "aguardando_financeiro",
  label: "Ag. Financeiro",
  tone: "bg-orange-50 text-orange-700 border-orange-200"
}, {
  id: "liberado_producao",
  label: "Liberado",
  tone: "bg-purple-50 text-purple-700 border-purple-200"
}, {
  id: "separacao",
  label: "Separação",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "corte",
  label: "Corte",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "costura",
  label: "Costura",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "bordado",
  label: "Bordado",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "impressao",
  label: "Impressão",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "prensa",
  label: "Prensa",
  tone: "bg-slate-100 text-slate-700 border-slate-200"
}, {
  id: "qualidade",
  label: "Qualidade",
  tone: "bg-pink-50 text-pink-700 border-pink-200"
}, {
  id: "expedicao",
  label: "Expedição",
  tone: "bg-green-50 text-green-700 border-green-200"
}];
function ProducaoPage() {
  const {
    data: orders = [],
    isLoading
  } = useOrders();
  const queryClient = useQueryClient();
  const {
    user
  } = useAuth();
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = reactExports.useState(false);
  const [allowUrgentMove, setAllowUrgentMove] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const deferredQ = reactExports.useDeferredValue(q);
  const moveOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
      oldStatus
    }) => {
      let ipAddress = "IP desconhecido";
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        if (data && data.ip) {
          ipAddress = data.ip;
        }
      } catch (err) {
        console.error("Falha ao obter IP", err);
      }
      const now = /* @__PURE__ */ new Date();
      const localTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) + " - " + now.toLocaleDateString("pt-BR");
      const {
        error: updateError
      } = await supabase.from("orders").update({
        status: newStatus
      }).eq("id", orderId);
      if (updateError) throw updateError;
      await supabase.from("order_timeline").insert([{
        order_id: orderId,
        user_id: user?.id,
        event_type: "status_change",
        description: `Movido de ${statusLabel[oldStatus]} para ${statusLabel[newStatus]} via Kanban. (IP: ${ipAddress}, Hora: ${localTime})`,
        metadata: {
          ip: ipAddress,
          timestamp: now.toISOString()
        }
      }]);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      });
      toast.success("Pedido movido com sucesso!");
    },
    onError: (err) => {
      toast.error("Erro ao mover pedido.");
      console.error(err);
    }
  });
  const activeOrders = reactExports.useMemo(() => {
    return orders.filter((o) => KANBAN_STAGES.some((s) => s.id === o.status) && (deferredQ === "" || o.code.toLowerCase().includes(deferredQ.toLowerCase()) || o.client_name.toLowerCase().includes(deferredQ.toLowerCase())));
  }, [orders, deferredQ]);
  const handleDragStart = (e, orderId, currentStatus) => {
    e.dataTransfer.setData("orderId", orderId);
    e.dataTransfer.setData("currentStatus", currentStatus);
  };
  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    if (!orderId || currentStatus === stageId) return;
    const order = orders.find((o) => o.id === orderId);
    const hasBipedItems = order?.items?.some((item) => (item.quantity_separated || 0) > 0);
    if (currentStatus === "separacao" && hasBipedItems && !allowUrgentMove) {
      toast.error("Separação iniciada! Complete a separação física via scanner no 'Modo Separação'.");
      return;
    }
    const currentIndex = KANBAN_STAGES.findIndex((s) => s.id === currentStatus);
    const targetIndex = KANBAN_STAGES.findIndex((s) => s.id === stageId);
    if (!allowUrgentMove && targetIndex > currentIndex + 1) {
      toast.error("Não é possível pular etapas. Ative 'Produção Urgente' para forçar.");
      return;
    }
    moveOrderMutation.mutate({
      orderId,
      newStatus: stageId,
      oldStatus: currentStatus
    });
  };
  const openDrawer = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[calc(100vh-64px)] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  const atrasados = activeOrders.filter((o) => o.deadline && new Date(o.deadline) < /* @__PURE__ */ new Date()).length;
  const urgentes = activeOrders.filter((o) => o.urgent).length;
  const total = activeOrders.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-64px)] bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 bg-white border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-semibold tracking-tight text-slate-900", children: [
          "Kanban de Produção",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => window.open("/debug-estoque", "_blank"), className: "ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200", children: "🔧 ABRIR PAINEL DE CORREÇÃO DE ESTOQUE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-4 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-700", children: total }),
            " na esteira"
          ] }),
          atrasados > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-600 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3" }),
            " ",
            atrasados,
            " atrasados"
          ] }),
          urgentes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-600 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-3" }),
            " ",
            urgentes,
            " urgentes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-64 hidden sm:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar pedido ou cliente...", className: "h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full border bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "urgent-mode", checked: allowUrgentMove, onCheckedChange: setAllowUrgentMove }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "urgent-mode", className: "text-xs font-semibold uppercase text-slate-600 cursor-pointer", children: "Livrar Bloqueios" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto overflow-y-hidden p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-start gap-4 w-max", children: KANBAN_STAGES.map((stage) => {
      const stageOrders = activeOrders.filter((o) => o.status === stage.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[320px] shrink-0 h-full max-h-full flex flex-col rounded-xl bg-slate-100/50 border border-slate-200", onDragOver: (e) => e.preventDefault(), onDrop: (e) => handleDrop(e, stage.id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("px-4 py-3 rounded-t-xl border-b font-medium flex items-center justify-between", stage.tone), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tracking-tight uppercase", children: stage.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold px-2 py-0.5 rounded-full bg-white/50", children: stageOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex-1 overflow-y-auto space-y-3 kanban-scroll", children: [
          stageOrders.map((order) => {
            const overdue = order.deadline && new Date(order.deadline) < /* @__PURE__ */ new Date();
            const badges = /* @__PURE__ */ new Set();
            order.items?.forEach((i) => {
              i.customizations?.forEach((c) => {
                if (c.name.toLowerCase().includes("dtf")) badges.add("DTF");
                if (c.name.toLowerCase().includes("bordado")) badges.add("Bordado");
                if (c.name.toLowerCase().includes("silk")) badges.add("Silk");
              });
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { draggable: true, onDragStart: (e) => handleDragStart(e, order.id, order.status), onClick: () => openDrawer(order), className: cn("bg-white p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group", order.urgent ? "border-orange-300 shadow-orange-100" : "border-slate-200"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-slate-700", children: order.code }),
                order.urgent && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-[9px] px-1 py-0 h-4", children: "URG" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-tight text-slate-900 mb-2 truncate", children: order.client_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-3 truncate", children: order.items?.map((i) => `${i.quantity}x ${i.product_name.split(" ")[0]} (${i.sku || "-"} - Tam: ${i.size || "-"})`).join(", ") || "Sem itens" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: Array.from(badges).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm", children: [
                b === "DTF" ? "🟣" : b === "Bordado" ? "🟡" : "🟢",
                " ",
                b
              ] }, b)) }),
              order.status === "separacao" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1 mb-2.5 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/print/operacional", search: {
                  orderId: order.id
                }, onClick: (e) => e.stopPropagation(), className: "flex-1 h-7 rounded bg-slate-800 hover:bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center gap-1 uppercase transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }),
                  " Imprimir Etqs."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/producao/separacao", search: {
                  orderId: order.id
                }, onClick: (e) => e.stopPropagation(), className: "flex-1 h-7 rounded bg-amber-500 hover:bg-amber-600 text-[10px] font-bold text-slate-950 flex items-center justify-center gap-1 uppercase transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { className: "size-3.5" }),
                  " Bipar (Separação)"
                ] })
              ] }),
              order.status === "prensa" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                const confirmText = `Deseja marcar a Prensa do pedido ${order.code} como ✔ Aplicado?`;
                if (window.confirm(confirmText)) {
                  moveOrderMutation.mutate({
                    orderId: order.id,
                    newStatus: "qualidade",
                    oldStatus: "prensa"
                  });
                }
              }, className: "w-full h-7 mt-1 mb-2.5 rounded bg-blue-600 hover:bg-blue-700 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 uppercase transition-colors", children: "✔ Aplicar Prensa (Visual)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-3 border-t border-slate-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-[10px] font-medium flex items-center gap-1", overdue ? "text-red-600 font-bold" : "text-slate-500"), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                  order.deadline ? new Date(order.deadline).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit"
                  }) : "S/ prazo"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded", children: [
                  order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0,
                  " un"
                ] })
              ] })
            ] }, order.id);
          }),
          stageOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 flex items-center justify-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg", children: "Arraste pedidos para cá" })
        ] })
      ] }, stage.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerPedido, { order: selectedOrder, open: isDrawerOpen, onOpenChange: setIsDrawerOpen })
  ] });
}
export {
  ProducaoPage as component
};
