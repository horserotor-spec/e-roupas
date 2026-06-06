const fs = require('fs');

let schema = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/supabase/schema.sql', 'utf8');

// 1. Atualizar product_models
schema = schema.replace(
  `CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);`,
  `CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);`
);

// 2. Atualizar fabrics
schema = schema.replace(
  `CREATE TABLE IF NOT EXISTS public.fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  grammage TEXT,`,
  `CREATE TABLE IF NOT EXISTS public.fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  grammage TEXT,`
);

// 3. Atualizar products
schema = schema.replace(
  `  customizations JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);`,
  `  customizations JSONB DEFAULT '[]'::jsonb,
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
);`
);

// 4. Atualizar orders
schema = schema.replace(
  `  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  responsible_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'rascunho',`,
  `  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  responsible_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'rascunho',
  mix_fabrics_allowed BOOLEAN DEFAULT false,`
);

// 5. Atualizar product_variants
schema = schema.replace(
  `CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES public.product_models(id),
  line_id UUID REFERENCES public.product_lines(id),
  fabric_id UUID NOT NULL REFERENCES public.fabrics(id),
  color_id UUID NOT NULL REFERENCES public.canonical_colors(id),
  size TEXT NOT NULL,
  gender TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id),
  sku_internal TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);`,
  `CREATE TABLE IF NOT EXISTS public.product_variants (
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
);`
);

fs.writeFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/supabase/schema.sql', schema, 'utf8');
console.log("schema.sql atualizado com sucesso!");
