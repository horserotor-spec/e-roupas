const fs = require('fs');
const path = 'src/lib/api/orders.ts';
let content = fs.readFileSync(path, 'utf8');

// Correção 1: Apagar order_payments do payload em useUpdateOrder
content = content.replace(
  /delete \(orderData as any\)\.users;/g,
  'delete (orderData as any).users;\n      delete (orderData as any).order_payments;\n      delete (orderData as any).created_at;'
);

// Correção 2: Corrigir commission_percent para commission_rate em useUpdateOrder
content = content.replace(
  /const { data: seller } = await supabase\.from\("clients"\)\.select\("commission_percent"\)\.eq\("id", orderData\.salesperson_id\)\.single\(\);/g,
  'const { data: seller } = await supabase.from("clients").select("commission_rate").eq("id", orderData.salesperson_id).single();'
);

content = content.replace(
  /if \(seller && seller\.commission_percent\) {/g,
  'if (seller && seller.commission_rate) {'
);

content = content.replace(
  /commissionValue = \(Number\(orderData\.final_total \|\| 0\) \* Number\(seller\.commission_percent\)\) \/ 100;/g,
  'commissionValue = (Number(orderData.final_total || 0) * Number(seller.commission_rate)) / 100;'
);

fs.writeFileSync(path, content);
console.log('Fixed useUpdateOrder');
