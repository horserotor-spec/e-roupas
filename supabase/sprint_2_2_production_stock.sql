-- SPRINT 2.2 — PRODUÇÃO + CONTROLE DE ESTOQUE INDUSTRIAL
-- Executar este script no editor SQL do Supabase.

-- 1. Vincular a engenharia de produto (PA) às características básicas (BOM/Ficha Técnica)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_id UUID REFERENCES public.product_models(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric_id UUID REFERENCES public.fabrics(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.canonical_colors(id) ON DELETE SET NULL;

-- 2. Criar índices para otimização de buscas
CREATE INDEX IF NOT EXISTS idx_products_model_id ON public.products(model_id);
CREATE INDEX IF NOT EXISTS idx_products_fabric_id ON public.products(fabric_id);
CREATE INDEX IF NOT EXISTS idx_products_color_id ON public.products(color_id);

-- 3. Adicionar coluna para rastrear retrabalho nas tarefas de produção
ALTER TABLE public.order_item_processes ADD COLUMN IF NOT EXISTS rework_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.products.model_id IS 'Modelo/Modelagem associado ao Produto Acabável (PA)';
COMMENT ON COLUMN public.products.fabric_id IS 'Malha/Tecido Técnico associado ao Produto Acabável (PA)';
COMMENT ON COLUMN public.products.color_id IS 'Cor Canônica associada ao Produto Acabável (PA)';
COMMENT ON COLUMN public.order_item_processes.rework_count IS 'Quantidade de vezes que esta etapa de produção foi retrabalhada';
