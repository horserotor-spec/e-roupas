import { createFileRoute } from "@tanstack/react-router";
import { useOrder } from "@/lib/api/orders";
import { Loader2, Printer, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Barcode from "react-barcode";

export const Route = createFileRoute("/print/operacional")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: (search.orderId as string) || "",
    };
  },
  component: PrintOperacionalPage,
});

function PrintOperacionalPage() {
  const params = Route.useSearch() as { orderId?: string };
  const orderId = params.orderId || "";
  const { data: order, isLoading, error } = useOrder(orderId);
  const [startPosition, setStartPosition] = useState<number>(0); // 0-indexed (0 a 95)

  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
    }
    return () => {
      if (isDark) {
        html.classList.add("dark");
      }
    };
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-slate-500 font-medium">
        <p>Pedido não encontrado.</p>
        <p className="text-sm mt-2">ID recebido: {orderId || "NENHUM"}</p>
        {error && <p className="text-xs text-red-500 mt-2">Erro interno: {(error as any).message || String(error)}</p>}
      </div>
    );
  }

  // A4 layout para 65 etiquetas (38,1x21,2mm por etiqueta)
  // Folha de 5 colunas por 13 linhas
  const totalLabelsOnSheet = 65;

  // Gerar array de etiquetas para impressão correspondente a todas as peças do pedido
  const labelsToPrint: any[] = [];
  order.items.forEach((item: any) => {
    // Para cada item, gerar tantas etiquetas quanto a quantidade do item
    const qty = Number(item.quantity) || 0;
    for (let i = 0; i < qty; i++) {
      // Determinar sigla das malhas/cores pelos códigos reais (se disponíveis)
      const prod = item.products || {};
      const fabricSigla = (prod.fabrics?.code || item.fabric?.substring(0, 3) || "GEN").toUpperCase();
      const colorSigla = (prod.canonical_colors?.code || item.color?.substring(0, 3) || "GEN").toUpperCase();
      const modelSigla = "REG"; // Fixo REG como combinado
      const sizeStr = (item.size || "G").toUpperCase();
      const artCode = (item.sku?.split('-')[0] || "ART").toUpperCase();
      
      const exactSku = item.sku || `${artCode}-REG-${fabricSigla}-${colorSigla}-${sizeStr}`;

      labelsToPrint.push({
        orderCode: order.code,
        art: artCode,
        model: modelSigla,
        fabric: fabricSigla,
        color: colorSigla,
        size: sizeStr,
        barcode: `${exactSku}.${i + 1}`,
        unitText: `${i + 1}/${qty}`
      });
    }
  });

  // Preencher com espaços em branco as posições anteriores ao início desejado
  const finalSheetLabels: (any | null)[] = Array(startPosition).fill(null).concat(labelsToPrint);

  return (
    <div className="min-h-screen print:min-h-0 print:h-auto print:block bg-slate-100 py-10 print:py-0 print:bg-white flex flex-col items-center">
      {/* SELETOR E TOOLBAR */}
      <div className="w-[210mm] bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6 print:hidden">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Grid className="size-5 text-primary" /> Configuração de Impressão de Etiquetas
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Layout: <strong>38,1x21,2mm em Folha A4 (5 Colunas x 13 Linhas)</strong>. Clique na grade abaixo para escolher a partir de qual posição deseja iniciar a impressão:
        </p>

        {/* GRADE CLICÁVEL DO A4 */}
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
            @page {
              size: A4 portrait;
              margin: 0;
            }
            .a4-sheet {
              width: 210mm !important;
              height: 297mm !important;
              box-shadow: none !important;
              border: none !important;
              page-break-after: avoid;
              break-after: avoid;
            }
          }
          /* Estilo A4 estruturado de 5 colunas e 13 linhas (38,1x21,2mm) */
          .a4-sheet {
            display: grid;
            grid-template-columns: repeat(5, 38.1mm);
            grid-template-rows: repeat(13, 21.2mm);
            column-gap: 2.65mm;
            row-gap: 0mm;
            padding: 10.9mm 4.49mm; /* Borda cima/baixo: 10.90mm, Borda esq/dir: 4.49mm */
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
              {/* Topo: Pedido e Tamanho Destacado */}
              <div className="flex justify-between items-center text-[8px] font-bold leading-none">
                <span>Ped: {lbl.orderCode}</span>
                <span className="text-[7px] text-slate-600 bg-slate-100 px-1 rounded">{lbl.unitText}</span>
                <span className="bg-black text-white text-[10px] px-1 py-0.5 rounded font-black tracking-wider flex items-center justify-center min-w-[16px] h-[14px] leading-none">
                  {lbl.size}
                </span>
              </div>
              
              {/* Código Completo com a Arte */}
              <div className="text-[7.5px] font-bold text-center leading-none truncate max-w-full my-0.5">
                {lbl.barcode}
              </div>

              {/* Barcode Principal Legível */}
              <div className="w-full flex justify-center overflow-hidden">
                <Barcode 
                  value={lbl.barcode} 
                  width={1.2} 
                  height={28} 
                  fontSize={8} 
                  displayValue={false} 
                  margin={0}
                  background="transparent"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
