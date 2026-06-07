const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$id.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = 'const { data: clients } = useClients();';
const replacement = target + '\n  const carriers = (clients || []).filter((c: any) => c.entity_type === "transportadora");';

if (content.includes(target) && !content.includes('const carriers =')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed carriers variable!');
} else {
  console.log('Target not found or already fixed.');
}
