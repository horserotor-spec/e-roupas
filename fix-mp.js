import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];

async function run() {
  console.log("Buscando MPs...");
  // Já que RLS pode bloquear, vamos buscar via PA? Não, "format='MP'" não bloqueia product_variants mas bloqueia products?
  // Vamos tentar buscar todos os products onde format='MP'.
  const { data: mps, error } = await supabase.from('products').select('id, name, sku').eq('format', 'MP');
  
  if (error || !mps || mps.length === 0) {
    console.log("Erro ou zero MPs retornados. Usando bypass...");
    // Bypass: buscar Mps através de order_items? Ou buscar todos os products que tem model, fabric, color?
    // Se a API restrita falhar, não consigo consertar via Node. 
    // Wait, eu posso criar uma mutation temporária no front pra fazer isso? 
  }
  
  if (mps && mps.length > 0) {
    for (const mp of mps) {
      console.log(`Verificando MP: ${mp.name} (${mp.id})`);
      for (const size of SIZES) {
        // Verifica se a variante existe
        const { data: existing } = await supabase.from('product_variants').select('id').eq('product_id', mp.id).eq('size', size).maybeSingle();
        let variantId = existing?.id;
        
        if (!variantId) {
           const { data: newVar } = await supabase.from('product_variants').insert([{
             product_id: mp.id,
             size: size,
             sku: `${mp.sku}-${size}`,
             active: true
           }]).select('id').single();
           if (newVar) variantId = newVar.id;
        }
        
        if (variantId) {
           // Verifica lote
           const { data: batch } = await supabase.from('inventory_batches').select('id').eq('product_variant_id', variantId).maybeSingle();
           if (!batch) {
             await supabase.from('inventory_batches').insert([{
               product_variant_id: variantId,
               quantity_available: 20,
               active: true,
               batch_number: 'LOTE-FIX-MP'
             }]);
           } else {
             await supabase.from('inventory_batches').update({ quantity_available: 20 }).eq('id', batch.id);
           }
        }
      }
    }
    console.log("Variantes e lotes de MP criados/atualizados com sucesso!");
  } else {
    console.log("Não foi possível buscar as MPs via Anon Key devido ao RLS.");
  }
}
run();
