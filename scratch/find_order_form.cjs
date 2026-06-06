const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/src/routes/_authenticated.pedidos.novo.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('client') || line.toLowerCase().includes('status') || line.toLowerCase().includes('salvar') || line.toLowerCase().includes('toggle') || line.toLowerCase().includes('switch')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
