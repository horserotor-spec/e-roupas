import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Deletando inventory_movements...");
  const { data: moveData, error: moveError } = await supabase
    .from('inventory_movements')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (moveError) console.error("Erro delete move:", moveError);
  else console.log("Movimentações deletadas com sucesso.");

  console.log("Deletando separation_logs...");
  const { data: sepLogData, error: sepLogError } = await supabase
    .from('separation_logs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (sepLogError) console.error("Erro delete separation_logs:", sepLogError);

  console.log("Deletando piece_identities...");
  const { data: pieceData, error: pieceError } = await supabase
    .from('piece_identities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Resetando quantidade separada dos itens de pedidos...");
  const { error: orderItemsError } = await supabase
    .from('order_items')
    .update({ quantity_separated: 0 })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Atualizando product_variants para 20 em estoque...");
  const { data: varData, error: varError } = await supabase
    .from('product_variants')
    .update({ stock_quantity: 20 })
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (varError) console.error("Erro update variants:", varError);
  else console.log("Variantes atualizadas com sucesso.");
  
  console.log("Fim do script.");
}

run();
