import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useOrder, useOrders } from "@/lib/api/orders";
import { Loader2, Printer, Grid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BWIPJS } from "@/components/ui/bwipjs";

export const Route = createFileRoute("/print/operacional")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: (search.orderId as string) || "",
    };
  },
  component: PrintOperacionalPage,
});

/**
 * Gera um código de barras PURAMENTE NUMÉRICO de 12 dígitos.
 * Usa Code 128C (supercompressão), gerando apenas ~30 módulos.
 * Em 38mm isso resulta em barras de ~1,26mm — perfeito para laser e jato de tinta.
 *
 * Formato: SEQPED(4) + ITEMHEX→DEC(5) + PEÇA(3) = 12 dígitos
 *   Ex: pedido "0001" + item "6EDE"→28382 + peça 1
 *   → "0001" + "28382" + "001" = "000128382001"
 */
function buildNumericBarcode(orderCode: string, itemId: string, pieceNum: number): string {
  // Extrair apenas a sequência numérica do pedido (ex: "ER-260715-0001" → últimos 4 dígitos = "0001")
  const digits = orderCode.replace(/\D/g, '');
  const orderSeq = digits.slice(-4).padStart(4, '0');
  // Converter os 4 primeiros chars do UUID do item (hex) para decimal 5 dígitos
  const hexPart = itemId.substring(0, 4).toUpperCase();
  const decimalPart = String(parseInt(hexPart, 16)).padStart(5, '0');
  // Número da peça com 3 dígitos
  const pieceStr = String(pieceNum).padStart(3, '0');
  return `${orderSeq}${decimalPart}${pieceStr}`;
}

/**
 * Gera o identificador humano único da etiqueta.
 * Ex: "ER-260715-0001-6EDE-001"
 */
function buildHumanReadable(orderCode: string, itemId: string, pieceNum: number): string {
  const shortId = itemId.substring(0, 4).toUpperCase();
  const pieceStr = String(pieceNum).padStart(3, "0");
  return `${orderCode}-${shortId}-${pieceStr}`;
}

function PrintOperacionalPage() {
  const params = Route.useSearch() as { orderId?: string };
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [activeOrderId, setActiveOrderId] = useState(params.orderId || "");
  const [startPosition, setStartPosition] = useState<number>(0);

  const { data: order, isLoading } = useOrder(activeOrderId);
  // Busca pelo código do pedido (ex: "ER-260715-0001")
  const { data: searchResults } = useOrders(searchInput.length >= 3 ? searchInput : undefined);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) html.classList.remove("dark");
    return () => { if (isDark) html.classList.add("dark"); };
  }, []);

  // Painel de busca de pedido (sempre visível no topo da toolbar)
  const OrderSelector = (
    <div className="mb-5 pb-5 border-b border-slate-100">
      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Número do Pedido</label>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Digite o código do pedido (ex: ER-260715-0001)"
            className="pl-9 h-9 text-sm"
          />
          {/* Dropdown de resultados */}
          {searchResults && searchResults.length > 0 && searchInput.length >= 3 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((o: any) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setActiveOrderId(o.id);
                    setSearchInput(o.code);
                    setStartPosition(0);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  <span className="font-bold text-slate-800">{o.code}</span>
                  <span className="text-slate-500 ml-2 text-xs">{o.client_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {order && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 whitespace-nowrap">
            ✓ {order.code} — {order.items?.length || 0} item(s)
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  const totalLabelsOnSheet = 65;

  // Código da marca: primeiros 2 chars do brand_code ou do code do pedido
  const brandCode = (order.brand_code || order.code || "ER").substring(0, 2).toUpperCase();

  // Gerar etiquetas — uma por peça de cada item do pedido
  const labelsToPrint: any[] = [];
  order.items.forEach((item: any) => {
    const qty = Number(item.quantity) || 0;
    const prod = item.products || {};

    // Códigos dos campos técnicos
    const artCode   = (item.art_code || item.sku?.split("-")[0] || "ART").toUpperCase();
    const fabricCode = (prod.fabrics?.code || prod.fabric?.code || "GEN").toUpperCase();
    const modelCode  = (prod.models?.code || prod.model?.code  || "MLD").toUpperCase();
    const colorCode  = (prod.canonical_colors?.code || prod.color?.code || "GEN").toUpperCase();
    const sizeStr    = (item.size || "G").toUpperCase();

    for (let i = 0; i < qty; i++) {
      const pieceNum = i + 1;
      const numericBarcode  = buildNumericBarcode(order.code, item.id, pieceNum);
      const humanReadable   = buildHumanReadable(order.code, item.id, pieceNum);

      // Linha 2 visual: FLA001-CMS-MML-PTO-P-ER.001
      const visualLine2 = `${artCode}-${fabricCode}-${modelCode}-${colorCode}-${sizeStr}-${brandCode}.${String(pieceNum).padStart(3, "0")}`;

      labelsToPrint.push({
        orderCode:      order.code,
        priority:       (order.priority || "N").toUpperCase().charAt(0),
        unitText:       `${pieceNum}/${qty}`,
        visualLine2,
        numericBarcode,
        humanReadable,
        size: sizeStr,
      });
    }
  });

  const finalSheetLabels: (any | null)[] = Array(startPosition).fill(null).concat(labelsToPrint);

  return (
    <div className="min-h-screen print:min-h-0 print:h-auto print:block bg-slate-100 py-10 print:py-0 print:bg-white flex flex-col items-center">
      {/* TOOLBAR */}
      <div className="w-[210mm] bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6 print:hidden">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Grid className="size-5 text-primary" /> Impressão de Etiquetas Operacionais
        </h2>

        {/* SELETOR DE PEDIDO */}
        {OrderSelector}

        <p className="text-xs text-muted-foreground mb-3">
          Layout: <strong>38,1x21,2mm (5 Colunas x 13 Linhas)</strong>. Clique na posição inicial:
        </p>

        <div className="grid grid-cols-5 gap-1 border border-slate-200 p-2 rounded-lg bg-slate-50 w-full max-w-[400px] mx-auto mb-6">
          {Array.from({ length: totalLabelsOnSheet }).map((_, idx) => {
            const isSelected = startPosition === idx;
            return (
              <button
                key={idx}
                onClick={() => setStartPosition(idx)}
                className={`aspect-[381/212] border text-[8px] flex items-center justify-center font-bold rounded transition-colors ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-700 border-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Imprimindo {labelsToPrint.length} etiqueta(s) a partir da posição {startPosition + 1}.
          </span>
          <Button onClick={() => window.print()} className="bg-primary text-white hover:bg-primary/90 rounded-full px-6">
            <Printer className="size-4 mr-2" /> Imprimir Etiquetas
          </Button>
        </div>
      </div>

      <style>
        {`
          @media print {
            body, html { margin: 0; padding: 0; background: white; height: 100%; }
            .print-hidden { display: none !important; }
            @page { size: A4 portrait; margin: 0; }
            .a4-sheet {
              width: 210mm !important;
              height: 297mm !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
          .a4-sheet {
            display: grid;
            grid-template-columns: repeat(5, 38.1mm);
            grid-template-rows: repeat(13, 21.2mm);
            column-gap: 2.65mm;
            row-gap: 0mm;
            padding: 10.9mm 4.49mm;
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            box-sizing: border-box;
            background: white;
            border: none;
          }
          .label-cell {
            box-sizing: border-box;
            border: 0.1mm dotted rgba(0,0,0,0.08);
            padding: 1mm 1.5mm 0.5mm 1.5mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            background: white;
          }
        `}
      </style>

      {/* FOLHA A4 */}
      <div className="a4-sheet shadow-lg">
        {finalSheetLabels.map((lbl, idx) => {
          if (!lbl) return <div key={`empty-${idx}`} className="label-cell" />;

          return (
            <div key={idx} className="label-cell text-black">

              {/* LINHA 1: Pedido | Peça X/Y | Prioridade */}
              <div className="flex justify-between items-center leading-none">
                <span style={{ fontSize: "6px", fontWeight: 700 }}>{lbl.orderCode}</span>
                <span style={{ fontSize: "5.5px", color: "#555" }}>{lbl.unitText}</span>
                <span style={{
                  fontSize: "8px", fontWeight: 900,
                  background: "#000", color: "#fff",
                  padding: "1px 3px", borderRadius: "2px",
                  lineHeight: 1.2, minWidth: "13px", textAlign: "center"
                }}>
                  {lbl.size}
                </span>
              </div>

              {/* LINHA 2: Arte-Malha-Modelo-Cor-Tamanho-Marca.Peça */}
              <div style={{ fontSize: "6px", fontWeight: 700, textAlign: "center", letterSpacing: "0.01em", lineHeight: 1.2 }}>
                {lbl.visualLine2}
              </div>

              {/* CÓDIGO DE BARRAS (Code 128C numérico — barra grossa, leitura garantida) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#fff" }}>
                <BWIPJS
                  bcid="code128"
                  text={lbl.numericBarcode}
                  scale={3}
                  height={12}
                  includetext={false}
                  className="w-full"
                />
                {/* Texto humano único ABAIXO das barras */}
                <span style={{ fontSize: "5px", fontFamily: "monospace", letterSpacing: "0.03em", marginTop: "0.5px" }}>
                  {lbl.humanReadable}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
