import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data keys:', data ? Object.keys(data[0] || {}) : []);
  const { error: notifyErr } = await supabase.rpc('reload_schema');
}
check();
