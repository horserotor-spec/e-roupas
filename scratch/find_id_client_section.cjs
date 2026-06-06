const fs = require('fs');
const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/src/routes/_authenticated.pedidos.$id.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('cliente') || line.toLowerCase().includes('client_id')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
