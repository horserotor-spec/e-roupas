const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/src/lib/api/orders.ts', 'utf8');

// Vamos ver as linhas que contêm 'fifo' ou 'inventory_batches' ou 'stock'
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('fifo') || line.toLowerCase().includes('batch') || line.toLowerCase().includes('reserve')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
