const fs = require('fs');
const path = 'src/components/pedidos/DrawerPedido.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('PlusCircle')) {
  content = content.replace('Factory } from "lucide-react";', 'Factory, PlusCircle, X } from "lucide-react";');
}

// 1. Update the state and handleSaveProd
const oldState = `  const [prodForm, setProdForm] = useState({
    corte_faction: "",
    corte_start_date: "",
    corte_end_date: "",
    costura_faction: "",
    costura_start_date: "",
    costura_end_date: ""
  });

  useEffect(() => {
    if (order) {
      setProdForm({
        corte_faction: order.corte_faction || "",
        corte_start_date: order.corte_start_date || "",
        corte_end_date: order.corte_end_date || "",
        costura_faction: order.costura_faction || "",
        costura_start_date: order.costura_start_date || "",
        costura_end_date: order.costura_end_date || ""
      });
    }
  }, [order]);`;

const newState = `  const [prodForm, setProdForm] = useState({
    corte_faction: "",
    corte_start_date: "",
    corte_end_date: "",
    costura_faction: "",
    costura_start_date: "",
    costura_end_date: "",
    corte_unit_price: 0,
    costura_unit_price: 0,
    corte_grid: {} as Record<string, number>,
    costura_grid: {} as Record<string, number>
  });

  const SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4", "2", "4", "6", "8", "10", "12", "14", "16"];

  useEffect(() => {
    if (order) {
      setProdForm({
        corte_faction: order.corte_faction || "",
        corte_start_date: order.corte_start_date || "",
        corte_end_date: order.corte_end_date || "",
        costura_faction: order.costura_faction || "",
        costura_start_date: order.costura_start_date || "",
        costura_end_date: order.costura_end_date || "",
        corte_unit_price: order.corte_unit_price || 0,
        costura_unit_price: order.costura_unit_price || 0,
        corte_grid: order.corte_grid || {},
        costura_grid: order.costura_grid || {}
      });
    }
  }, [order]);

  const addSizeToGrid = (stage: 'corte' | 'costura', size: string) => {
    if (!size) return;
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      if (grid[size] === undefined) {
        grid[size] = 0;
      }
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const removeSizeFromGrid = (stage: 'corte' | 'costura', size: string) => {
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      delete grid[size];
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const updateGridValue = (stage: 'corte' | 'costura', size: string, value: number) => {
    setProdForm(prev => {
      const grid = { ...prev[stage === 'corte' ? 'corte_grid' : 'costura_grid'] };
      grid[size] = value;
      return { ...prev, [stage === 'corte' ? 'corte_grid' : 'costura_grid']: grid };
    });
  };

  const calculateTotal = (grid: Record<string, number>, price: number) => {
    const totalQty = Object.values(grid).reduce((acc, val) => acc + (val || 0), 0);
    return totalQty * (price || 0);
  };
`;

if (content.includes(oldState)) {
    content = content.replace(oldState, newState);
}

// 2. Replace the HTML blocks
const oldHtmlRegex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?{costura_end_date: e\.target\.value}\)}\s*\/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

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
                          <option value="" disabled>+ Adicionar Tamanho</option>
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
                          <option value="" disabled>+ Adicionar Tamanho</option>
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
            </div>`;

if (content.match(oldHtmlRegex)) {
    content = content.replace(oldHtmlRegex, newHtml);
    fs.writeFileSync(path, content, 'utf8');
    console.log('DrawerPedido updated!');
} else {
    console.log('Could not find old html to replace.');
}
