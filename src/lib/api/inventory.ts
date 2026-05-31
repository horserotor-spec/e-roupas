import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

// ----------------------------------------------------------------------
// 1. Types & Interfaces
// ----------------------------------------------------------------------

export interface Supplier {
  id: string;
  name: string;
  company_name: string | null;
  cnpj: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  notes: string | null;
  lead_time_days: number;
  active: boolean;
  created_at: string;
}

export interface Fabric {
  id: string;
  name: string;
  grammage: string | null;
  composition: string | null;
  supplier_default: string | null;
  supports_dtf: boolean;
  supports_embroidery: boolean;
  supports_silk: boolean;
  supports_sublimation: boolean;
  notes: string | null;
  active: boolean;
  created_at: string;
}

export interface ProductModel {
  id: string;
  name: string;
  active: boolean;
}

export interface ProductLine {
  id: string;
  name: string;
  active: boolean;
}

export interface CanonicalColor {
  id: string;
  name: string;
  hex: string | null;
  active: boolean;
}

export interface ProductVariant {
  id: string;
  model_id: string;
  line_id: string | null;
  fabric_id: string;
  color_id: string;
  size: string;
  gender: string;
  brand_id: string | null;
  sku_internal: string | null;
  active: boolean;
  // Included relations for UI
  models?: ProductModel;
  lines?: ProductLine;
  fabrics?: Fabric;
  canonical_colors?: CanonicalColor;
}

export interface InventoryBatch {
  id: string;
  product_variant_id: string;
  supplier_id: string;
  batch_code: string;
  quantity_total: number;
  quantity_reserved: number;
  quantity_available: number;
  average_cost: number;
  entry_date: string;
  quality_notes: string | null;
  active: boolean;
  // Included relations
  product_variants?: ProductVariant;
  suppliers?: Supplier;
}

// ----------------------------------------------------------------------
// 2. Base Configuration Hooks
// ----------------------------------------------------------------------

export function useSuppliers(search?: string) {
  return useQuery({
    queryKey: ["suppliers", search],
    queryFn: async () => {
      let query = supabase.from("suppliers").select("*").eq("active", true).order("name");
      if (search) query = query.ilike("name", `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data as Supplier[];
    },
  });
}

export function useSaveSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Supplier>) => {
      if (payload.id) {
        const { data, error } = await supabase.from("suppliers").update(payload).eq("id", payload.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("suppliers").insert([payload]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
  });
}

export function useFabrics() {
  return useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fabrics").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data as Fabric[];
    },
  });
}

export function useModels() {
  return useQuery({
    queryKey: ["product_models"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_models").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data as ProductModel[];
    },
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["canonical_colors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("canonical_colors").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data as CanonicalColor[];
    },
  });
}

export function useLines() {
  return useQuery({
    queryKey: ["product_lines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_lines").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data as ProductLine[];
    },
  });
}

// ----------------------------------------------------------------------
// 3. Product Variants & Inventory Batches
// ----------------------------------------------------------------------

export function useProductVariants(search?: string) {
  return useQuery({
    queryKey: ["product_variants", search],
    queryFn: async () => {
      let query = supabase
        .from("product_variants")
        .select(`
          *,
          models:product_models(*),
          lines:product_lines(*),
          fabrics(*),
          canonical_colors(*)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      // We do manual search filtering here because ilike on multiple relations is tricky in PostgREST
      let variants = data as ProductVariant[];
      if (search) {
        const lowerQ = search.toLowerCase();
        variants = variants.filter(v => 
          v.sku_internal?.toLowerCase().includes(lowerQ) ||
          v.models?.name.toLowerCase().includes(lowerQ) ||
          v.fabrics?.name.toLowerCase().includes(lowerQ) ||
          v.canonical_colors?.name.toLowerCase().includes(lowerQ)
        );
      }
      return variants;
    },
  });
}

export function useInventoryBatches(variantId?: string) {
  return useQuery({
    queryKey: ["inventory_batches", variantId],
    queryFn: async () => {
      let query = supabase
        .from("inventory_batches")
        .select(`
          *,
          suppliers(*),
          product_variants(
            *,
            models:product_models(*),
            fabrics(*),
            canonical_colors(*)
          )
        `)
        .eq("active", true)
        .order("entry_date", { ascending: false });

      if (variantId) {
        query = query.eq("product_variant_id", variantId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as InventoryBatch[];
    },
  });
}

export function useSaveProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProductVariant>) => {
      if (payload.id) {
        const { data, error } = await supabase.from("product_variants").update(payload).eq("id", payload.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("product_variants").insert([payload]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_variants"] }),
  });
}

export function useCreateInventoryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<InventoryBatch>) => {
      // Create batch
      const { data: batch, error } = await supabase.from("inventory_batches").insert([{
        ...payload,
        quantity_available: payload.quantity_total // Initially available = total
      }]).select().single();
      
      if (error) throw error;

      // Log movement (Extrato imutável)
      const { error: movError } = await supabase.from("inventory_movements").insert([{
        batch_id: batch.id,
        movement_type: "compra",
        quantity: batch.quantity_total,
        notes: "Entrada inicial de lote"
      }]);

      if (movError) console.error("Error logging movement", movError);

      return batch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
      queryClient.invalidateQueries({ queryKey: ["product_variants"] });
    },
  });
}

export function useAdjustInventoryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { batch_id: string; quantity: number; notes: string; type: string }) => {
      // 1. Get the current batch
      const { data: batch, error: getError } = await supabase
        .from("inventory_batches")
        .select("*")
        .eq("id", payload.batch_id)
        .single();
        
      if (getError) throw getError;

      const adjustAmount = Math.abs(payload.quantity);
      if (payload.type === 'saída' && batch.quantity_available < adjustAmount) {
        throw new Error("Quantidade indisponível no lote para esta saída.");
      }

      const newAvailable = payload.type === 'saída' ? Number(batch.quantity_available) - adjustAmount : Number(batch.quantity_available) + adjustAmount;
      const newTotal = payload.type === 'saída' ? Number(batch.quantity_total) - adjustAmount : Number(batch.quantity_total) + adjustAmount;

      // 2. Update batch
      const { error: updateError } = await supabase
        .from("inventory_batches")
        .update({
          quantity_available: newAvailable,
          quantity_total: newTotal
        })
        .eq("id", batch.id);

      if (updateError) throw updateError;

      // 3. Log movement
      const { error: movError } = await supabase.from("inventory_movements").insert([{
        batch_id: batch.id,
        movement_type: payload.type === 'saída' ? 'ajuste_saida' : 'ajuste_entrada',
        quantity: payload.type === 'saída' ? -adjustAmount : adjustAmount,
        notes: payload.notes
      }]);

      if (movError) console.error("Error logging adjustment", movError);

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
    },
  });
}

// ----------------------------------------------------------------------
// 4. Advanced Logic: Stock Reservation
// ----------------------------------------------------------------------

export async function checkStockAvailability(variantId: string, requiredQuantity: number) {
  // Find available batches for this variant, ordered by entry_date (FIFO)
  const { data: batches, error } = await supabase
    .from("inventory_batches")
    .select("*")
    .eq("product_variant_id", variantId)
    .gt("quantity_available", 0)
    .order("entry_date", { ascending: true });

  if (error) throw error;

  let totalAvailable = 0;
  for (const b of batches) {
    totalAvailable += Number(b.quantity_available);
  }

  const needsMixing = batches.length > 1 && batches[0].quantity_available < requiredQuantity;
  const canFulfill = totalAvailable >= requiredQuantity;

  return {
    canFulfill,
    needsMixing,
    batchesToUse: batches
  };
}

export async function reserveStock(
  orderId: string, 
  orderItemId: string, 
  variantId: string, 
  quantity: number, 
  mixingApproved: boolean = false,
  mixingNotes: string = ""
) {
  const { canFulfill, needsMixing, batchesToUse } = await checkStockAvailability(variantId, quantity);

  if (!canFulfill) {
    throw new Error("Estoque insuficiente para esta variante.");
  }

  if (needsMixing && !mixingApproved) {
    throw new Error("MISTURA_REQUERIDA"); // Special error to trigger popup
  }

  let remainingToReserve = quantity;

  // FIFO Allocation
  for (const batch of batchesToUse) {
    if (remainingToReserve <= 0) break;

    const availableInBatch = Number(batch.quantity_available);
    const toReserveInThisBatch = Math.min(availableInBatch, remainingToReserve);

    // 1. Create reservation record
    await supabase.from("stock_reservations").insert([{
      order_id: orderId,
      order_item_id: orderItemId,
      batch_id: batch.id,
      quantity: toReserveInThisBatch,
      mixing_approved: mixingApproved,
      mixing_notes: mixingNotes
    }]);

    // 2. Update batch quantities
    await supabase.from("inventory_batches")
      .update({
        quantity_available: availableInBatch - toReserveInThisBatch,
        quantity_reserved: Number(batch.quantity_reserved) + toReserveInThisBatch
      })
      .eq("id", batch.id);

    remainingToReserve -= toReserveInThisBatch;
  }

  return true;
}
