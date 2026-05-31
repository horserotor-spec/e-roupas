import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export async function logTimelineEvent({
  orderId,
  action,
  description,
  oldStatus,
  newStatus,
}: {
  orderId: string;
  action: string;
  description: string;
  oldStatus?: string;
  newStatus?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("order_timeline").insert({
    order_id: orderId,
    action,
    description,
    old_status: oldStatus,
    new_status: newStatus,
    created_by: user.id,
  });

  if (error) {
    console.error("Erro ao registrar timeline:", error);
  }
}

export function useOrderTimeline(orderId: string) {
  return useQuery({
    queryKey: ["timeline", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_timeline")
        .select(`
          id, created_at, action, description, old_status, new_status,
          users:created_by(id, name)
        `)
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}
