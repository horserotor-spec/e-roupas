import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugAllocation() {
  const orderId = "c894c2dc-30ce-43d9-95cb-64bc1df9a0a0"; // I need the actual order ID.
  // Let's just find the first order that is "separacao" or "confirmado".
  const { data: orders } = await supabase.from('orders').select('id, code, client_name').in('status', ['separacao', 'confirmado', 'em_producao']).limit(10);
  
  if (!orders || orders.length === 0) {
    console.log("No orders found due to RLS.");
    return;
  }
  
  for (const o of orders) {
    console.log(`\n\n--- DEBUGGING ORDER: ${o.code} (${o.client_name}) ---`);
    const { data: items } = await supabase.from('order_items').select('*, products(model_id, fabric_id, color_id)').eq('order_id', o.id);
    if (!items) continue;
    
    for (const item of items) {
      console.log(`\nItem: ${item.sku} | Tamanho: ${item.size} | Qty: ${item.quantity}`);
      const prod = item.products;
      if (!prod || !prod.model_id || !prod.fabric_id || !prod.color_id) {
        console.log("  -> PA não possui model_id, fabric_id, color_id.");
        continue;
      }
      
      console.log(`  -> Buscando MP com model_id=${prod.model_id}, fabric_id=${prod.fabric_id}, color_id=${prod.color_id}`);
      
      const { data: mainMp, error: errMp } = await supabase
        .from("products")
        .select("id, name, sku")
        .eq("format", "MP")
        .eq("model_id", prod.model_id)
        .eq("fabric_id", prod.fabric_id)
        .eq("color_id", prod.color_id)
        .eq("active", true)
        .maybeSingle();
        
      if (!mainMp) {
        console.log("  -> [FALHA] MP Pai NÃO ENCONTRADO para estas propriedades!");
        if (errMp) console.error("     Erro:", errMp);
        continue;
      }
      console.log(`  -> MP Pai Encontrado: ${mainMp.name} (SKU: ${mainMp.sku}) [ID: ${mainMp.id}]`);
      
      const { data: variant, error: errVar } = await supabase
        .from("product_variants")
        .select("id, sku_internal")
        .eq("product_id", mainMp.id)
        .eq("size", item.size)
        .eq("active", true)
        .maybeSingle();
        
      if (!variant) {
        console.log(`  -> [FALHA] Variante MP NÃO ENCONTRADA para o tamanho ${item.size}!`);
        if (errVar) console.error("     Erro:", errVar);
        continue;
      }
      console.log(`  -> Variante Encontrada: SKU Interno = ${variant.sku_internal} [ID: ${variant.id}]`);
      
      const { data: batches } = await supabase
        .from("inventory_batches")
        .select("id, quantity_available")
        .eq("product_variant_id", variant.id)
        .eq("active", true)
        .gt("quantity_available", 0);
        
      if (!batches || batches.length === 0) {
        console.log(`  -> [FALHA] Nenhum LOTE com saldo disponível (>0) encontrado para esta variante!`);
        continue;
      }
      
      let sum = batches.reduce((a, b) => a + Number(b.quantity_available), 0);
      console.log(`  -> Lotes encontrados: ${batches.length}. Saldo Total Disponível: ${sum}`);
    }
  }
}

debugAllocation();
