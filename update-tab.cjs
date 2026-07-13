const fs = require('fs');
const path = 'src/components/estoque/InventoryBatchesTab.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('Columns3')) {
  content = content.replace(
    'CheckSquare } from "lucide-react";', 
    'CheckSquare, Columns3 } from "lucide-react";\nimport { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";'
  );
}

if (!content.includes('visibleColumns')) {
  content = content.replace(
    'const [isDeleting, setIsDeleting] = useState(false);', 
    'const [isDeleting, setIsDeleting] = useState(false);\n  const [visibleColumns, setVisibleColumns] = useState<string[]>(["lote_data", "variante", "fornecedor", "min_stock", "total", "reservado", "disponivel", "acoes"]);\n  const toggleColumn = (colId: string) => setVisibleColumns(prev => prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]);'
  );
}

const newUI = `          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <Columns3 className="size-4" />
                  <span className="hidden sm:inline">Colunas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("lote_data")} onCheckedChange={() => toggleColumn("lote_data")}>Lote / Data</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("variante")} onCheckedChange={() => toggleColumn("variante")}>Variante Mestre</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("fornecedor")} onCheckedChange={() => toggleColumn("fornecedor")}>Fornecedor</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("min_stock")} onCheckedChange={() => toggleColumn("min_stock")}>Estoque Mínimo</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("total")} onCheckedChange={() => toggleColumn("total")}>Total</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("reservado")} onCheckedChange={() => toggleColumn("reservado")}>Reservado</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("disponivel")} onCheckedChange={() => toggleColumn("disponivel")}>Disponível</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={visibleColumns.includes("acoes")} onCheckedChange={() => toggleColumn("acoes")}>Ações</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setDrawerOpen(true)} className="h-9 inline-flex items-center gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="size-4" /> Nova Entrada (Lote)
            </Button>
          </div>`;
content = content.replace(/<Button onClick=\{\(\) => setDrawerOpen\(true\)\}[\s\S]*?Nova Entrada \(Lote\)\s*<\/Button>/m, newUI);

content = content.replace(/<th className="text-left font-medium px-4 py-2.5">Lote \/ Data<\/th>/, '{visibleColumns.includes("lote_data") && <th className="text-left font-medium px-4 py-2.5">Lote / Data</th>}');
content = content.replace(/<th className="text-left font-medium px-4 py-2.5">Variante Mestre<\/th>/, '{visibleColumns.includes("variante") && <th className="text-left font-medium px-4 py-2.5">Variante Mestre</th>}');
content = content.replace(/<th className="text-left font-medium px-4 py-2.5">Fornecedor<\/th>/, '{visibleColumns.includes("fornecedor") && <th className="text-left font-medium px-4 py-2.5">Fornecedor</th>}\n                {visibleColumns.includes("min_stock") && <th className="text-right font-medium px-4 py-2.5">Est. Mínimo</th>}');
content = content.replace(/<th className="text-right font-medium px-4 py-2.5">Total<\/th>/, '{visibleColumns.includes("total") && <th className="text-right font-medium px-4 py-2.5">Total</th>}');
content = content.replace(/<th className="text-right font-medium px-4 py-2.5 text-orange-600">Reservado<\/th>/, '{visibleColumns.includes("reservado") && <th className="text-right font-medium px-4 py-2.5 text-orange-600">Reservado</th>}');
content = content.replace(/<th className="text-right font-medium px-4 py-2.5 text-green-600">.*?<\/th>/, '{visibleColumns.includes("disponivel") && <th className="text-right font-medium px-4 py-2.5 text-green-600">Disponível</th>}');
content = content.replace(/<th className="text-right font-medium px-4 py-2.5">A.*?es<\/th>/, '{visibleColumns.includes("acoes") && <th className="text-right font-medium px-4 py-2.5">Ações</th>}');

content = content.replace(
  /<td className="px-4 py-3">\s*<div className="font-mono text-xs font-semibold">\{b\.batch_code\}<\/div>[\s\S]*?<\/td>/,
  '{visibleColumns.includes("lote_data") && <td className="px-4 py-3"><div className="font-mono text-xs font-semibold">{b.batch_code}</div><div className="text-xs text-muted-foreground mt-0.5">{new Date(b.entry_date).toLocaleDateString()}</div></td>}'
);

content = content.replace(
  /<td className="px-4 py-3">\s*<div className="font-medium text-primary">\{b\.product_variants\?\.sku_internal[\s\S]*?<\/td>/,
  '{visibleColumns.includes("variante") && <td className="px-4 py-3"><div className="font-medium text-primary">{b.product_variants?.sku_internal || "Sem SKU"}</div><div className="text-xs text-muted-foreground line-clamp-1">{b.product_variants?.models?.name} · {b.product_variants?.fabrics?.name} · {b.product_variants?.canonical_colors?.name} · {b.product_variants?.size}</div></td>}'
);

content = content.replace(
  /<td className="px-4 py-3 text-muted-foreground">\{b\.suppliers\?\.company_name \|\| b\.suppliers\?\.name\}<\/td>/,
  '{visibleColumns.includes("fornecedor") && <td className="px-4 py-3 text-muted-foreground">{b.suppliers?.company_name || b.suppliers?.name}</td>}\n                  {visibleColumns.includes("min_stock") && <td className="px-4 py-3 text-right text-muted-foreground font-medium">{b.product_variants?.min_stock || 0}</td>}'
);

content = content.replace(
  /<td className="px-4 py-3 text-right font-medium">\{b\.quantity_total\}<\/td>/,
  '{visibleColumns.includes("total") && <td className="px-4 py-3 text-right font-medium">{b.quantity_total}</td>}'
);

content = content.replace(
  /<td className="px-4 py-3 text-right font-medium text-orange-600">\{b\.quantity_reserved\}<\/td>/,
  '{visibleColumns.includes("reservado") && <td className="px-4 py-3 text-right font-medium text-orange-600">{b.quantity_reserved}</td>}'
);

content = content.replace(
  /<td className="px-4 py-3 text-right font-medium text-green-600">[\s\S]*?<\/div>\s*<\/td>/,
  `{visibleColumns.includes("disponivel") && <td className="px-4 py-3 text-right font-medium text-green-600">
                    <div className="flex flex-col items-end gap-1">
                      <span>{b.quantity_available}</span>
                      {Number(b.quantity_available) === 0 ? (
                        <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Esgotado</span>
                      ) : Number(b.quantity_available) <= (b.product_variants?.min_stock || 0) ? (
                        <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Estoque Crítico</span>
                      ) : null}
                    </div>
                  </td>}`
);

content = content.replace(
  /<td className="px-4 py-3 text-right">\s*<Button variant="ghost"[\s\S]*?<\/td>/,
  `{visibleColumns.includes("acoes") && <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setAdjustmentOpen(b.id)} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <MinusCircle className="size-4 mr-1.5" /> Saída
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit()} className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <Edit2 className="size-4 mr-1.5" /> Editar
                    </Button>
                  </td>}`
);

content = content.replace(/colSpan=\{8\}/g, 'colSpan={visibleColumns.length + 1}');

fs.writeFileSync(path, content, 'utf8');
console.log("Success");
