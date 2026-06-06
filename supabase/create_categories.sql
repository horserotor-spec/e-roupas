CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all categories" ON public.product_categories;
CREATE POLICY "Allow all categories" ON public.product_categories FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.product_categories TO service_role;
GRANT ALL ON public.product_categories TO anon;
GRANT ALL ON public.product_categories TO authenticated;
