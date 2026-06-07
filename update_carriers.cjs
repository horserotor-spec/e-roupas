const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Add import for useClients
  if (!content.includes('import { useClients }')) {
    content = content.replace(
      /import \{ useSuppliers \} from "@\/lib\/api\/inventory";/,
      'import { useSuppliers } from "@/lib/api/inventory";\nimport { useClients } from "@/lib/api/clients";'
    );
  }

  // Add hook for carriers
  if (!content.includes('const carriers =')) {
    content = content.replace(
      /const \{ data: suppliers \} = useSuppliers\(\);/,
      'const { data: suppliers } = useSuppliers();\n  const { data: clients } = useClients();\n  const carriers = (clients || []).filter(c => c.entity_type === "transportadora");'
    );
  }

  // Update Combobox to use carriers
  content = content.replace(
    /items=\{\(suppliers \|\| \[\]\)\.map\(s => \(\{ id: s\.name, name: s\.name \}\)\)\}\s+value=\{formData\.carrier_name \|\| ""\}\s+onChange=\{\(v\) => setFormData\(\{ \.\.\.formData, carrier_name: v \}\)\}\s+placeholder="Selecione um transportador"/,
    'items={carriers.map(c => ({ id: c.name, name: c.name }))}\n                value={formData.carrier_name || ""}\n                onChange={(v) => setFormData({ ...formData, carrier_name: v })}\n                placeholder="Selecione um transportador"'
  );

  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated', path);
}

processFile('src/routes/_authenticated.pedidos.novo.tsx');
processFile('src/routes/_authenticated.pedidos.$id.tsx');
