import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, sku, technical_name, color_id, format
    `)
    .limit(10);

  if (error) {
    console.error("DB ERROR:", error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log("No products found.");
    return;
  }

  // Find colors separately
  const colorIds = data.map(p => p.color_id).filter(Boolean);
  let colors = [];
  if (colorIds.length > 0) {
      const { data: colorData } = await supabase.from('canonical_colors').select('id, name').in('id', colorIds);
      colors = colorData || [];
  }

  const enriched = data.map(p => {
    return {
      ...p,
      colorName: colors.find(c => c.id === p.color_id)?.name
    };
  });

  console.log(JSON.stringify(enriched, null, 2));
}
check();
