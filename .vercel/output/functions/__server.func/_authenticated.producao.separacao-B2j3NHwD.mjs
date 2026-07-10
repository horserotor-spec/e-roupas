import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { p as Route$b, B as Button, D as Dialog, f as DialogContent, i as DialogHeader, j as DialogTitle, y as supabase } from "./_ssr/router-C3pqRbRf.mjs";
import { b as bipSeparationItem } from "./_ssr/orders-E2Xxa3Vy.mjs";
import { I as Input } from "./_ssr/input-D7a6tjwM.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { B as Badge } from "./_ssr/badge-D804Hfqt.mjs";
import { H as Html5Qrcode } from "./_libs/html5-qrcode.mjs";
import { V as LoaderCircle, c as ArrowLeft, B as Barcode, r as CircleCheck, a3 as OctagonAlert, i as Camera, aa as Printer } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/cmdk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
function SeparationPage() {
  const params = Route$b.useSearch();
  const orderId = params.orderId || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [barcode, setBarcode] = reactExports.useState("");
  const [activeItemIndex, setActiveItemIndex] = reactExports.useState(0);
  const [bipResult, setBipResult] = reactExports.useState(null);
  const [isBiping, setIsBiping] = reactExports.useState(false);
  const barcodeInputRef = reactExports.useRef(null);
  const [cameraOpen, setCameraOpen] = reactExports.useState(false);
  const [cameraError, setCameraError] = reactExports.useState(null);
  const html5QrCodeRef = reactExports.useRef(null);
  const {
    data: order,
    isLoading
  } = useQuery({
    queryKey: ["separacao_pedido", orderId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("orders").select(`
          *,
          clients!orders_client_id_fkey(id, name, company_name),
          order_items(*)
        `).eq("id", orderId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!orderId
  });
  const playBeep = (success) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(success ? 1e3 : 180, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + (success ? 0.12 : 0.45));
    } catch (e) {
      console.error("Falha ao reproduzir bipe:", e);
    }
  };
  reactExports.useEffect(() => {
    if (barcodeInputRef.current && !cameraOpen) {
      barcodeInputRef.current.focus();
    }
  }, [activeItemIndex, bipResult, cameraOpen]);
  reactExports.useEffect(() => {
    if (cameraOpen) {
      setCameraError(null);
      const timer = setTimeout(() => {
        const html5QrCode = new Html5Qrcode("camera-scanner-view");
        html5QrCodeRef.current = html5QrCode;
        html5QrCode.start({
          facingMode: "environment"
        }, {
          fps: 10,
          qrbox: (width, height) => {
            return {
              width: Math.min(width * 0.85, 280),
              height: 100
            };
          }
        }, (decodedText) => {
          handleCameraScan(decodedText);
        }, () => {
        }).catch((err) => {
          console.error("Erro ao iniciar câmera:", err);
          setCameraError("Acesso à câmera negado ou não disponível.");
        });
      }, 300);
      return () => {
        clearTimeout(timer);
        if (html5QrCodeRef.current) {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch((err) => console.error("Erro ao fechar scanner:", err));
          }
        }
      };
    }
  }, [cameraOpen, activeItemIndex]);
  const handleCameraScan = async (scannedCode) => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop().catch((err) => console.error(err));
    }
    setCameraOpen(false);
    await processBip(scannedCode);
  };
  const handleScreenClick = () => {
    if (barcodeInputRef.current && !cameraOpen) {
      barcodeInputRef.current.focus();
    }
  };
  const processBip = async (codeToProcess) => {
    if (!codeToProcess.trim()) return;
    const currentItem2 = order?.order_items?.[activeItemIndex];
    if (!currentItem2) {
      toast.error("Nenhum item selecionado para separação.");
      return;
    }
    setIsBiping(true);
    setBipResult(null);
    try {
      const res = await bipSeparationItem(orderId, currentItem2.id, codeToProcess);
      setBipResult(res);
      setBarcode("");
      if (res.success) {
        playBeep(true);
        toast.success("MP Validado e baixado no estoque!");
        queryClient.invalidateQueries({
          queryKey: ["separacao_pedido", orderId]
        });
      } else {
        playBeep(false);
        toast.error("MP Incorreto! Bipagem bloqueada.");
      }
    } catch (err) {
      playBeep(false);
      toast.error("Erro na validação: " + err.message);
    } finally {
      setIsBiping(false);
    }
  };
  const handleBipSubmit = async (e) => {
    e.preventDefault();
    await processBip(barcode);
  };
  reactExports.useEffect(() => {
    if (order?.order_items) {
      const currentItem2 = order.order_items[activeItemIndex];
      if (currentItem2 && Number(currentItem2.quantity_separated || 0) >= Number(currentItem2.quantity)) {
        const nextPendingIdx = order.order_items.findIndex((item) => Number(item.quantity_separated || 0) < Number(item.quantity));
        if (nextPendingIdx !== -1) {
          setActiveItemIndex(nextPendingIdx);
          setBipResult(null);
        }
      }
    }
  }, [order, activeItemIndex]);
  const handleFinishSeparation = async (isPartial = false) => {
    const hasPending = order?.order_items?.some((item) => Number(item.quantity_separated || 0) < Number(item.quantity));
    if (!isPartial && hasPending) {
      toast.error("Ainda restam peças pendentes de separação física.");
      return;
    }
    if (isPartial) {
      const confirmText = `Deseja liberar o ENVIO PARCIAL deste pedido? Apenas ${totalSeparatedCount} de ${totalItemsCount} peças foram separadas.`;
      if (!window.confirm(confirmText)) return;
    }
    const {
      error: statusError
    } = await supabase.from("orders").update({
      status: "corte"
    }).eq("id", orderId);
    if (statusError) {
      toast.error("Erro ao atualizar status do pedido.");
      return;
    }
    const separatedItemIds = order.order_items.filter((i) => (i.quantity_separated || 0) > 0).map((i) => i.id);
    if (separatedItemIds.length > 0) {
      await supabase.from("order_item_processes").update({
        status: "concluido",
        finished_at: (/* @__PURE__ */ new Date()).toISOString()
      }).in("order_item_id", separatedItemIds);
    }
    await supabase.from("order_timeline").insert([{
      order_id: orderId,
      event_type: isPartial ? "separacao_parcial" : "separacao_concluida",
      description: isPartial ? `Separação física PARCIAL concluída (Envio Parcial). Separadas ${totalSeparatedCount} de ${totalItemsCount} peças. Liberado para o corte.` : "Separação física de todas as peças concluída. Pedido liberado para o Corte."
    }]);
    toast.success(isPartial ? "Envio parcial liberado com sucesso!" : "Separação concluída com sucesso! Pedido avançado.");
    navigate({
      to: "/producao"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center text-slate-500 font-medium", children: "Pedido não encontrado." });
  }
  const items = order.order_items || [];
  const currentItem = items[activeItemIndex];
  const totalItemsCount = items.reduce((acc, i) => acc + Number(i.quantity), 0);
  const totalSeparatedCount = items.reduce((acc, i) => acc + (Number(i.quantity_separated) || 0), 0);
  const isAllSeparated = totalSeparatedCount >= totalItemsCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: handleScreenClick, className: "min-h-screen bg-slate-900 text-white flex flex-col font-sans select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 bg-slate-800/80 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/producao", className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold tracking-tight text-white flex items-center gap-2", children: [
            "Modo Separação ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-slate-700 text-slate-200", children: "Industrial" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: [
            "Pedido: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200 font-bold", children: order.code }),
            " · Cliente: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200 font-bold", children: order.clients?.name })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black text-emerald-400 font-mono", children: [
          totalSeparatedCount,
          " / ",
          totalItemsCount
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-bold", children: "Peças Separadas" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-[360px] bg-slate-800/40 border-r border-slate-800 flex flex-col overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Itens a Separar" }),
          isAllSeparated && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", children: "Totalmente Separado" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-800/60", children: items.map((item, idx) => {
          const active = idx === activeItemIndex;
          const completed = Number(item.quantity_separated || 0) >= Number(item.quantity);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveItemIndex(idx);
            setBipResult(null);
          }, className: `w-full text-left p-4 flex items-start justify-between transition-colors ${active ? "bg-primary/10 border-l-4 border-primary" : completed ? "bg-slate-800/10 border-l-4 border-emerald-500" : "hover:bg-slate-800/30 border-l-4 border-transparent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4 truncate flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm truncate text-white", children: item.product_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5 truncate", children: item.sku }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-semibold", children: [
                  "Tamanho: ",
                  item.size
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-semibold", children: item.gender })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-base font-bold font-mono ${completed ? "text-emerald-400" : "text-amber-400"}`, children: [
                item.quantity_separated || 0,
                " / ",
                item.quantity
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-500 font-bold uppercase", children: "Qtd" })
            ] })
          ] }, item.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-slate-950 p-6 md:p-10 flex flex-col justify-between overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-8", children: [
          currentItem && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-slate-800/10 rounded-full flex items-center justify-center opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { className: "size-16" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-4", children: "Aguardando Matéria-Prima" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-extrabold text-white mb-2", children: currentItem.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase tracking-wider block", children: "Modelo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: currentItem.model || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase tracking-wider block", children: "Malha" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: currentItem.fabric || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase tracking-wider block", children: "Cor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: currentItem.color || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase tracking-wider block", children: "Tamanho" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-max block mt-0.5", children: currentItem.size })
              ] })
            ] })
          ] }),
          bipResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-6 rounded-2xl border flex items-start gap-4 transition-all animate-in fade-in zoom-in duration-200 ${bipResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400 shadow-lg shadow-red-950/20"}`, children: bipResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-10 text-emerald-400 flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-black tracking-tight", children: bipResult.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-500/80 mt-1", children: "Estoque do lote correspondente baixado com sucesso. Código de barras aceito." })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "size-10 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-black tracking-tight", children: bipResult.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-black/40 p-3.5 rounded-xl border border-red-500/10 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase block", children: "Esperado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white mt-0.5", children: [
                    bipResult.expected?.fabric,
                    " · ",
                    bipResult.expected?.color,
                    " (",
                    bipResult.expected?.size,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[9px] text-emerald-500 font-mono mt-0.5 block", children: bipResult.expected?.barcode })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase block", children: "Bipado (Incorreto)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-red-300 mt-0.5 truncate", children: bipResult.biped?.details }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[9px] text-red-400 font-mono mt-0.5 block truncate", children: bipResult.biped?.barcode })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-500/80 mt-3 font-semibold uppercase tracking-wider", children: "Avanço Bloqueado. Bipe a matéria-prima correta para continuar." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleBipSubmit, className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { className: "size-6 text-slate-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref: barcodeInputRef, type: "text", value: barcode, onChange: (e) => setBarcode(e.target.value), placeholder: "Escaneie o código de barras da matéria-prima...", disabled: isBiping, className: "h-16 pl-14 pr-4 bg-slate-900 border-2 border-slate-800 text-white rounded-2xl text-lg font-bold placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-inner w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 uppercase tracking-widest", children: "Aguardando Scanner" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: () => setCameraOpen(true), className: "h-16 w-16 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-primary-foreground transition-all flex-shrink-0", title: "Escanear com a câmera do celular", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-7 text-emerald-400" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-800/60 max-w-4xl mx-auto w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/print/operacional`, search: {
            orderId
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
            " Fila de Etiquetas"
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap items-center", children: [
            totalSeparatedCount > 0 && !isAllSeparated && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleFinishSeparation(true), className: "h-11 px-6 rounded-full font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "size-4 mr-2" }),
              " Liberar Envio Parcial"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleFinishSeparation(false), disabled: !isAllSeparated, className: `h-11 px-8 rounded-full font-bold transition-all ${isAllSeparated ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 mr-2" }),
              " Concluir Separação Total"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: cameraOpen, onOpenChange: setCameraOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md bg-slate-950 border-slate-800 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2 text-base font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5 text-emerald-400" }),
        "Escanear Matéria-Prima"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center p-4", children: [
        cameraError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 text-sm text-center py-6", children: cameraError }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "camera-scanner-view", className: "w-full h-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-1/2 h-0.5 bg-red-500/80 animate-pulse shadow-md shadow-red-500/50 pointer-events-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 text-center mt-4", children: "Aponte a câmera traseira do celular para o código de barras da etiqueta." })
      ] })
    ] }) })
  ] });
}
export {
  SeparationPage as component
};
