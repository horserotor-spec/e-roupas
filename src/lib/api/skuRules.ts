import { supabase } from "../supabase";
import { useQuery } from "@tanstack/react-query";

export interface SkuRule {
  id: string;
  rule_type: 'model' | 'fabric' | 'color' | 'category';
  name: string;
  abbreviation: string;
  active: boolean;
}

export function useSkuRules() {
  return useQuery({
    queryKey: ["sku_rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sku_rules")
        .select("*")
        .eq("active", true);

      if (error) {
        // Fallback or ignore for now if table doesn't exist yet
        console.error("Failed to fetch sku rules", error);
        return [] as SkuRule[];
      }
      return data as SkuRule[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });
}
