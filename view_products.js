import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*').limit(5);
  console.log(error ? error : JSON.stringify(data, null, 2));
}
run();
