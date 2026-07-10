import { a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { y as supabase } from "./router-C3pqRbRf.mjs";
function useSuppliers(search) {
  return useQuery({
    queryKey: ["suppliers_inventory", search],
    queryFn: async () => {
      let query = supabase.from("clients").select("*").eq("entity_type", "fornecedor").eq("active", true).order("name");
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
function useSaveSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const dataToSave = {
        ...payload,
        entity_type: "fornecedor",
        entity_class: payload.cnpj && payload.cnpj.replace(/\D/g, "").length === 14 ? "pj" : "pf"
      };
      const { lead_time_days, whatsapp, cnpj, ...cleaned } = dataToSave;
      if (cnpj) cleaned.document = cnpj;
      if (cleaned.id) {
        const { data, error } = await supabase.from("clients").update(cleaned).eq("id", cleaned.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("clients").insert([cleaned]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers_inventory"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });
}
function useFabrics() {
  return useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fabrics").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useModels() {
  return useQuery({
    queryKey: ["product_models"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_models").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("product_models").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_models"] })
  });
}
function useDeleteFabric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("fabrics").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fabrics"] })
  });
}
function useDeleteColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("canonical_colors").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canonical_colors"] })
  });
}
function useDeleteSizeGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("size_grids").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["size_grids"] })
  });
}
function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_categories").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("product_categories").insert([payload]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
  });
}
function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
  });
}
function useColors() {
  return useQuery({
    queryKey: ["canonical_colors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("canonical_colors").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useSizeGrids() {
  return useQuery({
    queryKey: ["size_grids"],
    queryFn: async () => {
      const { data, error } = await supabase.from("size_grids").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useSuppliersCRM() {
  return useQuery({
    queryKey: ["suppliers_crm"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name, company_name, phone, email, city").eq("entity_type", "fornecedor").eq("active", true).order("name");
      if (error) throw error;
      return data;
    }
  });
}
function useCreateSupplierCRM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("clients").insert([{
        name: payload.name.trim(),
        entity_type: "fornecedor",
        entity_class: "pj",
        // Padrão PJ para fornecedores
        active: true
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers_crm"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });
}
function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("product_models").insert([{ name: payload.name.toUpperCase().trim(), active: true }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_models"] })
  });
}
function useCreateFabric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("fabrics").insert([{ ...payload, active: true }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fabrics"] })
  });
}
function useCreateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("canonical_colors").insert([{ name: payload.name.trim(), hex: payload.hex || null, active: true }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canonical_colors"] })
  });
}
function useCreateSizeGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("size_grids").insert([{ name: payload.name.trim(), sizes: payload.sizes, description: payload.description || null, active: true }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["size_grids"] })
  });
}
function useProductVariants(search) {
  return useQuery({
    queryKey: ["product_variants", search],
    queryFn: async () => {
      let query = supabase.from("product_variants").select(`
          *,
          models:product_models(*),
          lines:product_lines(*),
          fabrics(*),
          canonical_colors(*)
        `).eq("active", true).order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      let variants = data;
      if (search) {
        const lowerQ = search.toLowerCase();
        variants = variants.filter(
          (v) => v.sku_internal?.toLowerCase().includes(lowerQ) || v.models?.name.toLowerCase().includes(lowerQ) || v.fabrics?.name.toLowerCase().includes(lowerQ) || v.canonical_colors?.name.toLowerCase().includes(lowerQ)
        );
      }
      return variants;
    }
  });
}
function useAllProductsStockSummary() {
  return useQuery({
    queryKey: ["all_stock_summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vw_stock_summary").select("product_id, available_qty");
      if (error) throw error;
      return data;
    }
  });
}
function useInventoryBatches(variantId) {
  return useQuery({
    queryKey: ["inventory_batches", variantId],
    queryFn: async () => {
      let query = supabase.from("inventory_batches").select(`
          *,
          suppliers(*),
          product_variants(
            *,
            models:product_models(*),
            fabrics(*),
            canonical_colors(*)
          )
        `).eq("active", true).order("entry_date", { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
function useStockMovements(filters) {
  return useQuery({
    queryKey: ["stock_movements", filters],
    queryFn: async () => {
      let query = supabase.from("inventory_movements").select(`
          *,
          users(name),
          inventory_batches!inner(
            batch_code,
            product_variants!inner(
              size,
              sku_internal,
              product_id,
              products!inner(
                name,
                technical_name
              )
            )
          )
        `).order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
function useSaveProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const {
        models,
        lines,
        fabrics,
        canonical_colors,
        products,
        ...dataToSave
      } = payload;
      if (dataToSave.id) {
        const { data, error } = await supabase.from("product_variants").update(dataToSave).eq("id", dataToSave.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("product_variants").insert([dataToSave]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product_variants"] })
  });
}
function useAdjustInventoryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data: movData, error: movErr } = await supabase.from("inventory_movements").insert([{
        batch_id: payload.batch_id,
        movement_type: payload.adjustment >= 0 ? "ajuste_entrada" : "ajuste_saida",
        quantity: payload.adjustment,
        notes: payload.reason
      }]).select().single();
      if (movErr) throw movErr;
      return movData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_batches"] });
    }
  });
}
function useCreateInventoryEntryGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data: prod, error: prodErr } = await supabase.from("products").select(`
          id, 
          model_id, 
          fabric_id, 
          color_id,
          model:product_models(code, name),
          fabric:fabrics(code, name),
          color:canonical_colors(code, name)
        `).eq("id", payload.product_id).single();
      if (prodErr || !prod) {
        throw new Error("Produto pai (MP) não encontrado: " + (prodErr?.message || ""));
      }
      const modelCode = prod.model?.code || prod.model?.name?.substring(0, 3).toUpperCase() || "XXX";
      const fabricCode = prod.fabric?.code || prod.fabric?.name?.substring(0, 3).toUpperCase() || "XXX";
      const colorCode = prod.color?.code || prod.color?.name?.substring(0, 3).toUpperCase() || "XXX";
      const entries = Object.entries(payload.grid);
      const results = [];
      for (const [size, qty] of entries) {
        if (qty <= 0) continue;
        const sku = `MP-${modelCode}-${fabricCode}-${colorCode}-${size.toUpperCase()}`;
        let { data: variant, error: varFindErr } = await supabase.from("product_variants").select("*").eq("product_id", prod.id).eq("size", size).maybeSingle();
        if (!variant) {
          const { data: newVar, error: varCreateErr } = await supabase.from("product_variants").insert([{
            product_id: prod.id,
            model_id: prod.model_id,
            fabric_id: prod.fabric_id,
            color_id: prod.color_id,
            size,
            gender: "unissex",
            sku_internal: sku,
            active: true
          }]).select().single();
          if (varCreateErr) throw varCreateErr;
          variant = newVar;
        }
        const { data: batch, error: batchErr } = await supabase.from("inventory_batches").insert([{
          product_variant_id: variant.id,
          supplier_id: payload.supplier_id,
          batch_code: payload.batch_code,
          quantity_total: 0,
          quantity_available: 0,
          quantity_reserved: 0,
          average_cost: payload.average_cost,
          quality_notes: payload.quality_notes
        }]).select().single();
        if (batchErr) throw batchErr;
        const { error: movErr } = await supabase.from("inventory_movements").insert([{
          batch_id: batch.id,
          movement_type: "compra",
          quantity: qty,
          notes: `Entrada por grade no lote ${payload.batch_code}`
        }]);
        if (movErr) console.error("Error logging movement", movErr);
        results.push(batch);
      }
      let totalCost = 0;
      for (const [size, qty] of entries) {
        if (qty > 0) totalCost += qty * payload.average_cost;
      }
      if (totalCost > 0) {
        let termsDays = 30;
        let paymentMethod = "Boleto";
        const { data: supplierObj } = await supabase.from("suppliers").select("*").eq("id", payload.supplier_id).maybeSingle();
        if (supplierObj) {
          termsDays = supplierObj.payment_terms_days !== void 0 && supplierObj.payment_terms_days !== null ? Number(supplierObj.payment_terms_days) : 30;
          paymentMethod = supplierObj.default_payment_method || "Boleto";
        } else {
          const { data: clientObj } = await supabase.from("clients").select("*").eq("id", payload.supplier_id).maybeSingle();
          if (clientObj) {
            termsDays = clientObj.payment_terms_days !== void 0 && clientObj.payment_terms_days !== null ? Number(clientObj.payment_terms_days) : 30;
            paymentMethod = clientObj.default_payment_method || "Boleto";
          }
        }
        const dueDate = /* @__PURE__ */ new Date();
        dueDate.setDate(dueDate.getDate() + termsDays);
        await supabase.from("financial_transactions").insert([{
          type: "pagar",
          description: `Compra de Estoque (MP) - Lote ${payload.batch_code}`,
          amount: totalCost,
          original_amount: totalCost,
          due_date: dueDate.toISOString().split("T")[0],
          status: "pendente",
          supplier_id: payload.supplier_id,
          payment_method: paymentMethod,
          cost_center: "Estoque"
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
export {
  useAllProductsStockSummary as a,
  useCategories as b,
  useColors as c,
  useCreateCategory as d,
  useCreateColor as e,
  useCreateFabric as f,
  useCreateInventoryEntryGrid as g,
  useCreateModel as h,
  useCreateSizeGrid as i,
  useCreateSupplierCRM as j,
  useDeleteCategory as k,
  useDeleteColor as l,
  useDeleteFabric as m,
  useDeleteModel as n,
  useDeleteSizeGrid as o,
  useFabrics as p,
  useInventoryBatches as q,
  useModels as r,
  useProductVariants as s,
  useSaveProductVariant as t,
  useAdjustInventoryBatch as u,
  useSaveSupplier as v,
  useSizeGrids as w,
  useStockMovements as x,
  useSuppliers as y,
  useSuppliersCRM as z
};
