import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { z as useAuth, B as Button, w as formatCurrency, D as Dialog, f as DialogContent, i as DialogHeader, j as DialogTitle, g as DialogDescription, h as DialogFooter, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { T as Textarea } from "./_ssr/textarea-CZ4oHjug.mjs";
import { a9 as Plus, O as Funnel, ad as Search, aA as X, V as LoaderCircle, C as Calendar, b as ArrowDownToLine, a6 as Pen, an as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/radix-ui__react-label.mjs";
const REVENUE_CATEGORIES = ["Venda de Roupas", "Private Label", "Dropshipping", "Serviços", "Receitas Financeiras"];
function ContasReceber() {
  const {
    user
  } = useAuth();
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("Todos");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [editingTx, setEditingTx] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    description: "",
    amount: "",
    due_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    category_name: "Venda de Roupas",
    cost_center: "Comercial",
    payment_method: "PIX",
    notes: "",
    status: "pendente"
  });
  const loadData = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("financial_transactions").select("*, financial_categories(*), orders(code, client_id, clients(name))").eq("type", "receber").order("due_date", {
      ascending: true
    });
    if (data) setTransactions(data);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  const handleQuickBaixar = async (id) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const {
      error
    } = await supabase.from("financial_transactions").update({
      status: "recebido",
      payment_date: today
    }).eq("id", id);
    if (error) {
      toast.error("Erro ao realizar a baixa.");
    } else {
      toast.success("Recebimento confirmado com sucesso!");
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Baixa de Conta a Receber",
        after_data: {
          id,
          status: "recebido",
          payment_date: today
        }
      }]);
      loadData();
    }
  };
  const handleEditClick = (tx) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description,
      amount: String(tx.amount),
      due_date: tx.due_date,
      category_name: tx.financial_categories?.name || "Venda de Roupas",
      cost_center: tx.cost_center || "Comercial",
      payment_method: tx.payment_method || "PIX",
      notes: tx.notes || "",
      status: tx.status || "pendente"
    });
    setModalOpen(true);
  };
  const handleDeleteClick = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este lançamento a receber?")) return;
    const {
      error
    } = await supabase.from("financial_transactions").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir lançamento: " + error.message);
    } else {
      toast.success("Lançamento excluído com sucesso!");
      await supabase.from("audit_logs").insert([{
        user_id: user?.id || null,
        module: "Financeiro",
        action: "Exclusão de Lançamento a Receber",
        after_data: {
          id
        }
      }]);
      loadData();
    }
  };
  const resolveCategory = async (name) => {
    let type = "receita";
    if (name === "Receitas Financeiras") type = "financeiro";
    const {
      data: existing
    } = await supabase.from("financial_categories").select("id").eq("name", name).maybeSingle();
    if (existing) return existing.id;
    const {
      data: created
    } = await supabase.from("financial_categories").insert([{
      name,
      type
    }]).select("id").single();
    return created?.id;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.due_date || !formData.category_name) {
      toast.error("Preencha todos os campos obrigatórios (*).");
      return;
    }
    setSaving(true);
    try {
      const amt = parseFloat(formData.amount);
      const categoryId = await resolveCategory(formData.category_name);
      const payload = {
        type: "receber",
        status: formData.status,
        description: formData.description,
        amount: amt,
        original_amount: amt,
        due_date: formData.due_date,
        category_id: categoryId,
        cost_center: formData.cost_center,
        payment_method: formData.payment_method,
        notes: formData.notes,
        payment_date: formData.status === "recebido" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : null
      };
      if (editingTx) {
        const {
          error
        } = await supabase.from("financial_transactions").update(payload).eq("id", editingTx.id);
        if (error) throw error;
        toast.success("Título a receber atualizado com sucesso!");
      } else {
        const {
          error
        } = await supabase.from("financial_transactions").insert([{
          ...payload,
          created_by: user?.id || null
        }]);
        if (error) throw error;
        toast.success("Título a receber cadastrado com sucesso!");
      }
      setFormData({
        description: "",
        amount: "",
        due_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        category_name: "Venda de Roupas",
        cost_center: "Comercial",
        payment_method: "PIX",
        notes: "",
        status: "pendente"
      });
      setEditingTx(null);
      setModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar lançamento: " + error.message);
    } finally {
      setSaving(false);
    }
  };
  const getDynamicStatus = (t) => {
    if (t.status === "recebido" || t.status === "cancelado" || t.status === "parcial") {
      return t.status;
    }
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (t.due_date < todayStr) return "atrasado";
    if (t.due_date === todayStr) return "vence_hoje";
    return "no_prazo";
  };
  const getStatusLabel = (status) => {
    const labels = {
      recebido: "Recebido",
      atrasado: "Atrasado",
      vence_hoje: "Vence hoje",
      no_prazo: "No prazo",
      parcial: "Parcial",
      cancelado: "Cancelado",
      pendente: "Pendente"
    };
    return labels[status] || status;
  };
  const getStatusTone = (status) => {
    const tones = {
      recebido: "bg-emerald-50 text-emerald-700 border-emerald-100",
      atrasado: "bg-rose-50 text-rose-700 border-rose-100",
      vence_hoje: "bg-amber-50 text-amber-700 border-amber-100",
      no_prazo: "bg-blue-50 text-blue-700 border-blue-100",
      parcial: "bg-purple-50 text-purple-700 border-purple-100",
      cancelado: "bg-slate-150 text-slate-500 border-slate-200"
    };
    return tones[status] || "bg-slate-50 text-slate-700 border-slate-100";
  };
  const filtered = transactions.filter((t) => {
    const dStatus = getDynamicStatus(t);
    const clientName = t.orders?.clients?.name || t.description || "";
    const matchesSearch = clientName.toLowerCase().includes(q.toLowerCase()) || t.description.toLowerCase().includes(q.toLowerCase()) || t.orders?.code?.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || dStatus === statusFilter;
    const matchesStart = !startDate || t.due_date >= startDate;
    const matchesEnd = !endDate || t.due_date <= endDate;
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });
  const clearFilters = () => {
    setQ("");
    setStatusFilter("Todos");
    setStartDate("");
    setEndDate("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 max-w-[1400px] mx-auto space-y-6 animate-in fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-slate-800", children: "Contas a Receber" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gestão de recebíveis, parcelas de vendas e conciliação." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditingTx(null);
        setModalOpen(true);
      }, className: "bg-slate-900 hover:bg-slate-800 text-white font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
        " Nova Receita"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-xl p-5 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Filtros de Busca" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider", children: "Cliente ou Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nome, ref, pedido...", value: q, onChange: (e) => setQ(e.target.value), className: "pl-8 h-9 text-xs" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no_prazo", children: "No prazo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "vence_hoje", children: "Vence hoje" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "atrasado", children: "Atrasado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "recebido", children: "Recebido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "parcial", children: "Parcial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelado", children: "Cancelado" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider", children: "Vencimento Início" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "h-9 text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider", children: "Vencimento Fim" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "h-9 text-xs" })
        ] })
      ] }),
      (q || statusFilter !== "Todos" || startDate || endDate) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, className: "text-xs text-red-600 hover:text-red-700 h-8 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-1" }),
        " Limpar Filtros"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-xl shadow-sm overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Vencimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Descrição / Lançamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Forma" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Valor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y text-xs", children: [
        filtered.map((t) => {
          const dStatus = getDynamicStatus(t);
          const clientName = t.orders?.clients?.name || "Lançamento Avulso";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-600 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5 text-slate-400" }),
              (/* @__PURE__ */ new Date(t.due_date + "T12:00:00")).toLocaleDateString("pt-BR")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium text-slate-800", children: [
              t.description,
              t.orders?.code && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-2 font-mono text-[10px] bg-slate-100 text-slate-600", children: [
                "#",
                t.orders.code
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 truncate max-w-[200px]", children: clientName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-slate-50 text-slate-600 rounded-md font-medium", children: t.payment_method || "PIX" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-bold text-slate-800", children: formatCurrency(t.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `px-2 py-0.5 rounded-md font-semibold ${getStatusTone(dStatus)}`, children: getStatusLabel(dStatus) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1.5 items-center", children: [
              dStatus !== "recebido" && dStatus !== "cancelado" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => handleQuickBaixar(t.id), className: "bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2.5 text-[10px] font-semibold flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "size-3 mr-1" }),
                " Baixar"
              ] }),
              dStatus === "recebido" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-600 font-bold flex items-center gap-1 mr-2", children: [
                "✓ ",
                t.payment_date && (/* @__PURE__ */ new Date(t.payment_date + "T12:00:00")).toLocaleDateString("pt-BR")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleEditClick(t), className: "h-7 px-2 text-[10px] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-3" }),
                " Editar"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => handleDeleteClick(t.id), className: "h-7 px-2 text-[10px] text-red-500 hover:bg-red-50 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                " Excluir"
              ] })
            ] }) })
          ] }, t.id);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-16 text-center text-muted-foreground text-sm", children: "Nenhum título a receber encontrado para os filtros selecionados." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: (open) => {
      setModalOpen(open);
      if (!open) setEditingTx(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-bold text-slate-850", children: editingTx ? "Editar Lançamento a Receber" : "Lançamento de Receita Manual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs", children: "Registre ou edite receitas operacionais ou recebimentos avulsos." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "text-xs font-semibold", children: "Descrição / Origem *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "description", placeholder: "Ex: Faturamento Lote Roupas ERP", value: formData.description, onChange: (e) => setFormData({
            ...formData,
            description: e.target.value
          }), className: "h-9", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", className: "text-xs font-semibold", children: "Valor (R$) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", step: "0.01", placeholder: "0,00", value: formData.amount, onChange: (e) => setFormData({
              ...formData,
              amount: e.target.value
            }), className: "h-9", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "due_date", className: "text-xs font-semibold", children: "Vencimento *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "due_date", type: "date", value: formData.due_date, onChange: (e) => setFormData({
              ...formData,
              due_date: e.target.value
            }), className: "h-9", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Categoria de Receita *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category_name, onValueChange: (v) => setFormData({
              ...formData,
              category_name: v
            }), required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: REVENUE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Meio de Pagamento *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.payment_method, onValueChange: (v) => setFormData({
              ...formData,
              payment_method: v
            }), required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PIX", children: "PIX" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Boleto", children: "Boleto Bancário" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cartão de Crédito", children: "Cartão de Crédito" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dinheiro", children: "Dinheiro" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Transferência", children: "TED/DOC" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Status de Recebimento *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (v) => setFormData({
              ...formData,
              status: v
            }), required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pendente", children: "Pendente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "recebido", children: "Recebido" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Centro de Custo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.cost_center, onValueChange: (v) => setFormData({
              ...formData,
              cost_center: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Comercial", children: "Comercial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Financeiro", children: "Financeiro" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Geral", children: "Geral" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", className: "text-xs font-semibold", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "notes", placeholder: "Informações adicionais do título", value: formData.notes, onChange: (e) => setFormData({
            ...formData,
            notes: e.target.value
          }), className: "min-h-[60px]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
          setModalOpen(false);
          setEditingTx(null);
        }, className: "h-9 text-xs", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving, className: "bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs font-semibold", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }),
          editingTx ? "Salvar Alterações" : "Salvar Lançamento"
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  ContasReceber as component
};
