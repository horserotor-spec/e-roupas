const fs = require('fs');
let content = fs.readFileSync('src/lib/api/inventory.ts', 'utf8');

const newCode = 
export function useSoftDeleteInventoryBatches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { batchIds: string[], reason: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      for (const batchId of payload.batchIds) {
        // 1. Inactivate the batch
        const { error: batchErr } = await supabase
          .from("inventory_batches")
          .update({ active: false, quantity_available: 0 })
          .eq("id", batchId);
        
        if (batchErr) throw batchErr;

        // 2. Record the movement 'excluir_produto'
        const { error: movErr } = await supabase
          .from("inventory_movements")
          .insert([{
            batch_id: batchId,
            movement_type: "excluir_produto",
            quantity: 0,
            notes: payload.reason,
            created_by: userId || null
          }]);
        
        if (movErr) throw movErr;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements"] });
    }
  });
}

export function useEditInventoryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { 
      batch_id: string; 
      supplier_id: string; 
      quantity_total: number;
      min_stock: number;
      reason: string;
      variant_id: string;
      old_quantity: number;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // 1. Update batch
      const qtyDiff = payload.quantity_total - payload.old_quantity;
      const { data: batchData, error: batchErr } = await supabase
        .rpc('update_inventory_batch_safe', {
          p_batch_id: payload.batch_id,
          p_supplier_id: payload.supplier_id,
          p_quantity_total: payload.quantity_total,
          p_diff: qtyDiff
        });
      // Fallback if rpc doesn't exist yet, we just update directly but it might mess up available quantity.
      // Assuming no RPC for now, we do a raw update:
      // We will first get the batch, then calc new available
      const { data: currentBatch, error: cbErr } = await supabase.from("inventory_batches").select("quantity_available, quantity_total").eq("id", payload.batch_id).single();
      if(cbErr) throw cbErr;

      const diff = payload.quantity_total - currentBatch.quantity_total;
      const newAvailable = currentBatch.quantity_available + diff;

      const { error: updErr } = await supabase
        .from("inventory_batches")
        .update({ 
          supplier_id: payload.supplier_id,
          quantity_total: payload.quantity_total,
          quantity_available: newAvailable
        })
        .eq("id", payload.batch_id);
      if (updErr) throw updErr;

      // 2. Update variant min_stock
      const { error: varErr } = await supabase
        .from("product_variants")
        .update({ min_stock: payload.min_stock })
        .eq("id", payload.variant_id);
      if (varErr) throw varErr;

      // 3. Record movement
      const { error: movErr } = await supabase
        .from("inventory_movements")
        .insert([{
          batch_id: payload.batch_id,
          movement_type: "ajuste_entrada", // Generic edit movement
          quantity: diff,
          notes: "EDIÇÃO DE LOTE: " + payload.reason,
          created_by: userId || null
        }]);
      if (movErr) throw movErr;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements"] });
      queryClient.invalidateQueries({ queryKey: ["product_variants"] });
    }
  });
}
\;

content = content + '\n' + newCode;
fs.writeFileSync('src/lib/api/inventory.ts', content);
