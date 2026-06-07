-- ==========================================
-- SPRINT 2.5: SIDEBAR PEDIDOS + GERAÇÃO PF + FINANCEIRO COMPLETO
-- ==========================================

-- 1. Novas colunas na tabela orders
DO $$
BEGIN
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS origin_channel TEXT DEFAULT 'Outro';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 2. Tabela de Pagamentos (Múltiplas formas / Parcelamento)
CREATE TABLE IF NOT EXISTS public.order_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  installments INTEGER DEFAULT 1,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
  payment_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS para order_payments
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on order_payments" ON public.order_payments;
CREATE POLICY "Allow authenticated users to perform all operations on order_payments" ON public.order_payments FOR ALL USING (auth.role() = 'authenticated');

-- 3. Nova coluna na tabela order_items para a Arte do PF
DO $$
BEGIN
  ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS art_code TEXT;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;
