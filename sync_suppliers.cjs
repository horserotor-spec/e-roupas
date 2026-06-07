const { createClient } = require('@supabase/supabase-js');

const url = 'https://krmcxyafxouhuzapulxj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjM4MzUsImV4cCI6MjA5NTczOTgzNX0.8sHHLRBakYvA8rvg6WIqbMHrjUKHzCUrqf-zrojN0tM';

const supabase = createClient(url, key);

(async () => {
  const {data: clients, error: err1} = await supabase.from('clients').select('*').eq('entity_type', 'fornecedor');
  if(err1) { console.error('Error fetching clients:', err1); return; }
  if(!clients || clients.length === 0) { console.log('No suppliers in CRM.'); return; }
  
  console.log(`Found ${clients.length} suppliers in CRM. Syncing to inventory suppliers...`);
  let synced = 0;
  for(const c of clients) {
    const { error: err2 } = await supabase.from('suppliers').upsert({
      id: c.id,
      name: c.name,
      company_name: c.company_name,
      cnpj: c.document,
      phone: c.phone,
      email: c.email,
      city: c.city,
      active: true
    }, { onConflict: 'id' });
    
    if(err2) {
      console.error(`Error syncing ${c.name}:`, err2);
    } else {
      synced++;
    }
  }
  console.log(`Synced ${synced} out of ${clients.length} suppliers.`);
})();
