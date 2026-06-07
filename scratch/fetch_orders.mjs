import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      clients!orders_client_id_fkey!inner(id, name, phone),
      brands!inner(id, code),
      users:responsible_user_id(id, name),
      salesperson:clients!orders_salesperson_id_fkey(id, name)
    `).order('created_at', { ascending: false }).limit(2);
  console.log("Error:", error);
  console.log("Orders with relations:", data?.length);
}
run();
