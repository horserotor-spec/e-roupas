-- Tentar criar as tabelas caso não existam (já devem existir)
CREATE TABLE IF NOT EXISTS public.financial_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('receita', 'custo_variavel', 'custo_fixo', 'financeiro', 'imposto')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('receber', 'pagar')),
    status TEXT NOT NULL DEFAULT 'pendente',
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2) NOT NULL,
    interest_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method TEXT,
    installments_count INT DEFAULT 1,
    installment_number INT DEFAULT 1,
    cost_center TEXT NOT NULL DEFAULT 'Geral',
    category_id UUID REFERENCES public.financial_categories(id),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    supplier_id UUID,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Excluir as políticas antigas se existirem (para evitar o erro "already exists")
DROP POLICY IF EXISTS "Enable all for authenticated users on financial_categories" ON public.financial_categories;
DROP POLICY IF EXISTS "Enable all for authenticated users on financial_transactions" ON public.financial_transactions;

-- Recriar as políticas corretamente
CREATE POLICY "Enable all for authenticated users on financial_categories" ON public.financial_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on financial_transactions" ON public.financial_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Atribuir permissões garantidas aos papéis
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_transactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_categories TO anon;

-- Inserir categorias base
INSERT INTO public.financial_categories (name, type) VALUES
('Venda de Roupas', 'receita'),
('Malha e Tecidos', 'custo_variavel'),
('Salários', 'custo_fixo'),
('Impostos', 'imposto')
ON CONFLICT DO NOTHING;
