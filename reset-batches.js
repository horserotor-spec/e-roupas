import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Buscando variantes...");
  const { data: variants, error: errV } = await supabase.from('product_variants').select('id');
  if (errV) return console.error(errV);

  console.log("Buscando lotes existentes...");
  const { data: batches, error: errB } = await supabase.from('inventory_batches').select('id, product_variant_id');
  if (errB) return console.error(errB);

  const variantHasBatch = new Set(batches.map(b => b.product_variant_id));
  const newBatches = [];

  for (const v of variants) {
    if (!variantHasBatch.has(v.id)) {
      newBatches.push({
        product_variant_id: v.id,
        quantity_available: 20,
        active: true,
        batch_number: 'LOTE-FIX',
        unit_cost: 0
      });
    }
  }

  if (newBatches.length > 0) {
    console.log(`Inserindo ${newBatches.length} novos lotes para variantes zeradas...`);
    // Supabase REST limite é ~1000 rows, quebrando se for o caso
    const { error: errIns } = await supabase.from('inventory_batches').insert(newBatches);
    if (errIns) console.error("Erro inserindo lotes:", errIns);
  }

  console.log("Atualizando lotes existentes para 20...");
  const { error: errUp } = await supabase.from('inventory_batches').update({ quantity_available: 20 }).neq('id', '00000000-0000-0000-0000-000000000000');
  if (errUp) console.error("Erro atualizando lotes:", errUp);

  console.log("Feito! Todas as variantes agora possuem 20 unidades.");
}

run();
