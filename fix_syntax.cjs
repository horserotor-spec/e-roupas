const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Fix 1: formatCurrency(X.toLocaleString("pt-BR", {minimumFractionDigits:2)}
  // Because my previous regex broke the closing brace `}` -> `)`
  // The bad string looks like: formatCurrency(finalTotal.toLocaleString("pt-BR", {minimumFractionDigits:2)})
  // Or: formatCurrency(finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 )})
  
  // We want to just extract the first argument and remove the toLocaleString entirely.
  // formatCurrency(X.toLocaleString(...)} -> formatCurrency(X)}
  
  content = content.replace(/formatCurrency\(([^.]+)\.toLocaleString\([^)]+\)\s*\}/g, 'formatCurrency($1)');
  
  // What if it is: formatCurrency((freight + otherExpenses).toLocaleString("pt-BR", {minimumFractionDigits:2)})}
  content = content.replace(/formatCurrency\(\(([^)]+)\)\.toLocaleString\([^)]+\)\s*\}/g, 'formatCurrency($1)');
  
  // What about the specific ones found:
  // {formatCurrency(finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 )})}
  content = content.replace(/\{formatCurrency\((.*?)\.toLocaleString\("pt-BR"[^)]*\)?\}\)/g, '{formatCurrency($1)}');

  // Fix for: {formatCurrency((freight + otherExpenses).toLocaleString("pt-BR", {minimumFractionDigits:2)})}
  content = content.replace(/\{formatCurrency\(\((.*?)\)\.toLocaleString\("pt-BR"[^)]*\)?\}\)/g, '{formatCurrency($1)}');

  // Another specific fix just to be safe for all files:
  content = content.replace(/\.toLocaleString\("pt-BR",\s*\{\s*minimumFractionDigits:\s*2\s*\)/g, '');
  content = content.replace(/\.toLocaleString\("pt-BR",\s*\{minimumFractionDigits:2\)/g, '');

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
