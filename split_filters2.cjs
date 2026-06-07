const fs = require('fs');

const path = 'src/routes/_authenticated.pedidos.index.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the filters array entirely
content = content.replace(
  /const filters:[\s\S]*?\];/,
  `const primaryFilters: { key: "todos" | "urgentes" | "atrasados" | OrderStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "urgentes", label: "Urgentes" },
  { key: "atrasados", label: "Atrasados" },
  { key: "finalizado", label: "Finalizados" },
];

const secondaryFilters: { key: OrderStatus; label: string }[] = [
  { key: "orcamento", label: "Orçamento" },
  { key: "arte_criacao", label: "Arte/Criação" },
  { key: "aguardando_arte", label: "Ag. Arte" },
  { key: "confirmado", label: "Confirmado" },
  { key: "aguardando_financeiro", label: "Ag. Financeiro" },
  { key: "liberado_producao", label: "Liberado Prod." },
  { key: "separacao", label: "Separação" },
  { key: "corte", label: "Corte" },
  { key: "costura", label: "Costura" },
  { key: "bordado", label: "Bordado" },
  { key: "impressao", label: "Impressão" },
  { key: "prensa", label: "Prensa" },
  { key: "qualidade", label: "Qualidade" },
  { key: "expedicao", label: "Expedição" },
  { key: "entregue", label: "Entregue" },
];`
);

// We must also fix the state definition:
// const [f, setF] = useState<(typeof filters)[number]["key"]>("todos");
content = content.replace(
  /const \[f, setF\] = useState<\(typeof filters\)\[number\]\["key"\]>\("todos"\);/,
  `const [f, setF] = useState<any>("todos");`
);

// We must fix the rendering logic
const oldRenderRegex = /<div className="flex items-center gap-2 mb-4 flex-wrap">[\s\S]*?<\/div>(\s*<div className="rounded-2xl border border-border bg-card overflow-hidden">)/;

const newRender = `<div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar pedido..."
              className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {primaryFilters.map((flt) => (
              <button
                key={flt.key}
                onClick={() => setF(flt.key as any)}
                className={\`shrink-0 h-8 px-3 rounded-md text-xs font-medium transition-colors \${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}\`}
              >
                {flt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {secondaryFilters.map((flt) => (
            <button
              key={flt.key}
              onClick={() => setF(flt.key as any)}
              className={\`shrink-0 h-6 px-2.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-colors \${f === flt.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}\`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>$1`;

content = content.replace(oldRenderRegex, newRender);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
