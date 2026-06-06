CREATE TABLE IF NOT EXISTS public.sku_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL, -- 'model', 'fabric', 'color', 'category'
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rule_type, name),
  UNIQUE(rule_type, abbreviation)
);

ALTER TABLE public.sku_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all sku rules" ON public.sku_rules;
CREATE POLICY "Allow all sku rules" ON public.sku_rules FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.sku_rules TO service_role;
GRANT ALL ON public.sku_rules TO anon;
GRANT ALL ON public.sku_rules TO authenticated;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS technical_name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS mix_allowed BOOLEAN DEFAULT false;

INSERT INTO public.sku_rules (rule_type, name, abbreviation) VALUES 
('model', 'Regular', 'REG'),
('model', 'Oversized', 'OVR'),
('color', 'Preto', 'PTO'),
('color', 'Branco', 'BCO'),
('color', 'Barbie', 'BRB'),
('fabric', 'Poliamida E&L', 'PEL'),
('fabric', 'Poliamida Pettenati', 'PPE'),
('fabric', 'Dry Poliéster', 'DPR'),
('fabric', 'Dry Poliamida', 'DPA')
ON CONFLICT (rule_type, name) DO NOTHING;
