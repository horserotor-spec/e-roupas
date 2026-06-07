-- Garantir os privilégios base na tabela para a role autenticada
GRANT ALL ON TABLE public.order_payments TO authenticated;
GRANT ALL ON TABLE public.order_payments TO anon;
GRANT ALL ON TABLE public.order_payments TO service_role;

GRANT ALL ON TABLE public.accounts_payable TO authenticated;
GRANT ALL ON TABLE public.accounts_payable TO anon;
GRANT ALL ON TABLE public.accounts_payable TO service_role;

-- Garantir privilégios também nas sequences (se existirem)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Recriar as políticas RLS apenas para garantir
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura de order_payments" ON public.order_payments;
DROP POLICY IF EXISTS "Permitir inserção em order_payments" ON public.order_payments;
DROP POLICY IF EXISTS "Permitir atualização de order_payments" ON public.order_payments;
DROP POLICY IF EXISTS "Permitir deleção de order_payments" ON public.order_payments;

CREATE POLICY "Permitir leitura de order_payments" ON public.order_payments FOR SELECT USING (true);
CREATE POLICY "Permitir inserção em order_payments" ON public.order_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de order_payments" ON public.order_payments FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção de order_payments" ON public.order_payments FOR DELETE USING (true);

DROP POLICY IF EXISTS "Permitir leitura de accounts_payable" ON public.accounts_payable;
DROP POLICY IF EXISTS "Permitir inserção em accounts_payable" ON public.accounts_payable;
DROP POLICY IF EXISTS "Permitir atualização de accounts_payable" ON public.accounts_payable;
DROP POLICY IF EXISTS "Permitir deleção de accounts_payable" ON public.accounts_payable;

CREATE POLICY "Permitir leitura de accounts_payable" ON public.accounts_payable FOR SELECT USING (true);
CREATE POLICY "Permitir inserção em accounts_payable" ON public.accounts_payable FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de accounts_payable" ON public.accounts_payable FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção de accounts_payable" ON public.accounts_payable FOR DELETE USING (true);
