import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { bipSeparationItem, BipSeparationResult } from "@/lib/api/orders";
import { ArrowLeft, Barcode, CheckCircle2, AlertOctagon, Loader2, Sparkles, Printer, UserCheck, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

export const Route = createFileRoute("/_authenticated/separacao")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: (search.orderId as string) || "",
    };
  },
  component: SeparationPage,
});

function SeparationPage() {
  const params = Route.useSearch() as { orderId?: string };
  const orderId = params.orderId || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [barcode, setBarcode] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [bipResult, setBipResult] = useState<BipSeparationResult | null>(null);
  const [isBiping, setIsBiping] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Estados do Scanner por Câmera
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleCameraScan = async (scannedCode: string) => {
    setCameraOpen(false);
    await processBip(scannedCode);
  };

  const { videoRef, error: scannerError } = useBarcodeScanner(handleCameraScan, cameraOpen);

  useEffect(() => {
    if (scannerError) setCameraError(scannerError);
  }, [scannerError]);

  // Busca dados detalhados do pedido
  const { data: order, isLoading } = useQuery({
    queryKey: ["separacao_pedido", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          clients!orders_client_id_fkey(id, name, company_name),
          order_items(*)
        `)
        .eq("id", orderId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });

  // Sintetizador de Som (Bipe)
  const playBeep = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(success ? 1000 : 180, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + (success ? 0.12 : 0.45));
    } catch (e) {
      console.error("Falha ao reproduzir bipe:", e);
    }
  };

  // Focar no campo de leitura continuamente
  useEffect(() => {
    if (barcodeInputRef.current && !cameraOpen) {
      barcodeInputRef.current.focus();
    }
  }, [activeItemIndex, bipResult, cameraOpen]);

  // Captura global de teclado para scanners físicos (pistola)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !cameraOpen &&
        barcodeInputRef.current &&
        document.activeElement !== barcodeInputRef.current &&
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey
      ) {
        barcodeInputRef.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cameraOpen]);

  // Manter foco ao clicar em qualquer lugar da tela
  const handleScreenClick = () => {
    if (barcodeInputRef.current && !cameraOpen) {
      barcodeInputRef.current.focus();
    }
  };

  const processBip = async (codeToProcess: string) => {
    if (!codeToProcess.trim()) return;

    const currentItem = order?.order_items?.[activeItemIndex];
    if (!currentItem) {
      toast.error("Nenhum item selecionado para separação.");
      return;
    }

    setIsBiping(true);
    setBipResult(null);

    try {
      const res = await bipSeparationItem(orderId, currentItem.id, codeToProcess);
      setBipResult(res);
      setBarcode("");

      if (res.success) {
        playBeep(true);
        toast.success("MP Validado e baixado no estoque!");
        queryClient.invalidateQueries({ queryKey: ["separacao_pedido", orderId] });
      } else {
        playBeep(false);
        toast.error("MP Incorreto! Bipagem bloqueada.");
      }
    } catch (err: any) {
      playBeep(false);
      toast.error("Erro na validação: " + err.message);
    } finally {
      setIsBiping(false);
    }
  };

  const handleBipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processBip(barcode);
  };

  // Se o item atual já estiver totalmente separado, seleciona automaticamente o próximo pendente
  useEffect(() => {
    if (order?.order_items) {
      const currentItem = order.order_items[activeItemIndex];
      if (currentItem && Number(currentItem.quantity_separated || 0) >= Number(currentItem.quantity)) {
        // Encontrar próximo item com quantidade pendente
        const nextPendingIdx = order.order_items.findIndex((item: any) => 
          Number(item.quantity_separated || 0) < Number(item.quantity)
        );
        if (nextPendingIdx !== -1) {
          setActiveItemIndex(nextPendingIdx);
          setBipResult(null);
        }
      }
    }
  }, [order, activeItemIndex]);

  const handleFinishSeparation = async (isPartial = false) => {
    // Verificar se todos os itens estão separados no fechamento total
    const hasPending = order?.order_items?.some((item: any) => 
      Number(item.quantity_separated || 0) < Number(item.quantity)
    );

    if (!isPartial && hasPending) {
      toast.error("Ainda restam peças pendentes de separação física.");
      return;
    }

    if (isPartial) {
      const confirmText = `Deseja liberar o ENVIO PARCIAL deste pedido? Apenas ${totalSeparatedCount} de ${totalItemsCount} peças foram separadas.`;
      if (!window.confirm(confirmText)) return;
    }

    // Avançar status do pedido para "🟢 Corte" (Kanban de Produção)
    const { error: statusError } = await supabase
      .from("orders")
      .update({ status: "corte" })
      .eq("id", orderId);

    if (statusError) {
      toast.error("Erro ao atualizar status do pedido.");
      return;
    }

    // Atualizar o status do processo na tabela order_item_processes para "concluido" apenas para os itens que foram fisicamente separados!
    const separatedItemIds = order.order_items
      .filter((i: any) => (i.quantity_separated || 0) > 0)
      .map((i: any) => i.id);

    if (separatedItemIds.length > 0) {
      await supabase
        .from("order_item_processes")
        .update({ status: "concluido", finished_at: new Date().toISOString() })
        .in("order_item_id", separatedItemIds);
    }

    // Registrar evento de auditoria na timeline
    await supabase.from("order_timeline").insert([{
      order_id: orderId,
      event_type: isPartial ? "separacao_parcial" : "separacao_concluida",
      description: isPartial
        ? `Separação física PARCIAL concluída (Envio Parcial). Separadas ${totalSeparatedCount} de ${totalItemsCount} peças. Liberado para o corte.`
        : "Separação física de todas as peças concluída. Pedido liberado para o Corte."
    }]);

    toast.success(isPartial ? "Envio parcial liberado com sucesso!" : "Separação concluída com sucesso! Pedido avançado.");
    navigate({ to: "/producao" });
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="flex h-screen items-center justify-center text-slate-500 font-medium">Pedido não encontrado.</div>;
  }

  const items = order.order_items || [];
  const currentItem = items[activeItemIndex];
  
  // Calcular totais
  const totalItemsCount = items.reduce((acc: number, i: any) => acc + Number(i.quantity), 0);
  const totalSeparatedCount = items.reduce((acc: number, i: any) => acc + (Number(i.quantity_separated) || 0), 0);
  const isAllSeparated = totalSeparatedCount >= totalItemsCount;

  return (
    <div onClick={handleScreenClick} className="min-h-screen bg-slate-900 text-white flex flex-col font-sans select-none">
      
      {/* CABEÇALHO INDUSTRIAL */}
      <div className="flex-shrink-0 bg-slate-800/80 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/producao" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Modo Separação <Badge variant="secondary" className="bg-slate-700 text-slate-200">Industrial</Badge>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Pedido: <span className="text-slate-200 font-bold">{order.code}</span> · Cliente: <span className="text-slate-200 font-bold">{order.clients?.name}</span>
            </p>
          </div>
        </div>
        
        {/* Progresso Geral */}
        <div className="text-right">
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {totalSeparatedCount} / {totalItemsCount}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Peças Separadas</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* LADO ESQUERDO: LISTA DE ITENS DO PEDIDO E PROBING */}
        <div className="w-full md:w-[360px] bg-slate-800/40 border-r border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itens a Separar</span>
            {isAllSeparated && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Totalmente Separado</Badge>}
          </div>
          <div className="divide-y divide-slate-800/60">
            {items.map((item: any, idx: number) => {
              const active = idx === activeItemIndex;
              const completed = Number(item.quantity_separated || 0) >= Number(item.quantity);
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItemIndex(idx);
                    setBipResult(null);
                  }}
                  className={`w-full text-left p-4 flex items-start justify-between transition-colors ${
                    active ? "bg-primary/10 border-l-4 border-primary" : completed ? "bg-slate-800/10 border-l-4 border-emerald-500" : "hover:bg-slate-800/30 border-l-4 border-transparent"
                  }`}
                >
                  <div className="pr-4 truncate flex-1">
                    <h4 className="font-bold text-sm truncate text-white">{item.product_name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{item.sku}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-semibold">Tamanho: {item.size}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-semibold">{item.gender}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-base font-bold font-mono ${completed ? "text-emerald-400" : "text-amber-400"}`}>
                      {item.quantity_separated || 0} / {item.quantity}
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Qtd</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* LADO DIREITO: CAMPO DE SCANNER E VALIDACÃO DE ERROS */}
        <div className="flex-1 bg-slate-950 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
          
          {/* PAINEL DE LEITURA (MAIN SCREEN) */}
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-8">
            
            {/* ITEM EXPECTED / DADOS DO PRODUTO ATUAL */}
            {currentItem && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800/10 rounded-full flex items-center justify-center opacity-30">
                  <Barcode className="size-16" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Aguardando Matéria-Prima</div>
                <h3 className="text-2xl font-extrabold text-white mb-2">{currentItem.product_name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Modelo</span>
                    <span className="text-sm font-semibold text-white">{currentItem.model || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Malha</span>
                    <span className="text-sm font-semibold text-white">{currentItem.fabric || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Cor</span>
                    <span className="text-sm font-semibold text-white">{currentItem.color || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tamanho</span>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-max block mt-0.5">{currentItem.size}</span>
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK VISUAL DAS BIPAGENS (VALIDO OU ERRO) */}
            {bipResult && (
              <div className={`p-6 rounded-2xl border flex items-start gap-4 transition-all animate-in fade-in zoom-in duration-200 ${
                bipResult.success 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400 shadow-lg shadow-red-950/20"
              }`}>
                {bipResult.success ? (
                  <>
                    <CheckCircle2 className="size-10 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-black tracking-tight">{bipResult.message}</h4>
                      <p className="text-xs text-emerald-500/80 mt-1">
                        Estoque do lote correspondente baixado com sucesso. Código de barras aceito.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="size-10 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black tracking-tight">{bipResult.message}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-black/40 p-3.5 rounded-xl border border-red-500/10 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Esperado</span>
                          <p className="font-bold text-white mt-0.5">
                            {bipResult.expected?.fabric} · {bipResult.expected?.color} ({bipResult.expected?.size})
                          </p>
                          <code className="text-[9px] text-emerald-500 font-mono mt-0.5 block">{bipResult.expected?.barcode}</code>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Bipado (Incorreto)</span>
                          <p className="font-bold text-red-300 mt-0.5 truncate">{bipResult.biped?.details}</p>
                          <code className="text-[9px] text-red-400 font-mono mt-0.5 block truncate">{bipResult.biped?.barcode}</code>
                        </div>
                      </div>
                      <p className="text-[10px] text-red-500/80 mt-3 font-semibold uppercase tracking-wider">
                        Avanço Bloqueado. Bipe a matéria-prima correta para continuar.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CAMPO DE BARCODE COM BOTÃO DE CÂMERA */}
            <div className="flex gap-3 items-center">
              <form onSubmit={handleBipSubmit} className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Barcode className="size-6 text-slate-500" />
                </div>
                <Input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Escaneie o código de barras da matéria-prima..."
                  disabled={isBiping}
                  className="h-16 pl-14 pr-24 bg-slate-900 border-2 border-slate-800 text-white rounded-2xl text-lg font-bold placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all shadow-inner w-full"
                />
                <button type="submit" disabled={isBiping || !barcode.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-12 flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:bg-slate-700 text-slate-950 px-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                  Bipar
                </button>
              </form>
              <Button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="h-16 w-16 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-primary-foreground transition-all flex-shrink-0"
                title="Escanear com a câmera do celular"
              >
                <Camera className="size-7 text-emerald-400" />
              </Button>
            </div>

          </div>

          {/* RODAPÉ DO MODO SEPARACÃO */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-800/60 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <Button 
                asChild
                variant="outline" 
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Link to={`/print/operacional`} search={{ orderId }}>
                  <Printer className="size-4 mr-2" /> Fila de Etiquetas
                </Link>
              </Button>
            </div>
            
            <div className="flex gap-2 flex-wrap items-center">
              {totalSeparatedCount > 0 && !isAllSeparated && (
                <Button
                  onClick={() => handleFinishSeparation(true)}
                  className="h-11 px-6 rounded-full font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  <AlertTriangle className="size-4 mr-2" /> Liberar Envio Parcial
                </Button>
              )}

              <Button
                onClick={() => handleFinishSeparation(false)}
                disabled={!isAllSeparated}
                className={`h-11 px-8 rounded-full font-bold transition-all ${
                  isAllSeparated 
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20" 
                    : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="size-4 mr-2" /> Concluir Separação Total
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* CAMERA SCANNER DIALOG */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-base font-bold">
              <Camera className="size-5 text-emerald-400" />
              Escanear Matéria-Prima
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {cameraError ? (
              <div className="text-red-400 text-sm text-center py-6">
                {cameraError}
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/80 animate-pulse shadow-md shadow-red-500/50 pointer-events-none" />
              </div>
            )}
            <p className="text-xs text-slate-400 text-center mt-4">
              Aponte a câmera traseira do celular para o código de barras da etiqueta.
            </p>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
