import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuote, useUpdateQuote, useConvertQuoteToOrder, useCloneQuote } from "@/lib/api/quotes";
import { useClients } from "@/lib/api/clients";
import { quoteStatusLabel, quoteStatusTone } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Loader2, ShoppingBag, Factory, Copy, Printer,
  AlertTriangle, TrendingUp, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/orcamentos/$id")({
  head: () => ({ meta: [{ title: "Orçamento · e-roupas OS" }] }),
  component: QuoteDetailPage,
});

function QuoteDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: quote, isLoading } = useQuote(id);
  const { data: clients } = useClients();
  const updateMutation = useUpdateQuote();
  const convertMutation = useConvertQuoteToOrder();
  const cloneMutation = useCloneQuote();
  const [printMode, setPrintMode] = useState<"none" | "comercial" | "producao">("none");

  if (isLoading || !quote) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  const items = quote.items || [];
  const totalCost = Number(quote.total_cost || 0);
  const finalTotal = Number(quote.final_total || 0);
  const margin = Number(quote.gross_margin_pct || 0);
  const isConverted = quote.status.startsWith("convertido");
  const client = clients?.find(c => c.id === quote.client_id);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ id, status: newStatus as any });
      toast.success("Status atualizado!");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleConvert = async (asProduction: boolean) => {
    if (!confirm(asProduction ? "Converter em Ordem de Produção?" : "Converter em Pedido de Venda?")) return;
    try {
      const order = await convertMutation.mutateAsync({ quoteId: id, asProduction });
      toast.success(`Pedido ${order.code} criado!`);
      navigate({ to: "/pedidos/$id", params: { id: order.id } });
    } catch (e: any) { toast.error(e.message); }
  };

  const handleClone = async () => {
    try {
      const clone = await cloneMutation.mutateAsync(id);
      toast.success(`Orçamento clonado: ${clone.code}`);
      navigate({ to: "/orcamentos/$id", params: { id: clone.id } });
    } catch (e: any) { toast.error(e.message); }
  };

  const handlePrint = (mode: "comercial" | "producao") => {
    setPrintMode(mode);
    setTimeout(() => { window.print(); setPrintMode("none"); }, 100);
  };

  return (
    <>
      <div className={cn("min-h-screen bg-slate-50 pb-20", printMode !== "none" && "no-print")}>
        {/* HEADER */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/orcamentos" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></Link>
              <h1 className="text-xl font-semibold text-slate-800">Orçamento {quote.code}</h1>
              <StatusBadge tone={quoteStatusTone[quote.status]}>{quoteStatusLabel[quote.status]}</StatusBadge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePrint("comercial")} className="gap-1.5"><Printer className="size-4" /> PDF Comercial</Button>
              <Button variant="outline" size="sm" onClick={() => handlePrint("producao")} className="gap-1.5"><Printer className="size-4" /> PDF Produção</Button>
              <Button variant="outline" size="sm" onClick={handleClone} disabled={cloneMutation.isPending} className="gap-1.5 border-purple-500 text-purple-600 hover:bg-purple-50"><Copy className="size-4" /> Clonar</Button>
              {!isConverted && (
                <>
                  <Button size="sm" onClick={() => handleConvert(false)} disabled={convertMutation.isPending} className="gap-1.5 bg-green-600 hover:bg-green-700"><ShoppingBag className="size-4" /> Gerar Pedido</Button>
                  <Button size="sm" onClick={() => handleConvert(true)} disabled={convertMutation.isPending} className="gap-1.5 bg-blue-600 hover:bg-blue-700"><Factory className="size-4" /> Gerar Produção</Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
          {/* TRACEABILITY */}
          {quote.converted_order_id && (
            <div className="rounded-xl border border-green-300 bg-green-50 p-4 flex items-center gap-3">
              <ExternalLink className="size-5 text-green-700" />
              <span className="text-sm font-medium text-green-800">Convertido em pedido:</span>
              <Link to="/pedidos/$id" params={{ id: quote.converted_order_id }} className="text-sm font-mono text-green-700 underline hover:text-green-900">Ver Pedido →</Link>
            </div>
          )}

          {/* STATUS + MARGIN ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status change */}
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Alterar Status</p>
              <Select value={quote.status} onValueChange={handleStatusChange} disabled={isConverted}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["rascunho","enviado","negociacao","aprovado","rejeitado"].map(s => (
                    <SelectItem key={s} value={s}>{quoteStatusLabel[s as keyof typeof quoteStatusLabel]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Margin */}
            <div className={cn("rounded-2xl border-2 p-5 flex items-center gap-4", margin < 0 ? "border-red-400 bg-red-50" : margin < 15 ? "border-amber-400 bg-amber-50" : "border-emerald-400 bg-emerald-50")}>
              {margin < 15 ? <AlertTriangle className={cn("size-6", margin < 0 ? "text-red-600" : "text-amber-600")} /> : <TrendingUp className="size-6 text-emerald-600" />}
              <div>
                <p className="text-sm font-semibold">Margem Bruta</p>
                <p className="text-xs text-muted-foreground">Custo: R$ {totalCost.toFixed(2)}</p>
              </div>
              <div className={cn("text-3xl font-bold ml-auto", margin < 0 ? "text-red-600" : margin < 15 ? "text-amber-600" : "text-emerald-600")}>{margin.toFixed(1)}%</div>
            </div>
            {/* Total */}
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total do Orçamento</p>
              <p className="text-3xl font-bold tracking-tight">R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground mt-1">Validade: {quote.validity_days} dias</p>
            </div>
          </div>

          {/* CLIENT INFO */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Dados do Cliente</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{quote.client_name}</span></div>
              <div><span className="text-muted-foreground">Empresa:</span> <span className="font-medium">{client?.company_name || "—"}</span></div>
              <div><span className="text-muted-foreground">Pagamento:</span> <span className="font-medium">{quote.payment_method || "—"}</span></div>
              <div><span className="text-muted-foreground">Condição:</span> <span className="font-medium">{quote.payment_condition || "—"}</span></div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="rounded-2xl border bg-card overflow-hidden">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground px-5 pt-4 mb-3">Itens do Orçamento ({items.length})</h3>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Produto</th>
                  <th className="text-left font-medium px-4 py-2.5">Composição</th>
                  <th className="text-center font-medium px-4 py-2.5">Qtd</th>
                  <th className="text-right font-medium px-4 py-2.5">Custo un.</th>
                  <th className="text-right font-medium px-4 py-2.5">Preço un.</th>
                  <th className="text-right font-medium px-4 py-2.5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-xs text-muted-foreground">{item.sku || "Sem SKU"}</div>
                    </td>
                    <td className="px-4 py-3">
                      {item.customizations?.length > 0 ? (
                        <div className="space-y-0.5">{item.customizations.map((c: any, ci: number) => (
                          <div key={ci} className="text-xs bg-muted/50 px-2 py-1 rounded">• {c.quantity}x {c.name} {c.details ? `(${c.details})` : ""}</div>
                        ))}</div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground number">{(item.unit_cost || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right number font-medium">{(item.unit_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right number font-bold">{((item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NOTES */}
          {(quote.notes || quote.internal_notes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quote.notes && <div className="rounded-2xl border bg-card p-5"><h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Observações</h3><p className="text-sm whitespace-pre-wrap">{quote.notes}</p></div>}
              {quote.internal_notes && <div className="rounded-2xl border bg-card p-5"><h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Observações Internas</h3><p className="text-sm whitespace-pre-wrap">{quote.internal_notes}</p></div>}
            </div>
          )}
        </div>
      </div>

      {/* PRINT: COMERCIAL (A4) — same as pedido print */}
      {printMode === "comercial" && (
        <div className="print-only p-8 text-black bg-white max-w-[210mm] mx-auto min-h-[297mm]">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
            <div><h1 className="text-3xl font-bold uppercase tracking-tighter">e-roupas</h1><p className="text-sm text-gray-600">Orçamento Comercial</p></div>
            <div className="text-right"><p className="font-bold text-xl">{quote.code}</p><p className="text-sm text-gray-600">Data: {new Date(quote.created_at).toLocaleDateString("pt-BR")}</p><p className="text-sm text-gray-600">Validade: {quote.validity_days} dias</p></div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div><h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Dados do Cliente</h3><p><strong>Nome:</strong> {quote.client_name}</p><p><strong>Empresa:</strong> {client?.company_name || "—"}</p></div>
            <div><h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Informações Comerciais</h3><p><strong>Pagamento:</strong> {quote.payment_method || "—"}</p><p><strong>Condição:</strong> {quote.payment_condition || "—"}</p></div>
          </div>
          <div className="mb-8">
            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Itens do Orçamento</h3>
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100"><tr><th className="border border-gray-300 p-2 w-12">Qtd</th><th className="border border-gray-300 p-2">Produto</th><th className="border border-gray-300 p-2">Detalhes</th><th className="border border-gray-300 p-2 w-24 text-right">Unit R$</th><th className="border border-gray-300 p-2 w-24 text-right">Total R$</th></tr></thead>
              <tbody>{items.map((item: any, i: number) => (
                <tr key={i}><td className="border border-gray-300 p-2 text-center font-bold">{item.quantity}</td><td className="border border-gray-300 p-2"><div className="font-semibold">{item.product_name}</div><div className="text-xs text-gray-500">SKU: {item.sku || "N/A"}</div></td><td className="border border-gray-300 p-2">{item.customizations?.length > 0 ? <div className="text-xs space-y-1">{item.customizations.map((c: any, ci: number) => <div key={ci}>• {c.quantity}x {c.name} {c.details ? `(${c.details})` : ""}</div>)}</div> : <span className="text-gray-400 text-xs">Sem personalização</span>}</td><td className="border border-gray-300 p-2 text-right number">{(item.unit_price || 0).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td><td className="border border-gray-300 p-2 text-right number">{((item.unit_price || 0) * (item.quantity || 1)).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="text-right text-sm">
            <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Subtotal:</span><span>R$ {Number(quote.estimated_total || 0).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
            {Number(quote.discount) > 0 && <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Desconto:</span><span>- R$ {Number(quote.discount).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>}
            {Number(quote.freight_cost) > 0 && <div className="flex justify-between border-b border-gray-200 py-1"><span className="text-gray-600">Frete:</span><span>+ R$ {Number(quote.freight_cost).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>}
            <div className="flex justify-between py-2 text-lg font-bold"><span>Total:</span><span>R$ {finalTotal.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
          </div>
          {quote.notes && <div className="mt-6 text-sm"><h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Observações</h3><p className="whitespace-pre-wrap">{quote.notes}</p></div>}
          <div className="text-center text-xs text-gray-500 mt-16 border-t border-gray-300 pt-4">Documento gerado pelo sistema ERP em {new Date().toLocaleString("pt-BR")}</div>
        </div>
      )}

      {/* PRINT: PRODUÇÃO — only products + compositions */}
      {printMode === "producao" && (
        <div className="print-only p-8 text-black bg-white max-w-[210mm] mx-auto min-h-[297mm]">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
            <div><h1 className="text-3xl font-bold uppercase tracking-tighter">e-roupas</h1><p className="text-sm text-gray-600">Relatório de Produção</p></div>
            <div className="text-right"><p className="font-bold text-xl">{quote.code}</p><p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString("pt-BR")}</p></div>
          </div>
          <div className="mb-4 text-sm"><p><strong>Cliente:</strong> {quote.client_name}</p></div>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100"><tr><th className="border border-gray-300 p-2 w-12">Qtd</th><th className="border border-gray-300 p-2">Produto</th><th className="border border-gray-300 p-2">Composição / Estrutura (BOM)</th></tr></thead>
            <tbody>{items.map((item: any, i: number) => (
              <tr key={i} className="print-break-inside-avoid">
                <td className="border border-gray-300 p-2 text-center font-bold text-lg">{item.quantity}</td>
                <td className="border border-gray-300 p-2"><div className="font-bold text-base">{item.product_name}</div><div className="text-xs text-gray-500">SKU: {item.sku || "N/A"}</div></td>
                <td className="border border-gray-300 p-2">{item.customizations?.length > 0 ? (
                  <div className="space-y-1">{item.customizations.map((c: any, ci: number) => (
                    <div key={ci} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded border border-gray-200">
                      <span className="font-bold text-sm">{c.quantity}x</span>
                      <span className="font-medium">{c.name}</span>
                      {c.details && <span className="text-gray-500">— {c.details}</span>}
                    </div>
                  ))}</div>
                ) : <span className="text-gray-400">Liso / Sem composição</span>}</td>
              </tr>
            ))}</tbody>
          </table>
          <div className="text-center text-xs text-gray-500 mt-16 border-t border-gray-300 pt-4">Relatório de produção gerado em {new Date().toLocaleString("pt-BR")}</div>
        </div>
      )}
    </>
  );
}
