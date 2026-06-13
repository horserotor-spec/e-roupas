import { supabase } from './src/lib/supabase';
import { allocateStockAndCreateProcesses } from './src/lib/api/orders';

async function run() {
  console.log("Deletando reservas de estoque antigas para recalcular...");
  await supabase.from('stock_reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Buscando pedidos ativos...");
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status')
    .in('status', ['confirmado', 'separacao', 'em_producao', 'corte', 'costura', 'bordado', 'impressao', 'prensa']);

  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    return;
  }

  console.log(`Realocando estoque para ${orders.length} pedidos com os novos lotes de 20 peças...`);
  for (const order of orders) {
    console.log(`Processando pedido ${order.id}...`);
    try {
      await allocateStockAndCreateProcesses(order.id);
    } catch (e) {
      console.error(`Falha no pedido ${order.id}:`, e);
    }
  }

  console.log("Concluído! Todos os pedidos devem estar com estoque alocado agora.");
}

run();
