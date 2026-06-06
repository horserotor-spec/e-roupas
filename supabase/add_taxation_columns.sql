-- Adiciona colunas de tributação completas à tabela public.products
-- Estas colunas são cruciais para emissão de Notas Fiscais (NF-e/NFC-e) no Brasil.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS origin INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS icms_cst TEXT DEFAULT '102';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS icms_percent NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pis_cst TEXT DEFAULT '07';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pis_percent NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cofins_cst TEXT DEFAULT '07';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cofins_percent NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ipi_cst TEXT DEFAULT '99';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ipi_percent NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cfop TEXT DEFAULT '5102';

COMMENT ON COLUMN public.products.origin IS 'Origem da mercadoria (0 - Nacional, 1 - Estrangeira Importação Direta, etc.)';
COMMENT ON COLUMN public.products.icms_cst IS 'CST ou CSOSN do ICMS';
COMMENT ON COLUMN public.products.icms_percent IS 'Alíquota de ICMS (%)';
COMMENT ON COLUMN public.products.pis_cst IS 'CST do PIS';
COMMENT ON COLUMN public.products.pis_percent IS 'Alíquota de PIS (%)';
COMMENT ON COLUMN public.products.cofins_cst IS 'CST da COFINS';
COMMENT ON COLUMN public.products.cofins_percent IS 'Alíquota de COFINS (%)';
COMMENT ON COLUMN public.products.ipi_cst IS 'CST do IPI';
COMMENT ON COLUMN public.products.ipi_percent IS 'Alíquota de IPI (%)';
COMMENT ON COLUMN public.products.cfop IS 'Código Fiscal de Operações e Prestações padrão';
