const fs = require('fs');

const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/supabase/schema.sql', 'utf8');

function showTable(tableName) {
  const regex = new RegExp(`CREATE TABLE (?:IF NOT EXISTS )?public\\.${tableName}\\s*\\(([\\s\S]*?)\\);`, 'g');
  const match = regex.exec(content);
  if (match) {
    console.log(`--- TABLE ${tableName} ---`);
    console.log(match[0]);
  } else {
    console.log(`Table ${tableName} not found.`);
  }
}

showTable('products');
showTable('product_variations');
showTable('product_variants');
showTable('inventory_batches');
