import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { B as Button, w as formatCurrency } from "./_ssr/router-C3pqRbRf.mjs";
import { u as useClients, b as useImportClients } from "./_ssr/clients-B1XUVlvf.mjs";
import { C as ClientFormDrawer } from "./_ssr/ClientFormDrawer-BGVqmjp_.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { P as Papa } from "./_libs/papaparse.mjs";
import { V as LoaderCircle, at as Upload, z as Download, a9 as Plus, ad as Search, a6 as Pen } from "./_libs/lucide-react.mjs";
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
import "./_ssr/sheet-D2lt7x6C.mjs";
import "./_ssr/input-D7a6tjwM.mjs";
import "./_ssr/label-DkxTpSdj.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_ssr/textarea-z4ZHWIWX.mjs";
import "./_ssr/select-B4kfgWOA.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_ssr/switch-BF-Fjd0q.mjs";
import "./_libs/radix-ui__react-switch.mjs";
import "./_ssr/checkbox-fhMdhopN.mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
function CrmPage() {
  const [q, setQ] = reactExports.useState("");
  const deferredQ = reactExports.useDeferredValue(q);
  const [brand, setBrand] = reactExports.useState("all");
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editingClient, setEditingClient] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const {
    data: clients = [],
    isLoading
  } = useClients(deferredQ);
  const importMutation = useImportClients();
  const filtered = clients;
  const openNewClient = () => {
    setEditingClient(null);
    setDrawerOpen(true);
  };
  const openEditClient = (client) => {
    setEditingClient(client);
    setDrawerOpen(true);
  };
  const handleExportCSV = () => {
    if (!clients.length) {
      toast.info("Nenhum cliente para exportar.");
      return;
    }
    const dataToExport = clients.map((c) => ({
      Nome: c.name,
      Tipo: c.entity_class?.toUpperCase() || "PF",
      Categoria: c.entity_type || "cliente",
      "CPF/CNPJ": c.document || "",
      "RG/IE": c.state_registration || "",
      Celular: c.phone || "",
      "Telefone Fixo": c.landline_phone || "",
      Email: c.email || "",
      Instagram: c.instagram || "",
      "Nome Fantasia": c.company_name || "",
      "Origem": c.lead_source || "",
      "Status Crédito": c.credit_status || "",
      "Primeira Compra": c.is_first_purchase ? "Sim" : "Não",
      "Última Compra": c.last_purchase_date ? new Date(c.last_purchase_date).toLocaleDateString("pt-BR") : "",
      "CEP": c.zip_code || "",
      "Endereço": c.street || "",
      "Número": c.number || "",
      "Complemento": c.complement || "",
      "Bairro": c.neighborhood || "",
      "Cidade": c.city || "",
      "UF": c.state || "",
      Observações: c.notes || ""
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
    link.setAttribute("download", `clientes_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
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
          const parsedClients = rows.map((row) => ({
            name: row.Nome || row.name || "Sem Nome",
            entity_class: (row.Tipo || row.entity_class || "pf").toLowerCase(),
            entity_type: (row.Categoria || row.entity_type || "cliente").toLowerCase(),
            document: row["CPF/CNPJ"] || row.document || null,
            state_registration: row["RG/IE"] || row.state_registration || null,
            phone: row.Celular || row.phone || null,
            landline_phone: row["Telefone Fixo"] || row.landline_phone || null,
            email: row.Email || row.email || null,
            instagram: row.Instagram || row.instagram || null,
            company_name: row["Nome Fantasia"] || row.company_name || null,
            lead_source: row.Origem || row.lead_source || null,
            credit_status: row["Status Crédito"] || row.credit_status || "bom",
            zip_code: row.CEP || row.zip_code || null,
            street: row["Endereço"] || row.street || null,
            number: row["Número"] || row.number || null,
            complement: row.Complemento || row.complement || null,
            neighborhood: row.Bairro || row.neighborhood || null,
            city: row.Cidade || row.city || null,
            state: row.UF || row.state || null,
            notes: row["Observações"] || row.notes || null,
            active: true
          }));
          const res = await importMutation.mutateAsync(parsedClients);
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "CRM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".csv", className: "hidden", ref: fileInputRef, onChange: handleImportCSV }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5", onClick: () => fileInputRef.current?.click(), disabled: importMutation.isPending, children: [
          importMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4" }),
          "Importar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-9 gap-1.5", onClick: handleExportCSV, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
          " Exportar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNewClient, className: "h-9 inline-flex items-center gap-1.5 px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          " Novo cliente"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[240px] max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar nome, email, telefone, CNPJ…", className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs", children: ["all", "ER", "PG8"].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBrand(b), className: `px-3 h-7 rounded-md font-medium transition-colors ${brand === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`, children: b === "all" ? "Todas" : b === "ER" ? "e-roupas" : "peagah8" }, b)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5", children: "Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5 hidden md:table-cell", children: "Contato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5 hidden lg:table-cell", children: "Origem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-4 py-2.5 hidden lg:table-cell", children: "Última Compra" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Pedidos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5 number", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-medium px-4 py-2.5", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          " Carregando clientes..."
        ] }) }) }),
        !isLoading && filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/crm/$clientId", params: {
              clientId: c.id
            }, className: "font-medium hover:text-primary", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.document || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 hidden md:table-cell text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: c.phone || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: c.email || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-muted-foreground", children: c.lead_source || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.last_purchase_date ? new Date(c.last_purchase_date).toLocaleDateString("pt-BR") : "—" }),
            c.entity_type === "cliente" && c.is_first_purchase && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-gray-400 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider", children: "PRIMEIRA COMPRA" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right number", children: c.orders }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right number font-medium", children: formatCurrency(c.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEditClient(c), className: "h-8 w-8 text-muted-foreground hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }) })
        ] }, c.id)),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum cliente encontrado." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClientFormDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, client: editingClient })
  ] });
}
export {
  CrmPage as component
};
