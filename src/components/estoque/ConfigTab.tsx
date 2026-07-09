import { useModels, useColors, useFabrics } from "@/lib/api/inventory";
import { Loader2 } from "lucide-react";

const COLOR_CODES: Record<string, string> = {
  "branco": "100",
  "natural": "101",
  "off white": "101",
  "off-white": "101",
  "verde agua": "102",
  "verde água": "102",
  "celeste": "103",
  "cinza claro": "105",
  "areia": "106",
  "lilás": "107",
  "lilas": "107",
  "rosa bb": "108",
  "creme": "109",
  "salmão": "114",
  "salmao": "114",
  "marinho": "201",
  "preto": "202",
  "limão": "203",
  "limao": "203",
  "seleção": "204",
  "selecao": "204",
  "chumbo": "206",
  "laranja": "207",
  "pink": "210",
  "barbie": "213",
  "ocre": "214",
  "royal": "301",
  "vermelho": "302",
  "bandeira": "303",
  "musgo": "304",
  "militar": "306",
  "turquesa": "307",
  "vinho": "308",
  "petróleo": "309",
  "petroleo": "309",
  "marrom": "310",
  "pitanga": "311",
  "jade": "312",
  "caramelo": "313",
  "roxo": "315",
  "botonê": "1101",
  "botone": "1101",
  "cinza mescla": "1001",
  "bananinha": "1100",
  "marinho mescla": "2011",
  "preto mescla": "2021",
};

export function ConfigTab() {
  const { data: models = [], isLoading: loadModels } = useModels();
  const { data: colors = [], isLoading: loadColors } = useColors();
  const { data: fabrics = [], isLoading: loadFabrics } = useFabrics();

  const isLoading = loadModels || loadColors || loadFabrics;

  if (isLoading) {
    return <div className="py-12 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      {/* Coluna Esquerda: Cores Padrão */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden h-full">
        <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
          <h3 className="font-semibold">Cores Padrão</h3>
        </div>
        <ul className="divide-y text-sm max-h-[570px] overflow-y-auto">
          {colors.map(m => {
            const code = COLOR_CODES[m.name.toLowerCase()] || m.code;
            return (
              <li key={m.id} className="px-4 py-2.5 hover:bg-muted/50 flex items-center gap-2">
                <div className="size-4 rounded-full border flex-shrink-0" style={{ backgroundColor: m.hex || '#ccc' }}></div>
                <span>{m.name} {code ? `(COD. ${code})` : ""}</span>
              </li>
            );
          })}
          {colors.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhuma cor.</li>}
        </ul>
      </div>

      {/* Coluna Direita: Modelos e Malhas */}
      <div className="space-y-6">
        
        {/* Modelos */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
            <h3 className="font-semibold">Modelos (Models)</h3>
          </div>
          <ul className="divide-y text-sm max-h-64 overflow-y-auto">
            {models.map(m => (
              <li key={m.id} className="px-4 py-2 hover:bg-muted/50">{m.name}</li>
            ))}
            {models.length === 0 && <li className="px-4 py-4 text-center text-muted-foreground">Nenhum modelo.</li>}
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
                <div className="text-xs text-muted-foreground mt-0.5">
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

    </div>
  );
}
