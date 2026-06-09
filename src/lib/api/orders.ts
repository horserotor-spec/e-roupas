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
  logistics_type?: string | null;
  tracking_code?: string | null;
  shipping_label_url?: string | null;
  posting_date?: string | null;
  logistics_status?: string | null;
  delivery_name?: string | null;
  delivery_phone?: string | null;
  delivery_document?: string | null;
  delivery_zip?: string | null;
  delivery_street?: string | null;
  delivery_number?: string | null;
  delivery_complement?: string | null;
  delivery_neighborhood?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  delivery_reference?: string | null;
  package_height?: number;
  package_width?: number;
  package_length?: number;
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
        
        // NOVO FLUXO ARQUITETURAL: Tenta resolver via product_relationships (PA -> MP)
        const { data: paVariant } = await supabase
          .from("product_variations")
          .select("id")
          .eq("product_id", item.product_id)
          .eq("size", item.size)
          .maybeSingle();

        if (paVariant) {
          const { data: rel } = await supabase
            .from("product_relationships")
            .select("mp_variant_id")
            .eq("pa_variant_id", paVariant.id)
            .eq("relationship_type", "MP_PA")
            .maybeSingle();

          if (rel && rel.mp_variant_id) {
            const { data: v } = await supabase
              .from("product_variations")
              .select("id")
              .eq("id", rel.mp_variant_id)
              .eq("active", true)
              .maybeSingle();
            variant = v;
          }
        }

        // FALLBACK LEGADO: Se não encontrou relação direta, busca via características
        if (!variant) {
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
  // A baixa de estoque real ocorre de forma física unitária no fluxo de bipagem de separação anti-erro (Sprint 2.10)
  return;
}

export interface BipSeparationResult {
  success: boolean;
  message: string;
  expected?: any;
  biped?: any;
}

export async function bipSeparationItem(
  orderId: string,
  orderItemId: string,
  barcodeBipado: string,
  operatorId?: string
): Promise<BipSeparationResult> {
  // 1. Obter o item do pedido
  const { data: item, error: itemError } = await supabase
    .from("order_items")
    .select(`
      id,
      product_id,
      product_name,
      sku,
      size,
      gender,
      quantity,
      quantity_separated,
      products:product_id (
        model_id,
        fabric_id,
        color_id,
        models:model_id (name),
        fabrics:fabric_id (name, code),
        canonical_colors:color_id (name, code)
      )
    `)
    .eq("id", orderItemId)
    .single();

  if (itemError || !item) {
    return { success: false, message: "Item do pedido não encontrado." };
  }

  const prod = item.products as any;
  const expectedModel = prod?.models?.name || "";
  const expectedFabric = prod?.fabrics?.name || "";
  const expectedColor = prod?.canonical_colors?.name || "";
  const expectedSize = item.size || "";

  // Barcode esperado gerado logicamente conforme a variação da MP associada (ex: MP-REG-PEL-PTO-G)
  const fabricCode = (prod?.fabrics?.code || "GEN").toUpperCase();
  const colorCode = (prod?.canonical_colors?.code || "GEN").toUpperCase();
  const sizeCode = expectedSize.toUpperCase();
  const expectedBarcode = `MP-REG-${fabricCode}-${colorCode}-${sizeCode}`;

  // Normalizar bipagem
  const cleanBiped = barcodeBipado.trim().toUpperCase();

  // 2. Validar anti-erro
  if (cleanBiped !== expectedBarcode) {
    // Tenta identificar o que foi bipado com base na nomenclatura MP-REG-MALHA-COR-TAMANHO
    const parts = cleanBiped.split('-');
    let bipedDetails = cleanBiped;
    if (parts.length >= 5) {
      const bipedFabric = parts[2];
      const bipedColor = parts[3];
      const bipedSize = parts[4];
      bipedDetails = `Regular / Malha: ${bipedFabric} / Cor: ${bipedColor} / Tam: ${bipedSize}`;
    }

    // Registrar erro no banco
    await supabase.from("separation_errors").insert([{
      order_id: orderId,
      order_item_id: orderItemId,
      expected_barcode: expectedBarcode,
      biped_barcode: cleanBiped,
      operator_id: operatorId || null
    }]);

    return {
      success: false,
      message: "🔴 MP INCORRETO",
      expected: {
        model: expectedModel,
        fabric: expectedFabric,
        color: expectedColor,
        size: expectedSize,
        barcode: expectedBarcode
      },
      biped: {
        details: bipedDetails,
        barcode: cleanBiped
      }
    };
  }

  // 3. Se correto: Executar baixa real de estoque do lote associado a reserva
  const { data: reservations } = await supabase
    .from("stock_reservations")
    .select("id, batch_id, quantity")
    .eq("order_item_id", orderItemId)
    .limit(1);

  if (!reservations || reservations.length === 0) {
    return { success: false, message: "Nenhuma reserva de estoque encontrada para este item." };
  }

  const reservation = reservations[0];
  const qtyToConsume = 1; // 1 bip = 1 saída

  // Buscar lote
  const { data: batch } = await supabase
    .from("inventory_batches")
    .select("quantity_available, quantity_reserved")
    .eq("id", reservation.batch_id)
    .single();

  if (!batch) {
    return { success: false, message: "Lote associado à reserva não encontrado." };
  }

  // Devolver logicamente 1 unidade da reserva para o disponível porque a trigger do inventory_movements vai subtrair de tudo
  await supabase
    .from("inventory_batches")
    .update({
      quantity_available: Number(batch.quantity_available) + qtyToConsume,
      quantity_reserved: Math.max(0, Number(batch.quantity_reserved || 0) - qtyToConsume)
    })
    .eq("id", reservation.batch_id);

  // Inserir movimento de consumo (saída de estoque real)
  await supabase
    .from("inventory_movements")
    .insert([{
      batch_id: reservation.batch_id,
      movement_type: "consumo",
      quantity: -qtyToConsume,
      reference_type: "pedido",
      reference_id: orderId,
      notes: `Consumo físico unitário na separação anti-erro (Reserva ID: ${reservation.id})`
    }]);

  // Atualizar a reserva decrementando 1 unidade ou excluindo se esgotar
  const currentResQty = Number(reservation.quantity);
  if (currentResQty <= qtyToConsume) {
    await supabase.from("stock_reservations").delete().eq("id", reservation.id);
  } else {
    await supabase
      .from("stock_reservations")
      .update({ quantity: currentResQty - qtyToConsume })
      .eq("id", reservation.id);
  }

  // Incrementar quantidade separada do item
  const newSeparated = (Number(item.quantity_separated) || 0) + qtyToConsume;
  await supabase
    .from("order_items")
    .update({ quantity_separated: newSeparated })
    .eq("id", orderItemId);

  // Registrar log de separação
  await supabase.from("separation_logs").insert([{
    order_id: orderId,
    order_item_id: orderItemId,
    barcode: cleanBiped,
    quantity: qtyToConsume,
    operator_id: operatorId || null
  }]);

  // Gerar identidade única da peça (ex: ER-20260609-0042-01)
  const { data: orderData } = await supabase.from("orders").select("code").eq("id", orderId).single();
  const orderCode = orderData?.code || "ER-TEMP";
  const pieceCode = `${orderCode}-${orderItemId.substring(0, 4)}-${newSeparated}`;

  await supabase.from("piece_identities").insert([{
    piece_code: pieceCode,
    order_id: orderId,
    order_item_id: orderItemId,
    status: 'separado'
  }]);

  // Timeline
  await supabase.from("order_timeline").insert([{
    order_id: orderId,
    user_id: operatorId || null,
    event_type: "separacao_validada",
    description: `Separação validada: 1 un. de ${item.product_name} (${expectedSize}) via barcode ${cleanBiped}.`
  }]);

  return { success: true, message: "🟢 MP VALIDADO" };
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
          salesperson:clients!orders_salesperson_id_fkey(id, name, commission_percent)
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

        // Gerar Contas a Receber no Módulo Financeiro
        if (["confirmado", "aguardando_financeiro", "em_producao", "separacao", "corte", "costura", "bordado", "impressao", "expedicao"].includes(orderData.status || "")) {
          const financialTransactions = payments.map((p, idx) => {
             const pDueDate = p.due_date ? new Date(p.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
             return {
                type: 'receber',
                description: `Recebimento - Pedido ${finalCode} (Parc. ${idx + 1}/${payments.length})`,
                amount: Number(p.amount),
                original_amount: Number(p.amount),
                due_date: pDueDate,
                status: p.status || 'pendente',
                payment_method: p.payment_method || 'PIX',
                order_id: newOrder.id,
                cost_center: 'Comercial'
             };
          });
          
          await supabase.from("financial_transactions").insert(financialTransactions);
        }
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

        await supabase.from("financial_transactions").insert([{
          type: 'pagar',
          description: `Comissão de Venda - Pedido ${finalCode}`,
          amount: commissionValue,
          original_amount: commissionValue,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pendente',
          supplier_id: orderData.salesperson_id,
          order_id: newOrder.id,
          cost_center: 'Comercial',
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
        const { data: existingTx } = await supabase
          .from("financial_transactions")
          .select("*")
          .eq("order_id", id);
          
        const receivedTxDates = (existingTx || [])
          .filter(tx => tx.status === 'recebido')
          .map(tx => ({ amount: Number(tx.amount), due_date: tx.due_date, payment_date: tx.payment_date }));

        await supabase.from("financial_transactions").delete().eq("order_id", id).eq("type", "receber");
        await supabase.from("order_payments").delete().eq("order_id", id);
        
        if (payments.length > 0) {
          const paymentsWithOrderId = payments.map(p => {
            const clean = { ...p };
            delete clean.id;
            return {
              ...clean,
              order_id: id
            };
          });
          const { error: paymentsError } = await supabase
            .from("order_payments")
            .insert(paymentsWithOrderId);
          if (paymentsError) throw paymentsError;

          const orderStatus = orderData.status || data.status || "";
          if (["confirmado", "aguardando_financeiro", "em_producao", "separacao", "corte", "costura", "bordado", "impressao", "expedicao"].includes(orderStatus)) {
            const transToInsert = payments.map((p, idx) => {
              const pDueDate = p.due_date ? new Date(p.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
              const pAmount = Number(p.amount);
              const wasReceived = receivedTxDates.find(rx => rx.amount === pAmount && rx.due_date === pDueDate);
              
              return {
                type: 'receber',
                description: `Recebimento - Pedido ${data.code} (Parc. ${idx + 1}/${payments.length})`,
                amount: pAmount,
                original_amount: pAmount,
                due_date: pDueDate,
                status: wasReceived ? 'recebido' : (p.status || 'pendente'),
                payment_date: wasReceived ? wasReceived.payment_date : p.payment_date || null,
                payment_method: p.payment_method || 'PIX',
                order_id: id,
                cost_center: 'Comercial'
              };
            });
            
            await supabase.from("financial_transactions").insert(transToInsert);
          }
        }
      } else if (orderData.status !== undefined) {
        if (orderData.status === "cancelado") {
          await supabase.from("financial_transactions").update({ status: 'cancelado' }).eq("order_id", id);
        } else if (["confirmado", "aguardando_financeiro", "em_producao", "separacao", "corte", "costura", "bordado", "impressao", "expedicao"].includes(orderData.status)) {
          const { data: existingTx } = await supabase.from("financial_transactions").select("id").eq("order_id", id).eq("type", "receber");
          if (!existingTx || existingTx.length === 0) {
            const { data: currentPayments } = await supabase.from("order_payments").select("*").eq("order_id", id);
            if (currentPayments && currentPayments.length > 0) {
              const transToInsert = currentPayments.map((p, idx) => ({
                type: 'receber',
                description: `Recebimento - Pedido ${data.code} (Parc. ${idx + 1}/${currentPayments.length})`,
                amount: Number(p.amount),
                original_amount: Number(p.amount),
                due_date: p.due_date ? new Date(p.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: p.status || 'pendente',
                payment_method: p.payment_method || 'PIX',
                order_id: id,
                cost_center: 'Comercial'
              }));
              await supabase.from("financial_transactions").insert(transToInsert);
            }
          }
        }
      }

      // Handle Accounts Payable update/creation
      if (orderData.salesperson_id) {
        await supabase.from("accounts_payable").delete().eq("order_id", id);
        await supabase.from("financial_transactions").delete().eq("order_id", id).eq("type", "pagar").ilike("description", "%Comissão%");
        
        if (commissionValue > 0) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);
          
          await supabase.from("accounts_payable").insert([{
            description: `Comissão de Venda - Pedido atualizado`,
            amount: commissionValue,
            due_date: dueDate.toISOString(),
            status: 'pendente',
            supplier_id: orderData.salesperson_id,
            order_id: id,
            notes: 'Recalculado automaticamente na atualização do pedido.'
          }]);

          await supabase.from("financial_transactions").insert([{
            type: 'pagar',
            description: `Comissão de Venda - Pedido atualizado`,
            amount: commissionValue,
            original_amount: commissionValue,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pendente',
            supplier_id: orderData.salesperson_id,
            order_id: id,
            cost_center: 'Comercial',
            notes: 'Recalculado automaticamente na atualização do pedido.'
          }]);
        }
      }

      // Handle Accounts Payable for Corte and Costura Factions
      // Deletar lançamentos antigos de corte/costura para este pedido
      await supabase.from("accounts_payable").delete().eq("order_id", id).ilike("description", "%Serviço - Corte - Pedido%");
      await supabase.from("accounts_payable").delete().eq("order_id", id).ilike("description", "%Serviço - Costura - Pedido%");
      await supabase.from("financial_transactions").delete().eq("order_id", id).eq("type", "pagar").ilike("description", "%Serviço - Corte - Pedido%");
      await supabase.from("financial_transactions").delete().eq("order_id", id).eq("type", "pagar").ilike("description", "%Serviço - Costura - Pedido%");

      // Verificar se o pedido está em status de produção/Kanban para gerar as novas contas
      const isProductionStatus = ["liberado_producao", "separacao", "corte", "costura", "bordado", "impressao", "prensa", "qualidade", "expedicao", "entregue", "finalizado"].includes(data.status || "");

      // Buscar categorias de Corte e Costura
      const { data: catCorte } = await supabase.from("financial_categories").select("id").eq("name", "Corte").maybeSingle();
      const { data: catCostura } = await supabase.from("financial_categories").select("id").eq("name", "Costura").maybeSingle();
      
      const corteCategoryId = catCorte?.id || null;
      const costuraCategoryId = catCostura?.id || null;

      const orderCode = data.code;

      // Sincronizar Corte
      if (isProductionStatus && data.corte_faction && data.corte_grid && data.corte_unit_price) {
        const qtyTotal = Object.values(data.corte_grid || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
        const amount = qtyTotal * Number(data.corte_unit_price || 0);

        if (amount > 0) {
          const { data: fac } = await supabase
            .from("clients")
            .select("id, payment_terms_days, default_payment_method")
            .eq("name", data.corte_faction)
            .eq("entity_type", "fornecedor")
            .maybeSingle();

          let dueDate = new Date();
          if (data.corte_end_date) {
            dueDate = new Date(data.corte_end_date);
          } else if (fac?.payment_terms_days) {
            dueDate.setDate(dueDate.getDate() + Number(fac.payment_terms_days));
          } else {
            dueDate.setDate(dueDate.getDate() + 30);
          }

          const desc = `Serviço - Corte - Pedido ${orderCode} - Facção ${data.corte_faction}`;

          await supabase.from("accounts_payable").insert([{
            description: desc,
            amount: amount,
            due_date: dueDate.toISOString(),
            status: 'pendente',
            supplier_id: fac?.id || null,
            order_id: id,
            notes: `Gerado automaticamente com base na grade de corte do pedido.`
          }]);

          await supabase.from("financial_transactions").insert([{
            type: 'pagar',
            description: desc,
            amount: amount,
            original_amount: amount,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pendente',
            payment_method: fac?.default_payment_method || 'Boleto',
            supplier_id: fac?.id || null,
            order_id: id,
            cost_center: 'Produção',
            category_id: corteCategoryId,
            notes: `Gerado automaticamente com base na grade de corte do pedido.`
          }]);
        }
      }

      // Sincronizar Costura
      if (isProductionStatus && data.costura_faction && data.costura_grid && data.costura_unit_price) {
        const qtyTotal = Object.values(data.costura_grid || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
        const amount = qtyTotal * Number(data.costura_unit_price || 0);

        if (amount > 0) {
          const { data: fac } = await supabase
            .from("clients")
            .select("id, payment_terms_days, default_payment_method")
            .eq("name", data.costura_faction)
            .eq("entity_type", "fornecedor")
            .maybeSingle();

          let dueDate = new Date();
          if (data.costura_end_date) {
            dueDate = new Date(data.costura_end_date);
          } else if (fac?.payment_terms_days) {
            dueDate.setDate(dueDate.getDate() + Number(fac.payment_terms_days));
          } else {
            dueDate.setDate(dueDate.getDate() + 30);
          }

          const desc = `Serviço - Costura - Pedido ${orderCode} - Facção ${data.costura_faction}`;

          await supabase.from("accounts_payable").insert([{
            description: desc,
            amount: amount,
            due_date: dueDate.toISOString(),
            status: 'pendente',
            supplier_id: fac?.id || null,
            order_id: id,
            notes: `Gerado automaticamente com base na grade de costura do pedido.`
          }]);

          await supabase.from("financial_transactions").insert([{
            type: 'pagar',
            description: desc,
            amount: amount,
            original_amount: amount,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pendente',
            payment_method: fac?.default_payment_method || 'Boleto',
            supplier_id: fac?.id || null,
            order_id: id,
            cost_center: 'Produção',
            category_id: costuraCategoryId,
            notes: `Gerado automaticamente com base na grade de costura do pedido.`
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
