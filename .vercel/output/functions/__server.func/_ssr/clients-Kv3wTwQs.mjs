import { a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { y as supabase } from "./router-BxmJvJdu.mjs";
function useClients(search) {
  return useQuery({
    queryKey: ["clients", search],
    queryFn: async () => {
      let query = supabase.from("clients").select("*").eq("active", true).order("name");
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,document.ilike.%${search}%,company_name.ilike.%${search}%,phone.ilike.%${search}%,entity_type.ilike.%${search}%,code.ilike.%${search}%`);
      }
      const { data: clientsData, error: clientsErr } = await query;
      if (clientsErr) throw clientsErr;
      const { data: ordersData } = await supabase.from("orders").select("client_id, final_total");
      const orderStats = {};
      if (ordersData) {
        ordersData.forEach((o) => {
          if (!orderStats[o.client_id]) orderStats[o.client_id] = { count: 0, total: 0 };
          orderStats[o.client_id].count++;
          orderStats[o.client_id].total += Number(o.final_total || 0);
        });
      }
      return (clientsData || []).map((c) => ({
        ...c,
        orders: orderStats[c.id]?.count || 0,
        total: orderStats[c.id]?.total || 0
      }));
    }
  });
}
function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (client) => {
      const { data, error } = await supabase.from("clients").insert(client).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });
}
function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });
}
function useImportClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clients) => {
      if (!clients.length) return { imported: 0, skipped: 0 };
      const { data: existing } = await supabase.from("clients").select("document").not("document", "is", null);
      const existingDocs = new Set(existing?.map((c) => c.document).filter(Boolean));
      const toInsert = clients.filter((c) => {
        if (!c.document) return true;
        if (existingDocs.has(c.document)) return false;
        existingDocs.add(c.document);
        return true;
      });
      if (!toInsert.length) return { imported: 0, skipped: clients.length };
      const { error } = await supabase.from("clients").insert(toInsert);
      if (error) throw error;
      return { imported: toInsert.length, skipped: clients.length - toInsert.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });
}
export {
  useCreateClient as a,
  useImportClients as b,
  useUpdateClient as c,
  useClients as u
};
