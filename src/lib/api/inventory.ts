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
  code?: string | null;
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
  code?: string | null;
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

export interface SizeGrid {
  id: string;
  name: string;
  sizes: string[];
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface CRMSupplier {
  id: string;
  name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
}

export interface ProductVariant {
  id: string;
  product_id?: string | null;
  model_id?: string | null;
  line_id?: string | null;
  fabric_id?: string | null;
  color_id?: string | null;
  size: string;
  gender: string;
  brand_id?: string | null;
  sku_internal?: string | null;
  barcode?: string | null;
  qr_code?: string | null;
  crossdocking?: boolean;
  lead_time_medio?: number;
  cost_price?: number;
  average_cost?: number;
  active: boolean;
  // Included relations for UI
  models?: ProductModel;
  lines?: ProductLine;
  fabrics?: Fabric;
  canonical_colors?: CanonicalColor;
  products?: any;
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
// 2. Auxiliary Lookups (Fabrics, Colors, Categories, Suppliers)
// ----------------------------------------------------------------------

export function useSuppliers(search?: string) {
  return useQuery({
    queryKey: ["suppliers_inventory", search],
    queryFn: async () => {
      let query = supabase
        .from("suppliers")
        .select("*")
        .eq("active", true)
        .order("name");

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Supplier[];
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Supplier>) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([payload])
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers_inventory"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers_inventory"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useFabrics() {
  return useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fabrics").select("*").order("name");
      if (error) throw error;
      return data as Fabric[];
    },
  });
}

export function useModels() {
  return useQuery({
    queryKey: ["product_models"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_models").select("*").order("name");
      if (error) throw error;
      return data as ProductModel[];
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_models").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_models"] }),
  });
}

export function useDeleteFabric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fabrics").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fabrics"] }),
  });
}

export function useDeleteColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("canonical_colors").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canonical_colors"] }),
  });
}

export function useDeleteSizeGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("size_grids").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["size_grids"] }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_categories").select("*").order("name");
      if (error) throw error;
      return data as ProductCategory[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProductCategory>) => {
      const { data, error } = await supabase.from("product_categories").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["canonical_colors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("canonical_colors").select("*").order("name");
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

export function useSizeGrids() {
  return useQuery({
    queryKey: ["size_grids"],
    queryFn: async () => {
      const { data, error } = await supabase.from("size_grids").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data as SizeGrid[];
    },
  });
}

/** Fornecedores vindos do CRM (clients com entity_type = 'fornecedor') */
export function useSuppliersCRM() {
  return useQuery({
    queryKey: ["suppliers_crm"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, company_name, phone, email, city")
        .eq("entity_type", "fornecedor")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data as CRMSupplier[];
    },
  });
}

export function useCreateSupplierCRM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .insert([{ 
          name: payload.name.trim(), 
          entity_type: "fornecedor", 
          entity_class: "pj", // Padrão PJ para fornecedores
          active: true 
        }])
        .select()
        .single();
      if (error) throw error;
      return data as CRMSupplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers_crm"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data, error } = await supabase
        .from("product_models")
        .insert([{ name: payload.name.toUpperCase().trim(), active: true }])
        .select()
        .single();
      if (error) throw error;
      return data as ProductModel;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_models"] }),
  });
}

export function useCreateFabric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Fabric>) => {
      const { data, error } = await supabase
        .from("fabrics")
        .insert([{ ...payload, active: true }])
        .select()
        .single();
      if (error) throw error;
      return data as Fabric;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fabrics"] }),
  });
}

export function useCreateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; hex?: string }) => {
      const { data, error } = await supabase
        .from("canonical_colors")
        .insert([{ name: payload.name.trim(), hex: payload.hex || null, active: true }])
        .select()
        .single();
      if (error) throw error;
      return data as CanonicalColor;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canonical_colors"] }),
  });
}

export function useCreateSizeGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; sizes: string[]; description?: string }) => {
      const { data, error } = await supabase
        .from("size_grids")
        .insert([{ name: payload.name.trim(), sizes: payload.sizes, description: payload.description || null, active: true }])
        .select()
        .single();
      if (error) throw error;
      return data as SizeGrid;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["size_grids"] }),
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

export function useProductStockSummary(productId: string) {
  return useQuery({
    queryKey: ["stock_summary", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("vw_stock_summary")
        .select("*")
        .eq("product_id", productId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });
}

export function useAllProductsStockSummary() {
  return useQuery({
    queryKey: ["all_stock_summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vw_stock_summary")
        .select("product_id, available_qty");
      if (error) throw error;
      return data;
    }
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

export function useStockMovements(filters?: { productId?: string; batchId?: string; limit?: number }) {
  return useQuery({
    queryKey: ["stock_movements", filters],
    queryFn: async () => {
      let query = supabase
        .from("inventory_movements")
        .select(`
          *,
          users(name),
          inventory_batches!inner(
            batch_code,
            product_variants!inner(
              size,
              sku_internal,
              product_id
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (filters?.productId) {
        query = query.eq("inventory_batches.product_variants.product_id", filters.productId);
      }
      if (filters?.batchId) {
        query = query.eq("batch_id", filters.batchId);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
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

// ----------------------------------------------------------------------
// 4. Batch Adjustments & Movements
// ----------------------------------------------------------------------

export function useAdjustInventoryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      batch_id: string;
      adjustment: number;
      reason: string;
    }) => {
      // Registrar movimento de estoque
      const { data: movData, error: movErr } = await supabase
        .from("inventory_movements")
        .insert([{
          batch_id: payload.batch_id,
          movement_type: payload.adjustment >= 0 ? "ajuste_entrada" : "ajuste_saida",
          quantity: payload.adjustment,
          notes: payload.reason
        }])
        .select()
        .single();

      if (movErr) throw movErr;

      return movData;
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

export function useCreateInventoryEntryGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      product_id: string;
      supplier_id: string;
      batch_code: string;
      average_cost: number;
      quality_notes: string;
      grid: Record<string, number>;
    }) => {
      // 1. Buscar produto pai com os relacionamentos de engenharia
      const { data: prod, error: prodErr } = await supabase
        .from("products")
        .select(`
          id, 
          model_id, 
          fabric_id, 
          color_id,
          model:product_models(code, name),
          fabric:fabrics(code, name),
          color:canonical_colors(code, name)
        `)
        .eq("id", payload.product_id)
        .single();

      if (prodErr || !prod) {
        throw new Error("Produto pai (MP) não encontrado: " + (prodErr?.message || ""));
      }

      const modelCode = (prod.model as any)?.code || (prod.model as any)?.name?.substring(0, 3).toUpperCase() || "XXX";
      const fabricCode = (prod.fabric as any)?.code || (prod.fabric as any)?.name?.substring(0, 3).toUpperCase() || "XXX";
      const colorCode = (prod.color as any)?.code || (prod.color as any)?.name?.substring(0, 3).toUpperCase() || "XXX";

      const entries = Object.entries(payload.grid);
      const results = [];

      for (const [size, qty] of entries) {
        if (qty <= 0) continue;

        // Gerar SKU dinâmico: MP-REG-PEL-PTO-P
        const sku = `MP-${modelCode}-${fabricCode}-${colorCode}-${size.toUpperCase()}`;

        // 2. Verificar ou criar variante física (product_variants)
        let { data: variant, error: varFindErr } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", prod.id)
          .eq("size", size)
          .maybeSingle();

        if (!variant) {
          const { data: newVar, error: varCreateErr } = await supabase
            .from("product_variants")
            .insert([{
              product_id: prod.id,
              model_id: prod.model_id,
              fabric_id: prod.fabric_id,
              color_id: prod.color_id,
              size: size,
              gender: "unissex",
              sku_internal: sku,
              active: true
            }])
            .select()
            .single();

          if (varCreateErr) throw varCreateErr;
          variant = newVar;
        }

        // 3. Criar lote de estoque (inventory_batches) com saldo 0
        const { data: batch, error: batchErr } = await supabase
          .from("inventory_batches")
          .insert([{
            product_variant_id: variant.id,
            supplier_id: payload.supplier_id,
            batch_code: payload.batch_code,
            quantity_total: 0,
            quantity_available: 0,
            quantity_reserved: 0,
            average_cost: payload.average_cost,
            quality_notes: payload.quality_notes
          }])
          .select()
          .single();

        if (batchErr) throw batchErr;

        // 4. Registrar movimento de estoque (inventory_movements)
        const { error: movErr } = await supabase
          .from("inventory_movements")
          .insert([{
            batch_id: batch.id,
            movement_type: "compra",
            quantity: qty,
            notes: `Entrada por grade no lote ${payload.batch_code}`
          }]);

        if (movErr) console.error("Error logging movement", movErr);
        results.push(batch);
      }

      // Gerar Contas a Pagar (Módulo Financeiro)
      let totalCost = 0;
      for (const [size, qty] of entries) {
        if (qty > 0) totalCost += (qty * payload.average_cost);
      }
      
      if (totalCost > 0) {
        let termsDays = 30;
        let paymentMethod = "Boleto";

        const { data: supplierObj } = await supabase
          .from("suppliers")
          .select("*")
          .eq("id", payload.supplier_id)
          .maybeSingle();

        if (supplierObj) {
          termsDays = supplierObj.payment_terms_days !== undefined && supplierObj.payment_terms_days !== null 
            ? Number(supplierObj.payment_terms_days) 
            : 30;
          paymentMethod = supplierObj.default_payment_method || "Boleto";
        } else {
          const { data: clientObj } = await supabase
            .from("clients")
            .select("*")
            .eq("id", payload.supplier_id)
            .maybeSingle();
          if (clientObj) {
            termsDays = clientObj.payment_terms_days !== undefined && clientObj.payment_terms_days !== null 
              ? Number(clientObj.payment_terms_days) 
              : 30;
            paymentMethod = clientObj.default_payment_method || "Boleto";
          }
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + termsDays);

        await supabase.from("financial_transactions").insert([{
          type: 'pagar',
          description: `Compra de Estoque (MP) - Lote ${payload.batch_code}`,
          amount: totalCost,
          original_amount: totalCost,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pendente',
          supplier_id: payload.supplier_id,
          payment_method: paymentMethod,
          cost_center: 'Estoque'
        }]);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
      queryClient.invalidateQueries({ queryKey: ["product_variants"] });
    }
  });
}
