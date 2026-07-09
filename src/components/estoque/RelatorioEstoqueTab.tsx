import { useState } from "react";
import { useStockMovements } from "@/lib/api/inventory";
import { Download, Filter, FileSpreadsheet, Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COLUMNS_DEF = [
  { id: "date", label: "Data / Hora" },
  { id: "type", label: "Tipo" },
  { id: "user", label: "Usuário" },
  { id: "batch", label: "Lote" },
  { id: "product", label: "Produto" },
  { id: "technical_name", label: "Nome Técnico" },
  { id: "sku", label: "SKU / Tamanho" },
  { id: "qty_before", label: "Estoque Anterior" },
  { id: "qty_move", label: "Movimento" },
  { id: "qty_after", label: "Estoque Atual" },
  { id: "notes", label: "Motivo / Origem" },
];

export function RelatorioEstoqueTab() {
  const { data: movements = [], isLoading } = useStockMovements();
  const [filterType, setFilterType] = useState<string>("todos");
  const [filterSearch, setFilterSearch] = useState("");
  
  // Default visible columns: Data/Hora, Produto, Nome Técnico, SKU, Quantidade Anterior, Movimento, Quantidade Atual
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "date",
    "product",
    "technical_name",
    "sku",
    "qty_before",
    "qty_move",
    "qty_after"
  ]);

  const filteredMovements = movements.filter((m: any) => {
    if (filterType !== "todos" && m.movement_type !== filterType) return false;
    
    if (filterSearch) {
      const searchStr = filterSearch.toLowerCase();
      const variant = m.inventory_batches?.product_variants;
      const matchSku = variant?.sku_internal?.toLowerCase().includes(searchStr);
      const matchBatch = m.inventory_batches?.batch_code?.toLowerCase().includes(searchStr);
      const matchUser = m.users?.name?.toLowerCase().includes(searchStr);
      const matchProduct = variant?.products?.name?.toLowerCase().includes(searchStr);
      const matchTech = variant?.products?.technical_name?.toLowerCase().includes(searchStr);
      
      if (!matchSku && !matchBatch && !matchUser && !matchProduct && !matchTech) return false;
    }
    
    return true;
  });

  const exportCSV = () => {
    const headers = ["Data", "Tipo", "Usuário", "Lote", "Produto", "Nome Técnico", "SKU", "Tamanho", "Estoque Anterior", "Movimento", "Estoque Atual", "Motivo"];
    const rows = filteredMovements.map((m: any) => [
      new Date(m.created_at).toLocaleString("pt-BR"),
      m.movement_type,
      m.users?.name || "Sistema",
      m.inventory_batches?.batch_code || "-",
      m.inventory_batches?.product_variants?.products?.name || "-",
      m.inventory_batches?.product_variants?.products?.technical_name || "-",
      m.inventory_batches?.product_variants?.sku_internal || "-",
      m.inventory_batches?.product_variants?.size || "-",
      m.quantity_before || 0,
      m.quantity,
      m.quantity_after || 0,
      m.notes || "-"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_estoque_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800">Rastreabilidade de Estoque</h2>
          <p className="text-sm text-slate-500 mt-1">Busque registros e exporte auditorias de movimentação.</p>
        </div>
        <Button onClick={exportCSV} className="bg-emerald-600 hover:bg-emerald-700 h-9">
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Planilha (CSV)
        </Button>
      </div>

      <div className="bg-white border shadow-sm rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm">
          <Filter className="h-4 w-4" /> Filtros de Auditoria
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Busca Livre</Label>
            <Input 
              placeholder="SKU, Lote, Produto..." 
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Tipo de Movimentação</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="compra">Compra / Lote Inicial</SelectItem>
                <SelectItem value="ajuste_entrada">Ajuste de Entrada</SelectItem>
                <SelectItem value="ajuste_saida">Ajuste de Saída</SelectItem>
                <SelectItem value="perda">Perda / Avaria</SelectItem>
                <SelectItem value="transferencia">Transferência Interna</SelectItem>
                <SelectItem value="consumo">Consumo de Produção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5 flex flex-col justify-end">
            <Label className="text-xs text-slate-500">Colunas da Tabela</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 justify-start gap-2 border-slate-200 bg-white">
                  <Settings2 className="h-4 w-4 text-slate-500" />
                  <span>Selecionar Colunas ({visibleColumns.length})</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Exibir Colunas</p>
                  {COLUMNS_DEF.map(col => {
                    const checked = visibleColumns.includes(col.id);
                    return (
                      <label key={col.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            if (isChecked) {
                              setVisibleColumns(prev => [...prev, col.id]);
                            } else {
                              setVisibleColumns(prev => prev.filter(c => c !== col.id));
                            }
                          }}
                        />
                        <span>{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-slate-400" />
            Carregando log de auditoria...
          </div>
        ) : (
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b sticky top-0">
                <tr>
                  {visibleColumns.includes("date") && <th className="font-medium p-4">Data / Hora</th>}
                  {visibleColumns.includes("type") && <th className="font-medium p-4">Tipo</th>}
                  {visibleColumns.includes("user") && <th className="font-medium p-4">Usuário</th>}
                  {visibleColumns.includes("batch") && <th className="font-medium p-4">Lote</th>}
                  {visibleColumns.includes("product") && <th className="font-medium p-4">Produto</th>}
                  {visibleColumns.includes("technical_name") && <th className="font-medium p-4">Nome Técnico</th>}
                  {visibleColumns.includes("sku") && <th className="font-medium p-4">SKU / Tamanho</th>}
                  {visibleColumns.includes("qty_before") && <th className="font-medium p-4 text-right">Estoque Anterior</th>}
                  {visibleColumns.includes("qty_move") && <th className="font-medium p-4 text-center">Movimento</th>}
                  {visibleColumns.includes("qty_after") && <th className="font-medium p-4 text-right">Estoque Atual</th>}
                  {visibleColumns.includes("notes") && <th className="font-medium p-4">Motivo / Origem</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length || 1} className="p-8 text-center text-slate-500">
                      Nenhum registro atende aos filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((mov: any) => {
                    const batch = mov.inventory_batches;
                    const variant = batch?.product_variants;
                    const isPositive = Number(mov.quantity) > 0;
                    
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                        {visibleColumns.includes("date") && (
                          <td className="p-4 text-slate-600">
                            {new Date(mov.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" })}
                          </td>
                        )}
                        {visibleColumns.includes("type") && (
                          <td className="p-4">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium uppercase text-[10px] tracking-wider">
                              {mov.movement_type.replace('_', ' ')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.includes("user") && (
                          <td className="p-4 text-slate-700 font-medium">{(mov.users as any)?.name || "Sistema"}</td>
                        )}
                        {visibleColumns.includes("batch") && (
                          <td className="p-4 text-slate-600 font-mono text-[10px]">{batch?.batch_code || "-"}</td>
                        )}
                        {visibleColumns.includes("product") && (
                          <td className="p-4 text-slate-700 font-medium">{variant?.products?.name || "-"}</td>
                        )}
                        {visibleColumns.includes("technical_name") && (
                          <td className="p-4 text-slate-600">{variant?.products?.technical_name || "-"}</td>
                        )}
                        {visibleColumns.includes("sku") && (
                          <td className="p-4">
                            <div className="font-medium text-slate-800">{variant?.sku_internal || "-"}</div>
                            <div className="text-[10px] text-slate-500">Tam: {variant?.size || "-"}</div>
                          </td>
                        )}
                        {visibleColumns.includes("qty_before") && (
                          <td className="p-4 text-right font-medium text-slate-500">{Number(mov.quantity_before || 0)}</td>
                        )}
                        {visibleColumns.includes("qty_move") && (
                          <td className="p-4 text-center">
                            <span className={`font-bold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{mov.quantity}
                            </span>
                          </td>
                        )}
                        {visibleColumns.includes("qty_after") && (
                          <td className="p-4 text-right font-medium text-slate-800">{Number(mov.quantity_after || 0)}</td>
                        )}
                        {visibleColumns.includes("notes") && (
                          <td className="p-4 text-slate-600 max-w-[300px] truncate" title={mov.notes || "-"}>{mov.notes || "-"}</td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
