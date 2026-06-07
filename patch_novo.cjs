const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.novo.tsx';
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

// Add Status to order
content = content.replace(
  /<div className="space-y-1\.5 md:col-span-2">\s*<Label className="text-xs text-muted-foreground text-blue-600">Pedido de compra<\/Label>/,
  '<div className="space-y-1.5 md:col-span-1">\n              <Label className="text-xs text-muted-foreground text-blue-600">Pedido de compra</Label>'
);

content = content.replace(
  /onChange=\{e => setFormData\(\{\.\.\.formData, purchase_order: e\.target\.value\}\)\} \/>\s*<\/div>\s*<\/div>\s*<\/section>/,
  `onChange={e => setFormData({...formData, purchase_order: e.target.value})} />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-xs text-muted-foreground">Status do Pedido *</Label>
              <Select value={formData.status || "confirmado"} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="aguardando_financeiro">Ag. Financeiro</SelectItem>
                  <SelectItem value="liberado_producao">Liberado Prod.</SelectItem>
                  <SelectItem value="separacao">Separação</SelectItem>
                  <SelectItem value="corte">Corte</SelectItem>
                  <SelectItem value="costura">Costura</SelectItem>
                  <SelectItem value="bordado">Bordado</SelectItem>
                  <SelectItem value="impressao">Impressão</SelectItem>
                  <SelectItem value="expedicao">Expedição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>`
);

// Wrap main content in Tabs
content = content.replace(
  /<div className="max-w-\[1400px\] mx-auto px-6 py-8 space-y-8">\s*\{\/\* DADOS DO CLIENTE \*\/\}/,
  `<div className="max-w-[1400px] mx-auto px-6 py-8">
        <Tabs defaultValue="pedido" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="pedido">Dados do Pedido</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro / Interno</TabsTrigger>
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
                    <p className="text-xs text-purple-600 mt-2">A comissão é calculada com base na taxa cadastrada no perfil do vendedor associado a este pedido (Representante). Ela incidirá sobre o valor final do pedido.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        </Tabs>
      </div>
    </>
  );`
);

fs.writeFileSync(path, content);
console.log('Patched novo.tsx');
