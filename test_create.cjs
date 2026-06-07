const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const finalCode = "GEN-260607-0001";
  const orderData = {
    client_id: "753bcab2-a6f0-466a-bcde-23bc49a37cda", // need a valid client id
    brand_id: "087bcab2-a6f0-466a-bcde-23bc49a37cda", // need a valid brand id
    store: "Matriz",
    business_unit: "",
    delivery_days: 0,
    other_expenses: 0,
    discount: 0,
    sale_date: "2026-06-07",
    departure_date: null,
    expected_date: null,
    purchase_order: "",
    payment_category: "Sem categoria",
    payment_condition: "",
    payment_method: "PIX",
    origin_channel: "Internet",
    carrier_name: "",
    freight_payer: "CIF",
    volumes_quantity: 0,
    gross_weight: 0,
    freight_cost: 0,
    logistics_integration: "",
    notes: "",
    internal_notes: "",
    items_discount: 0,
    estimated_total: 100,
    final_total: 100
  };

  // get a client
  const { data: clients } = await supabase.from('clients').select('id').limit(1);
  if (clients.length > 0) orderData.client_id = clients[0].id;
  
  // get a brand
  const { data: brands } = await supabase.from('brands').select('id').limit(1);
  if (brands.length > 0) orderData.brand_id = brands[0].id;

  console.log("Inserting order...");
  const { data: newOrder, error } = await supabase
    .from("orders")
    .insert([{
      ...orderData,
      code: finalCode,
      status: "atendimento"
    }])
    .select()
    .single();

  if (error) {
    console.error("ORDER INSERT ERROR:", error);
    return;
  }
  console.log("ORDER INSERTED:", newOrder.id);
  
  // Insert Items
  const itemsToInsert = [{
    product_name: "Test",
    sku: "TEST",
    quantity: 1,
    unit_price: 100,
    order_id: newOrder.id
  }];
  
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);
    
  if (itemsError) {
    console.error("ITEMS INSERT ERROR:", itemsError);
    return;
  }
  
  // Insert Payments
  const paymentsWithOrderId = [{
    amount: 100,
    payment_method: "PIX",
    due_date: "2026-06-07",
    order_id: newOrder.id
  }];
  
  const { error: paymentsError } = await supabase
    .from("order_payments")
    .insert(paymentsWithOrderId);
    
  if (paymentsError) {
    console.error("PAYMENTS INSERT ERROR:", paymentsError);
    return;
  }
  
  console.log("SUCCESS!");
}

run();
