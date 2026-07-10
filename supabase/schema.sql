-- Supabase Database Schema for e-roupas OS

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables

-- BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PERMISSIONS
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL,
  permission_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER_PERMISSIONS
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  permission_level TEXT NOT NULL,
  granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  entity_class TEXT DEFAULT 'pf', -- 'pf' ou 'pj'
  entity_type TEXT DEFAULT 'cliente', -- 'cliente', 'fornecedor' ou 'colaborador'
  document TEXT,
  state_registration TEXT, -- RG / IE
  phone TEXT,
  landline_phone TEXT,
  email TEXT,
  instagram TEXT,
  company_name TEXT,
  lead_source TEXT,
  notes TEXT,
  responsible_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  credit_status TEXT DEFAULT 'normal',
  is_first_purchase BOOLEAN DEFAULT true,
  last_purchase_date TIMESTAMPTZ,
  zip_code TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  active BOOLEAN DEFAULT true,
  commission_percent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  estimated_value NUMERIC,
  notes TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  salesperson_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  store TEXT,
  business_unit TEXT,
  price_list_id UUID, -- For future implementation
  status TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  financial_status TEXT DEFAULT 'pendente',
  responsible_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  deadline TIMESTAMPTZ,
  sale_date TIMESTAMPTZ,
  departure_date TIMESTAMPTZ,
  expected_date TIMESTAMPTZ,
  purchase_order TEXT,
  
  -- Financial totals
  delivery_days INTEGER DEFAULT 0,
  other_expenses NUMERIC DEFAULT 0,
  items_discount NUMERIC DEFAULT 0,
  commissions_total NUMERIC DEFAULT 0,
  estimated_total NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  final_total NUMERIC DEFAULT 0,
  
  -- Payment
  payment_category TEXT,
  payment_condition TEXT,
  payment_method TEXT,
  
  -- Logistics
  carrier_name TEXT,
  freight_payer TEXT,
  volumes_quantity INTEGER DEFAULT 0,
  gross_weight NUMERIC DEFAULT 0,
  freight_cost NUMERIC DEFAULT 0,
  logistics_integration TEXT,
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  approved_art BOOLEAN DEFAULT false,
  confirmed BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ORDER_ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  model TEXT,
  line TEXT,
  fabric TEXT,
  color TEXT,
  size TEXT,
  gender TEXT,
  quantity NUMERIC NOT NULL,
  unit_cost NUMERIC,
  list_price NUMERIC,
  discount_percent NUMERIC DEFAULT 0,
  unit_price NUMERIC,
  customizations JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ADD COLUMN IF NOT EXISTS TO HANDLE OLD DATABASES
DO $$
BEGIN
  ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS customizations JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS production_status TEXT DEFAULT 'aguardando';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- PRODUCTION_PROCESSES
CREATE TABLE IF NOT EXISTS public.production_processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  required BOOLEAN DEFAULT false
);

-- ORDER_ITEM_PROCESSES
CREATE TABLE IF NOT EXISTS public.order_item_processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  process_id UUID NOT NULL REFERENCES public.production_processes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'aguardando',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT,
  rework_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDER_TIMELINE
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT,
  price NUMERIC DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  format TEXT DEFAULT 'MP', -- MP, PA, Serviço, Composição, Variação
  unit TEXT DEFAULT 'UN',
  brand TEXT,
  category TEXT,
  condition TEXT DEFAULT 'Novo',
  net_weight NUMERIC DEFAULT 0,
  gross_weight NUMERIC DEFAULT 0,
  gtin_ean TEXT,
  ncm TEXT,
  cest TEXT,
  min_stock NUMERIC DEFAULT 0,
  max_stock NUMERIC DEFAULT 0,
  model_id UUID REFERENCES public.product_models(id) ON DELETE SET NULL,
  fabric_id UUID REFERENCES public.fabrics(id) ON DELETE SET NULL,
  color_id UUID REFERENCES public.canonical_colors(id) ON DELETE SET NULL,
  origin INTEGER DEFAULT 0,
  icms_cst TEXT DEFAULT '102',
  icms_percent NUMERIC DEFAULT 0,
  pis_cst TEXT DEFAULT '07',
  pis_percent NUMERIC DEFAULT 0,
  cofins_cst TEXT DEFAULT '07',
  cofins_percent NUMERIC DEFAULT 0,
  ipi_cst TEXT DEFAULT '99',
  ipi_percent NUMERIC DEFAULT 0,
  cfop TEXT DEFAULT '5102',
  customizations JSONB DEFAULT '[]'::jsonb,
  fabric_family TEXT,
  size_grid TEXT,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supports_dtf BOOLEAN DEFAULT true,
  supports_embroidery BOOLEAN DEFAULT true,
  supports_silk BOOLEAN DEFAULT true,
  supports_sublimation BOOLEAN DEFAULT false,
  lead_time_minutes INTEGER DEFAULT 0,
  production_sla_days INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ADD COLUMN IF NOT EXISTS TO HANDLE OLD DATABASES
DO $$
BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS customizations JSONB DEFAULT '[]'::jsonb;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- PRODUCT_VARIATIONS
CREATE TABLE IF NOT EXISTS public.product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: Cor:Azul;Tamanho:M
  sku TEXT,
  price NUMERIC, -- Preço específico (se null, usa o do pai)
  stock NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 3. RLS (Row Level Security) Configuration

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Note: Proper RLS policies should be added here depending on user roles and requirements.
-- For now, allowing all authenticated users to read and write (this can be tightened later).

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on brands" ON public.brands;
CREATE POLICY "Allow authenticated users to perform all operations on brands" ON public.brands FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on roles" ON public.roles;
CREATE POLICY "Allow authenticated users to perform all operations on roles" ON public.roles FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on permissions" ON public.permissions;
CREATE POLICY "Allow authenticated users to perform all operations on permissions" ON public.permissions FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on users" ON public.users;
CREATE POLICY "Allow authenticated users to perform all operations on users" ON public.users FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on user_permissions" ON public.user_permissions;
CREATE POLICY "Allow authenticated users to perform all operations on user_permissions" ON public.user_permissions FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on clients" ON public.clients;
CREATE POLICY "Allow authenticated users to perform all operations on clients" ON public.clients FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on products" ON public.products;
CREATE POLICY "Allow authenticated users to perform all operations on products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on product_variations" ON public.product_variations;
CREATE POLICY "Allow authenticated users to perform all operations on product_variations" ON public.product_variations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on leads" ON public.leads;
CREATE POLICY "Allow authenticated users to perform all operations on leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on orders" ON public.orders;
CREATE POLICY "Allow authenticated users to perform all operations on orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on order_items" ON public.order_items;
CREATE POLICY "Allow authenticated users to perform all operations on order_items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on production_processes" ON public.production_processes;
CREATE POLICY "Allow authenticated users to perform all operations on production_processes" ON public.production_processes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on order_item_processes" ON public.order_item_processes;
CREATE POLICY "Allow authenticated users to perform all operations on order_item_processes" ON public.order_item_processes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on order_timeline" ON public.order_timeline;
CREATE POLICY "Allow authenticated users to perform all operations on order_timeline" ON public.order_timeline FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated users to perform all operations on audit_logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on attachments" ON public.attachments;
CREATE POLICY "Allow authenticated users to perform all operations on attachments" ON public.attachments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on conversations" ON public.conversations;
CREATE POLICY "Allow authenticated users to perform all operations on conversations" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto-create user record when signed up (Optional)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert Default Data safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.brands WHERE code = 'ER') THEN
    INSERT INTO public.brands (name, code) VALUES ('e-roupas', 'ER');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.brands WHERE code = 'PG8') THEN
    INSERT INTO public.brands (name, code) VALUES ('peagah8', 'PG8');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.production_processes WHERE name = 'Separação') THEN
    INSERT INTO public.production_processes (name, order_index, required) VALUES
    ('Separação', 1, false),
    ('Corte', 2, false),
    ('Costura', 3, false),
    ('Bordado', 4, false),
    ('Impressão DTF', 5, false),
    ('Silk', 6, false),
    ('Sublimação', 7, false),
    ('Prensa', 8, false),
    ('Manuseio e qualidade', 9, true),
    ('Expedição', 10, true);
  END IF;

  -- Add new columns to clients if they don't exist
  BEGIN
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS entity_class TEXT DEFAULT 'pf';
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS entity_type TEXT DEFAULT 'cliente';
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS state_registration TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS landline_phone TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS is_first_purchase BOOLEAN DEFAULT true;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS last_purchase_date TIMESTAMPTZ;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS zip_code TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS street TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS number TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS complement TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS neighborhood TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS city TEXT;
    ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS state TEXT;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;

END $$;

-- ==========================================
-- SPRINT 2.1 - ESTOQUE INTELIGENTE
-- ==========================================

-- 1. Product Models (Modelos)
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Product Lines (Linhas)
CREATE TABLE IF NOT EXISTS public.product_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Fabrics (Malhas)
CREATE TABLE IF NOT EXISTS public.fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  grammage TEXT,
  composition TEXT,
  supplier_default TEXT,
  supports_dtf BOOLEAN DEFAULT true,
  supports_embroidery BOOLEAN DEFAULT true,
  supports_silk BOOLEAN DEFAULT true,
  supports_sublimation BOOLEAN DEFAULT false,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Canonical Colors (Cores Canônicas)
CREATE TABLE IF NOT EXISTS public.canonical_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  hex TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Suppliers (Fornecedores)
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company_name TEXT,
  cnpj TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  city TEXT,
  notes TEXT,
  lead_time_days INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Product Variants (Variantes de Produto - Novo Cadastro Mestre)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  model_id UUID REFERENCES public.product_models(id),
  line_id UUID REFERENCES public.product_lines(id),
  fabric_id UUID REFERENCES public.fabrics(id),
  color_id UUID REFERENCES public.canonical_colors(id),
  size TEXT NOT NULL,
  gender TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id),
  sku_internal TEXT,
  barcode TEXT,
  qr_code TEXT,
  crossdocking BOOLEAN DEFAULT false,
  lead_time_medio INTEGER DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  average_cost NUMERIC DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Inventory Batches (Lotes de Estoque)
CREATE TABLE IF NOT EXISTS public.inventory_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  batch_code TEXT NOT NULL,
  quantity_total NUMERIC DEFAULT 0,
  quantity_reserved NUMERIC DEFAULT 0,
  quantity_available NUMERIC DEFAULT 0,
  average_cost NUMERIC DEFAULT 0,
  entry_date TIMESTAMPTZ DEFAULT now(),
  quality_notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Inventory Movements (Movimentações de Estoque - Extrato Imutável)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES public.inventory_batches(id),
  movement_type TEXT NOT NULL, -- 'compra', 'devolução', 'ajuste', 'produção', 'perda', 'expedição', 'cancelamento'
  quantity NUMERIC NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Stock Reservations (Reservas de Estoque)
CREATE TABLE IF NOT EXISTS public.stock_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES public.inventory_batches(id),
  quantity NUMERIC NOT NULL,
  mixing_approved BOOLEAN DEFAULT false,
  mixing_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;

-- Policies (Allow all for authenticated users)
DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on product_models" ON public.product_models;
CREATE POLICY "Allow authenticated users to perform all operations on product_models" ON public.product_models FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on product_lines" ON public.product_lines;
CREATE POLICY "Allow authenticated users to perform all operations on product_lines" ON public.product_lines FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on fabrics" ON public.fabrics;
CREATE POLICY "Allow authenticated users to perform all operations on fabrics" ON public.fabrics FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on canonical_colors" ON public.canonical_colors;
CREATE POLICY "Allow authenticated users to perform all operations on canonical_colors" ON public.canonical_colors FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on suppliers" ON public.suppliers;
CREATE POLICY "Allow authenticated users to perform all operations on suppliers" ON public.suppliers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on product_variants" ON public.product_variants;
CREATE POLICY "Allow authenticated users to perform all operations on product_variants" ON public.product_variants FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on inventory_batches" ON public.inventory_batches;
CREATE POLICY "Allow authenticated users to perform all operations on inventory_batches" ON public.inventory_batches FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on inventory_movements" ON public.inventory_movements;
CREATE POLICY "Allow authenticated users to perform all operations on inventory_movements" ON public.inventory_movements FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on stock_reservations" ON public.stock_reservations;
CREATE POLICY "Allow authenticated users to perform all operations on stock_reservations" ON public.stock_reservations FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- SPRINT 3.0 - ORÇAMENTO INTELIGENTE
-- ==========================================

-- QUOTES (Orçamentos)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'rascunho',
    -- rascunho, enviado, negociacao, aprovado, rejeitado, convertido_pedido, convertido_producao

  -- Financial
  estimated_total NUMERIC DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  other_expenses NUMERIC DEFAULT 0,
  freight_cost NUMERIC DEFAULT 0,
  final_total NUMERIC DEFAULT 0,
  gross_margin_pct NUMERIC DEFAULT 0,

  -- Conversion traceability
  converted_order_id UUID REFERENCES public.orders(id),
  converted_at TIMESTAMPTZ,

  -- Metadata
  validity_days INTEGER DEFAULT 15,
  notes TEXT,
  internal_notes TEXT,
  payment_condition TEXT,
  payment_method TEXT,

  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- QUOTE_ITEMS (Itens do Orçamento)
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  quantity NUMERIC NOT NULL,
  unit_cost NUMERIC DEFAULT 0,
  list_price NUMERIC DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  customizations JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on quotes" ON public.quotes;
CREATE POLICY "Allow authenticated users to perform all operations on quotes" ON public.quotes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on quote_items" ON public.quote_items;
CREATE POLICY "Allow authenticated users to perform all operations on quote_items" ON public.quote_items FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- SPRINT 4.0: FINANCEIRO BÁSICO E COMISSIONAMENTO
-- ==========================================

-- 1. Colunas adicionais necessárias
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS commission_percent NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS salesperson_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- 2. Novas tabelas
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'receita', 'despesa', 'custo'
  parent_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
  supplier_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
  payment_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to perform all operations on cost_centers" ON public.cost_centers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to perform all operations on chart_of_accounts" ON public.chart_of_accounts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to perform all operations on accounts_payable" ON public.accounts_payable FOR ALL USING (auth.role() = 'authenticated');


-- ADICIONADO PARA CRM
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;
CREATE TABLE IF NOT EXISTS public.entity_sequences (prefix TEXT PRIMARY KEY, next_val INTEGER DEFAULT 1);
CREATE OR REPLACE FUNCTION generate_client_code() RETURNS TRIGGER AS  DECLARE v_prefix TEXT; v_next_val INTEGER; BEGIN IF NEW.code IS NULL OR NEW.code = '' THEN v_prefix := UPPER(SUBSTRING(COALESCE(NEW.entity_type, 'cliente') FROM 1 FOR 3)); INSERT INTO public.entity_sequences (prefix, next_val) VALUES (v_prefix, 2) ON CONFLICT (prefix) DO UPDATE SET next_val = entity_sequences.next_val + 1 RETURNING next_val - 1 INTO v_next_val; NEW.code := v_prefix || '-' || LPAD(v_next_val::TEXT, 4, '0'); END IF; RETURN NEW; END;  LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_generate_client_code ON public.clients;
CREATE TRIGGER trg_generate_client_code BEFORE INSERT ON public.clients FOR EACH ROW EXECUTE FUNCTION generate_client_code();
