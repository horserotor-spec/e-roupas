import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { bipSeparationItem, BipSeparationResult } from "@/lib/api/orders";
import { ArrowLeft, Barcode, CheckCircle2, AlertOctagon, Loader2, Sparkles, Printer, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/producao/separacao")({
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

  // Focar no campo de leitura continuamente
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [activeItemIndex, bipResult]);

  // Manter foco ao clicar em qualquer lugar da tela
  const handleScreenClick = () => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  const handleBipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    const currentItem = order?.order_items?.[activeItemIndex];
    if (!currentItem) {
      toast.error("Nenhum item selecionado para separação.");
      return;
    }

    setIsBiping(true);
    setBipResult(null);

    try {
      const res = await bipSeparationItem(orderId, currentItem.id, barcode);
      setBipResult(res);
      setBarcode("");

      if (res.success) {
        toast.success("MP Validado e baixado no estoque!");
        // Invalidar cache de pedidos para atualizar as quantidades separadas
        queryClient.invalidateQueries({ queryKey: ["separacao_pedido", orderId] });
      } else {
        toast.error("MP Incorreto! Bipagem bloqueada.");
      }
    } catch (err: any) {
      toast.error("Erro na validação: " + err.message);
    } finally {
      setIsBiping(false);
    }
  };

  // Se o item atual já estiver totalmente separado, seleciona automaticamente o próximo pendente
  useEffect(() => {
    if (order?.order_items) {
      const currentItem = order.order_items[activeItemIndex];
      if (currentItem && Number(currentItem.quantity_separated || 0) >= Number(currentItem.quantity)) {
        // Encontrar próximo item com quantidade pendente
        const nextPendingIdx = order.order_items.findIndex((item: any, idx: number) => 
          Number(item.quantity_separated || 0) < Number(item.quantity)
        );
        if (nextPendingIdx !== -1) {
          setActiveItemIndex(nextPendingIdx);
          setBipResult(null);
        }
      }
    }
  }, [order, activeItemIndex]);

  const handleFinishSeparation = async () => {
    // Verificar se todos os itens estão separados
    const hasPending = order?.order_items?.some((item: any) => 
      Number(item.quantity_separated || 0) < Number(item.quantity)
    );

    if (hasPending) {
      toast.error("Ainda restam peças pendentes de separação física.");
      return;
    }

    // Avançar status do pedido para "🟢 Separado" e mover o processo de Separação para concluído
    const { error: statusError } = await supabase
      .from("orders")
      .update({ status: "corte" }) // Avança para o Kanban do Corte
      .eq("id", orderId);

    if (statusError) {
      toast.error("Erro ao atualizar status do pedido.");
      return;
    }

    // Atualizar o status do processo na tabela order_item_processes
    const itemIds = order.order_items.map((i: any) => i.id);
    await supabase
      .from("order_item_processes")
      .update({ status: "concluido", finished_at: new Date().toISOString() })
      .in("order_item_id", itemIds);

    // Timeline
    await supabase.from("order_timeline").insert([{
      order_id: orderId,
      event_type: "separacao_concluida",
      description: "Separação física de todas as peças concluída. Pedido liberado para o Corte."
    }]);

    toast.success("Separação concluída com sucesso! Pedido avançado.");
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

            {/* CAMPO DE BARCODE INVISIVEL / AUTO-FOCADO */}
            <form onSubmit={handleBipSubmit} className="relative">
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
                className="h-16 pl-14 pr-4 bg-slate-900 border-2 border-slate-800 text-white rounded-2xl text-lg font-bold placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-inner w-full"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 uppercase tracking-widest">Aguardando Scanner</span>
              </div>
            </form>

          </div>

          {/* RODAPÉ DO MODO SEPARACÃO */}
          <div className="flex-shrink-0 flex justify-between items-center pt-6 border-t border-slate-800/60 max-w-4xl mx-auto w-full">
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
            
            <Button
              onClick={handleFinishSeparation}
              disabled={!isAllSeparated}
              className={`h-11 px-8 rounded-full font-bold transition-all ${
                isAllSeparated 
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20" 
                  : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="size-4 mr-2" /> Concluir e Liberar Pedido
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
