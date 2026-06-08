-- SPRINT 2.3B: CORREÇÃO ARQUITETURAL MP → PA → PF

-- 1. Criação das novas estruturas
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS source_mp_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_variations ADD COLUMN IF NOT EXISTS source_mp_variant_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public.product_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mp_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  pa_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  mp_variant_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  pa_variant_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  pf_variant_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'MP_PA', 'PA_PF'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_relationships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to perform all operations on product_relationships" ON public.product_relationships;
CREATE POLICY "Allow authenticated users to perform all operations on product_relationships" ON public.product_relationships FOR ALL USING (auth.role() = 'authenticated');

-- 2. Limpeza dos PAs antigos para recriar base correta
DELETE FROM public.products WHERE format = 'PA';

-- 3. Função Trigger para Produtos Pai (MP -> PA)
CREATE OR REPLACE FUNCTION public.sync_mp_to_pa_product()
RETURNS TRIGGER AS $$
DECLARE
  new_pa_id UUID;
  new_sku TEXT;
BEGIN
  -- Somente atuar sobre MPs que não são gerados por essa própria trigger
  IF NEW.format = 'MP' AND NEW.source_mp_id IS NULL THEN
    
    new_sku := COALESCE(REPLACE(NEW.sku, 'MP-', 'PA-'), NEW.sku);
    IF new_sku = NEW.sku AND new_sku IS NOT NULL THEN
      new_sku := 'PA-' || NEW.sku;
    END IF;

    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.products (
        name, sku, price, cost_price, format, unit, brand, category, 
        condition, net_weight, gross_weight, gtin_ean, ncm, cest, 
        min_stock, max_stock, model_id, fabric_id, color_id, 
        origin, icms_cst, icms_percent, pis_cst, pis_percent, 
        cofins_cst, cofins_percent, ipi_cst, ipi_percent, cfop, 
        customizations, fabric_family, size_grid, supplier_id, 
        supports_dtf, supports_embroidery, supports_silk, supports_sublimation, 
        lead_time_minutes, production_sla_days, active, source_mp_id, technical_name
      ) VALUES (
        NEW.name, 
        new_sku, 
        NEW.price, NEW.cost_price, 'PA', NEW.unit, NEW.brand, NEW.category, 
        NEW.condition, NEW.net_weight, NEW.gross_weight, NEW.gtin_ean, NEW.ncm, NEW.cest, 
        0, 0, NEW.model_id, NEW.fabric_id, NEW.color_id, 
        NEW.origin, NEW.icms_cst, NEW.icms_percent, NEW.pis_cst, NEW.pis_percent, 
        NEW.cofins_cst, NEW.cofins_percent, NEW.ipi_cst, NEW.ipi_percent, NEW.cfop, 
        NEW.customizations, NEW.fabric_family, NEW.size_grid, NEW.supplier_id, 
        NEW.supports_dtf, NEW.supports_embroidery, NEW.supports_silk, NEW.supports_sublimation, 
        NEW.lead_time_minutes, NEW.production_sla_days, NEW.active, NEW.id, NEW.technical_name
      ) RETURNING id INTO new_pa_id;

    ELSIF TG_OP = 'UPDATE' THEN
      UPDATE public.products SET
        name = NEW.name,
        sku = new_sku,
        price = NEW.price,
        cost_price = NEW.cost_price,
        model_id = NEW.model_id,
        fabric_id = NEW.fabric_id,
        color_id = NEW.color_id,
        customizations = NEW.customizations,
        supports_dtf = NEW.supports_dtf,
        supports_embroidery = NEW.supports_embroidery,
        supports_silk = NEW.supports_silk,
        supports_sublimation = NEW.supports_sublimation,
        active = NEW.active,
        technical_name = NEW.technical_name
      WHERE source_mp_id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_mp_to_pa_product ON public.products;
CREATE TRIGGER trg_sync_mp_to_pa_product
AFTER INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE PROCEDURE public.sync_mp_to_pa_product();

-- 4. Função Trigger para Variantes (MP_VAR -> PA_VAR)
CREATE OR REPLACE FUNCTION public.sync_mp_to_pa_variation()
RETURNS TRIGGER AS $$
DECLARE
  v_pa_product_id UUID;
  new_pa_var_id UUID;
  new_sku TEXT;
BEGIN
  -- Somente atuar se não for ele mesmo um PA (evitar loops) e se for originário de um MP
  IF EXISTS (SELECT 1 FROM public.products WHERE id = NEW.product_id AND format = 'MP') THEN
    
    SELECT id INTO v_pa_product_id FROM public.products WHERE source_mp_id = NEW.product_id LIMIT 1;
    
    IF v_pa_product_id IS NOT NULL THEN
      new_sku := COALESCE(REPLACE(NEW.sku, 'MP-', 'PA-'), NEW.sku);
      IF new_sku = NEW.sku AND new_sku IS NOT NULL THEN
        new_sku := 'PA-' || NEW.sku;
      END IF;

      IF TG_OP = 'INSERT' THEN
        INSERT INTO public.product_variations (
          product_id, name, sku, price, stock,
          model_id, line_id, fabric_id, color_id, 
          size, gender, brand_id, sku_internal, barcode, qr_code, 
          crossdocking, lead_time_medio, cost_price, average_cost, active, source_mp_variant_id
        ) VALUES (
          v_pa_product_id, NEW.name, new_sku, NEW.price, 0,
          NEW.model_id, NEW.line_id, NEW.fabric_id, NEW.color_id, 
          NEW.size, NEW.gender, NEW.brand_id, REPLACE(COALESCE(NEW.sku_internal, ''), 'MP-', 'PA-'), NEW.barcode, NEW.qr_code, 
          NEW.crossdocking, NEW.lead_time_medio, NEW.cost_price, NEW.average_cost, NEW.active, NEW.id
        ) RETURNING id INTO new_pa_var_id;

        INSERT INTO public.product_relationships (mp_product_id, pa_product_id, mp_variant_id, pa_variant_id, relationship_type)
        VALUES (NEW.product_id, v_pa_product_id, NEW.id, new_pa_var_id, 'MP_PA');

      ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.product_variations SET
          name = NEW.name,
          sku = new_sku,
          price = NEW.price,
          model_id = NEW.model_id,
          line_id = NEW.line_id,
          fabric_id = NEW.fabric_id,
          color_id = NEW.color_id,
          size = NEW.size,
          gender = NEW.gender,
          sku_internal = REPLACE(COALESCE(NEW.sku_internal, ''), 'MP-', 'PA-'),
          cost_price = NEW.cost_price,
          active = NEW.active
        WHERE source_mp_variant_id = NEW.id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_mp_to_pa_variation ON public.product_variations;
CREATE TRIGGER trg_sync_mp_to_pa_variation
AFTER INSERT OR UPDATE ON public.product_variations
FOR EACH ROW EXECUTE PROCEDURE public.sync_mp_to_pa_variation();

-- 5. Backfill: Gerar PAs para MPs existentes
DO $$
DECLARE
  mp_row RECORD;
  var_row RECORD;
  inserted_pa_id UUID;
  new_pa_var_id UUID;
  new_sku TEXT;
  new_var_sku TEXT;
BEGIN
  -- Percorre todos os produtos MP que ainda não têm um PA vinculado (source_mp_id IS NULL garante que não pegue PA)
  FOR mp_row IN SELECT * FROM public.products WHERE format = 'MP' LOOP
    
    -- Verifica se já existe o PA correspondente para este MP (pode ter sido gerado pela trigger durante este processo, improvável mas seguro)
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE source_mp_id = mp_row.id) THEN
      
      new_sku := COALESCE(REPLACE(mp_row.sku, 'MP-', 'PA-'), mp_row.sku);
      IF new_sku = mp_row.sku AND new_sku IS NOT NULL THEN
        new_sku := 'PA-' || mp_row.sku;
      END IF;

      INSERT INTO public.products (
        name, sku, price, cost_price, format, unit, brand, category, 
        condition, net_weight, gross_weight, gtin_ean, ncm, cest, 
        min_stock, max_stock, model_id, fabric_id, color_id, 
        origin, icms_cst, icms_percent, pis_cst, pis_percent, 
        cofins_cst, cofins_percent, ipi_cst, ipi_percent, cfop, 
        customizations, fabric_family, size_grid, supplier_id, 
        supports_dtf, supports_embroidery, supports_silk, supports_sublimation, 
        lead_time_minutes, production_sla_days, active, source_mp_id, technical_name
      ) VALUES (
        mp_row.name, new_sku, mp_row.price, mp_row.cost_price, 'PA', mp_row.unit, mp_row.brand, mp_row.category, 
        mp_row.condition, mp_row.net_weight, mp_row.gross_weight, mp_row.gtin_ean, mp_row.ncm, mp_row.cest, 
        0, 0, mp_row.model_id, mp_row.fabric_id, mp_row.color_id, 
        mp_row.origin, mp_row.icms_cst, mp_row.icms_percent, mp_row.pis_cst, mp_row.pis_percent, 
        mp_row.cofins_cst, mp_row.cofins_percent, mp_row.ipi_cst, mp_row.ipi_percent, mp_row.cfop, 
        mp_row.customizations, mp_row.fabric_family, mp_row.size_grid, mp_row.supplier_id, 
        mp_row.supports_dtf, mp_row.supports_embroidery, mp_row.supports_silk, mp_row.supports_sublimation, 
        mp_row.lead_time_minutes, mp_row.production_sla_days, mp_row.active, mp_row.id, mp_row.technical_name
      ) RETURNING id INTO inserted_pa_id;

      -- Percorre variações
      FOR var_row IN SELECT * FROM public.product_variations WHERE product_id = mp_row.id LOOP
        
        new_var_sku := COALESCE(REPLACE(var_row.sku, 'MP-', 'PA-'), var_row.sku);
        IF new_var_sku = var_row.sku AND new_var_sku IS NOT NULL THEN
          new_var_sku := 'PA-' || var_row.sku;
        END IF;

        INSERT INTO public.product_variations (
          product_id, name, sku, price, stock,
          model_id, line_id, fabric_id, color_id, 
          size, gender, brand_id, sku_internal, barcode, qr_code, 
          crossdocking, lead_time_medio, cost_price, average_cost, active, source_mp_variant_id
        ) VALUES (
          inserted_pa_id, var_row.name, new_var_sku, var_row.price, 0,
          var_row.model_id, var_row.line_id, var_row.fabric_id, var_row.color_id, 
          var_row.size, var_row.gender, var_row.brand_id, REPLACE(COALESCE(var_row.sku_internal, ''), 'MP-', 'PA-'), var_row.barcode, var_row.qr_code, 
          var_row.crossdocking, var_row.lead_time_medio, var_row.cost_price, var_row.average_cost, var_row.active, var_row.id
        ) RETURNING id INTO new_pa_var_id;

        INSERT INTO public.product_relationships (mp_product_id, pa_product_id, mp_variant_id, pa_variant_id, relationship_type)
        VALUES (mp_row.id, inserted_pa_id, var_row.id, new_pa_var_id, 'MP_PA');

      END LOOP;
    END IF;
  END LOOP;
END $$;
