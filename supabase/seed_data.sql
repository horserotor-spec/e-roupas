-- SEED DE DADOS - e-roupas OS
-- RODE ESTE SCRIPT NO EDITOR SQL DO SUPABASE PARA PRE-CADASTRAR AS ENTIDADES

-- 1. Fornecedores (suppliers)
INSERT INTO public.suppliers (name, lead_time_days, active) VALUES
('Pettenati', 0, true),
('Menegotti', 0, true),
('Pemgir', 0, true),
('E&L', 0, true),
('Guimatex', 0, true),
('Santa Constancia', 0, true)
ON CONFLICT (name) DO NOTHING; -- Se houver unique constraint ou semelhante

-- 2. Modelagem (product_models)
INSERT INTO public.product_models (name, active) VALUES
('CALÇA DE MOLETOM', true),
('BERMUDA DE MOLETOM', true),
('CAMISETA REGULAR', true),
('CAMISETA OVERSIZED', true),
('CAMISETA INFANTIL', true),
('BABYLOOK', true),
('REGATA FEMININA MACHÃO', true),
('REGATA MASCULINA MACHÃO', true),
('REGATA MASCULINA NADADOR', true),
('REGATA FEMININA NADADOR', true),
('CAMISETA MANGA LONGA', true),
('CAMISETA RAGLAN', true),
('MOLETOM COM CAPUZ E BOLSO CANGURU', true),
('MOLETOM COM CAPUZ', true),
('MOLETOM GOLA CARECA', true),
('POLO MASCULINA', true),
('POLO FEMININA', true),
('POLO INFANTIL', true),
('POLO GOLA PADRE MASCULINA', true),
('POLO GOLA PADRE FEMININA', true),
('CROPPED INFANTIL', true),
('CROPPED FEMININO', true)
ON CONFLICT DO NOTHING;

-- 3. Malhas (fabrics)
INSERT INTO public.fabrics (name, supports_dtf, supports_silk, supports_embroidery, supports_sublimation, active) VALUES
('100% ALGODÃO FIO 30.1 PENTEADO', true, true, true, true, true),
('100% ALGODÃO FIO 26.1 PENTEADO', true, true, true, true, true),
('100% ALGODÃO EGÍPCIO', true, true, true, true, true),
('100% ALGODÃO PIMA PERUANO', true, true, true, true, true),
('100% ALGODÃO SUEDINE EGÍPCIO', true, true, true, true, true),
('67% POLIESTER 33% VISCOSE (PV)', true, true, true, true, true),
('67% POLIESTER 33% ALGODÃO (PIQUET PA)', true, true, true, true, true),
('50% POLIESTER 50% ALGODÃO (PA ANTIPILLING)', true, true, true, true, true),
('50% POLIESTER 50% ALGODÃO (MOLETOM SEM FELPA)', true, true, true, true, true),
('58% POLIESTER 42% ALGODÃO (MOLETOM COM FELPA)', true, true, true, true, true)
ON CONFLICT DO NOTHING;

-- 4. Tipos de Personalização (products)
INSERT INTO public.products (name, sku, price, cost_price, format, unit, active) VALUES
('DTF FRENTE', 'PERS-DTF-FRENTE', 0, 0, 'Serviço', 'UN', true),
('DTF COSTAS', 'PERS-DTF-COSTAS', 0, 0, 'Serviço', 'UN', true),
('DTF MANGA ESQUERDA', 'PERS-DTF-MANGA-ESQUERDA', 0, 0, 'Serviço', 'UN', true),
('DTF MANGA DIREITA', 'PERS-DTF-MANGA-DIREITA', 0, 0, 'Serviço', 'UN', true),
('DTF BARRA FRENTE', 'PERS-DTF-BARRA-FRENTE', 0, 0, 'Serviço', 'UN', true),
('DTF BARRA COSTAS', 'PERS-DTF-BARRA-COSTAS', 0, 0, 'Serviço', 'UN', true),
('DTF PEITO ESQUERDO', 'PERS-DTF-PEITO-ESQUERDO', 0, 0, 'Serviço', 'UN', true),
('DTF PEITO DIREITO', 'PERS-DTF-PEITO-DIREITO', 0, 0, 'Serviço', 'UN', true),
('ETIQUETA INTERNA', 'PERS-ETIQUETA-INTERNA', 0, 0, 'Serviço', 'UN', true),
('NUCA', 'PERS-NUCA', 0, 0, 'Serviço', 'UN', true),
('SILK FRENTE', 'PERS-SILK-FRENTE', 0, 0, 'Serviço', 'UN', true),
('SILK COSTAS', 'PERS-SILK-COSTAS', 0, 0, 'Serviço', 'UN', true),
('SILK MANGA ESQUERDA', 'PERS-SILK-MANGA-ESQUERDA', 0, 0, 'Serviço', 'UN', true),
('SILK MANGA DIREITA', 'PERS-SILK-MANGA-DIREITA', 0, 0, 'Serviço', 'UN', true),
('SILK BARRA FRENTE', 'PERS-SILK-BARRA-FRENTE', 0, 0, 'Serviço', 'UN', true),
('SILK BARRA COSTAS', 'PERS-SILK-BARRA-COSTAS', 0, 0, 'Serviço', 'UN', true),
('SILK PEITO ESQUERDO', 'PERS-SILK-PEITO-ESQUERDO', 0, 0, 'Serviço', 'UN', true),
('SILK PEITO DIREITO', 'PERS-SILK-PEITO-DIREITO', 0, 0, 'Serviço', 'UN', true),
('BORDADO FRENTE', 'PERS-BORDADO-FRENTE', 0, 0, 'Serviço', 'UN', true),
('BORDADO COSTAS', 'PERS-BORDADO-COSTAS', 0, 0, 'Serviço', 'UN', true),
('BORDADO MANGA ESQUERDA', 'PERS-BORDADO-MANGA-ESQUERDA', 0, 0, 'Serviço', 'UN', true),
('BORDADO MANGA DIREITA', 'PERS-BORDADO-MANGA-DIREITA', 0, 0, 'Serviço', 'UN', true),
('BORDADO BARRA FRENTE', 'PERS-BORDADO-BARRA-FRENTE', 0, 0, 'Serviço', 'UN', true),
('BORDADO BARRA COSTAS', 'PERS-BORDADO-BARRA-COSTAS', 0, 0, 'Serviço', 'UN', true),
('BORDADO PEITO ESQUERDO', 'PERS-BORDADO-PEITO-ESQUERDO', 0, 0, 'Serviço', 'UN', true),
('BORDADO PEITO DIREITO', 'PERS-BORDADO-PEITO-DIREITO', 0, 0, 'Serviço', 'UN', true),
('SUBLIMAÇÃO FRENTE', 'PERS-SUBLIMACAO-FRENTE', 0, 0, 'Serviço', 'UN', true),
('SUBLIMAÇÃO COSTAS', 'PERS-SUBLIMACAO-COSTAS', 0, 0, 'Serviço', 'UN', true),
('SUBLIMAÇÃO MANGA DIREITA', 'PERS-SUBLIMACAO-MANGA-DIREITA', 0, 0, 'Serviço', 'UN', true),
('SUBLIMAÇÃO MANGA ESQUERDA', 'PERS-SUBLIMACAO-MANGA-ESQUERDA', 0, 0, 'Serviço', 'UN', true),
('SUBLIMAÇÃO TOTAL', 'PERS-SUBLIMACAO-TOTAL', 0, 0, 'Serviço', 'UN', true)
ON CONFLICT (sku) DO NOTHING;

-- 5. Cores Padrão (canonical_colors)
ALTER TABLE public.canonical_colors ADD COLUMN IF NOT EXISTS code TEXT;

INSERT INTO public.canonical_colors (name, code, active)
SELECT v.name, v.code, v.active
FROM (VALUES
  ('Branco', 'BCO', true),
  ('Natural', 'NAT', true),
  ('Água Água', 'AAG', true),
  ('Celeste', 'CEL', true),
  ('Cinza Claro', 'CCL', true),
  ('Areia', 'ARE', true),
  ('Lilás', 'LIL', true),
  ('Rosa BB', 'RBB', true),
  ('Creme', 'CRE', true),
  ('Salmão', 'SAL', true),
  ('Marinho', 'MRN', true),
  ('Preto', 'PRE', true),
  ('Limão', 'LIM', true),
  ('Seleção', 'SEL', true),
  ('Chumbo', 'CHU', true),
  ('Laranja', 'LAR', true),
  ('Pink', 'PNK', true),
  ('Barbie', 'BRB', true),
  ('Ocre', 'OCR', true),
  ('Royal', 'RYL', true),
  ('Vermelho', 'VRM', true),
  ('Bandeira', 'BND', true),
  ('Musgo', 'MUS', true),
  ('Militar', 'MIL', true),
  ('Turquesa', 'TRQ', true),
  ('Vinho', 'VIN', true),
  ('Petróleo', 'PTR', true),
  ('Marrom', 'MRM', true),
  ('Pitanga', 'PIT', true),
  ('Jade', 'JAD', true),
  ('Roxo', 'RXO', true)
) AS v(name, code, active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.canonical_colors c 
  WHERE c.code = v.code OR c.name = v.name
);
