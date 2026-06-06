-- ----------------------------------------------------------------------
-- SPRINT 2.3 — ARQUITETURA INDUSTRIAL DE PRODUTOS, ESTOQUE E VARIAÇÕES
-- ----------------------------------------------------------------------

-- 1. ADICIONAR COLUNAS DE CÓDIGOS EM MODELAGEM E MALHAS
ALTER TABLE public.product_models ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.fabrics ADD COLUMN IF NOT EXISTS code TEXT;

-- Popular alguns códigos básicos se estiverem nulos para manter a geração automática de SKU funcional
UPDATE public.product_models SET code = UPPER(SUBSTRING(name, 1, 3)) WHERE code IS NULL;
UPDATE public.fabrics SET code = UPPER(SUBSTRING(name, 1, 3)) WHERE code IS NULL;

-- 2. ADICIONAR COLUNAS NA TABELA DE PRODUTOS (PRODUCTS)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric_family TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_grid TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supports_dtf BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supports_embroidery BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supports_silk BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supports_sublimation BOOLEAN DEFAULT false;

-- Colunas específicas para Serviços na tabela de produtos
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lead_time_minutes INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS production_sla_days INTEGER DEFAULT 0;

-- 3. ADICIONAR CONFIGURAÇÕES DE PEDIDOS E MIX DE MALHAS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mix_fabrics_allowed BOOLEAN DEFAULT false;

-- 4. ATUALIZAR E FLEXIBILIZAR TABELA DE VARIANTES (PRODUCT_VARIANTS)
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS crossdocking BOOLEAN DEFAULT false;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS lead_time_medio INTEGER DEFAULT 0;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS average_cost NUMERIC DEFAULT 0;

-- Tornar colunas model_id, fabric_id, color_id opcionais na tabela de variantes
ALTER TABLE public.product_variants ALTER COLUMN model_id DROP NOT NULL;
ALTER TABLE public.product_variants ALTER COLUMN fabric_id DROP NOT NULL;
ALTER TABLE public.product_variants ALTER COLUMN color_id DROP NOT NULL;
