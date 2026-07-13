const fs = require('fs');
let content = fs.readFileSync('src/lib/api/inventory.ts', 'utf8');

// Also update min_stock if variant exists
content = content.replace(
  ariant = newVar;
          }
,
  ariant = newVar;
          } else {
            // Update min_stock if it changed
            if (minQty > 0 && variant.min_stock !== minQty) {
              await supabase.from("product_variants").update({ min_stock: minQty }).eq("id", variant.id);
            }
          }

);

fs.writeFileSync('src/lib/api/inventory.ts', content);
