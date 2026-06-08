-- Sprint 2.9: Integração SGP Web e Motor Logístico
-- Alterações para suporte a rastreio, etiquetas e controle de expedição

-- 1. Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ativar RLS em system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para system_settings (Apenas usuários autenticados para leitura e escrita, 
-- com controle idealmente feito via roles no frontend/API)
DROP POLICY IF EXISTS "Enable all for authenticated users on system_settings" ON public.system_settings;
CREATE POLICY "Enable all for authenticated users on system_settings" ON public.system_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Função de trigger para updated_at genérica se não existir
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_system_settings ON public.system_settings;
CREATE TRIGGER set_timestamp_system_settings
BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Inserir registro padrão para SGP Web se não existir
INSERT INTO public.system_settings (key, value, description) 
VALUES (
  'sgp_web_integration', 
  '{"api_url": "https://api.sgpweb.com.br", "token": "", "app_key": "", "user": "", "password": "", "environment": "homologacao", "status": "desconectado"}'::jsonb,
  'Credenciais de acesso à API do SGP Web'
) ON CONFLICT (key) DO NOTHING;

-- 2. Alterações na tabela Orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS logistics_type TEXT DEFAULT 'Correios',
ADD COLUMN IF NOT EXISTS tracking_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
ADD COLUMN IF NOT EXISTS posting_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS logistics_status TEXT DEFAULT 'Aguardando envio', -- 'Aguardando envio', 'Aguardando etiqueta', 'Etiqueta gerada', 'Aguardando postagem', 'Postado', 'Em trânsito', 'Saiu para entrega', 'Entregue', 'Falha entrega', 'Devolvido', 'Extraviado'
ADD COLUMN IF NOT EXISTS delivery_name TEXT,
ADD COLUMN IF NOT EXISTS delivery_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_document TEXT,
ADD COLUMN IF NOT EXISTS delivery_zip TEXT,
ADD COLUMN IF NOT EXISTS delivery_street TEXT,
ADD COLUMN IF NOT EXISTS delivery_number TEXT,
ADD COLUMN IF NOT EXISTS delivery_complement TEXT,
ADD COLUMN IF NOT EXISTS delivery_neighborhood TEXT,
ADD COLUMN IF NOT EXISTS delivery_city TEXT,
ADD COLUMN IF NOT EXISTS delivery_state TEXT,
ADD COLUMN IF NOT EXISTS delivery_reference TEXT,
ADD COLUMN IF NOT EXISTS package_height NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS package_width NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS package_length NUMERIC DEFAULT 0;

-- 3. Alterações na tabela Products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS package_height NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS package_width NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS package_length NUMERIC DEFAULT 0;

-- Adicionar índices para facilitar buscas por rastreio
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_logistics_status ON public.orders(logistics_status);
