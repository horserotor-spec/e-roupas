import { createFileRoute } from "@tanstack/react-router";
import { useOrder } from "@/lib/api/orders";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/print/$id")({
  component: PrintPage,
});

function PrintPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="flex h-screen items-center justify-center">Pedido não encontrado.</div>;
  }

  const itemsTotalNet = order.items.reduce((acc, item) => acc + (Number(item.unit_price || 0) * item.quantity), 0);
  const saleDiscount = itemsTotalNet * (Number(order.discount || 0) / 100);
  const otherExpenses = Number(order.other_expenses || 0);
  const freight = Number(order.freight_cost || 0);
  const finalTotal = itemsTotalNet - saleDiscount + otherExpenses + freight;

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:py-0 print:bg-white">
      <div className="max-w-[800px] mx-auto mb-6 flex justify-end px-6 print:hidden">
        <Button onClick={() => window.print()} className="bg-primary text-white hover:bg-primary/90">
          <Printer className="size-4 mr-2" /> Imprimir
        </Button>
      </div>

      <div className="max-w-[800px] mx-auto bg-white p-12 shadow-sm rounded-xl print:shadow-none print:p-12 print:m-0">
        <div className="flex justify-between items-start border-b pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
              {order.status === "orcamento" ? "Orçamento" : "Pedido de Venda"}
            </h1>
            <p className="text-slate-500 font-mono mt-1">#{order.code}</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="e-roupas" className="h-8 object-contain ml-auto mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cliente</h3>
            <p className="font-semibold">{order.client_name}</p>
            {order.clients?.phone && <p className="text-sm text-slate-600">{order.clients.phone}</p>}
            {order.clients?.email && <p className="text-sm text-slate-600">{order.clients.email}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalhes</h3>
            <p className="text-sm text-slate-600">
              Vendedor: <span className="font-medium">{order.salesperson_name || "N/A"}</span>
            </p>
            <p className="text-sm text-slate-600">
              Marca: <span className="font-medium">{order.brand_code}</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-y text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-center py-3 px-4 font-semibold">Qtd</th>
                <th className="text-right py-3 px-4 font-semibold">Un. (R$)</th>
                <th className="text-right py-3 px-4 font-semibold">Total (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</p>
                  </td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{(item.unit_price || 0).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td>
                  <td className="py-3 px-4 text-right">{((item.unit_price || 0) * item.quantity).toLocaleString("pt-BR", {minimumFractionDigits:2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observações</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{order.notes || "Nenhuma observação."}</p>
          </div>
          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Subtotal:</span> 
              <span className="font-medium">R$ {itemsTotalNet.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span>
            </div>
            {saleDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descontos:</span> 
                <span>- R$ {saleDiscount.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span>
              </div>
            )}
            {(freight > 0 || otherExpenses > 0) && (
              <div className="flex justify-between text-slate-500">
                <span>Frete/Outros:</span> 
                <span>+ R$ {(freight + otherExpenses).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>Total Final:</span> 
              <span>R$ {finalTotal.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-slate-400 mt-16 pt-6 border-t">
          Documento gerado em {new Date().toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}
