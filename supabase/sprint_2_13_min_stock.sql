ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS min_stock NUMERIC DEFAULT 0;
ALTER TABLE public.products DROP COLUMN IF EXISTS min_stock;
ALTER TABLE public.products DROP COLUMN IF EXISTS max_stock;