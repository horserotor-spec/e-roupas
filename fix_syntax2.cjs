const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Fix duplicate 'clients' variable declaration
  content = content.replace(/const \{ data: clients \} = useClients\(\);\s+const \{ data: clients \} = useClients\(\);/g, 'const { data: clients } = useClients();');
  // It could be separated by other code:
  // Instead of complex regex, let's just rename the second one:
  content = content.replace(/const \{ data: suppliers \} = useSuppliers\(\);\s*const \{ data: clients \} = useClients\(\);\s*const carriers = \(clients/g, 'const { data: suppliers } = useSuppliers();\n  const carriers = (clients');

  // Also remove ALL occurrences of `.toLocaleString("pt-BR", ...)` inside formatCurrency
  // The safest way is to just wipe `.toLocaleString("pt-BR", { minimumFractionDigits: 2 })` 
  // and even malformed ones `.toLocaleString("pt-BR", { minimumFractionDigits: 2 )})`
  // We'll just strip out anything from `.toLocaleString` to the closing `)` before `}`
  content = content.replace(/\.toLocaleString\("pt-BR"[^\}]*\}\)/g, '');
  content = content.replace(/\.toLocaleString\("pt-BR"[^\)]*\)\)/g, '');
  // Specifically for `2 )})`
  content = content.replace(/\.toLocaleString\("pt-BR"[^\)]*\)\)\}/g, '}');
  
  // Just clean up any left-over malformed strings
  content = content.replace(/formatCurrency\(([^)]+)\.toLocaleString\("pt-BR"[^)]*\)\)\s*\}/g, 'formatCurrency($1)}');
  content = content.replace(/formatCurrency\(\(([^)]+)\)\.toLocaleString\("pt-BR"[^)]*\)\)\s*\}/g, 'formatCurrency($1)}');

  // Let's do a more robust regex:
  content = content.replace(/\.toLocaleString\([^)]+\)/g, '');
  content = content.replace(/\{ minimumFractionDigits: 2 \)\}\)/g, '');
  content = content.replace(/\{minimumFractionDigits:2\)\}\)/g, '');
  content = content.replace(/\{ minimumFractionDigits: 2 \)/g, '');
  content = content.replace(/\{minimumFractionDigits:2\)/g, '');
  content = content.replace(/pt-BR",/g, '');

  fs.writeFileSync(path, content, 'utf8');
}

const files = [
  'src/routes/_authenticated.orcamentos.$id.tsx',
  'src/routes/_authenticated.pedidos.$id.tsx',
  'src/routes/_authenticated.pedidos.$orderId.tsx',
  'src/routes/_authenticated.pedidos.novo.tsx',
  'src/components/pedidos/DrawerPedido.tsx'
];

files.forEach(f => {
  processFile(f);
  console.log('Fixed', f);
});
