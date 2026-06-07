const fs = require('fs');
const path = 'src/components/pedidos/DrawerPedido.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useClients')) {
  content = content.replace('import { useUpdateOrder', 'import { useClients } from "@/lib/api/clients";\nimport { useUpdateOrder');
}
if (!content.includes('SelectTrigger')) {
  content = content.replace('import { Trash2', 'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";\nimport { Trash2');
}

const hooksOld = '  const deleteOrder = useDeleteOrder();\n  const [isSavingProd, setIsSavingProd] = useState(false);';
const hooksNew = '  const deleteOrder = useDeleteOrder();\n  const { data: clients = [] } = useClients();\n  const suppliers = clients.filter(c => c.entity_type === "fornecedor");\n  const [isSavingProd, setIsSavingProd] = useState(false);';

if (content.includes(hooksOld)) {
  content = content.replace(hooksOld, hooksNew);
}

const inputCorte = '<Input className="h-8 text-xs bg-white" value={prodForm.corte_faction} onChange={e => setProdForm({...prodForm, corte_faction: e.target.value})} placeholder="Nome da facção..." />';
const selectCorte = `<Select value={prodForm.corte_faction} onValueChange={v => setProdForm({...prodForm, corte_faction: v})}>
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue placeholder="Selecione um fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.name} className="text-xs">{s.name}</SelectItem>)}
                        {suppliers.length === 0 && <SelectItem value="none" disabled className="text-xs">Nenhum fornecedor encontrado</SelectItem>}
                      </SelectContent>
                    </Select>`;

const inputCostura = '<Input className="h-8 text-xs bg-white" value={prodForm.costura_faction} onChange={e => setProdForm({...prodForm, costura_faction: e.target.value})} placeholder="Nome da facção..." />';
const selectCostura = `<Select value={prodForm.costura_faction} onValueChange={v => setProdForm({...prodForm, costura_faction: v})}>
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue placeholder="Selecione um fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.name} className="text-xs">{s.name}</SelectItem>)}
                        {suppliers.length === 0 && <SelectItem value="none" disabled className="text-xs">Nenhum fornecedor encontrado</SelectItem>}
                      </SelectContent>
                    </Select>`;

content = content.replace(inputCorte, selectCorte);
content = content.replace(inputCostura, selectCostura);

fs.writeFileSync(path, content, 'utf8');
console.log('DrawerPedido updated with Suppliers Select!');
