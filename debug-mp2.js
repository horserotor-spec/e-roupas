import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Buscando variantes...");
  const { data: variants, error } = await supabase.from('product_variants').select('*, products!inner(format, name)').eq('products.format', 'MP');
  if (error) {
     console.log("Erro:", error);
     return;
  }
  console.log("Total de variantes MP:", variants?.length);
  if (variants && variants.length > 0) {
    console.log("Exemplo de tamanhos das variantes de MP:", [...new Set(variants.map(v => v.size))].join(', '));
  }
  
  console.log("E os Lotes dessas variantes?");
  const { data: batches } = await supabase.from('inventory_batches').select('quantity_available, product_variants!inner(size, products!inner(format))').eq('product_variants.products.format', 'MP');
  console.log("Lotes de MP:", batches?.length);
}
run();
