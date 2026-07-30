import { createFileRoute, Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { useClients, Client, useImportClients, useCleanBadImports } from "@/lib/api/clients";
import { useState, useDeferredValue, useRef } from "react";
import { Search, Plus, Loader2, Edit2, Download, Upload } from "lucide-react";
import { ClientFormDrawer } from "@/components/crm/ClientFormDrawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/crm/")({
  head: () => ({ meta: [{ title: "CRM · e-roupas OS" }] }),
  component: CrmPage,
});

function CrmPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [brand, setBrand] = useState<"all" | "ER" | "PG8">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: clients = [], isLoading } = useClients(deferredQ);
  const importMutation = useImportClients();
  const cleanBadImports = useCleanBadImports();

  const filtered = clients; // Search is handled by the API now

  const openNewClient = () => {
    setEditingClient(null);
    setDrawerOpen(true);
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (!clients.length) {
      toast.info("Nenhum cliente para exportar.");
      return;
    }

    const dataToExport = clients.map(c => ({
      "Código": c.code || '',
      Nome: c.name,
      Tipo: c.entity_class?.toUpperCase() || 'PF',
      Categoria: c.entity_type || 'cliente',
      "CPF/CNPJ": c.document || '',
      "RG/IE": c.state_registration || '',
      Celular: c.phone || '',
      "Telefone Fixo": c.landline_phone || '',
      Email: c.email || '',
      "Email NF": c.email_nfe || '',
      Instagram: c.instagram || '',
      "Nome Fantasia": c.company_name || '',
      "Origem": c.lead_source || '',
      "Status Crédito": c.credit_status || '',
      "Cliente Desde": c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : '',
      "Primeira Compra": c.is_first_purchase ? 'Sim' : 'Não',
      "Última Compra": c.last_purchase_date ? new Date(c.last_purchase_date).toLocaleDateString("pt-BR") : '',
      "CEP": c.zip_code || '',
      "Endereço": c.street || '',
      "Número": c.number || '',
      "Complemento": c.complement || '',
      "Bairro": c.neighborhood || '',
      "Cidade": c.city || '',
      "UF": c.state || '',
      Observações: c.notes || ''
    }));

    const csv = Papa.unparse(dataToExport, { header: true });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `clientes_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Helper: try multiple possible column name variations (case-insensitive)
    const get = (row: any, ...keys: string[]) => {
      for (const key of keys) {
        // Exact match first
        if (row[key] !== undefined && row[key] !== "") return row[key];
        // Case-insensitive / space-insensitive match (and strip BOM)
        const normalized = key.toLowerCase().replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ").trim();
        const found = Object.keys(row).find(k =>
          k.replace(/[\uFEFF\u200B]/g, "").toLowerCase().replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ").trim() === normalized
        );
        if (found && row[found] !== undefined && row[found] !== "") return row[found];
      }
      return null;
    };

    // Helper: parse DD/MM/YYYY into YYYY-MM-DD for PostgreSQL
    const parseDateStr = (dateStr: string | null | undefined) => {
      if (!dateStr) return null;
      if (dateStr.includes("-")) return dateStr; // Already ISO format or DB export
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        return `${year}-${month}-${day}`;
      }
      return null;
    };

    // Read the file as text first so we can detect delimiter and encoding
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        toast.error("Não foi possível ler o arquivo.");
        return;
      }

      // Remove BOM if present
      const clean = text.replace(/^\uFEFF/, "");

      // Detect delimiter: use semicolon if more ';' than ',' in first line
      const firstLine = clean.split("\n")[0] || "";
      const delimiter = (firstLine.split(";").length > firstLine.split(",").length) ? ";" : ",";

      Papa.parse(clean, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        transformHeader: (h) => h.trim(), // Remove leading/trailing spaces from headers
        complete: async (results) => {
          try {
            const rows = results.data as any[];
            if (!rows.length) {
              toast.error("O arquivo CSV está vazio.");
              return;
            }

            // Diagnostic: show detected columns
            const detectedCols = results.meta.fields || [];
            console.log("[Importação CRM] Delimitador detectado:", delimiter);
            console.log("[Importação CRM] Colunas detectadas:", detectedCols);
            console.log("[Importação CRM] Primeira linha:", rows[0]);

            const parsedClients = rows.map(row => {
              const rawClass = get(row, "Tipo", "entity_class", "Tipo Pessoa", "Tipo pessoa") || 'pf';
              const entity_class = rawClass.toLowerCase().includes("jur") || rawClass.toLowerCase().includes("pj") ? "pj" : "pf";
              
              const rawType = get(row, "Categoria", "entity_type") || 'cliente';
              const entity_type = rawType.toLowerCase().trim();

              return {
                name:               get(row, "Nome", "name", "Nome Completo") || "Sem Nome",
                entity_class,
                entity_type,
                document:           get(row, "CPF/CNPJ", "CNPJ/CPF", "CNPJ / CPF", "CPF / CNPJ", "CNPJ", "CPF", "document"),
              state_registration: get(row, "RG/IE", "IE/RG", "RG / IE", "IE / RG", "RG", "IE", "state_registration"),
              phone:              get(row, "Celular", "phone", "Telefone", "Fone", "WhatsApp"),
              landline_phone:     get(row, "Telefone Fixo", "Fixo", "landline_phone"),
              email:              get(row, "Email", "E-mail", "email"),
              email_nfe:          get(row, "Email NF", "Email NF-e", "Email NFe", "E-mail NF", "email_nfe"),
              instagram:          get(row, "Instagram", "instagram"),
              company_name:       get(row, "Nome Fantasia", "Fantasia", "company_name"),
              lead_source:        get(row, "Origem", "lead_source"),
              credit_status:      get(row, "Status Crédito", "Status Credito", "credit_status") || 'bom',
              zip_code:           get(row, "CEP", "zip_code", "Código Postal"),
              street:             get(row, "Endereço", "Endereco", "street", "Logradouro"),
              number:             get(row, "Número", "Numero", "number"),
              complement:         get(row, "Complemento", "complement"),
              neighborhood:       get(row, "Bairro", "neighborhood"),
              city:               get(row, "Cidade", "city", "Município"),
              state:              get(row, "UF", "Estado", "state"),
              notes:              get(row, "Observações", "Observacoes", "Obs", "notes"),
              created_at:         parseDateStr(get(row, "Cliente Desde", "created_at")),
              active: true,
              is_first_purchase: false
            };
          });

            const res = await importMutation.mutateAsync(parsedClients);
            toast.success(`Importação concluída: ${res.imported} adicionados, ${res.skipped} ignorados. (${rows.length} linhas lidas, separador: '${delimiter}')`);
          } catch (error: any) {
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
    reader.readAsText(file, "UTF-8");
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Nome", "Tipo", "Categoria", "CPF/CNPJ", "RG/IE", "Celular", 
      "Telefone Fixo", "Email", "Email NF", "Instagram", "Nome Fantasia", 
      "Origem", "Status Crédito", "CEP", "Endereço", "Número", 
      "Complemento", "Bairro", "Cidade", "UF", "Observações", "Cliente Desde"
    ];
    
    // Create CSV string with headers only (empty row optional, but headers are enough)
    const csvContent = Papa.unparse({
      fields: headers,
      data: []
    });
    
    // Trigger download
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "modelo_importacao_clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CRM</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Clientes</h1>
        </div>
          <div className="flex gap-2 flex-wrap">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportCSV} 
            />
            <Button variant="destructive" className="h-9 gap-1.5" onClick={async () => {
              if (confirm("🚨 ATENÇÃO: Isso irá DELETAR COMPLETAMENTE TODOS os clientes que foram cadastrados HOJE no sistema. Tem certeza absoluta?")) {
                try {
                  await cleanBadImports.mutateAsync();
                  toast.success("Limpeza concluída com sucesso!");
                } catch (e: any) {
                  toast.error("Erro ao limpar: " + e.message);
                }
              }
            }} disabled={cleanBadImports.isPending} title="Limpar importaçao com erro">
              {cleanBadImports.isPending ? <Loader2 className="size-4 animate-spin" /> : "🧹 Limpar Erros de Hoje"}
            </Button>
            <Button variant="outline" className="h-9 gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending}>
            {importMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} 
            Importar
          </Button>
          <Button variant="outline" className="h-9 gap-1.5" onClick={handleDownloadTemplate} title="Baixar Modelo de Importação">
            <Download className="size-4" /> Modelo CSV
          </Button>
          <Button variant="outline" className="h-9 gap-1.5" onClick={handleExportCSV}>
            <Download className="size-4" /> Exportar
          </Button>
          <Button onClick={openNewClient} className="h-9 inline-flex items-center gap-1.5 px-3">
            <Plus className="size-4" /> Novo cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, email, telefone, CNPJ…"
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs">
          {(["all", "ER", "PG8"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-3 h-7 rounded-md font-medium transition-colors ${brand === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {b === "all" ? "Todas" : b === "ER" ? "e-roupas" : "peagah8"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Cliente</th>
              <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">Contato</th>
              <th className="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Origem</th>
              <th className="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Cliente Desde</th>
              <th className="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Última Compra</th>
              <th className="text-right font-medium px-4 py-2.5 number">Pedidos</th>
              <th className="text-right font-medium px-4 py-2.5 number">Total</th>
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Carregando clientes...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filtered.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to="/crm/$clientId" params={{ clientId: c.id }} className="font-medium hover:text-primary">{c.name}</Link>
                    {c.code && (
                      <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground font-mono">
                        {c.code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.document || "—"}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  <div>{c.phone || "—"}</div>
                  <div className="text-xs">{c.email || "—"}</div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{c.lead_source || "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  {c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  <div className="flex flex-col items-start gap-1">
                    <span>{c.last_purchase_date ? new Date(c.last_purchase_date).toLocaleDateString("pt-BR") : "—"}</span>
                    {c.entity_type === "cliente" && c.is_first_purchase && (
                      <span className="inline-flex items-center rounded-full bg-gray-400 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        PRIMEIRA COMPRA
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right number">{c.orders}</td>
                <td className="px-4 py-3 text-right number font-medium">{formatCurrency(c.total)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditClient(c)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <ClientFormDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        client={editingClient} 
      />
    </div>
  );
}
