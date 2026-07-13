import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  cost_price: number;
  format: string;
  unit: string;
  brand: string | null;
  category: string | null;
  condition: string;
  net_weight: number;
  gross_weight: number;
  gtin_ean: string | null;
  ncm: string | null;
  cest: string | null;
  min_stock: number;
  max_stock: number;
  model_id?: string | null;
  fabric_id?: string | null;
  color_id?: string | null;
  models?: any;
  fabrics?: any;
  canonical_colors?: any;
  model?: any;
  fabric?: any;
  color?: any;
  origin?: number;
  icms_cst?: string | null;
  icms_percent?: number;
  pis_cst?: string | null;
  pis_percent?: number;
  cofins_cst?: string | null;
  cofins_percent?: number;
  ipi_cst?: string | null;
  ipi_percent?: number;
  cfop?: string | null;
  active: boolean;
  customizations?: any[];
  fabric_family?: string | null;
  size_grid?: string | null;
  supplier_id?: string | null;
  supports_dtf?: boolean;
  supports_embroidery?: boolean;
  supports_silk?: boolean;
  supports_sublimation?: boolean;
  lead_time_minutes?: number;
  production_sla_days?: number;
  technical_name?: string | null;
  mix_allowed?: boolean;
  created_at: string;
  updated_at: string;
  variations?: ProductVariation[];
}

export function useCreateProductFromBOM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; sku: string; price: number; cost_price: number; customizations: any[] }) => {
      const { data, error } = await supabase
        .from("products")
        .insert([{
          name: payload.name,
          sku: payload.sku,
          price: payload.price,
          cost_price: payload.cost_price,
          customizations: payload.customizations,
          format: 'PF',
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProducts(search?: string) {
  return useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          variations:product_variations(*),
          models:product_models(*),
          fabrics(*),
          canonical_colors(*)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,technical_name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { variations, ...mainProduct } = productData;
      
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert([mainProduct])
        .select()
        .single();

      if (error) throw error;

      if (variations && variations.length > 0) {
        const varsToInsert = variations.map(({ id, ...v }) => ({
          ...v,
          product_id: newProduct.id
        }));

        const { error: varError } = await supabase
          .from("product_variations")
          .insert(varsToInsert);
          
        if (varError) throw varError;
      }

      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product> & { id: string }) => {
      const { variations, id, ...mainProduct } = productData;
      
      const { data, error } = await supabase
        .from("products")
        .update(mainProduct)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Handle variations
      if (variations !== undefined) {
        // 1. Delete existing variations
        await supabase.from("product_variations").delete().eq("product_id", id);
        
        // 2. Insert new variations
        if (variations.length > 0) {
          const varsToInsert = variations.map(({ id: varId, ...v }) => ({
            ...v,
            product_id: id
          }));
          
          const { error: varError } = await supabase
            .from("product_variations")
            .insert(varsToInsert);
            
          if (varError) throw varError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete marking active = false
      const { error } = await supabase
        .from("products")
        .update({ active: false })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useImportProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productsToImport: Partial<Product>[]) => {
      // Basic deduplication check by SKU
      const { data: existingProducts } = await supabase.from("products").select("sku");
      const existingSkus = new Set((existingProducts || []).map(p => p.sku).filter(Boolean));

      const newProducts = productsToImport.filter(p => !p.sku || !existingSkus.has(p.sku));

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
    },
  });
}

export function useCloneProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // 1. Fetch the original product with variations
      const { data: original, error: fetchError } = await supabase
        .from("products")
        .select(`*, variations:product_variations(*)`)
        .eq("id", productId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Clone main product
      const { id, created_at, updated_at, variations, ...productData } = original;
      const clonedProduct = {
        ...productData,
        name: `Cópia de ${original.name}`,
        sku: original.sku ? `${original.sku}-COPIA` : null,
      };

      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert([clonedProduct])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Clone variations if they exist
      if (variations && variations.length > 0) {
        const clonedVariations = variations.map((v: any) => {
          const { id: vId, created_at: vCreated, ...vData } = v;
          return {
            ...vData,
            product_id: newProduct.id,
            sku: v.sku ? `${v.sku}-COPIA` : null,
          };
        });

        const { error: varError } = await supabase
          .from("product_variations")
          .insert(clonedVariations);

        if (varError) throw varError;
      }

      // 4. Return the new product (with variations refetched)
      const { data: finalProduct } = await supabase
        .from("products")
        .select(`*, variations:product_variations(*)`)
        .eq("id", newProduct.id)
        .single();

      return finalProduct as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Suggest product names and SKUs based on existing entries
export interface ProductSuggestion {
  name: string;
  sku: string | null;
}

/**
 * Hook to fetch product name/SKU suggestions for autocomplete.
 * If `search` is provided, filters by name or SKU containing the term.
 */
export function useProductSuggestions(search?: string) {
  return useQuery({
    queryKey: ["productSuggestions", search],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`name, sku`)
        .in("format", ["PA", "PF", "Serviço"])
        .order("name", { ascending: true });

      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProductSuggestion[];
    },
  });
}

export function useProductRelationships(mpProductId?: string) {
  return useQuery({
    queryKey: ["productRelationships", mpProductId],
    queryFn: async () => {
      if (!mpProductId) return [];
      const { data, error } = await supabase
        .from("product_relationships")
        .select(`
          id,
          pa_variant_id,
          pa_product_id,
          pa_variant:product_variations!pa_variant_id(
            id, name, sku, price, active
          )
        `)
        .eq("mp_product_id", mpProductId)
        .eq("relationship_type", "MP_PA");
      
      if (error) throw error;
      return data;
    },
    enabled: !!mpProductId
  });
}
