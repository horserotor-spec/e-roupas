const fs = require('fs');

function ensureImport(path) {
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('formatCurrency') && !content.includes('import { formatCurrency }')) {
    // For normal files starting with imports
    content = content.replace(/import [^\n]+\n/, match => match + 'import { formatCurrency } from "@/lib/utils";\n');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Added import to', path);
  }
}

const files = [
  'src/components/pedidos/DrawerPedido.tsx',
  'src/routes/_authenticated.crm.$clientId.tsx',
  'src/routes/_authenticated.crm.index.tsx',
  'src/routes/_authenticated.dashboard.tsx',
  'src/routes/_authenticated.financeiro.tsx',
  'src/routes/_authenticated.orcamentos.novo.tsx'
];

files.forEach(f => {
  ensureImport(f);
});
