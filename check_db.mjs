import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const data = [
     {
       type: 'receber',
       description: `Teste`,
       amount: 100,
       original_amount: 100,
       due_date: new Date().toISOString().split('T')[0],
       status: 'pendente',
       payment_method: 'PIX',
       cost_center: 'Comercial'
     }
  ];
  const result = await supabase.from('financial_transactions').insert(data).select();
  console.log("Insert result:", JSON.stringify(result, null, 2));
}

check();
