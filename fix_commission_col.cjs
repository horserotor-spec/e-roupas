const fs = require('fs');
const path = 'src/lib/api/orders.ts';
let content = fs.readFileSync(path, 'utf8');

// Correção em useCreateOrder
content = content.replace(
  /const { data: salesperson } = await supabase\.from\('clients'\)\.select\('commission_rate'\)\.eq\('id', orderData\.salesperson_id\)\.single\(\);/g,
  'const { data: salesperson } = await supabase.from("clients").select("*").eq("id", orderData.salesperson_id).single();'
);
content = content.replace(
  /if \(salesperson && salesperson\.commission_rate\) {/g,
  'const rate = salesperson?.commission_rate || salesperson?.commission_percent || 0;\n        if (rate > 0) {'
);
content = content.replace(
  /commissionValue = Number\(orderData\.final_total \|\| 0\) \* \(salesperson\.commission_rate \/ 100\);/g,
  'commissionValue = Number(orderData.final_total || 0) * (rate / 100);'
);

// Correção em useUpdateOrder
content = content.replace(
  /const { data: seller } = await supabase\.from\("clients"\)\.select\("commission_rate"\)\.eq\("id", orderData\.salesperson_id\)\.single\(\);/g,
  'const { data: seller } = await supabase.from("clients").select("*").eq("id", orderData.salesperson_id).single();'
);
content = content.replace(
  /if \(seller && seller\.commission_rate\) {/g,
  'const rate = seller?.commission_rate || seller?.commission_percent || 0;\n        if (rate > 0) {'
);
content = content.replace(
  /commissionValue = \(Number\(orderData\.final_total \|\| 0\) \* Number\(seller\.commission_rate\)\) \/ 100;/g,
  'commissionValue = (Number(orderData.final_total || 0) * Number(rate)) / 100;'
);

fs.writeFileSync(path, content);
console.log('Fixed commission calculation in orders.ts');
