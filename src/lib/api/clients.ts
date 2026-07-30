import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

export interface Client {
  id: string;
  code: string | null;
  name: string;
  entity_class: "pf" | "pj";
  entity_type: "cliente" | "fornecedor" | "colaborador" | "vendedor" | "socio" | "transportadora";
  document: string | null;
  state_registration: string | null;
  phone: string | null;
  landline_phone: string | null;
  email: string | null;
  email_nfe: string | null;
  icms_contributor_type: string | null;
  instagram: string | null;
  company_name: string | null;
  order_contact_name: string | null;
  order_contact_phone: string | null;
  lead_source: string | null;
  notes: string | null;
  credit_status: string;
  is_first_purchase: boolean;
  last_purchase_date: string | null;
  zip_code: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
  responsible_id: string | null;
  commission_percent: number;
  orders: number;
  total: number;
  created_at: string;
}

export function useClients(search?: string, activeFilter: "active" | "inactive" | "all" = "active") {
  return useQuery({
    queryKey: ["clients", search, activeFilter],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*")
        .order("name");

      if (activeFilter === "active") query = query.eq("active", true);
      else if (activeFilter === "inactive") query = query.eq("active", false);
      // "all" = no filter

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,document.ilike.%${search}%,company_name.ilike.%${search}%,phone.ilike.%${search}%,entity_type.ilike.%${search}%,code.ilike.%${search}%`);
      }

      const { data: clientsData, error: clientsErr } = await query;
      if (clientsErr) throw clientsErr;

      const { data: ordersData } = await supabase
        .from("orders")
        .select("client_id, final_total");

      const orderStats: Record<string, { count: number; total: number }> = {};
      
      if (ordersData) {
        ordersData.forEach(o => {
          if (!orderStats[o.client_id]) orderStats[o.client_id] = { count: 0, total: 0 };
          orderStats[o.client_id].count++;
          orderStats[o.client_id].total += Number(o.final_total || 0);
        });
      }

      return (clientsData || []).map(c => ({
        ...c,
        orders: orderStats[c.id]?.count || 0,
        total: orderStats[c.id]?.total || 0,
      })) as Client[];
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (client: Partial<Client>) => {
      const { data, error } = await supabase.from("clients").insert(client).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").update({ active: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useReactivateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").update({ active: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useImportClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clients: Partial<Client>[]) => {
      if (!clients.length) return { imported: 0, skipped: 0 };
      
      // Fetch existing documents to avoid duplicates
      const { data: existing } = await supabase.from("clients").select("document").not("document", "is", null);
      const existingDocs = new Set(existing?.map(c => c.document).filter(Boolean));

      const toInsert = clients.filter(c => {
        const doc = c.document?.trim();
        const isPlaceholder = !doc || doc === "-" || doc === "0" || doc.toLowerCase() === "n/a" || doc.toLowerCase() === "na" || doc.toLowerCase() === "não informado";
        
        if (isPlaceholder) {
          c.document = null;
          return true; // Let them through if they have no valid document
        }
        if (existingDocs.has(doc)) return false;
        existingDocs.add(doc); // Add to set so we don't duplicate within the same batch
        return true;
      });

      if (!toInsert.length) return { imported: 0, skipped: clients.length };

      const { error } = await supabase.from("clients").insert(toInsert);
      if (error) throw error;

      return { imported: toInsert.length, skipped: clients.length - toInsert.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useCleanBadImports() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { error } = await supabase.from("clients")
        .delete()
        .or(`created_at.is.null,created_at.gte.${yesterday.toISOString()}`);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
