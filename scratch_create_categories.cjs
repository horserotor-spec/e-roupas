const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://krmcxyafxouhuzapulxj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE2MzgzNSwiZXhwIjoyMDk1NzM5ODM1fQ.lLFvcOSMoLPlQsKr0gw9hQTDgCwbvDYgyby990fyqwA'
);

async function run() {
  const sql = `
    CREATE TABLE IF NOT EXISTS product_categories (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow all categories" ON product_categories;
    CREATE POLICY "Allow all categories" ON product_categories FOR ALL USING (true);
    
    GRANT ALL ON product_categories TO service_role;
    GRANT ALL ON product_categories TO anon;
    GRANT ALL ON product_categories TO authenticated;
  `;
  
  // Note: the supabase RPC 'exec_sql' may not exist unless created by a user, but let's try.
  // If it doesn't exist, we'll get an error.
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
    console.error('Error running exec_sql:', error.message);
  } else {
    console.log('Success:', data);
  }
}

run();
