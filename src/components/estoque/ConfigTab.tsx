import { useState } from "react";
import { useModels, useLines, useColors, useFabrics } from "@/lib/api/inventory";
import { Loader2 } from "lucide-react";

export function ConfigTab() {
  const { data: models = [], isLoading: loadModels } = useModels();
  const { data: lines = [], isLoading: loadLines } = useLines();
  const { data: colors = [], isLoading: loadColors } = useColors();
  const { data: fabrics = [], isLoading: loadFabrics } = useFabrics();

  const isLoading = loadModels || loadLines || loadColors || loadFabrics;

  if (isLoading) {
    return <div className="py-12 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Modelos */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold">Modelos (Models)</h3>
          {/* Add buttons later if needed */}
        </div>
        <ul className="divide-y text-sm max-h-64 overflow-y-auto">
          {models.map(m => (
            <li key={m.id} className="px-4 py-2 hover:bg-muted/50">{m.name}</li>
          ))}
          {models.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhum modelo.</li>}
        </ul>
      </div>

      {/* Linhas */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold">Linhas (Lines)</h3>
        </div>
        <ul className="divide-y text-sm max-h-64 overflow-y-auto">
          {lines.map(m => (
            <li key={m.id} className="px-4 py-2 hover:bg-muted/50">{m.name}</li>
          ))}
          {lines.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhuma linha.</li>}
        </ul>
      </div>

      {/* Cores Canônicas */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold">Cores Canônicas</h3>
        </div>
        <ul className="divide-y text-sm max-h-64 overflow-y-auto">
          {colors.map(m => (
            <li key={m.id} className="px-4 py-2 hover:bg-muted/50 flex items-center gap-2">
              <div className="size-4 rounded-full border" style={{ backgroundColor: m.hex || '#ccc' }}></div>
              {m.name}
            </li>
          ))}
          {colors.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhuma cor.</li>}
        </ul>
      </div>

      {/* Malhas */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold">Malhas (Fabrics)</h3>
        </div>
        <ul className="divide-y text-sm max-h-64 overflow-y-auto">
          {fabrics.map(m => (
            <li key={m.id} className="px-4 py-2 hover:bg-muted/50">
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">
                {m.grammage ? `Gramatura: ${m.grammage}` : ''} {m.composition ? `· Comp: ${m.composition}` : ''}
              </div>
              <div className="text-[10px] uppercase mt-1 flex gap-1 text-slate-500">
                {m.supports_dtf && <span className="bg-slate-100 px-1 rounded">DTF</span>}
                {m.supports_silk && <span className="bg-slate-100 px-1 rounded">Silk</span>}
                {m.supports_embroidery && <span className="bg-slate-100 px-1 rounded">Bordado</span>}
                {m.supports_sublimation && <span className="bg-slate-100 px-1 rounded">Sublimação</span>}
              </div>
            </li>
          ))}
          {fabrics.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhuma malha.</li>}
        </ul>
      </div>

    </div>
  );
}
