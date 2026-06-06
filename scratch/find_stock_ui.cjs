const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/src/routes/_authenticated.estoque.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('entrada') || line.toLowerCase().includes('lote') || line.toLowerCase().includes('drawer') || line.toLowerCase().includes('dialog')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
