import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

export interface OrderItemProcess {
  id: string;
  order_item_id: string;
  process_id: string;
  status: string;
  responsible_user_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  order_index: number;
}

export function useOrderItemProcesses(orderItemId: string) {
  return useQuery({
    queryKey: ["item_processes", orderItemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_item_processes")
        .select(`
          *,
          production_processes(name)
        `)
        .eq("order_item_id", orderItemId)
        .order("order_index");

      if (error) throw error;
      return data;
    },
    enabled: !!orderItemId,
  });
}

export function useUpsertOrderItemProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (process: Partial<OrderItemProcess> & { order_item_id: string, process_id: string }) => {
      // Check if it exists
      const { data: existing } = await supabase
        .from("order_item_processes")
        .select("id")
        .eq("order_item_id", process.order_item_id)
        .eq("process_id", process.process_id)
        .single();
        
      let result;
      if (existing) {
        result = await supabase.from("order_item_processes").update(process).eq("id", existing.id).select().single();
      } else {
        result = await supabase.from("order_item_processes").insert(process).select().single();
      }
      
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["item_processes", variables.order_item_id] });
    },
  });
}

export function useDeleteOrderItemProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, orderItemId }: { id: string, orderItemId: string }) => {
      const { error } = await supabase.from("order_item_processes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["item_processes", variables.orderItemId] });
    },
  });
}
