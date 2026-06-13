import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Buscando order_items para descobrir o que está faltando...");
  
  // Buscar um pedido pra ver o que ele tá tentando alocar
  const { data: orders } = await supabase.from('orders').select('id, code, status').in('status', ['confirmado', 'separacao', 'em_producao']).limit(5);
  console.log("Pedidos:", orders.map(o => o.code));

  for (const o of orders) {
    const { data: items } = await supabase.from('order_items').select('*, products(model_id, fabric_id, color_id, format)').eq('order_id', o.id);
    for (const item of items) {
       console.log(`Item: ${item.product_name} Size: ${item.size}`);
       if (item.products?.model_id) {
         const { data: mainMp } = await supabase
            .from("products")
            .select("id, name, format")
            .eq("format", "MP")
            .eq("model_id", item.products.model_id)
            .eq("fabric_id", item.products.fabric_id)
            .eq("color_id", item.products.color_id)
            .maybeSingle();
         
         if (mainMp) {
           console.log(`  Encontrou MP: ${mainMp.name} (ID: ${mainMp.id})`);
           const { data: vars } = await supabase.from('product_variants').select('id, size, sku').eq('product_id', mainMp.id);
           console.log(`  Variantes MP cadastradas:`, vars.map(v => v.size).join(', '));
         } else {
           console.log(`  NÃO encontrou MP para as caracteristicas!`);
         }
       }
    }
  }
}

run();
