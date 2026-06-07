import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('orders').select('*');
  console.log("Orders:", data?.length);
  if (data?.length > 0) {
    console.log("First order:", data[0]);
  } else {
    console.log("No orders found");
  }
}
run();
