import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { OrderStatus } from "../constants";

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  sku?: string | null;
  model?: string;
  line?: string;
  fabric?: string;
  color?: string;
  size?: string;
  gender?: string;
  quantity: number;
  unit_cost?: number;
  list_price?: number;
  discount_percent?: number;
  unit_price?: number;
  customizations?: any[];
  production_status?: string;
  notes?: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  priority: string;
  deadline: string | null;
  final_total: number;
  urgent: boolean;
  brand_code: string;
  client_name: string;
  owner_name: string;
  items: OrderItem[];
  
  // Full fields
  client_id: string;
  brand_id: string;
  seller_id: string | null;
  store: string | null;
  business_unit: string | null;
  sale_date: string | null;
  departure_date: string | null;
  expected_date: string | null;
  purchase_order: string | null;
  delivery_days: number;
  other_expenses: number;
  items_discount: number;
  commissions_total: number;
  estimated_total: number;
  discount: number;
  payment_category: string | null;
  payment_condition: string | null;
  payment_method: string | null;
  carrier_name: string | null;
  freight_payer: string | null;
  volumes_quantity: number;
  gross_weight: number;
  freight_cost: number;
  logistics_integration: string | null;
  notes: string | null;
  internal_notes: string | null;
}

export type OrderPayload = Partial<Order> & { client_id: string; brand_id: string; items?: OrderItem[] };

export function useOrders(search?: string) {
  return useQuery({
    queryKey: ["orders", search],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          clients!inner(id, name, phone),
          brands!inner(id, code),
          users:responsible_user_id(id, name),
          order_items(*)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`code.ilike.%${search}%,clients.name.ilike.%${search}%,clients.phone.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((o: any) => ({
        ...o,
        status: o.status as OrderStatus,
        urgent: o.priority === "alta",
        final_total: Number(o.final_total),
        brand_code: o.brands?.code || "GEN",
        client_name: o.clients?.name || "Sem Cliente",
        owner_name: o.users?.name || "Sem Responsável",
        items: o.order_items || [],
      })) as Order[];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const { items, ...orderData } = payload;
      
      // Sanitize orderData
      delete (orderData as any).order_items;
      delete (orderData as any).clients;
      delete (orderData as any).brands;
      delete (orderData as any).users;
      if (orderData.seller_id === "") orderData.seller_id = null;
      if (orderData.responsible_user_id === "") orderData.responsible_user_id = null;
      
      // Fetch brand code for the order code prefix
      const { data: brand } = await supabase.from("brands").select("code").eq("id", orderData.brand_id).single();
      const brandCode = brand?.code || "GEN";

      // Generate Code
      const date = new Date();
      const dateStr = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      const { count } = await supabase.from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());
        
      const seq = String((count || 0) + 1).padStart(4, '0');
      const finalCode = `${brandCode}-${dateStr}-${seq}`;

      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert([{
          ...orderData,
          code: finalCode,
          status: orderData.status || "atendimento"
        }])
        .select()
        .single();

      if (error) throw error;

      // Insert Items
      if (items && items.length > 0) {
        const itemsToInsert = items.map(item => {
          const cleanItem = { ...item };
          delete cleanItem.id;
          delete (cleanItem as any).created_at;
          if (cleanItem.product_id === "") cleanItem.product_id = null;
          if (cleanItem.sku === "") cleanItem.sku = null;
          return {
            ...cleanItem,
            order_id: newOrder.id
          };
        });
        
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(itemsToInsert);
          
        if (itemsError) throw itemsError;
      }

      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string } & Partial<OrderPayload>) => {
      const { items, id, ...orderData } = payload;

      // Sanitize orderData
      delete (orderData as any).order_items;
      delete (orderData as any).clients;
      delete (orderData as any).brands;
      delete (orderData as any).users;
      if (orderData.seller_id === "") orderData.seller_id = null;
      if (orderData.responsible_user_id === "") orderData.responsible_user_id = null;

      const { data, error } = await supabase
        .from("orders")
        .update(orderData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Handle Items update (delete all and re-insert for simplicity)
      if (items !== undefined) {
        await supabase.from("order_items").delete().eq("order_id", id);
        
        if (items.length > 0) {
          const itemsToInsert = items.map(item => {
            const cleanItem = { ...item };
            delete cleanItem.id;
            delete (cleanItem as any).created_at;
            if (cleanItem.product_id === "") cleanItem.product_id = null;
            if (cleanItem.sku === "") cleanItem.sku = null;
            return {
              ...cleanItem,
              order_id: id
            };
          });
          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("order_items")
        .update({ production_status: payload.status })
        .eq("id", payload.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
