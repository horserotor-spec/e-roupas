const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/src/routes/_authenticated.pedidos.$orderId.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('order.client') || line.toLowerCase().includes('order.brand') || line.toLowerCase().includes('vendedor') || line.toLowerCase().includes('venda')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
