import { createFileRoute } from "@tanstack/react-router";
import { useOrder } from "@/lib/api/orders";
import { Loader2, Printer, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/print/operacional")({
  component: PrintOperacionalPage,
});

// Componente simples para renderizar o código de barras da peça
function SimpleBarcode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-3 w-full bg-white overflow-hidden justify-center items-end border-x border-black">
        {value.split('').map((char, i) => {
          const width = (char.charCodeAt(0) % 2) + 1;
          const isSpace = i % 2 === 0;
          return (
            <div 
              key={i} 
              style={{ width: `${width}px`, height: '100%', backgroundColor: isSpace ? 'transparent' : 'black', marginLeft: isSpace ? '1px' : '0px' }} 
            />
          );
        })}
      </div>
      <span className="font-mono text-[7px] font-bold mt-[1px] text-[6px] tracking-tight">{value}</span>
    </div>
  );
}

function PrintOperacionalPage() {
  const params = Route.useSearch() as { orderId?: string };
  const orderId = params.orderId || "";
  const { data: order, isLoading } = useOrder(orderId);
  const [startPosition, setStartPosition] = useState<number>(0); // 0-indexed (0 a 95)

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500 font-medium">
        Pedido não encontrado. Certifique-se de passar o orderId na busca.
      </div>
    );
  }

  // A4 layout para 96 etiquetas Colacril (31x17mm por etiqueta)
  // Folha de 8 colunas por 12 linhas
  const totalLabelsOnSheet = 96;

  // Gerar array de etiquetas para impressão correspondente a todas as peças do pedido
  const labelsToPrint: any[] = [];
  order.items.forEach((item) => {
    // Para cada item, gerar tantas etiquetas quanto a quantidade do item
    const qty = Number(item.quantity) || 0;
    for (let i = 0; i < qty; i++) {
      // Determinar sigla das malhas/cores
      const fabricSigla = (item.fabric?.substring(0, 3) || "MP").toUpperCase();
      const colorSigla = (item.color?.substring(0, 3) || "PTO").toUpperCase();
      const modelSigla = (item.model?.substring(0, 3) || "REG").toUpperCase();
      const sizeStr = (item.size || "G").toUpperCase();
      const artCode = (item.sku?.split('-')[0] || "ART").toUpperCase();

      labelsToPrint.push({
        orderCode: order.code,
        art: artCode,
        model: modelSigla,
        fabric: fabricSigla,
        color: colorSigla,
        size: sizeStr,
        barcode: `${artCode}-${modelSigla}-${fabricSigla}-${colorSigla}-${sizeStr}`
      });
    }
  });

  // Preencher com espaços em branco as posições anteriores ao início desejado
  const finalSheetLabels: (any | null)[] = Array(startPosition).fill(null).concat(labelsToPrint);

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:py-0 print:bg-white flex flex-col items-center">
      {/* SELETOR E TOOLBAR */}
      <div className="w-[210mm] bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6 print:hidden">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Grid className="size-5 text-primary" /> Configuração de Impressão de Etiquetas
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Layout: <strong>Colacril 31x17mm em Folha A4 (8 Colunas x 12 Linhas)</strong>. Clique na grade abaixo para escolher a partir de qual posição deseja iniciar a impressão:
        </p>

        {/* GRADE CLICÁVEL DO A4 */}
        <div className="grid grid-cols-8 gap-1 border border-slate-200 p-2 rounded-lg bg-slate-50 w-full max-w-[480px] mx-auto mb-6">
          {Array.from({ length: totalLabelsOnSheet }).map((_, idx) => {
            const isSelected = startPosition === idx;
            return (
              <button
                key={idx}
                onClick={() => setStartPosition(idx)}
                className={`aspect-[31/17] border text-[8px] flex items-center justify-center font-bold rounded transition-colors ${
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
            body { margin: 0; padding: 0; background: white; }
            .print-hidden { display: none !important; }
            @page {
              size: A4 portrait;
              margin: 0;
            }
            .a4-sheet {
              width: 210mm !important;
              height: 297mm !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              page-break-after: always;
            }
          }
          /* Estilo A4 estruturado de 8 colunas e 12 linhas */
          .a4-sheet {
            display: grid;
            grid-template-columns: repeat(8, 26.25mm);
            grid-template-rows: repeat(12, 24.75mm);
            width: 210mm;
            height: 297mm;
            box-sizing: border-box;
            background: white;
            border: 1px dashed #ccc;
          }
          .label-cell {
            box-sizing: border-box;
            border: 0.1mm dotted rgba(0, 0, 0, 0.08); /* Delinear as bordas de forma sutil */
            padding: 1.5mm 1mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
          }
        `}
      </style>

      {/* RENDERIZADOR A4 REAL EM GRADE */}
      <div className="a4-sheet shadow-lg">
        {finalSheetLabels.map((lbl, idx) => {
          if (!lbl) {
            return <div key={`empty-${idx}`} className="label-cell" />;
          }

          return (
            <div key={idx} className="label-cell text-black">
              {/* Pedido e Arte */}
              <div className="flex justify-between items-center text-[7px] font-bold leading-none">
                <span className="truncate max-w-[40px]">{lbl.orderCode.replace("ER-", "")}</span>
                <span className="bg-slate-100 px-0.5 rounded text-[6px] truncate max-w-[32px]">{lbl.art}</span>
              </div>
              
              {/* Dados Principais do Produto */}
              <div className="flex items-center justify-between text-[7px] font-medium leading-none">
                <div className="flex gap-[2px]">
                  <span className="font-bold">{lbl.model}</span>
                  <span className="opacity-75">{lbl.fabric}</span>
                  <span className="opacity-75">{lbl.color}</span>
                </div>
                <span className="font-bold border border-black px-[2px] text-[7px] leading-tight rounded-sm bg-black text-white">{lbl.size}</span>
              </div>

              {/* Barcode Principal */}
              <div className="mt-0.5">
                <SimpleBarcode value={lbl.barcode} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
