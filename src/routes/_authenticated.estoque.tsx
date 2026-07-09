import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Boxes, Package, Factory, Truck, Settings, FileBox, AlertTriangle, TrendingDown, Loader2, FileText } from "lucide-react";
import { SuppliersTab } from "@/components/estoque/SuppliersTab";
import { ConfigTab } from "@/components/estoque/ConfigTab";
import { ProductVariantsTab } from "@/components/estoque/ProductVariantsTab";
import { InventoryBatchesTab } from "@/components/estoque/InventoryBatchesTab";
import { RelatorioEstoqueTab } from "@/components/estoque/RelatorioEstoqueTab";
import { CorteCosturaTab } from "@/components/estoque/CorteCosturaTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStockMovements } from "@/lib/api/inventory";

export const Route = createFileRoute("/_authenticated/estoque")({
  head: () => ({ meta: [{ title: "Estoque Inteligente · e-roupas OS" }] }),
  component: EstoquePage,
});

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: Boxes },
  { id: "corte_costura", label: "Ficha de Corte e Costura", icon: FileText },
  { id: "relatorios", label: "Relatórios & Exportação", icon: FileBox },
  { id: "variantes", label: "Variantes (Cadastro)", icon: Package },
  { id: "lotes", label: "Lotes (Entrada)", icon: FileBox },
  { id: "fornecedores", label: "Fornecedores", icon: Truck },
  { id: "config", label: "Configurações", icon: Settings },
];

function EstoquePage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estoque</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Estoque Inteligente</h1>
        </div>
      </div>

      <div className="flex space-x-1 border-b mb-6 overflow-x-auto pb-px">
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "corte_costura" && <CorteCosturaTab />}
        {activeTab === "relatorios" && <RelatorioEstoqueTab />}
        {activeTab === "variantes" && <ProductVariantsTab />}
        {activeTab === "lotes" && <InventoryBatchesTab />}
        {activeTab === "fornecedores" && <SuppliersTab />}
        {activeTab === "config" && <ConfigTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const { data: batches = [], isLoading: isLoadingBatches } = useQuery({
    queryKey: ["dashboard_batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_batches")
        .select(`
          *,
          product_variants (
            *,
            models:product_models(*),
            fabrics(*),
            canonical_colors(*)
          )
        `)
        .eq("active", true);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: soldItems = [], isLoading: isLoadingSold } = useQuery({
    queryKey: ["dashboard_sold_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*");
      if (error) throw error;
      return data || [];
    }
  });

  const { data: movements = [], isLoading: isLoadingMovements } = useQuery({
    queryKey: ["dashboard_movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select(`
          *,
          inventory_batches (
            *,
            product_variants (
              *,
              fabrics(*),
              canonical_colors(*)
            )
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoadingBatches || isLoadingSold || isLoadingMovements) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <Loader2 className="animate-spin size-8 text-primary" />
        <p className="text-sm">Carregando métricas dinâmicas do estoque...</p>
      </div>
    );
  }

  const variantBalances: Record<string, { available: number; reserved: number; variant: any }> = {};
  
  batches.forEach((b: any) => {
    const v = b.product_variants;
    if (!v) return;
    if (!variantBalances[v.id]) {
      variantBalances[v.id] = { available: 0, reserved: 0, variant: v };
    }
    variantBalances[v.id].available += Number(b.quantity_available) || 0;
    variantBalances[v.id].reserved += Number(b.quantity_reserved) || 0;
  });

  const variantList = Object.values(variantBalances);
  const ruptures = variantList.filter(v => v.available === 0).length;
  const lowStock = variantList.filter(v => v.available > 0 && v.available < 15).length;
  const reservedTotal = batches.reduce((acc: number, b: any) => acc + (Number(b.quantity_reserved) || 0), 0);
  const activeProducts = variantList.length;

  const colorSales: Record<string, number> = {};
  const sizeSales: Record<string, number> = {};

  soldItems.forEach((item: any) => {
    if (item.color) {
      colorSales[item.color] = (colorSales[item.color] || 0) + (Number(item.quantity) || 0);
    }
    if (item.size) {
      sizeSales[item.size] = (sizeSales[item.size] || 0) + (Number(item.quantity) || 0);
    }
  });

  const colorsData = Object.entries(colorSales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const sizesData = Object.entries(sizeSales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const fabricConsumption: Record<string, number> = {};
  const batchConsumption: Record<string, number> = {};

  const consumptionMovements = movements.filter((m: any) => Number(m.quantity) < 0);

  consumptionMovements.forEach((m: any) => {
    const qty = Math.abs(Number(m.quantity));
    const batch = m.inventory_batches;
    const variant = batch?.product_variants;
    const fabricName = variant?.fabrics?.name;
    const batchCode = batch?.batch_code;

    if (fabricName) {
      fabricConsumption[fabricName] = (fabricConsumption[fabricName] || 0) + qty;
    }
    if (batchCode) {
      batchConsumption[batchCode] = (batchConsumption[batchCode] || 0) + qty;
    }
  });

  const fabricsData = Object.entries(fabricConsumption)
    .map(([name, consumo]) => ({ name, consumo }))
    .sort((a, b) => b.consumo - a.consumo)
    .slice(0, 7);

  const batchesData = Object.entries(batchConsumption)
    .map(([name, consumo]) => ({ name, consumo }))
    .sort((a, b) => b.consumo - a.consumo)
    .slice(0, 7);

  const variantDailyConsumption: Record<string, number> = {};
  
  consumptionMovements.forEach((m: any) => {
    const v = m.inventory_batches?.product_variants;
    if (v) {
      const qty = Math.abs(Number(m.quantity));
      variantDailyConsumption[v.id] = (variantDailyConsumption[v.id] || 0) + (qty / 30);
    }
  });

  const rupturePredictions: any[] = [];

  variantList.forEach((item) => {
    const dailyUse = variantDailyConsumption[item.variant.id] || 0;
    if (dailyUse > 0) {
      const daysRemaining = item.available / dailyUse;
      if (daysRemaining <= 15) {
        rupturePredictions.push({
          name: `${item.variant.models?.name || "Modelo"} ${item.variant.fabrics?.name || "Malha"} ${item.variant.canonical_colors?.name || "Cor"} (${item.variant.size})`,
          available: item.available,
          dailyUse: dailyUse.toFixed(2),
          daysRemaining: Math.ceil(daysRemaining)
        });
      }
    }
  });

  rupturePredictions.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Baixo Estoque <AlertTriangle className="size-4 text-amber-500"/></div>
          <div className="mt-2 text-3xl font-bold text-amber-600">{lowStock}</div>
          <div className="text-xs text-muted-foreground mt-1">Variantes abaixo do estoque de segurança (&lt; 15)</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Ruptura <AlertTriangle className="size-4 text-red-500"/></div>
          <div className="mt-2 text-3xl font-bold text-red-600">{ruptures}</div>
          <div className="text-xs text-muted-foreground mt-1">Variantes com saldo físico zerado</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Estoque Reservado <Factory className="size-4 text-indigo-500"/></div>
          <div className="mt-2 text-3xl font-bold text-indigo-600">{reservedTotal.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-muted-foreground mt-1">Matéria-prima alocada para produção</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Variantes Ativas <Package className="size-4 text-slate-400"/></div>
          <div className="mt-2 text-3xl font-bold text-slate-700">{activeProducts}</div>
          <div className="text-xs text-muted-foreground mt-1">Total de SKUs físicos cadastrados</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-800">Top 5 Cores Mais Vendidas</h3>
          {colorsData.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">Sem dados de venda registrados.</div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={colorsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {colorsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} un`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-800">Top 5 Tamanhos Mais Vendidos</h3>
          {sizesData.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">Sem dados de venda registrados.</div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sizesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sizesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} un`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-800">Consumo por Malha (Insumos de Produção)</h3>
          {fabricsData.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">Sem histórico de consumo de malhas.</div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fabricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value} un`} />
                  <Bar dataKey="consumo" fill="#6366f1" radius={[4, 4, 0, 0]} name="Consumido (un)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-800">Consumo por Lote de Entrada</h3>
          {batchesData.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">Sem histórico de consumo de lotes.</div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value} un`} />
                  <Bar dataKey="consumo" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Consumido (un)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800">Previsão Inteligente de Ruptura (Próximos 15 dias)</h3>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
            <TrendingDown className="size-3.5"/> Análise Preditiva
          </span>
        </div>
        {rupturePredictions.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Excelente! Nenhuma ruptura iminente prevista para os próximos 15 dias com base no histórico de consumo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-medium">Variante (Modelagem + Malha + Cor + Tamanho)</th>
                  <th className="px-5 py-3 font-medium text-center">Saldo Disponível</th>
                  <th className="px-5 py-3 font-medium text-center">Consumo Diário Médio</th>
                  <th className="px-5 py-3 font-medium text-center text-red-600">Previsão de Esgotamento</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {rupturePredictions.map((pred, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-semibold">{pred.name}</td>
                    <td className="px-5 py-3 text-center">{pred.available} un</td>
                    <td className="px-5 py-3 text-center text-slate-500">{pred.dailyUse} un / dia</td>
                    <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-50/20">
                      {pred.daysRemaining === 0 ? "Esgota hoje" : `Em ${pred.daysRemaining} dias`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function MovementsTab() {
  const { data: movements = [], isLoading } = useStockMovements();

  if (isLoading) return <div className="p-8 text-center text-slate-500"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />Carregando histórico...</div>;

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Histórico de Movimentações (Auditoria)</h2>
        <p className="text-slate-500 text-xs mt-1">Registro imutável de todas as entradas, saídas e ajustes no estoque industrial.</p>
      </div>
      
      <div className="p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="font-medium p-4">Data / Hora</th>
              <th className="font-medium p-4">Tipo</th>
              <th className="font-medium p-4">Usuário</th>
              <th className="font-medium p-4">Lote</th>
              <th className="font-medium p-4">SKU / Tamanho</th>
              <th className="font-medium p-4 text-right">Qtd Antes</th>
              <th className="font-medium p-4 text-center">Movimento</th>
              <th className="font-medium p-4 text-right">Qtd Depois</th>
              <th className="font-medium p-4">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500">Nenhuma movimentação registrada.</td>
              </tr>
            ) : (
              movements.map((mov: any) => {
                const batch = mov.inventory_batches;
                const variant = batch?.product_variants;
                const isPositive = Number(mov.quantity) > 0;
                
                return (
                  <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-600">
                      {new Date(mov.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium uppercase text-[10px] tracking-wider">
                        {mov.movement_type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{(mov.users as any)?.name || "Sistema"}</td>
                    <td className="p-4 text-slate-600 font-mono text-[10px]">{batch?.batch_code || "-"}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{variant?.sku_internal || "-"}</div>
                      <div className="text-[10px] text-slate-500">Tam: {variant?.size || "-"}</div>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-500">{Number(mov.quantity_before || 0)}</td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{mov.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-800">{Number(mov.quantity_after || 0)}</td>
                    <td className="p-4 text-slate-600 max-w-[200px] truncate" title={mov.notes || "-"}>{mov.notes || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

