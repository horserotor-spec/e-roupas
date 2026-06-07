const fs = require('fs');

function ensureImport(path) {
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('formatCurrency(') && !content.includes('import { formatCurrency }')) {
    // Add import after the first import line
    content = content.replace(/import [^\n]+\n/, match => match + 'import { formatCurrency } from "@/lib/utils";\n');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Added import to', path);
  }
}

const files = [
  'src/routes/_authenticated.pedidos.novo.tsx',
  'src/routes/_authenticated.pedidos.index.tsx',
  'src/routes/_authenticated.relatorios.tsx',
  'src/routes/_authenticated.pedidos.$id.tsx',
  'src/routes/_authenticated.orcamentos.$id.tsx',
  'src/routes/_authenticated.pedidos.$orderId.tsx'
];

files.forEach(f => {
  ensureImport(f);
});
