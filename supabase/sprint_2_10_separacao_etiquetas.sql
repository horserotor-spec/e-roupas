-- ==========================================
-- SPRINT 2.10: VALIDAÇÃO DE SEPARAÇÃO E ETIQUETAS OPERACIONAIS
-- ==========================================

-- Tabela para rastrear erros operacionais na bipagem (erros evitados)
CREATE TABLE IF NOT EXISTS public.separation_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  expected_barcode TEXT,
  biped_barcode TEXT,
  operator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de logs de separações validadas (bipes corretos)
CREATE TABLE IF NOT EXISTS public.separation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  barcode TEXT,
  quantity NUMERIC DEFAULT 1,
  operator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Identidade única gerada para a peça individual após separação bem-sucedida
CREATE TABLE IF NOT EXISTS public.piece_identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_code TEXT UNIQUE NOT NULL, -- Ex: ER-20260609-0042-01
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'separado', -- separado, corte, costura, bordado, dtf, prensa, qualidade, expedido
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.separation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.separation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_identities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all to authenticated users)
DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on separation_errors" ON public.separation_errors;
CREATE POLICY "Allow authenticated users to perform all operations on separation_errors" ON public.separation_errors FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on separation_logs" ON public.separation_logs;
CREATE POLICY "Allow authenticated users to perform all operations on separation_logs" ON public.separation_logs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on piece_identities" ON public.piece_identities;
CREATE POLICY "Allow authenticated users to perform all operations on piece_identities" ON public.piece_identities FOR ALL USING (auth.role() = 'authenticated');

-- Adicionar coluna de quantidade separada na tabela de itens do pedido para controle do progresso
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS quantity_separated NUMERIC DEFAULT 0;
