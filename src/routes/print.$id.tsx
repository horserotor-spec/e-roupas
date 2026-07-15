import { createFileRoute } from "@tanstack/react-router";
import { useOrder } from "@/lib/api/orders";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const Route = createFileRoute("/print/$id")({
  component: PrintPage,
});

function PrintPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading } = useOrder(id);

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

  // Update document title so that PDF export proposes a nice filename
  useEffect(() => {
    if (order) {
      const originalTitle = document.title;
      const type = order.status === "orcamento" ? "Orcamento" : "Pedido";
      const dateStr = new Date(order.created_at || Date.now()).toISOString().split("T")[0];
      document.title = `${type}_${order.code}_${dateStr}`;
      
      return () => {
        document.title = originalTitle;
      };
    }
  }, [order]);

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
            <p className="text-xs text-slate-500">Emitido em: {new Date(order.created_at || Date.now()).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cliente</h3>
            <p className="font-semibold">{order.client_name}</p>
            {order.clients?.company_name && order.clients.company_name !== order.clients.name && (
              <p className="text-sm text-slate-600">Razão Social: {order.clients.company_name}</p>
            )}
            {order.clients?.document && (
              <p className="text-sm text-slate-600">CPF/CNPJ: {order.clients.document}</p>
            )}
            {(order.clients?.phone || order.clients?.landline_phone) && (
              <p className="text-sm text-slate-600">Tel: {order.clients.phone || order.clients.landline_phone}</p>
            )}
            {order.clients?.email && (
              <p className="text-sm text-slate-600">Email: {order.clients.email}</p>
            )}
            {(order.clients?.street || order.clients?.city) && (
              <p className="text-xs text-slate-500 mt-2 border-t pt-2 leading-relaxed">
                <strong>Endereço:</strong> {order.clients.street}{order.clients.number ? `, ${order.clients.number}` : ""}
                {order.clients.complement ? ` - ${order.clients.complement}` : ""}
                {order.clients.neighborhood ? ` - ${order.clients.neighborhood}` : ""}
                {order.clients.city ? ` - ${order.clients.city}/${order.clients.state || ""}` : ""}
                {order.clients.zip_code ? ` - CEP: ${order.clients.zip_code}` : ""}
              </p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalhes</h3>
            <p className="text-sm text-slate-600">
              Vendedor: <span className="font-medium">{order.salesperson_name || "N/A"}</span>
            </p>
            <p className="text-sm text-slate-600">
              Marca: <span className="font-medium">{order.brand_code}</span>
            </p>
            {order.payment_method && (
              <p className="text-sm text-slate-600">
                Forma de Pagamento: <span className="font-medium">{order.payment_method}</span>
              </p>
            )}
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

        <div className="grid grid-cols-2 gap-8 mb-6">
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

        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Forma de Pagamento / Parcelas</h3>
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase">
                <th className="border border-slate-200 p-1.5 font-semibold w-12 text-center">#</th>
                <th className="border border-slate-200 p-1.5 font-semibold">Valor (R$)</th>
                <th className="border border-slate-200 p-1.5 font-semibold">Forma</th>
                <th className="border border-slate-200 p-1.5 font-semibold">Data Venc.</th>
              </tr>
            </thead>
            <tbody>
              {(order.payments && order.payments.length > 0
                ? order.payments
                : [{ amount: finalTotal, payment_method: order.payment_method || "PIX", due_date: order.sale_date ? order.sale_date.substring(0, 10) : new Date().toISOString().split("T")[0] }]
              ).map((p, idx) => (
                <tr key={idx} className="text-slate-700">
                  <td className="border border-slate-200 p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-slate-200 p-1.5 font-medium">R$ {Number(p.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="border border-slate-200 p-1.5">{p.payment_method || "PIX"}</td>
                  <td className="border border-slate-200 p-1.5">{p.due_date ? p.due_date.split("-").reverse().join("/") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 flex justify-between gap-8 pt-8 mb-6">
          <div className="w-[45%] text-center border-t border-slate-400 pt-2 text-xs">
            Assinatura do Vendedor / Responsável
          </div>
          <div className="w-[45%] text-center border-t border-slate-400 pt-2 text-xs">
            De acordo do Cliente (Ok / Assinatura)
          </div>
        </div>
        
        <div className="text-center text-xs text-slate-400 mt-16 pt-6 border-t">
          Documento gerado em {new Date().toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}
