const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/supabase/schema.sql', 'utf8');

const tableRegex = /CREATE TABLE (?:IF NOT EXISTS )?([\w.]+)\s*\(([\s\S]*?)\);/g;
let match;
while ((match = tableRegex.exec(content)) !== null) {
  const tableName = match[1];
  if (['public.products', 'public.product_variations', 'public.product_variants', 'public.inventory_batches', 'public.fabrics', 'public.product_models'].includes(tableName)) {
    console.log(`--- ${tableName} ---`);
    console.log(match[0]);
  }
}
