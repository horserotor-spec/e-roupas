import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('clients').select('*').limit(1);
  if (error) {
    console.error("Error fetching clients:", error);
  } else {
    console.log("Client columns:", data.length > 0 ? Object.keys(data[0]) : "No clients found to inspect");
  }
}

check();
