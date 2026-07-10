import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { z as useAuth, w as formatCurrency, B as Button, D as Dialog, f as DialogContent, i as DialogHeader, j as DialogTitle, g as DialogDescription, h as DialogFooter, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { ad as Search, V as LoaderCircle, a as ArrowDownRight, e as ArrowUpRight, C as Calendar, ak as SquareCheckBig, R as Landmark } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
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
function Conciliacao() {
  const {
    user
  } = useAuth();
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [selectedTx, setSelectedTx] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    payment_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    original_amount: 0,
    interest_amount: "0",
    discount_amount: "0",
    tax_amount: "0",
    // Salva na observação ou nas taxas se houver (vamos deduzir/gravar em logs)
    final_amount: "0",
    // Valor líquido pago/recebido
    payment_method: "PIX"
  });
  const loadData = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("financial_transactions").select("*, financial_categories(*)").in("status", ["pendente", "no_prazo", "vence_hoje", "atrasado", "parcial"]).order("due_date", {
      ascending: true
    });
    if (data) setTransactions(data);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  const openConciliation = (tx) => {
    setSelectedTx(tx);
    setFormData({
      payment_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      original_amount: Number(tx.amount),
      interest_amount: "0",
      discount_amount: "0",
      tax_amount: "0",
      final_amount: String(tx.amount),
      payment_method: tx.payment_method || "PIX"
    });
    setModalOpen(true);
  };
  const handleAmountChange = (field, val) => {
    const orig = formData.original_amount;
    let juros = parseFloat(field === "interest_amount" ? val : formData.interest_amount) || 0;
    let desc = parseFloat(field === "discount_amount" ? val : formData.discount_amount) || 0;
    let taxa = parseFloat(field === "tax_amount" ? val : formData.tax_amount) || 0;
    const isReceber = selectedTx?.type === "receber";
    let finalAmt = isReceber ? orig + juros - desc - taxa : orig + juros - desc + taxa;
    setFormData((prev) => ({
      ...prev,
      [field]: val,
      final_amount: String(Math.max(0, finalAmt).toFixed(2))
    }));
  };
  const handleConciliar = async (e) => {
    e.preventDefault();
    if (!selectedTx) return;
    setSaving(true);
    const finalAmount = parseFloat(formData.final_amount) || 0;
    const interest = parseFloat(formData.interest_amount) || 0;
    const discount = parseFloat(formData.discount_amount) || 0;
    const finalStatus = selectedTx.type === "receber" ? "recebido" : "pago";
    const beforeData = {
      ...selectedTx
    };
    const {
      error
    } = await supabase.from("financial_transactions").update({
      status: finalStatus,
      payment_date: formData.payment_date,
      amount: finalAmount,
      // atualiza com o valor real final liquidado
      interest_amount: interest,
      discount_amount: discount,
      payment_method: formData.payment_method,
      notes: `${selectedTx.notes || ""} [Conciliado: Juros R$${interest} | Desc R$${discount} | Taxa R$${formData.tax_amount}]`.trim()
    }).eq("id", selectedTx.id);
    if (error) {
      toast.error("Erro ao conciliar título: " + error.message);
    } else {
      toast.success("Título conciliado com sucesso!");
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Conciliação de Lançamento",
        before_data: beforeData,
        after_data: {
          id: selectedTx.id,
          status: finalStatus,
          payment_date: formData.payment_date,
          amount: finalAmount,
          interest_amount: interest,
          discount_amount: discount,
          payment_method: formData.payment_method,
          tax_applied: parseFloat(formData.tax_amount)
        }
      }]);
      setModalOpen(false);
      loadData();
    }
    setSaving(false);
  };
  const getDynamicStatus = (t) => {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (t.due_date < todayStr) return "atrasado";
    if (t.due_date === todayStr) return "vence_hoje";
    return "no_prazo";
  };
  const getStatusLabel = (status) => {
    const labels = {
      atrasado: "Atrasado",
      vence_hoje: "Vence hoje",
      no_prazo: "No prazo",
      parcial: "Parcial"
    };
    return labels[status] || status;
  };
  const getStatusTone = (status) => {
    const tones = {
      atrasado: "bg-rose-50 text-rose-700 border-rose-100",
      vence_hoje: "bg-amber-50 text-amber-700 border-amber-100",
      no_prazo: "bg-blue-50 text-blue-700 border-blue-100",
      parcial: "bg-purple-50 text-purple-700 border-purple-100"
    };
    return tones[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };
  const filtered = transactions.filter((t) => t.description.toLowerCase().includes(q.toLowerCase()) || (t.financial_categories?.name || "").toLowerCase().includes(q.toLowerCase()) || t.cost_center.toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-[1400px] mx-auto space-y-6 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-slate-800", children: "Conciliação Financeira" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Realize a baixa de títulos informando juros, descontos, tarifas e data de pagamento real." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 max-w-md bg-white border p-1 rounded-xl shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-slate-400 ml-2.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Filtrar títulos pendentes por descrição, categoria...", value: q, onChange: (e) => setQ(e.target.value), className: "h-8 w-full text-xs outline-none bg-transparent pr-2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-xl shadow-sm overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Tipo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Vencimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Descrição" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Categoria / Centro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Valor Original" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Ação" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y text-xs", children: [
        filtered.map((t) => {
          const isReceber = t.type === "receber";
          const dStatus = getDynamicStatus(t);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center w-12", children: isReceber ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center", title: "A Receber", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "size-4" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center", title: "A Pagar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-600 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5 text-slate-400" }),
              (/* @__PURE__ */ new Date(t.due_date + "T12:00:00")).toLocaleDateString("pt-BR")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-slate-800", children: t.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.financial_categories?.name || "Lançamento Avulso" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                "Centro: ",
                t.cost_center
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 text-right font-bold ${isReceber ? "text-emerald-600" : "text-red-500"}`, children: formatCurrency(t.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `px-2 py-0.5 rounded-md font-semibold ${getStatusTone(dStatus)}`, children: getStatusLabel(dStatus) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => openConciliation(t), className: "bg-slate-900 hover:bg-slate-800 text-white h-7 px-3 text-[11px] font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "size-3 mr-1.5" }),
              " Baixar / Conciliar"
            ] }) })
          ] }, t.id);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-16 text-center text-muted-foreground text-sm", children: "Nenhum título pendente encontrado para conciliação." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConciliar, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { className: "size-5 text-primary" }),
          "Conciliação de Título"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs", children: selectedTx?.type === "receber" ? "Registre a entrada e liquidação deste recebível." : "Registre a saída e quitação desta despesa." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-3 rounded-lg border flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-600", children: "Descrição:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 text-right truncate max-w-[220px]", children: selectedTx?.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payment_date", className: "text-xs font-semibold", children: "Data do Pagamento *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "payment_date", type: "date", value: formData.payment_date, onChange: (e) => setFormData({
              ...formData,
              payment_date: e.target.value
            }), className: "h-9 text-xs", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Forma de Pagamento *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.payment_method, onValueChange: (v) => setFormData({
              ...formData,
              payment_method: v
            }), required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PIX", children: "PIX" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Débito", children: "Débito" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito à vista", children: "Crédito à vista" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito parcelado", children: "Crédito parcelado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Boleto", children: "Boleto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Transferência", children: "Transferência" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dinheiro", children: "Dinheiro" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "juros", className: "text-xs font-semibold", children: "Juros / Multa (+)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "juros", type: "number", step: "0.01", placeholder: "0,00", value: formData.interest_amount, onChange: (e) => handleAmountChange("interest_amount", e.target.value), className: "h-8 text-xs" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desconto", className: "text-xs font-semibold", children: "Desconto (-)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "desconto", type: "number", step: "0.01", placeholder: "0,00", value: formData.discount_amount, onChange: (e) => handleAmountChange("discount_amount", e.target.value), className: "h-8 text-xs" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "taxa", className: "text-xs font-semibold", children: "Taxa Adm. / Cartão" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "taxa", type: "number", step: "0.01", placeholder: "0,00", value: formData.tax_amount, onChange: (e) => handleAmountChange("tax_amount", e.target.value), className: "h-8 text-xs" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-3 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700 text-sm", children: "Valor Final Conciliado:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-base font-extrabold ${selectedTx?.type === "receber" ? "text-emerald-600" : "text-red-500"}`, children: formatCurrency(parseFloat(formData.final_amount) || 0) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setModalOpen(false), className: "h-9 text-xs", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving, className: "bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-semibold", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }),
          "Confirmar Conciliação"
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Conciliacao as component
};
