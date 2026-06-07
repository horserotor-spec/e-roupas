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

export interface OrderPayment {
  id?: string;
  order_id?: string;
  amount: number;
  payment_method: string;
  installments: number;
  due_date: string;
  status: "pendente" | "pago" | "cancelado";
  payment_date?: string | null;
  notes?: string | null;
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
  payments?: OrderPayment[];
  
  // Full fields
  client_id: string;
  brand_id: string;
  seller_id: string | null;
  salesperson_id: string | null;
  store: string | null;
  business_unit: string | null;
  origin_channel: string;
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
  salesperson_name?: string;

    corte_faction?: string | null;
    corte_start_date?: string | null;
    corte_end_date?: string | null;
    costura_faction?: string | null;
    costura_start_date?: string | null;
    costura_end_date?: string | null;
    corte_grid?: Record<string, number>;
    costura_grid?: Record<string, number>;
    corte_unit_price?: number;
    costura_unit_price?: number;


}

export type OrderPayload = Partial<Order> & { client_id: string; brand_id: string; items?: OrderItem[]; payments?: OrderPayment[] };

export async function allocateStockAndCreateProcesses(orderId: string) {
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      product_id,
      product_name,
      sku,
      size,
      gender,
      quantity,
      customizations,
      products:product_id (
        model_id,
        fabric_id,
        color_id
      )
    `)
    .eq("order_id", orderId);

  if (itemsError || !orderItems || orderItems.length === 0) return;

  const { data: allProcesses } = await supabase
    .from("production_processes")
    .select("*")
    .order("order_index", { ascending: true });

  if (allProcesses && allProcesses.length > 0) {
    for (const item of orderItems) {
      const { data: existing } = await supabase
        .from("order_item_processes")
        .select("id")
        .eq("order_item_id", item.id);

      if (!existing || existing.length === 0) {
        const processNames = ["Separação", "Manuseio e qualidade", "Expedição"];

        const hasDtf = (item.customizations || []).some((c: any) => 
          c.name?.toLowerCase().includes("dtf") || c.details?.toLowerCase().includes("dtf")
        );
        const hasBordado = (item.customizations || []).some((c: any) => 
          c.name?.toLowerCase().includes("bordado") || c.details?.toLowerCase().includes("bordado")
        );
        const hasSilk = (item.customizations || []).some((c: any) => 
          c.name?.toLowerCase().includes("silk") || c.details?.toLowerCase().includes("silk")
        );
        const hasSublimacao = (item.customizations || []).some((c: any) => 
          c.name?.toLowerCase().includes("sublima") || c.details?.toLowerCase().includes("sublima")
        );

        if (hasDtf) {
          processNames.push("Impressão DTF");
          processNames.push("Prensa");
        }
        if (hasBordado) {
          processNames.push("Bordado");
        }
        if (hasSilk) {
          processNames.push("Silk");
        }
        if (hasSublimacao) {
          processNames.push("Sublimação");
        }

        const prod = (item.products as any);
        if (prod && prod.model_id && prod.fabric_id) {
          processNames.push("Corte");
          processNames.push("Costura");
        }

        const toInsert = allProcesses
          .filter((p: any) => processNames.includes(p.name))
          .map((p: any) => ({
            order_item_id: item.id,
            process_id: p.id,
            status: p.name === "Separação" ? "em_andamento" : "pendente"
          }));

        if (toInsert.length > 0) {
          await supabase.from("order_item_processes").insert(toInsert);
        }
      }
    }
  }

  // 1. Obter informações de mix_fabrics_allowed do pedido
  const { data: orderData } = await supabase
    .from("orders")
    .select("mix_fabrics_allowed")
    .eq("id", orderId)
    .single();
  const mixFabricsAllowed = orderData?.mix_fabrics_allowed || false;

  const { data: existingReservations } = await supabase
    .from("stock_reservations")
    .select("id")
    .eq("order_id", orderId);

  if (!existingReservations || existingReservations.length === 0) {
    for (const item of orderItems) {
      const prod = (item.products as any);
      if (!prod) continue;

      let variant = null;
      let usedAlternative = false;
      let actualFabricId = prod.fabric_id;

      // Se for PA (Produto Acabável) ou se o produto pai tiver modelagem, tecido e cor definidos
      if (prod.model_id && prod.fabric_id && prod.color_id) {
        
        // 2. Tenta encontrar a variante física da MP principal
        // Primeiro precisamos achar o produto MP correspondente
        const { data: mainMp } = await supabase
          .from("products")
          .select("id")
          .eq("format", "MP")
          .eq("model_id", prod.model_id)
          .eq("fabric_id", prod.fabric_id)
          .eq("color_id", prod.color_id)
          .eq("active", true)
          .maybeSingle();

        if (mainMp) {
          const { data: v } = await supabase
            .from("product_variants")
            .select("id")
            .eq("product_id", mainMp.id)
            .eq("size", item.size)
            .eq("active", true)
            .maybeSingle();
          variant = v;
        }

        // 3. Se não achou variante ou se o estoque disponível da variante principal for insuficiente, 
        // e se o cliente aceita mistura de tecidos, busca outra MP alternativa
        if (mixFabricsAllowed) {
          let hasSufficientStock = false;
          if (variant) {
            const { data: sumStock } = await supabase
              .from("inventory_batches")
              .select("quantity_available")
              .eq("product_variant_id", variant.id)
              .eq("active", true);
            const available = sumStock?.reduce((acc, b) => acc + Number(b.quantity_available || 0), 0) || 0;
            hasSufficientStock = available >= Number(item.quantity);
          }

          if (!variant || !hasSufficientStock) {
            // Buscar outros produtos MP que tenham o mesmo modelo e cor mas malha/tecido diferente
            const { data: alternativeMps } = await supabase
              .from("products")
              .select("id, fabric_id")
              .eq("format", "MP")
              .eq("model_id", prod.model_id)
              .eq("color_id", prod.color_id)
              .neq("fabric_id", prod.fabric_id) // Tecidos diferentes
              .eq("active", true);

            if (alternativeMps && alternativeMps.length > 0) {
              for (const altMp of alternativeMps) {
                const { data: altV } = await supabase
                  .from("product_variants")
                  .select("id")
                  .eq("product_id", altMp.id)
                  .eq("size", item.size)
                  .eq("active", true)
                  .maybeSingle();

                if (altV) {
                  const { data: sumStock } = await supabase
                    .from("inventory_batches")
                    .select("quantity_available")
                    .eq("product_variant_id", altV.id)
                    .eq("active", true);
                  const available = sumStock?.reduce((acc, b) => acc + Number(b.quantity_available || 0), 0) || 0;
                  if (available >= Number(item.quantity)) {
                    variant = altV;
                    actualFabricId = altMp.fabric_id;
                    usedAlternative = true;
                    break; // Encontrou um tecido compatível com estoque suficiente!
                  }
                }
              }
            }
          }
        }
      }

      if (variant) {
        const { data: batches } = await supabase
          .from("inventory_batches")
          .select("*")
          .eq("product_variant_id", variant.id)
          .eq("active", true)
          .gt("quantity_available", 0)
          .order("entry_date", { ascending: true });

        let qtyNeeded = Number(item.quantity);
        if (batches && batches.length > 0) {
          for (const batch of batches) {
            if (qtyNeeded <= 0) break;

            const qtyToReserve = Math.min(qtyNeeded, Number(batch.quantity_available));
            qtyNeeded -= qtyToReserve;

            await supabase
              .from("inventory_batches")
              .update({
                quantity_available: Number(batch.quantity_available) - qtyToReserve,
                quantity_reserved: Number(batch.quantity_reserved || 0) + qtyToReserve
              })
              .eq("id", batch.id);

            await supabase
              .from("stock_reservations")
              .insert([{
                order_id: orderId,
                order_item_id: item.id,
                batch_id: batch.id,
                quantity: qtyToReserve
              }]);
          }
        }

        if (usedAlternative) {
          // Logar substituição na timeline do pedido
          const { data: altFabric } = await supabase.from("fabrics").select("name").eq("id", actualFabricId).single();
          await supabase
            .from("order_timeline")
            .insert([{
              order_id: orderId,
              user_id: null,
              event_type: "info",
              description: `Substituição inteligente: item ${item.product_name} (${item.size}) foi alocado com o tecido alternativo "${altFabric?.name}" por falta do tecido original.`
            }]);
        }

        if (qtyNeeded > 0) {
          await supabase
            .from("order_timeline")
            .insert([{
              order_id: orderId,
              user_id: null,
              event_type: "alerta",
              description: `Estoque de MP insuficiente para ${item.product_name} (${item.size}). Faltaram ${qtyNeeded} un. no FIFO.`
            }]);
        }
      } else {
        // Se nem a variante principal nem a alternativa foram encontradas
        await supabase
          .from("order_timeline")
          .insert([{
            order_id: orderId,
            user_id: null,
            event_type: "alerta",
            description: `Variante ou Matéria-Prima não encontrada para ${item.product_name} (${item.size}).`
          }]);
      }
    }
  }
}

export async function consumeStockForOrder(orderId: string) {
  const { data: reservations, error } = await supabase
    .from("stock_reservations")
    .select("*")
    .eq("order_id", orderId);

  if (error || !reservations || reservations.length === 0) return;

  for (const res of reservations) {
    const qtyToConsume = Number(res.quantity);
    if (qtyToConsume <= 0) continue;

    // 1. Fetch batch to get current reserved
    const { data: batch } = await supabase
      .from("inventory_batches")
      .select("quantity_available, quantity_reserved")
      .eq("id", res.batch_id)
      .single();

    if (!batch) continue;

    // 2. We logically return the reserved quantity to available because the inventory_movements 
    // trigger will subtract it from available and total. This perfectly simulates consumption of reserved stock.
    await supabase
      .from("inventory_batches")
      .update({
        quantity_available: Number(batch.quantity_available) + qtyToConsume,
        quantity_reserved: Math.max(0, Number(batch.quantity_reserved || 0) - qtyToConsume)
      })
      .eq("id", res.batch_id);

    // 3. Insert movement (Consumption)
    await supabase
      .from("inventory_movements")
      .insert([{
        batch_id: res.batch_id,
        movement_type: "consumo",
        quantity: -qtyToConsume,
        reference_type: "pedido",
        reference_id: orderId,
        notes: `Consumo FIFO automático após liberação de produção (Reserva ID: ${res.id})`
      }]);

    // 4. Delete the reservation now that it's consumed
    await supabase
      .from("stock_reservations")
      .delete()
      .eq("id", res.id);
  }
}

export function useOrders(search?: string) {
  return useQuery({
    queryKey: ["orders", search],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          clients!orders_client_id_fkey!inner(id, name, phone),
          brands!inner(id, code),
          users:responsible_user_id(id, name),
          salesperson:clients!orders_salesperson_id_fkey(id, name),
          order_items(*),
          order_payments(*)
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
        salesperson_name: o.salesperson?.name || null,
        items: o.order_items || [],
        payments: o.order_payments || [],
      })) as Order[];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          clients!orders_client_id_fkey(id, name, company_name),
          brands(id, name, code),
          seller:users!orders_seller_id_fkey(id, name),
          salesperson:clients!orders_salesperson_id_fkey(id, name, commission_rate)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        status: data.status as OrderStatus,
        urgent: data.priority === "alta",
        brand_code: data.brands?.code || "BRN",
        client_name: data.clients?.company_name || data.clients?.name || "Cliente não informado",
        owner_name: data.seller?.name || "—",
        salesperson_name: data.salesperson?.name || null,
        items: data.order_items || [],
        payments: data.order_payments || [],
      } as Order;
    },
    enabled: !!id,
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const { items, payments, ...orderData } = payload;
      
      // Sanitize orderData
      delete (orderData as any).order_items;
      delete (orderData as any).clients;
      delete (orderData as any).brands;
      delete (orderData as any).users;
      delete (orderData as any).order_payments;
      delete (orderData as any).created_at;
      if (orderData.seller_id === "") orderData.seller_id = null;
      if (orderData.salesperson_id === "") orderData.salesperson_id = null;
      if (orderData.responsible_user_id === "") orderData.responsible_user_id = null;
      
      delete (orderData as any).mix_fabrics_allowed;
      if (orderData.departure_date === "") orderData.departure_date = null;
      if (orderData.expected_date === "") orderData.expected_date = null;
      if (orderData.deadline === "") orderData.deadline = null;
      if (orderData.sale_date === "") orderData.sale_date = null;
      
      // Handle Commission calculation
      let commissionValue = 0;
      if (orderData.salesperson_id) {
        const { data: salesperson } = await supabase.from("clients").select("*").eq("id", orderData.salesperson_id).single();
        const rate = salesperson?.commission_rate || salesperson?.commission_percent || 0;
        if (rate > 0) {
          commissionValue = Number(orderData.final_total || 0) * (rate / 100);
        }
      }
      orderData.commissions_total = commissionValue;
      
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
          status: orderData.status || "confirmado"
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

      // Insert Payments
      if (payments && payments.length > 0) {
        const paymentsWithOrderId = payments.map(p => ({
          ...p,
          order_id: newOrder.id
        }));
        
        const { error: paymentsError } = await supabase
          .from("order_payments")
          .insert(paymentsWithOrderId);
          
        if (paymentsError) throw paymentsError;
      }

      // Generate Accounts Payable for Commission
      if (orderData.salesperson_id && commissionValue > 0) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Default to 30 days
        
        await supabase.from("accounts_payable").insert([{
          description: `Comissão de Venda - Pedido ${finalCode}`,
          amount: commissionValue,
          due_date: dueDate.toISOString(),
          status: 'pendente',
          supplier_id: orderData.salesperson_id,
          order_id: newOrder.id,
          notes: 'Gerado automaticamente na criação do pedido.'
        }]);
      }

      if (orderData.status === "em_producao" || orderData.status === "confirmado") {
        await allocateStockAndCreateProcesses(newOrder.id);
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
      const { items, payments, id, ...orderData } = payload;

      // Sanitize orderData
      delete (orderData as any).order_items;
      delete (orderData as any).clients;
      delete (orderData as any).brands;
      delete (orderData as any).users;
      delete (orderData as any).order_payments;
      delete (orderData as any).created_at;
      if (orderData.seller_id === "") orderData.seller_id = null;
      if (orderData.salesperson_id === "") orderData.salesperson_id = null;
      if (orderData.responsible_user_id === "") orderData.responsible_user_id = null;
      
      delete (orderData as any).mix_fabrics_allowed;
      if (orderData.departure_date === "") orderData.departure_date = null;
      if (orderData.expected_date === "") orderData.expected_date = null;
      if (orderData.deadline === "") orderData.deadline = null;
      if (orderData.sale_date === "") orderData.sale_date = null;

      // Handle Commission calculation
      let commissionValue = 0;
      if (orderData.salesperson_id) {
        const { data: seller } = await supabase.from("clients").select("*").eq("id", orderData.salesperson_id).single();
        const rate = seller?.commission_rate || seller?.commission_percent || 0;
        if (rate > 0) {
          commissionValue = (Number(orderData.final_total || 0) * Number(rate)) / 100;
          orderData.commissions_total = commissionValue;
        }
      }

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

      // Handle Payments update
      if (payments !== undefined) {
        await supabase.from("order_payments").delete().eq("order_id", id);
        
        if (payments.length > 0) {
          const paymentsWithOrderId = payments.map(p => {
            const clean = { ...p };
            delete clean.id; // delete ID if it exists so supabase generates new ones, as we just deleted all
            return {
              ...clean,
              order_id: id
            };
          });
          const { error: paymentsError } = await supabase
            .from("order_payments")
            .insert(paymentsWithOrderId);
          if (paymentsError) throw paymentsError;
        }
      }

      // Handle Accounts Payable update/creation
      if (orderData.salesperson_id) {
        // Delete existing payable for this order if any
        await supabase.from("accounts_payable").delete().eq("order_id", id);
        
        if (commissionValue > 0) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30); // Default 30 days
          
          await supabase.from("accounts_payable").insert([{
            description: `Comissão de Venda - Pedido atualizado`,
            amount: commissionValue,
            due_date: dueDate.toISOString(),
            status: 'pendente',
            supplier_id: orderData.salesperson_id,
            order_id: id,
            notes: 'Recalculado automaticamente na atualização do pedido.'
          }]);
        }
      }

      if (orderData.status === "em_producao" || orderData.status === "confirmado") {
        await allocateStockAndCreateProcesses(id);
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

export function useOverrideStockBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { reservationId: string; newBatchId: string }) => {
      const { data: reservation, error: resError } = await supabase
        .from("stock_reservations")
        .select("*, inventory_batches(*)")
        .eq("id", payload.reservationId)
        .single();

      if (resError || !reservation) throw new Error("Reserva não encontrada");
      if (reservation.batch_id === payload.newBatchId) return { success: true };

      const { data: newBatch, error: batchError } = await supabase
        .from("inventory_batches")
        .select("*")
        .eq("id", payload.newBatchId)
        .single();

      if (batchError || !newBatch) throw new Error("Novo lote não encontrado");

      const qty = Number(reservation.quantity);
      if (Number(newBatch.quantity_available) < qty) {
        throw new Error(`Estoque insuficiente no novo lote. Disponível: ${newBatch.quantity_available}`);
      }

      const oldBatch = reservation.inventory_batches;
      
      // Devolver antigo
      await supabase
        .from("inventory_batches")
        .update({
          quantity_available: Number(oldBatch.quantity_available) + qty,
          quantity_reserved: Math.max(0, Number(oldBatch.quantity_reserved) - qty)
        })
        .eq("id", oldBatch.id);

      // Reservar novo
      await supabase
        .from("inventory_batches")
        .update({
          quantity_available: Number(newBatch.quantity_available) - qty,
          quantity_reserved: Number(newBatch.quantity_reserved || 0) + qty
        })
        .eq("id", newBatch.id);

      // Atualizar reserva
      const { error: updateResError } = await supabase
        .from("stock_reservations")
        .update({ batch_id: payload.newBatchId })
        .eq("id", payload.reservationId);

      if (updateResError) throw updateResError;

      // Movimentos
      await supabase
        .from("inventory_movements")
        .insert([
          {
            batch_id: oldBatch.id,
            movement_type: "ajuste",
            quantity: qty,
            reference_type: "pedido",
            reference_id: reservation.order_id,
            notes: `Devolução por override manual no pedido ID ${reservation.order_id}`
          },
          {
            batch_id: newBatch.id,
            movement_type: "produção",
            quantity: -qty,
            reference_type: "pedido",
            reference_id: reservation.order_id,
            notes: `Consumo por override manual no pedido ID ${reservation.order_id}`
          }
        ]);

      // Timeline
      await supabase
        .from("order_timeline")
        .insert([{
          order_id: reservation.order_id,
          action: "override_lote",
          description: `Alocação manual de estoque alterada do lote ${oldBatch.batch_code} para ${newBatch.batch_code}.`
        }]);

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["stock_reservations"] });
    }
  });
}
