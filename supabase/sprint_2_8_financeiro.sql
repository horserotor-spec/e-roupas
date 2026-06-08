-- Sprint 2.8: Módulo Financeiro
-- Plano de Contas e Lançamentos Financeiros (Contas a Receber, Pagar, Caixa)

-- Criação do Plano de Contas (Categorias)
CREATE TABLE IF NOT EXISTS public.financial_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('receita', 'custo_variavel', 'custo_fixo', 'financeiro', 'imposto')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserindo Plano de Contas padrão
INSERT INTO public.financial_categories (name, type) VALUES
('Venda de Roupas', 'receita'),
('Private Label', 'receita'),
('Dropshipping', 'receita'),
('Serviços', 'receita'),
('Malha e Tecidos', 'custo_variavel'),
('DTF', 'custo_variavel'),
('Bordado', 'custo_variavel'),
('Silk e Estamparia', 'custo_variavel'),
('Prensa', 'custo_variavel'),
('Etiqueta', 'custo_variavel'),
('Embalagem', 'custo_variavel'),
('Frete e Logística', 'custo_variavel'),
('Aluguel', 'custo_fixo'),
('Energia Elétrica', 'custo_fixo'),
('Internet e Telefonia', 'custo_fixo'),
('Sistemas e Software', 'custo_fixo'),
('Marketing e Tráfego', 'custo_fixo'),
('Salários e Pró-labore', 'custo_fixo'),
('Limpeza e Manutenção', 'custo_fixo'),
('Taxas de Cartão', 'financeiro'),
('Juros e Multas', 'financeiro'),
('Antecipações', 'financeiro'),
('Simples Nacional / Impostos', 'imposto')
ON CONFLICT DO NOTHING;

-- Criação da Tabela de Movimentações Financeiras
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('receber', 'pagar')),
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'no_prazo', 'vence_hoje', 'recebido', 'pago', 'parcial', 'atrasado', 'cancelado')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2) NOT NULL, -- Valor antes de juros/descontos
    interest_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method TEXT, -- PIX, Boleto, Cartão de Crédito, etc.
    installments_count INT DEFAULT 1,
    installment_number INT DEFAULT 1,
    cost_center TEXT NOT NULL DEFAULT 'Geral' CHECK (cost_center IN ('Atendimento', 'Designer', 'Financeiro', 'Impressão', 'Produção', 'Expedição', 'Compras', 'Estoque', 'Comercial', 'Diretoria', 'Geral')),
    category_id UUID REFERENCES public.financial_categories(id),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- Se vier de um pedido
    supplier_id UUID, -- Se vier de um fornecedor (Assumindo que talvez não exista a tabela de fornecedores realizada com fkey forte, deixamos solto ou vinculamos se tiver)
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas (Permitindo todos autenticados para simplificar por enquanto, restrição será por interface)
CREATE POLICY "Enable all for authenticated users on financial_categories" ON public.financial_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on financial_transactions" ON public.financial_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp_financial()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_financial_transactions
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp_financial();
