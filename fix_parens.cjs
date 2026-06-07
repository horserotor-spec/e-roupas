const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Fix `{formatCurrency(itemsTotalNet))}` -> `{formatCurrency(itemsTotalNet)}`
  // We want to replace `))}` with `)}` ONLY if it matches the formatCurrency pattern
  content = content.replace(/\{formatCurrency\(([^)]+)\)\)\}/g, '{formatCurrency($1)}');
  
  // Fix `{formatCurrency((freight + otherExpenses)))}` -> `{formatCurrency(freight + otherExpenses)}`
  content = content.replace(/\{formatCurrency\(\(([^)]+)\)\)\)\}/g, '{formatCurrency($1)}');
  
  // Actually, sometimes it's `(freight + otherExpenses)` inside `formatCurrency`.
  // So `{formatCurrency((freight + otherExpenses))}` is valid!
  // But my regex replaced it into `)))}`. Let's be careful.
  content = content.replace(/\{formatCurrency\(([^}]+)\)\)\}/g, '{formatCurrency($1)}');
  content = content.replace(/\{formatCurrency\(\(([^}]+)\)\)\)\}/g, '{formatCurrency($1)}');

  // Let's just do a clean sweep for all these files:
  content = content.replace(/\{formatCurrency\(([^}]+?)\)\)\}/g, '{formatCurrency($1)}');
  content = content.replace(/\{formatCurrency\(\(([^}]+?)\)\)\)\}/g, '{formatCurrency($1)}');
  
  fs.writeFileSync(path, content, 'utf8');
}

const files = [
  'src/routes/_authenticated.orcamentos.$id.tsx',
  'src/routes/_authenticated.pedidos.$id.tsx',
  'src/routes/_authenticated.pedidos.$orderId.tsx',
  'src/components/pedidos/DrawerPedido.tsx'
];

files.forEach(f => {
  processFile(f);
  console.log('Fixed', f);
});
