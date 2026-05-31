import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  model: string | null;
  line: string | null;
  fabric: string | null;
  color: string | null;
  size: string | null;
  gender: string | null;
  quantity: number;
  unit_price: number | null;
  unit_cost: number | null;
  notes: string | null;
  active: boolean;
}

export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ["order_items", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)
        .eq("active", true)
        .order("created_at");

      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!orderId,
  });
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<OrderItem> & { order_id: string }) => {
      const { data, error } = await supabase.from("order_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", variables.order_id] });
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrderItem> & { id: string }) => {
      const { data, error } = await supabase.from("order_items").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", data.order_id] });
    },
  });
}

export function useDeleteOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, orderId }: { id: string, orderId: string }) => {
      const { error } = await supabase.from("order_items").update({ active: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", variables.orderId] });
    },
  });
}
