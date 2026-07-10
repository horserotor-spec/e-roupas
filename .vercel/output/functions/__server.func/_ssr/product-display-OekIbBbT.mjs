import { y as supabase } from "./router-BxmJvJdu.mjs";
import { a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
function useCreateProductFromBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.from("products").insert([{
        name: payload.name,
        sku: payload.sku,
        price: payload.price,
        cost_price: payload.cost_price,
        customizations: payload.customizations,
        format: "PF"
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useProducts(search) {
  return useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      let query = supabase.from("products").select(`
          *,
          variations:product_variations(*),
          models:product_models(*),
          fabrics(*),
          canonical_colors(*)
        `).eq("active", true).order("created_at", { ascending: false });
      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,technical_name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const { variations, ...mainProduct } = productData;
      const { data: newProduct, error } = await supabase.from("products").insert([mainProduct]).select().single();
      if (error) throw error;
      if (variations && variations.length > 0) {
        const varsToInsert = variations.map(({ id, ...v }) => ({
          ...v,
          product_id: newProduct.id
        }));
        const { error: varError } = await supabase.from("product_variations").insert(varsToInsert);
        if (varError) throw varError;
      }
      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const { variations, id, ...mainProduct } = productData;
      const { data, error } = await supabase.from("products").update(mainProduct).eq("id", id).select().single();
      if (error) throw error;
      if (variations !== void 0) {
        await supabase.from("product_variations").delete().eq("product_id", id);
        if (variations.length > 0) {
          const varsToInsert = variations.map(({ id: varId, ...v }) => ({
            ...v,
            product_id: id
          }));
          const { error: varError } = await supabase.from("product_variations").insert(varsToInsert);
          if (varError) throw varError;
        }
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productsToImport) => {
      const { data: existingProducts } = await supabase.from("products").select("sku");
      const existingSkus = new Set((existingProducts || []).map((p) => p.sku).filter(Boolean));
      const newProducts = productsToImport.filter((p) => !p.sku || !existingSkus.has(p.sku));
      if (newProducts.length > 0) {
        const { error } = await supabase.from("products").insert(newProducts);
        if (error) throw error;
      }
      return {
        imported: newProducts.length,
        skipped: productsToImport.length - newProducts.length
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useCloneProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      const { data: original, error: fetchError } = await supabase.from("products").select(`*, variations:product_variations(*)`).eq("id", productId).single();
      if (fetchError) throw fetchError;
      const { id, created_at, updated_at, variations, ...productData } = original;
      const clonedProduct = {
        ...productData,
        name: `Cópia de ${original.name}`,
        sku: original.sku ? `${original.sku}-COPIA` : null
      };
      const { data: newProduct, error: insertError } = await supabase.from("products").insert([clonedProduct]).select().single();
      if (insertError) throw insertError;
      if (variations && variations.length > 0) {
        const clonedVariations = variations.map((v) => {
          const { id: vId, created_at: vCreated, ...vData } = v;
          return {
            ...vData,
            product_id: newProduct.id,
            sku: v.sku ? `${v.sku}-COPIA` : null
          };
        });
        const { error: varError } = await supabase.from("product_variations").insert(clonedVariations);
        if (varError) throw varError;
      }
      const { data: finalProduct } = await supabase.from("products").select(`*, variations:product_variations(*)`).eq("id", newProduct.id).single();
      return finalProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useProductRelationships(mpProductId) {
  return useQuery({
    queryKey: ["productRelationships", mpProductId],
    queryFn: async () => {
      if (!mpProductId) return [];
      const { data, error } = await supabase.from("product_relationships").select(`
          id,
          pa_variant_id,
          pa_product_id,
          pa_variant:product_variations!pa_variant_id(
            id, name, sku, price, active
          )
        `).eq("mp_product_id", mpProductId).eq("relationship_type", "MP_PA");
      if (error) throw error;
      return data;
    },
    enabled: !!mpProductId
  });
}
function getProductDisplayName(product) {
  if (product.technical_name && product.technical_name.trim() !== "") {
    return product.technical_name;
  }
  return product.name.replace(/^(Mat[eé]ria[ -]Prima|MATERIA[ -]PRIMA)\s*/i, "");
}
export {
  useCreateProduct as a,
  useCreateProductFromBOM as b,
  useDeleteProduct as c,
  useImportProducts as d,
  useProductRelationships as e,
  useProducts as f,
  getProductDisplayName as g,
  useUpdateProduct as h,
  useCloneProduct as u
};
