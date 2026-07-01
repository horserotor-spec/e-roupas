import { createFileRoute } from "@tanstack/react-router";
import { useOrder } from "@/lib/api/orders";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/print/etiqueta/$id")({
  component: PrintEtiquetaPage,
});

// Componente simples para renderizar um código de barras visual fake para a etiqueta.
// Se precisar de código de barras real, recomendamos a biblioteca react-barcode.
function FakeBarcode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-full max-w-[200px] bg-white overflow-hidden justify-center items-end opacity-90 border-x-4 border-black">
        {/* Generates a pseudo-random barcode pattern based on string length/characters */}
        {value.split('').map((char, i) => {
          const width = (char.charCodeAt(0) % 4) + 1;
          const isSpace = i % 3 === 0;
          return (
            <div 
              key={i} 
              style={{ width: `${width}px`, height: '100%', backgroundColor: isSpace ? 'transparent' : 'black', marginLeft: isSpace ? '2px' : '1px' }} 
            />
          );
        })}
      </div>
      <span className="font-mono text-[10px] mt-1 font-bold tracking-widest">{value}</span>
    </div>
  );
}

function PrintEtiquetaPage() {
  const { id } = Route.useParams();
  const { loading: authLoading } = useAuth();
  const { data: order, isLoading, error } = useOrder(id);

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

  if (authLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (error || !order) {
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-2">
        <div className="text-xl font-bold text-slate-800">Pedido não encontrado.</div>
        <div className="text-slate-500 font-mono text-sm">ID Procurado: {id}</div>
        <div className="text-red-500 text-xs font-mono max-w-md text-center">{error ? String(error.message || error) : 'Sem erro retornado, apenas null'}</div>
        <div className="text-slate-400 text-xs">O pedido pode não existir ou faltam permissões de acesso (RLS).</div>
      </div>
    );
  }

  const senderInfo = {
    name: "e-roupas (Sua Empresa)",
    document: "00.000.000/0001-00",
    street: "Rua do Remetente, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zip: "01000-000",
  };

  const trackingCode = order.tracking_code || "BR" + order.code.replace(/\D/g, '') + "BR";

  const isSedex = order.logistics_type?.toLowerCase().includes("sedex");
  const servicoNome = isSedex ? "SEDEX" : "PAC";
  const chancelaCode = isSedex ? "04162" : "04669"; // Exemplos

  return (
    <div className="min-h-screen bg-slate-200 py-10 print:py-0 print:bg-white flex flex-col items-center font-sans">
      
      {/* TOOLBAR FOR PRINTING */}
      <div className="w-full max-w-4xl mx-auto mb-6 flex justify-between items-center px-6 print:hidden">
        <div className="text-sm text-slate-500">
          <p>Configurado para <strong>4 etiquetas por página (A4)</strong></p>
          <p>Tamanho da etiqueta Correios Padrão: 10,5cm x 14,8cm</p>
        </div>
        <Button onClick={() => window.print()} className="bg-primary text-white hover:bg-primary/90">
          <Printer className="size-4 mr-2" /> Imprimir Etiqueta
        </Button>
      </div>

      <style>
        {`
          @media print {
            @page { margin: 0; size: A4 portrait; }
            body { margin: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-container { 
              display: block !important;
              box-shadow: none !important;
              background: transparent !important;
              padding: 0 !important;
            }
          }
        `}
      </style>

      {/* A4 Sheet */}
      <div className="print-container bg-white shadow-md w-[210mm] min-h-[297mm] p-0 box-border">
        {/* Etiqueta 1/4 A4 */}
        <div className="float-left box-border print:border-none relative" 
             style={{ width: '105mm', height: '148.5mm', padding: '2mm' }}>
          
          <div className="w-full h-full border-[1.5px] border-black bg-white flex flex-col overflow-hidden text-black p-1">
            
            {/* TOPO: LOGO CORREIOS E CHANCELA */}
            <div className="flex border-b border-black">
              {/* Logo (Fake/Simulado se não tiver imagem) */}
              <div className="w-1/3 p-1 flex flex-col items-center justify-center border-r border-black">
                <div className="font-bold text-[14px] text-blue-800 tracking-tighter leading-none mb-0.5">Correios</div>
              </div>
              
              {/* NF / Pedido */}
              <div className="w-1/3 p-1 flex flex-col items-center justify-center border-r border-black text-[9px] leading-tight">
                <div>NF: <strong>—</strong></div>
                <div>PEDIDO: <strong>{order.code}</strong></div>
                <div>CONTRATO: <strong>9912345678</strong></div>
              </div>

              {/* Chancela Serviço */}
              <div className="w-1/3 p-1 flex flex-col items-center justify-center bg-black text-white">
                <div className="font-bold text-[14px]">{servicoNome}</div>
                <div className="font-mono text-[10px]">{chancelaCode}</div>
              </div>
            </div>

            {/* CÓDIGO DE BARRAS PRINCIPAL */}
            <div className="flex flex-col items-center justify-center py-2 border-b border-black">
              <FakeBarcode value={trackingCode} />
              <div className="text-[12px] font-bold mt-1 tracking-widest">{trackingCode}</div>
            </div>

            {/* RECEBEDOR (DESTINATÁRIO) E INFORMAÇÕES */}
            <div className="flex border-b border-black">
              
              {/* Rotação Lateral (Opcional nos correios tem dados laterais, mas vamos focar no recebedor) */}
              <div className="flex-1 p-1">
                <div className="flex justify-between items-end mb-1 border-b border-dashed border-black pb-1">
                  <div className="text-[10px] font-bold uppercase">Recebedor</div>
                  <div className="text-[9px]">Assinatura: __________________ Documento: _______________</div>
                </div>
                
                <div className="text-[11px] font-bold uppercase leading-tight mt-1">
                  {order.delivery_name || order.client_name}
                </div>
                
                <div className="text-[10px] leading-tight mt-1">
                  {order.delivery_street || "Endereço não cadastrado"}, {order.delivery_number} {order.delivery_complement && `- ${order.delivery_complement}`}
                </div>
                <div className="text-[10px] leading-tight">
                  {order.delivery_neighborhood}
                </div>
                <div className="text-[10px] leading-tight">
                  {order.delivery_city || "Cidade"} / {order.delivery_state || "UF"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-[12px] font-bold">CEP: {order.delivery_zip || "00000-000"}</div>
                </div>

                {/* Cep Barcode Mini */}
                <div className="mt-1 h-6 max-w-[150px] opacity-80">
                  <FakeBarcode value={order.delivery_zip ? order.delivery_zip.replace(/\D/g, '') : "00000000"} />
                </div>
              </div>
            </div>

            {/* PESO E DECLARAÇÃO */}
            <div className="flex border-b border-black text-[9px]">
              <div className="w-1/2 p-1 border-r border-black">
                <div>Peso (kg): <strong>{order.gross_weight || "0.100"}</strong></div>
                <div>Volumes: <strong>1/{order.volumes_quantity || 1}</strong></div>
              </div>
              <div className="w-1/2 p-1">
                <div>Dimensões: <strong>{order.package_width||'10'}x{order.package_length||'15'}x{order.package_height||'10'} cm</strong></div>
                <div>Obs: <strong>Nenhuma</strong></div>
              </div>
            </div>

            {/* REMETENTE */}
            <div className="flex-1 p-1 text-[9px] relative flex flex-col justify-end">
              <div className="font-bold uppercase mb-0.5">Remetente</div>
              <div className="font-bold">{senderInfo.name}</div>
              <div>{senderInfo.street} - {senderInfo.neighborhood}</div>
              <div>{senderInfo.city} / {senderInfo.state} - CEP: {senderInfo.zip}</div>
              <div className="text-[8px] mt-1 text-slate-600">Não é documento fiscal. Declaração de conteúdo dispensada.</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
