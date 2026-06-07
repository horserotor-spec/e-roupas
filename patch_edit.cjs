const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$id.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix salesperson_id dropdown
content = content.replace(
  /value=\{formData\.seller_id \|\| ""\}\s*onChange=\{\(v\) => setFormData\(\{ \.\.\.formData, seller_id: v \}\)\}/,
  'value={formData.salesperson_id || ""}\n                onChange={(v) => setFormData({ ...formData, salesperson_id: v })}'
);

// Add the hidden fields for itemsDiscountTotal and itemsTotalList
content = content.replace(
  /<div className="space-y-1\.5">\s*<Label className="text-xs text-muted-foreground">Desconto total dos itens<\/Label>/,
  '<div className="space-y-1.5 hidden">\n              <Label className="text-xs text-muted-foreground">Desconto total dos itens</Label>'
);

content = content.replace(
  /<div className="space-y-1\.5">\s*<Label className="text-xs text-muted-foreground">Total dos itens<\/Label>/,
  '<div className="space-y-1.5 hidden">\n              <Label className="text-xs text-muted-foreground">Total dos itens</Label>'
);

// Add delete button
content = content.replace(
  /<Link to="\/pedidos">\s*<Button variant="outline" className="h-9 px-6 rounded-full border-green-600 text-green-700 hover:bg-green-50">Cancelar<\/Button>\s*<\/Link>/,
  `<Button variant="outline" className="h-9 px-4 rounded-full border-red-600 text-red-600 hover:bg-red-50" onClick={() => { if(window.confirm('Tem certeza que deseja excluir este pedido?')) { deleteMutation.mutate(id); } }}>
              <Trash2 className="size-4 mr-2" /> Excluir
            </Button>
            <Link to="/pedidos">
              <Button variant="outline" className="h-9 px-6 rounded-full border-green-600 text-green-700 hover:bg-green-50">Cancelar</Button>
            </Link>`
);

content = content.replace(
  /const updateMutation = useUpdateOrder\(\);/,
  `const updateMutation = useUpdateOrder();
  const deleteMutation = useDeleteOrder();`
);

content = content.replace(
  /import \{ useUpdateOrder, OrderItem, OrderPayload \} from "@\/lib\/api\/orders";/,
  `import { useUpdateOrder, useDeleteOrder, OrderItem, OrderPayload } from "@/lib/api/orders";`
);

content = content.replace(
  /import \{ Loader2, Trash2, Plus, ArrowLeft, Wand2, Check, ChevronsUpDown, Save, Printer, Tag \} from "lucide-react";/,
  `import { Loader2, Trash2, Plus, ArrowLeft, Wand2, Check, ChevronsUpDown, Save, Printer, Tag, Flame, Activity, CircleDashed } from "lucide-react";\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";\nimport { useOrderTimeline } from "@/lib/api/timeline";`
);

content = content.replace(
  /const \[installmentsCount, setInstallmentsCount\] = useState\(1\);/,
  `const [installmentsCount, setInstallmentsCount] = useState(1);
  const { data: timeline = [], isLoading: isLoadingTimeline } = useOrderTimeline(id);`
);

// Wrap main content in Tabs
content = content.replace(
  /<div className="max-w-\[1400px\] mx-auto px-6 py-8 space-y-8">\s*\{\/\* DADOS DO CLIENTE \*\/\}/,
  `<div className="max-w-[1400px] mx-auto px-6 py-8">
        <Tabs defaultValue="pedido" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[500px] grid-cols-3">
              <TabsTrigger value="pedido">Dados do Pedido</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro / Interno</TabsTrigger>
              <TabsTrigger value="historico">Histórico e Logs</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pedido" className="space-y-8 mt-0">
            {/* DADOS DO CLIENTE */}`
);

content = content.replace(
  /setFormData\(\{\.\.\.formData, internal_notes: e\.target\.value\}\)\} placeholder="Anotações internas\.\.\." \/>\s*<\/div>\s*<\/div>\s*<\/section>\s*<\/div>\s*<\/div>\s*<\/>/,
  `setFormData({...formData, internal_notes: e.target.value})} placeholder="Anotações internas..." />
            </div>
          </div>
        </section>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-8 mt-0">
          <section className="bg-white p-6 rounded-xl border">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Flame className="size-4 text-orange-500" /> Detalhamento Financeiro (Restrito)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Custos e Acréscimos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Total dos Itens (Sem desconto)</span>
                      <span className="font-medium">R$ {itemsTotalList.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Desconto nos Itens</span>
                      <span className="text-red-500 font-medium">- R$ {itemsDiscountTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Desconto Adicional (Venda)</span>
                      <span className="text-red-500 font-medium">- R$ {saleDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Frete / Outras Despesas</span>
                      <span className="text-emerald-600 font-medium">+ R$ {(freight + otherExpenses).toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t flex justify-between items-center font-bold text-slate-800">
                      <span>Total Final Cobrado</span>
                      <span>R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-700 mb-3">Comissionamento</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-800 font-medium">Comissão Total Prevista</span>
                      <span className="font-bold text-purple-900">Calculada automaticamente</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">A comissão é calculada com base na taxa cadastrada no perfil do vendedor associado a este pedido. Ela incidirá sobre o valor final do pedido (R$ {finalTotal.toFixed(2)}).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="historico" className="mt-0">
          <aside className="rounded-2xl border border-border bg-card p-5 flex flex-col h-[600px]">
            <h2 className="text-sm font-semibold mb-1">Timeline e Histórico de Edição</h2>
            <p className="text-xs text-muted-foreground mb-4">Auditoria e histórico de ações neste pedido.</p>

            <ul className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingTimeline ? (
                <div className="text-center py-4 text-xs text-muted-foreground"><Loader2 className="animate-spin size-4 inline mr-2"/> Carregando timeline...</div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">Nenhum evento registrado.</div>
              ) : (
                timeline.map((t: any) => (
                  <li key={t.id} className="flex gap-3">
                    <div className="size-7 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0 border border-border">
                      {t.action.includes("criado") ? <Plus className="size-3.5" />
                        : t.action.includes("status") ? <Activity className="size-3.5 text-primary" />
                        : <CircleDashed className="size-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs">
                        <span className="font-medium">{t.users?.name || "Sistema"}</span>
                        <span className="text-muted-foreground"> · {new Date(t.created_at).toLocaleString("pt-BR")}</span>
                      </div>
                      <p className="text-sm mt-0.5 leading-relaxed text-foreground/90">{t.description}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </aside>
        </TabsContent>
        </Tabs>
      </div>
    </>
  );`
);

fs.writeFileSync(path, content);
console.log('Patched edit.tsx');
