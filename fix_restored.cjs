const fs = require('fs');

// Fix DrawerPedido.tsx
let drawer = fs.readFileSync('src/components/pedidos/DrawerPedido.tsx', 'utf8');
drawer = drawer.replace('{formatCurrency(order.final_total)}}', '{formatCurrency(order.final_total)}');
fs.writeFileSync('src/components/pedidos/DrawerPedido.tsx', drawer, 'utf8');

// Apply Carriers fix to _authenticated.pedidos.$id.tsx again
let pid = fs.readFileSync('src/routes/_authenticated.pedidos.$id.tsx', 'utf8');
if (!pid.includes('import { useClients')) {
  pid = pid.replace(
    /import \{ useSuppliers \} from "@\/lib\/api\/inventory";/,
    'import { useSuppliers } from "@/lib/api/inventory";\nimport { useClients } from "@/lib/api/clients";'
  );
}
if (!pid.includes('const carriers =')) {
  pid = pid.replace(
    /const \{ data: suppliers \} = useSuppliers\(\);/,
    'const { data: suppliers } = useSuppliers();\n  const { data: clients } = useClients();\n  const carriers = (clients || []).filter(c => c.entity_type === "transportadora");'
  );
}
pid = pid.replace(
  /items=\{\(suppliers \|\| \[\]\)\.map\(s => \(\{ id: s\.name, name: s\.name \}\)\)\}\s+value=\{formData\.carrier_name \|\| ""\}\s+onChange=\{\(v\) => setFormData\(\{ \.\.\.formData, carrier_name: v \}\)\}\s+placeholder="Selecione um transportador"/,
  'items={carriers.map(c => ({ id: c.name, name: c.name }))}\n                value={formData.carrier_name || ""}\n                onChange={(v) => setFormData({ ...formData, carrier_name: v })}\n                placeholder="Selecione um transportador"'
);

// We still need to apply formatCurrency to the restored files!
// Instead of a risky regex, I'll do specific replacements.
// 1. _authenticated.orcamentos.$id.tsx
let orc = fs.readFileSync('src/routes/_authenticated.orcamentos.$id.tsx', 'utf8');
orc = orc.replace(/R\$ \{finalTotal\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(finalTotal)}');
orc = orc.replace(/R\$ \{Number\(quote\.estimated_total \|\| 0\)\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(quote.estimated_total)}');
orc = orc.replace(/R\$ \{Number\(quote\.discount\)\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(quote.discount)}');
orc = orc.replace(/R\$ \{Number\(quote\.freight_cost\)\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(quote.freight_cost)}');
if (!orc.includes('formatCurrency')) {
    orc = orc.replace('import { useQuote', 'import { formatCurrency } from "@/lib/utils";\nimport { useQuote');
}
fs.writeFileSync('src/routes/_authenticated.orcamentos.$id.tsx', orc, 'utf8');

// 2. _authenticated.pedidos.$orderId.tsx
let oid = fs.readFileSync('src/routes/_authenticated.pedidos.$orderId.tsx', 'utf8');
oid = oid.replace(/R\$ \{\(\(group\.unit_price \|\| 0\) \* group\.totalQty\)\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency((group.unit_price || 0) * group.totalQty)}');
oid = oid.replace(/R\$ \{group\.unit_price\?\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(group.unit_price)}');
if (!oid.includes('formatCurrency')) {
    oid = oid.replace('import { useOrder', 'import { formatCurrency } from "@/lib/utils";\nimport { useOrder');
}
fs.writeFileSync('src/routes/_authenticated.pedidos.$orderId.tsx', oid, 'utf8');

// 3. _authenticated.pedidos.$id.tsx
pid = pid.replace(/R\$ \{payments\.reduce\(\(acc, p\) => acc \+ \(p\.amount \|\| 0\), 0\)\}/, '{formatCurrency(payments.reduce((acc, p) => acc + (p.amount || 0), 0))}');
pid = pid.replace(/R\$ \{finalTotal\}/, '{formatCurrency(finalTotal)}');
pid = pid.replace(/R\$ \{itemsTotalList\}/, '{formatCurrency(itemsTotalList)}');
pid = pid.replace(/R\$ \{itemsDiscountTotal\}/, '{formatCurrency(itemsDiscountTotal)}');
pid = pid.replace(/R\$ \{saleDiscount\}/, '{formatCurrency(saleDiscount)}');
pid = pid.replace(/R\$ \{\(freight \+ otherExpenses\)\}/, '{formatCurrency(freight + otherExpenses)}');
pid = pid.replace(/R\$ \{p\.cost_price\}/, '{formatCurrency(p.cost_price)}');
pid = pid.replace(/R\$ \{p\.price\}/, '{formatCurrency(p.price)}');
pid = pid.replace(/R\$ \{itemsTotalNet\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(itemsTotalNet)}');
pid = pid.replace(/R\$ \{saleDiscount\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(saleDiscount)}');
pid = pid.replace(/R\$ \{\(freight \+ otherExpenses\)\.toLocaleString\("pt-BR",\s*\{.*?\)\}/, '{formatCurrency(freight + otherExpenses)}');
pid = pid.replace(/R\$ \{finalTotal\.toLocaleString\("pt-BR",\s*\{.*?\)\}/g, '{formatCurrency(finalTotal)}');

if (!pid.includes('formatCurrency')) {
    pid = pid.replace('import { useOrder', 'import { formatCurrency } from "@/lib/utils";\nimport { useOrder');
}

fs.writeFileSync('src/routes/_authenticated.pedidos.$id.tsx', pid, 'utf8');

console.log('Restoration and fixes applied!');
