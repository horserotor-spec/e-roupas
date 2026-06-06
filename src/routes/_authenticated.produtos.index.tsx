import { createFileRoute } from "@tanstack/react-router";
import { useProducts, Product, useImportProducts, useCloneProduct, useDeleteProduct } from "@/lib/api/products";
import { useState, useDeferredValue, useRef } from "react";
import { Search, Plus, Loader2, Edit2, Box, Download, Upload, Copy, Trash2, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductFormDrawer } from "@/components/products/ProductFormDrawer";
import { toast } from "sonner";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/produtos/")({
  head: () => ({ meta: [{ title: "Produtos · e-roupas OS" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useProducts(deferredQ);
  const importMutation = useImportProducts();
  const cloneMutation = useCloneProduct();
  const deleteMutation = useDeleteProduct();

  const [columns, setColumns] = useState({
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

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (!products.length) {
      toast.info("Nenhum produto para exportar.");
      return;
    }

    const dataToExport = products.map(p => ({
      Nome: p.name,
      SKU: p.sku || '',
      Preço: p.price || 0,
      "Preço Custo": p.cost_price || 0,
      Formato: p.format || 'MP',
      Unidade: p.unit || 'UN',
      Marca: p.brand || '',
      Categoria: p.category || '',
      Condição: p.condition || 'Novo',
      "EAN": p.gtin_ean || '',
      NCM: p.ncm || '',
      CEST: p.cest || '',
      Origem: p.origin ?? 0,
      "CST ICMS": p.icms_cst || '102',
      "Alíquota ICMS": p.icms_percent ?? 0,
      "CST PIS": p.pis_cst || '07',
      "Alíquota PIS": p.pis_percent ?? 0,
      "CST COFINS": p.cofins_cst || '07',
      "Alíquota COFINS": p.cofins_percent ?? 0,
      "CST IPI": p.ipi_cst || '99',
      "Alíquota IPI": p.ipi_percent ?? 0,
      CFOP: p.cfop || '5102',
      Ativo: p.active ? 'Sim' : 'Não'
    }));

    const csv = Papa.unparse(dataToExport, { header: true });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `produtos_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          if (!rows.length) {
            toast.error("O arquivo CSV está vazio.");
            return;
          }

          const parsedProducts = rows.map(row => ({
            name: row.Nome || row.name || "Sem Nome",
            sku: row.SKU || row.sku || null,
            price: parseFloat(row.Preço || row.price || 0),
            cost_price: parseFloat(row["Preço Custo"] || row.cost_price || 0),
            format: row.Formato || row.format || 'MP',
            unit: row.Unidade || row.unit || 'UN',
            brand: row.Marca || row.brand || null,
            category: row.Categoria || row.category || null,
            condition: row.Condição || row.condition || 'Novo',
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

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CADASTROS</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Produtos</h1>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
          />
          <Button variant="outline" className="h-9 gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending}>
            {importMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} 
            Importar
          </Button>
          <Button variant="outline" className="h-9 gap-1.5" onClick={handleExportCSV}>
            <Download className="size-4" /> Exportar
          </Button>
          <Button onClick={openNewProduct} className="h-9 inline-flex items-center gap-1.5 px-3">
            <Plus className="size-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-1.5 shrink-0 text-muted-foreground hover:text-foreground">
              <Columns3 className="size-4" />
              <span className="hidden sm:inline">Colunas</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem checked={columns.category} onCheckedChange={v => setColumns({...columns, category: v})}>
              Categoria / Marca
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={columns.format} onCheckedChange={v => setColumns({...columns, format: v})}>
              Formato
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={columns.price} onCheckedChange={v => setColumns({...columns, price: v})}>
              Preço
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={columns.stock} onCheckedChange={v => setColumns({...columns, stock: v})}>
              Estoque
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={columns.status} onCheckedChange={v => setColumns({...columns, status: v})}>
              Situação
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2.5">Produto</th>
              {columns.category && <th className="text-left font-medium px-4 py-2.5">Categoria / Marca</th>}
              {columns.format && <th className="text-left font-medium px-4 py-2.5">Formato</th>}
              {columns.price && <th className="text-right font-medium px-4 py-2.5 number">Preço (R$)</th>}
              {columns.stock && <th className="text-right font-medium px-4 py-2.5 number">Estoque</th>}
              {columns.status && <th className="text-right font-medium px-4 py-2.5">Situação</th>}
              <th className="text-right font-medium px-4 py-2.5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Carregando produtos...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && products.map((p) => {
              const totalStock = p.format === "MP" && p.variations 
                ? p.variations.reduce((acc, v) => acc + (v.stock || 0), 0)
                : p.stock || 0;

              return (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{p.name}</span>
                    {p.sku && <span className="text-[10px] font-mono text-slate-500 mt-0.5">{p.sku}</span>}
                    {p.technical_name && <span className="text-[10px] text-slate-400 mt-0.5">{p.technical_name}</span>}
                  </div>
                </td>
                {columns.category && (
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{p.category || "—"}</div>
                    <div className="text-xs">{p.brand || "—"}</div>
                  </td>
                )}
                {columns.format && (
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Box className="size-3.5" />
                      <span>{p.format}</span>
                    </div>
                  </td>
                )}
                {columns.price && (
                  <td className="px-4 py-3 text-right number font-medium">
                    {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                )}
                {columns.stock && (
                  <td className="px-4 py-3 text-right number">
                    {p.format === "MP" ? `${totalStock} (Acesso Variantes)` : (p.format === "PA" ? "-" : totalStock)}
                  </td>
                )}
                {columns.status && (
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      p.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => {
                      cloneMutation.mutateAsync(p.id).then((cloned) => {
                        if (cloned) { setEditingProduct(cloned); setDrawerOpen(true); toast.success("Produto clonado! Edite e salve."); }
                      }).catch((e: any) => toast.error("Erro ao clonar: " + e.message));
                    }} disabled={cloneMutation.isPending} className="h-8 w-8 text-muted-foreground hover:text-purple-600" title="Clonar Produto">
                      <Copy className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditProduct(p)} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Editar">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if(confirm('Tem certeza que deseja excluir este produto?')) {
                        deleteMutation.mutateAsync(p.id)
                          .then(() => toast.success("Produto excluído com sucesso!"))
                          .catch((e:any) => toast.error("Erro ao excluir: " + e.message));
                      }
                    }} disabled={deleteMutation.isPending} className="h-8 w-8 text-muted-foreground hover:text-red-600" title="Excluir Produto">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )})}
            {!isLoading && products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {drawerOpen && (
        <ProductFormDrawer 
          open={drawerOpen} 
          onOpenChange={setDrawerOpen} 
          product={editingProduct} 
        />
      )}
    </div>
  );
}
