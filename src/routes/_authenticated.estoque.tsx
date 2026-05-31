import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Boxes, Package, Factory, Truck, Settings, FileBox } from "lucide-react";
import { SuppliersTab } from "@/components/estoque/SuppliersTab";
import { ConfigTab } from "@/components/estoque/ConfigTab";
import { ProductVariantsTab } from "@/components/estoque/ProductVariantsTab";
import { InventoryBatchesTab } from "@/components/estoque/InventoryBatchesTab";

export const Route = createFileRoute("/_authenticated/estoque")({
  head: () => ({ meta: [{ title: "Estoque Inteligente · e-roupas OS" }] }),
  component: EstoquePage,
});

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: Boxes },
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
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação Logística</p>
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
        {activeTab === "variantes" && <ProductVariantsTab />}
        {activeTab === "lotes" && <InventoryBatchesTab />}
        {activeTab === "fornecedores" && <SuppliersTab />}
        {activeTab === "config" && <ConfigTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Baixo Estoque <Boxes className="size-4 text-orange-500"/></div>
          <div className="mt-2 text-3xl font-bold">12</div>
          <div className="text-xs text-muted-foreground mt-1">Variantes abaixo do limite</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Ruptura <Boxes className="size-4 text-red-500"/></div>
          <div className="mt-2 text-3xl font-bold text-red-600">3</div>
          <div className="text-xs text-muted-foreground mt-1">Produtos zerados</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Estoque Reservado <Factory className="size-4 text-indigo-500"/></div>
          <div className="mt-2 text-3xl font-bold">1.450</div>
          <div className="text-xs text-muted-foreground mt-1">Peças alocadas para pedidos</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Produtos Parados <Package className="size-4 text-slate-400"/></div>
          <div className="mt-2 text-3xl font-bold text-slate-700">8</div>
          <div className="text-xs text-muted-foreground mt-1">Sem movimentação há 30 dias</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-muted/20"><h3 className="font-semibold">Previsão de Ruptura (Próximos 15 dias)</h3></div>
          <div className="p-5 text-center text-sm text-muted-foreground">
            Gráfico de consumo diário vs estoque disponível.
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-muted/20"><h3 className="font-semibold">Mais Consumidos</h3></div>
          <ul className="divide-y text-sm">
            <li className="px-5 py-3 flex justify-between"><span>Camiseta Regular Algodão Preta M</span> <span className="font-medium">-340 un</span></li>
            <li className="px-5 py-3 flex justify-between"><span>Camiseta Regular Algodão Branca G</span> <span className="font-medium">-210 un</span></li>
            <li className="px-5 py-3 flex justify-between"><span>Baby Look Poliamida Marinho P</span> <span className="font-medium">-180 un</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}


