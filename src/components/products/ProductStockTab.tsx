import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Settings2 } from "lucide-react";
import { useInventoryBatches } from "@/lib/api/inventory";
import { MovementModal } from "../inventory/MovementModal";
import { Product } from "@/lib/api/products";

interface ProductStockTabProps {
  product: Product;
}

export function ProductStockTab({ product }: ProductStockTabProps) {
  const { data: batches = [], isLoading } = useInventoryBatches();
  
  // Filtrar apenas lotes que pertencem às variações deste produto
  const productBatches = batches.filter(b => b.product_variants?.product_id === product.id);

  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedVariantInfo, setSelectedVariantInfo] = useState("");

  const handleOpenMovement = (batchId: string, sku: string, size: string) => {
    setSelectedBatch(batchId);
    setSelectedVariantInfo(`SKU: ${sku} | Tamanho: ${size}`);
    setMovementModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-500">Carregando estoque...</div>;

  return (
    <div className="space-y-6 flex flex-col h-full min-h-0">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Controle Industrial de Estoque</h3>
          <p className="text-xs text-slate-500">Visualização por Lote e Fornecedor</p>
        </div>
        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Entrada por Grade
        </Button>
      </div>

      {/* Smart Grid */}
      <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="font-medium p-3">Tecido</th>
              <th className="font-medium p-3">Cor</th>
              <th className="font-medium p-3">Fornecedor</th>
              <th className="font-medium p-3 text-center">Tamanho</th>
              <th className="font-medium p-3 text-right">Total</th>
              <th className="font-medium p-3 text-right">Reservado</th>
              <th className="font-medium p-3 text-right text-blue-600">Disponível</th>
              <th className="font-medium p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productBatches.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  Nenhum lote de estoque encontrado para este produto.
                </td>
              </tr>
            ) : (
              productBatches.map(batch => {
                const variant = batch.product_variants;
                return (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-700">{(variant?.fabrics as any)?.name || "-"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: (variant?.canonical_colors as any)?.hex || '#ccc' }}></div>
                        <span className="text-slate-700">{(variant?.canonical_colors as any)?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700">{(batch.suppliers as any)?.company_name || (batch.suppliers as any)?.name || "-"}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{variant?.size}</td>
                    <td className="p-3 text-right font-medium text-slate-600">{Number(batch.quantity_total).toFixed(0)}</td>
                    <td className="p-3 text-right text-orange-600 font-medium">{Number(batch.quantity_reserved).toFixed(0)}</td>
                    <td className="p-3 text-right text-blue-600 font-bold">
                      <div className="flex flex-col items-end gap-1">
                        <span>{Number(batch.quantity_available).toFixed(0)}</span>
                        {Number(batch.quantity_available) === 0 ? (
                          <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Esgotado</span>
                        ) : Number(batch.quantity_available) <= (variant?.min_stock || 0) ? (
                          <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Estoque Crítico</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpenMovement(batch.id, variant?.sku_internal || "", variant?.size || "")}
                      >
                        <Settings2 className="h-3.5 w-3.5 mr-1" /> Ajustar
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Movement Modal */}
      {selectedBatch && (
        <MovementModal
          open={movementModalOpen}
          onOpenChange={setMovementModalOpen}
          batchId={selectedBatch}
          variantInfo={selectedVariantInfo}
        />
      )}
    </div>
  );
}
