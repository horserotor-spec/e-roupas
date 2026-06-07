-- Habilitar RLS nas tabelas, caso não estejam
ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_payable ENABLE ROW LEVEL SECURITY;

-- Políticas para order_payments
CREATE POLICY "Permitir leitura de order_payments para usuários autenticados" 
ON order_payments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserção em order_payments para usuários autenticados" 
ON order_payments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir atualização de order_payments para usuários autenticados" 
ON order_payments FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Permitir deleção de order_payments para usuários autenticados" 
ON order_payments FOR DELETE TO authenticated USING (true);

-- Políticas para accounts_payable
CREATE POLICY "Permitir leitura de accounts_payable para usuários autenticados" 
ON accounts_payable FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserção em accounts_payable para usuários autenticados" 
ON accounts_payable FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir atualização de accounts_payable para usuários autenticados" 
ON accounts_payable FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Permitir deleção de accounts_payable para usuários autenticados" 
ON accounts_payable FOR DELETE TO authenticated USING (true);
