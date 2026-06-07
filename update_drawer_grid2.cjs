const fs = require('fs');
const path = 'src/components/pedidos/DrawerPedido.tsx';
let content = fs.readFileSync(path, 'utf8');

const startTag = '{/* Corte */}';
const endTag = '{/* Observações */}';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
    console.log('Tags not found');
    process.exit(1);
}

// First, go back from startTag to find `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">`
const gridStartTag = '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">';
const realStartIndex = content.lastIndexOf(gridStartTag, startIndex);

// Real end index should be right before ` {/* Observações */}`
// Actually the previous structure had a `</div>\n            </div>\n\n            {/* Observações */}`
// Let's just replace from `realStartIndex` to `endIndex`

const newHtml = `<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Corte */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Corte</h4>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-500">Facção / Responsável</Label>
                    <Input className="h-8 text-xs bg-white" value={prodForm.corte_faction} onChange={e => setProdForm({...prodForm, corte_faction: e.target.value})} placeholder="Nome da facção..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.corte_start_date} onChange={e => setProdForm({...prodForm, corte_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.corte_end_date} onChange={e => setProdForm({...prodForm, corte_end_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <Label className="text-[10px] uppercase text-slate-500">Valor Unitário por Peça (R$)</Label>
                    <Input type="number" step="0.01" className="h-8 text-xs font-medium text-slate-900 bg-white" value={prodForm.corte_unit_price || ''} onChange={e => setProdForm({...prodForm, corte_unit_price: parseFloat(e.target.value) || 0})} placeholder="0.00" />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Grade Produzida (Corte)</Label>
                      <div className="flex items-center gap-1">
                        <select 
                          className="h-6 text-[10px] rounded border-slate-200 px-1 bg-white"
                          onChange={(e) => {
                            addSizeToGrid('corte', e.target.value);
                            e.target.value = "";
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>+ Add Tamanho</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.keys(prodForm.corte_grid).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-2">Nenhum tamanho adicionado na grade.</div>
                      ) : (
                        Object.entries(prodForm.corte_grid).map(([size, qty]) => (
                          <div key={size} className="flex items-center gap-2">
                            <div className="w-10 h-7 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700">{size}</div>
                            <Input 
                              type="number" 
                              className="h-7 text-xs bg-white text-right flex-1" 
                              value={qty || ''} 
                              onChange={e => updateGridValue('corte', size, parseInt(e.target.value) || 0)} 
                              placeholder="Qtd..."
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeSizeFromGrid('corte', size)}>
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>Total a Pagar:</span>
                    <span>{formatCurrency(calculateTotal(prodForm.corte_grid, prodForm.corte_unit_price))}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right mt-1">
                    {Object.values(prodForm.corte_grid).reduce((a,b)=>a+(b||0),0)} peças totais
                  </div>
                </div>

                {/* Costura */}
                <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Costura</h4>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-500">Facção / Responsável</Label>
                    <Input className="h-8 text-xs bg-white" value={prodForm.costura_faction} onChange={e => setProdForm({...prodForm, costura_faction: e.target.value})} placeholder="Nome da facção..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Entrada</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.costura_start_date} onChange={e => setProdForm({...prodForm, costura_start_date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500">Data Saída</Label>
                      <Input type="date" className="h-8 text-xs bg-white" value={prodForm.costura_end_date} onChange={e => setProdForm({...prodForm, costura_end_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <Label className="text-[10px] uppercase text-slate-500">Valor Unitário por Peça (R$)</Label>
                    <Input type="number" step="0.01" className="h-8 text-xs font-medium text-slate-900 bg-white" value={prodForm.costura_unit_price || ''} onChange={e => setProdForm({...prodForm, costura_unit_price: parseFloat(e.target.value) || 0})} placeholder="0.00" />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Grade Produzida (Costura)</Label>
                      <div className="flex items-center gap-1">
                        <select 
                          className="h-6 text-[10px] rounded border-slate-200 px-1 bg-white"
                          onChange={(e) => {
                            addSizeToGrid('costura', e.target.value);
                            e.target.value = "";
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>+ Add Tamanho</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.keys(prodForm.costura_grid).length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-2">Nenhum tamanho adicionado na grade.</div>
                      ) : (
                        Object.entries(prodForm.costura_grid).map(([size, qty]) => (
                          <div key={size} className="flex items-center gap-2">
                            <div className="w-10 h-7 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700">{size}</div>
                            <Input 
                              type="number" 
                              className="h-7 text-xs bg-white text-right flex-1" 
                              value={qty || ''} 
                              onChange={e => updateGridValue('costura', size, parseInt(e.target.value) || 0)} 
                              placeholder="Qtd..."
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeSizeFromGrid('costura', size)}>
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>Total a Pagar:</span>
                    <span>{formatCurrency(calculateTotal(prodForm.costura_grid, prodForm.costura_unit_price))}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right mt-1">
                    {Object.values(prodForm.costura_grid).reduce((a,b)=>a+(b||0),0)} peças totais
                  </div>
                </div>
              </div>
            </div>
            
`;

content = content.substring(0, realStartIndex) + newHtml + content.substring(endIndex);
fs.writeFileSync(path, content, 'utf8');
console.log('Drawer updated!');
