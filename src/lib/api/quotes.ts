import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { QuoteStatus } from "../constants";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface QuoteItem {
  id?: string;
  quote_id?: string;
  product_id?: string | null;
  product_name: string;
  sku?: string | null;
  quantity: number;
  unit_cost?: number;
  list_price?: number;
  discount_percent?: number;
  unit_price?: number;
  customizations?: any[];
  notes?: string;
}

export interface Quote {
  id: string;
  code: string;
  client_id: string;
  brand_id: string | null;
  seller_id: string | null;
  status: QuoteStatus;

  estimated_total: number;
  total_cost: number;
  discount: number;
  other_expenses: number;
  freight_cost: number;
  final_total: number;
  gross_margin_pct: number;

  converted_order_id: string | null;
  converted_at: string | null;

  validity_days: number;
  notes: string | null;
  internal_notes: string | null;
  payment_condition: string | null;
  payment_method: string | null;

  active: boolean;
  created_at: string;
  updated_at: string;

  // Included relations for UI
  client_name?: string;
  brand_code?: string;
  seller_name?: string;
  items?: QuoteItem[];
}

export type QuotePayload = Partial<Quote> & { client_id: string; items?: QuoteItem[] };

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export function useQuotes(search?: string) {
  return useQuery({
    queryKey: ["quotes", search],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          clients!inner(id, name),
          brands(id, code, name),
          users:seller_id(id, name),
          quote_items(*)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`code.ilike.%${search}%,clients.name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((q: any) => ({
        ...q,
        status: q.status as QuoteStatus,
        client_name: q.clients?.name || "Sem Cliente",
        brand_code: q.brands?.code || "GEN",
        seller_name: q.users?.name || "",
        items: q.quote_items || [],
        final_total: Number(q.final_total),
        total_cost: Number(q.total_cost),
        gross_margin_pct: Number(q.gross_margin_pct),
      })) as Quote[];
    },
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          clients!inner(id, name, company_name, phone, email),
          brands(id, code, name),
          users:seller_id(id, name),
          quote_items(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        status: data.status as QuoteStatus,
        client_name: data.clients?.name || "Sem Cliente",
        brand_code: data.brands?.code || "GEN",
        seller_name: data.users?.name || "",
        items: data.quote_items || [],
        final_total: Number(data.final_total),
        total_cost: Number(data.total_cost),
        gross_margin_pct: Number(data.gross_margin_pct),
      } as Quote & { clients: any; brands: any };
    },
    enabled: !!id,
  });
}

async function generateQuoteCode(brandId?: string | null): Promise<string> {
  let brandCode = "GEN";
  if (brandId) {
    const { data: brand } = await supabase.from("brands").select("code").eq("id", brandId).single();
    if (brand?.code) brandCode = brand.code;
  }
  const date = new Date();
  const dateStr = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  const seq = String((count || 0) + 1).padStart(4, '0');
  return `ORC-${brandCode}-${dateStr}-${seq}`;
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: QuotePayload) => {
      const { items, ...quoteData } = payload;

      // Sanitize
      delete (quoteData as any).quote_items;
      delete (quoteData as any).clients;
      delete (quoteData as any).brands;
      delete (quoteData as any).users;
      delete (quoteData as any).client_name;
      delete (quoteData as any).brand_code;
      delete (quoteData as any).seller_name;

      const code = await generateQuoteCode(quoteData.brand_id);

      const { data: newQuote, error } = await supabase
        .from("quotes")
        .insert([{
          ...quoteData,
          code,
          status: quoteData.status || "rascunho",
        }])
        .select()
        .single();

      if (error) throw error;

      if (items && items.length > 0) {
        const itemsToInsert = items.map(item => {
          const { id, quote_id, ...rest } = item as any;
          return { ...rest, quote_id: newQuote.id };
        });

        const { error: itemsError } = await supabase.from("quote_items").insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      return newQuote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string } & Partial<QuotePayload>) => {
      const { items, id, ...quoteData } = payload;

      // Sanitize
      delete (quoteData as any).quote_items;
      delete (quoteData as any).clients;
      delete (quoteData as any).brands;
      delete (quoteData as any).users;
      delete (quoteData as any).client_name;
      delete (quoteData as any).brand_code;
      delete (quoteData as any).seller_name;

      const { data, error } = await supabase
        .from("quotes")
        .update({ ...quoteData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (items !== undefined) {
        await supabase.from("quote_items").delete().eq("quote_id", id);

        if (items.length > 0) {
          const itemsToInsert = items.map(item => {
            const { id: itemId, quote_id, ...rest } = item as any;
            return { ...rest, quote_id: id };
          });
          const { error: itemsError } = await supabase.from("quote_items").insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}

export function useConvertQuoteToOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ quoteId, asProduction }: { quoteId: string; asProduction?: boolean }) => {
      // 1. Fetch full quote
      const { data: quote, error: qErr } = await supabase
        .from("quotes")
        .select("*, quote_items(*)")
        .eq("id", quoteId)
        .single();

      if (qErr) throw qErr;

      // 2. Get brand code for order code
      let brandCode = "GEN";
      if (quote.brand_id) {
        const { data: brand } = await supabase.from("brands").select("code").eq("id", quote.brand_id).single();
        if (brand?.code) brandCode = brand.code;
      }

      // 3. Generate order code
      const date = new Date();
      const dateStr = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count } = await supabase.from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());
      const seq = String((count || 0) + 1).padStart(4, '0');
      const orderCode = `${brandCode}-${dateStr}-${seq}`;

      // 4. Create order
      const { data: newOrder, error: oErr } = await supabase
        .from("orders")
        .insert([{
          code: orderCode,
          client_id: quote.client_id,
          brand_id: quote.brand_id,
          seller_id: quote.seller_id,
          status: asProduction ? "liberado_producao" : "atendimento",
          discount: quote.discount,
          other_expenses: quote.other_expenses,
          freight_cost: quote.freight_cost,
          estimated_total: quote.estimated_total,
          final_total: quote.final_total,
          payment_condition: quote.payment_condition,
          payment_method: quote.payment_method,
          notes: quote.notes,
          internal_notes: quote.internal_notes,
        }])
        .select()
        .single();

      if (oErr) throw oErr;

      // 5. Copy items
      if (quote.quote_items && quote.quote_items.length > 0) {
        const orderItems = quote.quote_items.map((qi: any) => ({
          order_id: newOrder.id,
          product_id: qi.product_id || null,
          product_name: qi.product_name,
          sku: qi.sku,
          quantity: qi.quantity,
          unit_cost: qi.unit_cost,
          list_price: qi.list_price,
          discount_percent: qi.discount_percent,
          unit_price: qi.unit_price,
          customizations: qi.customizations,
          notes: qi.notes,
        }));

        const { error: iiErr } = await supabase.from("order_items").insert(orderItems);
        if (iiErr) throw iiErr;
      }

      // 6. Update quote status and traceability
      const newStatus = asProduction ? "convertido_producao" : "convertido_pedido";
      await supabase.from("quotes").update({
        status: newStatus,
        converted_order_id: newOrder.id,
        converted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", quoteId);

      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCloneQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quoteId: string) => {
      const { data: original, error: qErr } = await supabase
        .from("quotes")
        .select("*, quote_items(*)")
        .eq("id", quoteId)
        .single();

      if (qErr) throw qErr;

      const code = await generateQuoteCode(original.brand_id);

      const { data: clone, error: cErr } = await supabase
        .from("quotes")
        .insert([{
          code,
          client_id: original.client_id,
          brand_id: original.brand_id,
          seller_id: original.seller_id,
          status: "rascunho",
          estimated_total: original.estimated_total,
          total_cost: original.total_cost,
          discount: original.discount,
          other_expenses: original.other_expenses,
          freight_cost: original.freight_cost,
          final_total: original.final_total,
          gross_margin_pct: original.gross_margin_pct,
          validity_days: original.validity_days,
          notes: original.notes,
          internal_notes: original.internal_notes,
          payment_condition: original.payment_condition,
          payment_method: original.payment_method,
        }])
        .select()
        .single();

      if (cErr) throw cErr;

      if (original.quote_items && original.quote_items.length > 0) {
        const clonedItems = original.quote_items.map((qi: any) => ({
          quote_id: clone.id,
          product_id: qi.product_id,
          product_name: qi.product_name,
          sku: qi.sku,
          quantity: qi.quantity,
          unit_cost: qi.unit_cost,
          list_price: qi.list_price,
          discount_percent: qi.discount_percent,
          unit_price: qi.unit_price,
          customizations: qi.customizations,
          notes: qi.notes,
        }));

        await supabase.from("quote_items").insert(clonedItems);
      }

      return clone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}

// ----------------------------------------------------------------------
// KPIs
// ----------------------------------------------------------------------

export function useQuoteKPIs() {
  return useQuery({
    queryKey: ["quote_kpis"],
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from("quotes")
        .select("id, status, final_total, total_cost, gross_margin_pct, created_at, converted_at")
        .eq("active", true);

      if (error) throw error;

      const all = quotes || [];
      const total = all.length;
      const open = all.filter(q => ["rascunho", "enviado", "negociacao"].includes(q.status));
      const converted = all.filter(q => ["convertido_pedido", "convertido_producao"].includes(q.status));
      const approved = all.filter(q => q.status === "aprovado");

      const openTotal = open.reduce((acc, q) => acc + Number(q.final_total || 0), 0);
      const conversionRate = total > 0 ? ((converted.length + approved.length) / total) * 100 : 0;

      const marginValues = all
        .filter(q => Number(q.gross_margin_pct) !== 0)
        .map(q => Number(q.gross_margin_pct));
      const avgMargin = marginValues.length > 0
        ? marginValues.reduce((a, b) => a + b, 0) / marginValues.length
        : 0;

      // Average closing time (days between creation and conversion)
      const closingTimes = converted
        .filter(q => q.converted_at)
        .map(q => {
          const created = new Date(q.created_at).getTime();
          const conv = new Date(q.converted_at!).getTime();
          return (conv - created) / (1000 * 60 * 60 * 24);
        });
      const avgClosingDays = closingTimes.length > 0
        ? closingTimes.reduce((a, b) => a + b, 0) / closingTimes.length
        : 0;

      return {
        totalOpen: open.length,
        openTotal,
        conversionRate,
        avgMargin,
        avgClosingDays,
        totalQuotes: total,
        totalConverted: converted.length,
      };
    },
  });
}
