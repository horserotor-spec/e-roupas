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
  active: boolean;
  customizations?: any[];
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
          format: 'Simples',
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
          variations:product_variations(*)
        `)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
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
