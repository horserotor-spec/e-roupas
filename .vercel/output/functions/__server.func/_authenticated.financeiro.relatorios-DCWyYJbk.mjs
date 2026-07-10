import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { B as Button, w as formatCurrency, y as supabase } from "./_ssr/router-BxmJvJdu.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { aa as Printer, z as Download, O as Funnel, aA as X, V as LoaderCircle } from "./_libs/lucide-react.mjs";
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
function RelatoriosFinanceiros() {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [clients, setClients] = reactExports.useState([]);
  const [suppliers, setSuppliers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("Todos");
  const [statusFilter, setStatusFilter] = reactExports.useState("Todos");
  const [costCenterFilter, setCostCenterFilter] = reactExports.useState("Todos");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("Todos");
  const [clientFilter, setClientFilter] = reactExports.useState("Todos");
  const [supplierFilter, setSupplierFilter] = reactExports.useState("Todos");
  const [paymentMethodFilter, setPaymentMethodFilter] = reactExports.useState("Todos");
  const [originFilter, setOriginFilter] = reactExports.useState("Todos");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const loadLookupsAndData = async () => {
    setLoading(true);
    const {
      data: txData
    } = await supabase.from("financial_transactions").select("*, financial_categories(*), orders(code, client_id, origin_channel, clients(name))").order("due_date", {
      ascending: false
    });
    if (txData) setTransactions(txData);
    const {
      data: catData
    } = await supabase.from("financial_categories").select("*").order("name");
    if (catData) setCategories(catData);
    const {
      data: clientData
    } = await supabase.from("clients").select("id, name").eq("entity_type", "cliente").order("name");
    if (clientData) setClients(clientData);
    const {
      data: supplierData
    } = await supabase.from("suppliers").select("id, name").order("name");
    if (supplierData) setSuppliers(supplierData);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadLookupsAndData();
  }, []);
  const getDynamicStatus = (t) => {
    if (t.status === "recebido" || t.status === "pago" || t.status === "cancelado" || t.status === "parcial") {
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
      pago: "Pago",
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
      pago: "bg-slate-100 text-slate-700 border-slate-200",
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
    const catName = t.financial_categories?.name || "";
    const matchesSearch = t.description.toLowerCase().includes(q.toLowerCase()) || catName.toLowerCase().includes(q.toLowerCase()) || t.cost_center.toLowerCase().includes(q.toLowerCase()) || (t.orders?.code || "").toLowerCase().includes(q.toLowerCase());
    const matchesType = typeFilter === "Todos" || t.type === typeFilter;
    const matchesStatus = statusFilter === "Todos" || dStatus === statusFilter;
    const matchesCostCenter = costCenterFilter === "Todos" || t.cost_center === costCenterFilter;
    const matchesCategory = categoryFilter === "Todos" || t.category_id === categoryFilter;
    const matchesClient = clientFilter === "Todos" || t.orders?.client_id === clientFilter;
    const matchesSupplier = supplierFilter === "Todos" || t.supplier_id === supplierFilter;
    const matchesPaymentMethod = paymentMethodFilter === "Todos" || t.payment_method === paymentMethodFilter;
    const matchesOrigin = originFilter === "Todos" || t.orders?.origin_channel === originFilter;
    const matchesStart = !startDate || t.due_date >= startDate;
    const matchesEnd = !endDate || t.due_date <= endDate;
    return matchesSearch && matchesType && matchesStatus && matchesCostCenter && matchesCategory && matchesClient && matchesSupplier && matchesPaymentMethod && matchesOrigin && matchesStart && matchesEnd;
  });
  const clearFilters = () => {
    setQ("");
    setTypeFilter("Todos");
    setStatusFilter("Todos");
    setCostCenterFilter("Todos");
    setCategoryFilter("Todos");
    setClientFilter("Todos");
    setSupplierFilter("Todos");
    setPaymentMethodFilter("Todos");
    setOriginFilter("Todos");
    setStartDate("");
    setEndDate("");
  };
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.warning("Nenhum dado para exportar.");
      return;
    }
    const headers = ["Vencimento", "Pagamento", "Tipo", "Descricao", "Valor (R$)", "Status", "Forma Pagamento", "Centro Custo", "Categoria", "Cliente", "Origem Pedido"];
    const rows = filtered.map((t) => [t.due_date, t.payment_date || "", t.type === "receber" ? "Receita" : "Despesa", t.description.replace(/;/g, ","), Number(t.amount).toFixed(2), getDynamicStatus(t), t.payment_method || "PIX", t.cost_center, t.financial_categories?.name || "Avulso", (t.orders?.clients?.name || "").replace(/;/g, ","), t.orders?.origin_channel || ""]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_financeiro_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório CSV exportado com sucesso!");
  };
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in print:p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Módulo Financeiro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-bold tracking-tight text-slate-800", children: "Relatórios Financeiros" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Gere demonstrativos, cruze dados operacionais e exporte relatórios consolidados." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrint, variant: "outline", className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
          " Imprimir (PDF)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleExportCSV, className: "bg-slate-900 hover:bg-slate-800 text-white h-9 inline-flex items-center gap-1.5 px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
          " Exportar (CSV/Excel)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-xl p-5 shadow-sm space-y-4 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Filtros Cruzados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Busca Geral" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Descrição, pedido...", value: q, onChange: (e) => setQ(e.target.value), className: "h-9 text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: typeFilter, onValueChange: setTypeFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Tipos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "receber", children: "Receita (Entrada)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pagar", children: "Despesa (Saída)" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no_prazo", children: "No prazo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "vence_hoje", children: "Vence hoje" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "atrasado", children: "Atrasado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "recebido", children: "Recebido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pago", children: "Pago / Quitado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "parcial", children: "Parcial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelado", children: "Cancelado" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Centro de Custo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: costCenterFilter, onValueChange: setCostCenterFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Centros" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Geral", children: "Geral" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Atendimento", children: "Atendimento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Designer", children: "Designer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Financeiro", children: "Financeiro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Impressão", children: "Impressão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Produção", children: "Produção" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Expedição", children: "Expedição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Compras", children: "Compras" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Estoque", children: "Estoque" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Comercial", children: "Comercial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Diretoria", children: "Diretoria" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Categoria / Conta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todas as Contas" }),
              categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: clientFilter, onValueChange: setClientFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Clientes" }),
              clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Fornecedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: supplierFilter, onValueChange: setSupplierFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todos os Fornecedores" }),
              suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Forma de Pagto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: paymentMethodFilter, onValueChange: setPaymentMethodFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Todos", children: "Todas as Formas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PIX", children: "PIX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Débito", children: "Débito" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito à vista", children: "Crédito à vista" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito parcelado", children: "Crédito parcelado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Boleto", children: "Boleto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Transferência", children: "Transferência" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Dinheiro", children: "Dinheiro" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Vencimento Início" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "h-9 text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-wider", children: "Vencimento Fim" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "h-9 text-xs" })
        ] })
      ] }),
      (q || typeFilter !== "Todos" || statusFilter !== "Todos" || costCenterFilter !== "Todos" || categoryFilter !== "Todos" || clientFilter !== "Todos" || supplierFilter !== "Todos" || paymentMethodFilter !== "Todos" || startDate || endDate) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, className: "text-xs text-red-600 hover:text-red-700 h-8 px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-1" }),
        " Limpar Filtros"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden print:block border-b-2 pb-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold uppercase", children: "Relatório Financeiro Consolidado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
        "Gerado em: ",
        (/* @__PURE__ */ new Date()).toLocaleString("pt-BR"),
        " | Total de registros: ",
        filtered.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 border-b text-xs font-semibold uppercase tracking-wider print:bg-transparent print:text-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Vencimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Tipo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Descrição / Lançamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Categoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Centro Custo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Forma Pagto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Valor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y text-xs print:divide-slate-200", children: [
        filtered.map((t) => {
          const isReceber = t.type === "receber";
          const dStatus = getDynamicStatus(t);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap text-slate-600 font-medium", children: (/* @__PURE__ */ new Date(t.due_date + "T12:00:00")).toLocaleDateString("pt-BR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold uppercase tracking-wider text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isReceber ? "text-emerald-600" : "text-red-500", children: isReceber ? "Receita" : "Despesa" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium text-slate-800", children: [
              t.description,
              t.orders?.code && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 font-mono text-[9px] text-muted-foreground", children: [
                "#",
                t.orders.code
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600", children: t.financial_categories?.name || "Avulso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-slate-600 font-medium", children: t.cost_center }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: t.payment_method || "PIX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-4 py-3 text-right font-bold ${isReceber ? "text-emerald-600" : "text-red-500"}`, children: [
              isReceber ? "+" : "-",
              " ",
              formatCurrency(t.amount)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `px-2 py-0.5 rounded-md font-semibold print:border-none print:bg-transparent ${getStatusTone(dStatus)}`, children: getStatusLabel(dStatus) }) })
          ] }, t.id);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-16 text-center text-muted-foreground text-sm", children: "Nenhum lançamento corresponde aos filtros selecionados." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border rounded-xl p-5 shadow-inner print:border-2 print:shadow-none print:mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center sm:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider", children: "Total de Receitas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-emerald-600", children: formatCurrency(filtered.filter((t) => t.type === "receber").reduce((acc, t) => acc + Number(t.amount), 0)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center sm:text-left border-t sm:border-t-0 sm:border-x px-4 border-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider", children: "Total de Despesas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-red-500", children: formatCurrency(filtered.filter((t) => t.type === "pagar").reduce((acc, t) => acc + Number(t.amount), 0)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center sm:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider", children: "Saldo do Filtro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xl font-extrabold ${filtered.filter((t) => t.type === "receber").reduce((acc, t) => acc + Number(t.amount), 0) - filtered.filter((t) => t.type === "pagar").reduce((acc, t) => acc + Number(t.amount), 0) >= 0 ? "text-emerald-600" : "text-red-500"}`, children: formatCurrency(filtered.filter((t) => t.type === "receber").reduce((acc, t) => acc + Number(t.amount), 0) - filtered.filter((t) => t.type === "pagar").reduce((acc, t) => acc + Number(t.amount), 0)) })
      ] })
    ] })
  ] });
}
export {
  RelatoriosFinanceiros as component
};
