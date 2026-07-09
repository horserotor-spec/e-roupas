-- Conceder permissões para a role authenticated e anon na tabela system_settings
GRANT ALL ON TABLE public.system_settings TO authenticated;
GRANT ALL ON TABLE public.system_settings TO anon;
GRANT ALL ON TABLE public.system_settings TO service_role;

-- Garantir privilégios em todas as sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Garantir que RLS está habilitado e com política ativa
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users on system_settings" ON public.system_settings;
CREATE POLICY "Enable all for authenticated users on system_settings" ON public.system_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for anonymous users on system_settings" ON public.system_settings;
CREATE POLICY "Enable select for anonymous users on system_settings" ON public.system_settings FOR SELECT TO anon USING (true);
