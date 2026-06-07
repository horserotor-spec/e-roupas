const fs = require('fs');
const path = 'src/lib/api/orders.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /status: orderData\.status \|\| "atendimento"/,
  'status: orderData.status || "confirmado"'
);

fs.writeFileSync(path, content);
console.log('Fixed default status');
