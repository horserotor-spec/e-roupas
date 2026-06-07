const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$id.tsx';
let content = fs.readFileSync(path, 'utf8');

// The original patch replaced an incorrect string. Let's fix the closing tags.
content = content.replace(
  /<Textarea className="min-h-\[100px\] resize-y" value=\{formData\.internal_notes \|\| ""\} onChange=\{e => setFormData\(\{\.\.\.formData, internal_notes: e\.target\.value\}\)\} \/>\s*<\/div>\s*<\/div>\s*<\/section>/,
  `<Textarea className="min-h-[100px] resize-y" value={formData.internal_notes || ""} onChange={e => setFormData({...formData, internal_notes: e.target.value})} />
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
        </Tabs>`
);

fs.writeFileSync(path, content);
console.log('Fixed edit.tsx');
