const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      clients!inner(id, name, phone),
      brands!inner(id, code),
      users:responsible_user_id(id, name),
      salesperson:salesperson_id(id, name)
    `);
  console.log("Error:", error);
  console.log("Orders:", data?.length);
}
run();
