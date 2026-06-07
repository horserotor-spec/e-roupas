-- ----------------------------------------------------------------------
-- SPRINT 2.4 - Controle de Estoque Industrial
-- ----------------------------------------------------------------------

-- 1. Novas colunas para auditoria na tabela de movimentações
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS quantity_before NUMERIC DEFAULT 0;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS quantity_after NUMERIC DEFAULT 0;

-- 2. Trigger Function para processamento de saldo
CREATE OR REPLACE FUNCTION trg_process_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
    v_qty_available NUMERIC;
    v_qty_total NUMERIC;
    v_adjust_amount NUMERIC;
BEGIN
    -- Obter os saldos atuais do lote
    SELECT quantity_available, quantity_total
    INTO v_qty_available, v_qty_total
    FROM public.inventory_batches
    WHERE id = NEW.batch_id
    FOR UPDATE; -- lock row to prevent race conditions

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lote de estoque não encontrado para o movimento';
    END IF;

    -- Preencher a quantidade anterior no log imutável
    NEW.quantity_before := v_qty_available;

    -- Padronizar ajuste (Entradas somam, Saídas subtraem)
    IF NEW.movement_type IN ('compra', 'produção', 'ajuste_entrada', 'devolução', 'entrada', 'transferencia_entrada') THEN
        v_adjust_amount := abs(NEW.quantity);
    ELSIF NEW.movement_type IN ('venda', 'perda', 'expedição', 'ajuste_saida', 'consumo', 'saida', 'amostra', 'erro', 'transferencia_saida') THEN
        v_adjust_amount := -abs(NEW.quantity);
    ELSE
        v_adjust_amount := NEW.quantity;
    END IF;

    NEW.quantity := v_adjust_amount;
    NEW.quantity_after := v_qty_available + v_adjust_amount;

    IF NEW.quantity_after < 0 THEN
        RAISE EXCEPTION 'Quantidade indisponível no lote. Saldo resultante ficaria negativo.';
    END IF;

    -- Atualizar o lote
    UPDATE public.inventory_batches
    SET 
        quantity_available = NEW.quantity_after,
        quantity_total = quantity_total + v_adjust_amount
    WHERE id = NEW.batch_id;

    -- Garantir preenchimento do usuário
    IF NEW.created_by IS NULL THEN
        NEW.created_by := auth.uid();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Associar Trigger
DROP TRIGGER IF EXISTS trigger_stock_movement ON public.inventory_movements;
CREATE TRIGGER trigger_stock_movement
BEFORE INSERT ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION trg_process_stock_movement();

-- 4. Garantir que Updates/Deletes sejam proibidos na tabela de movimentação
CREATE OR REPLACE FUNCTION trg_prevent_stock_movement_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Edição ou deleção de movimentos de estoque não é permitida por questões de auditoria.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_stock_movement_mutation ON public.inventory_movements;
CREATE TRIGGER trigger_prevent_stock_movement_mutation
BEFORE UPDATE OR DELETE ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION trg_prevent_stock_movement_mutation();

-- 5. Views Auxiliares para o Dashboard
CREATE OR REPLACE VIEW public.vw_stock_summary AS
SELECT 
    v.product_id,
    p.name as product_name,
    p.sku as product_sku,
    p.format as product_format,
    v.id as variant_id,
    v.sku_internal,
    v.size,
    c.name as color_name,
    c.hex as color_hex,
    f.name as fabric_name,
    COALESCE(SUM(b.quantity_total), 0) as total_qty,
    COALESCE(SUM(b.quantity_reserved), 0) as reserved_qty,
    COALESCE(SUM(b.quantity_available), 0) as available_qty
FROM public.product_variants v
JOIN public.products p ON p.id = v.product_id
LEFT JOIN public.canonical_colors c ON c.id = v.color_id
LEFT JOIN public.fabrics f ON f.id = v.fabric_id
LEFT JOIN public.inventory_batches b ON b.product_variant_id = v.id AND b.active = true
WHERE v.active = true
GROUP BY v.id, p.id, c.id, f.id;
