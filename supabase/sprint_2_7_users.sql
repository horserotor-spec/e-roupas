-- SPRINT 2.7: USUÁRIOS E PERMISSÕES GRANULARES

-- 1. ADICIONAR COLUNAS À TABELA USERS
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativo',
ADD COLUMN IF NOT EXISTS last_ip TEXT,
ADD COLUMN IF NOT EXISTS last_device TEXT,
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false;

-- Atualizar status dos usuários existentes para 'Ativo' se estiverem null e active for true
UPDATE public.users SET status = 'Ativo' WHERE active = true AND status IS NULL;
UPDATE public.users SET status = 'Inativo' WHERE active = false AND status IS NULL;

-- 2. ATUALIZAR TABELA USER_PERMISSIONS PARA MATRIZ DE AÇÕES
ALTER TABLE public.user_permissions
ADD COLUMN IF NOT EXISTS actions JSONB DEFAULT '{}'::jsonb;

-- Migração básica de permissões antigas
UPDATE public.user_permissions
SET actions = jsonb_build_object(
  'visualizar', true,
  'criar', CASE WHEN permission_level IN ('write', 'admin') THEN true ELSE false END,
  'editar', CASE WHEN permission_level IN ('write', 'admin') THEN true ELSE false END,
  'excluir', CASE WHEN permission_level = 'admin' THEN true ELSE false END,
  'exportar', CASE WHEN permission_level = 'admin' THEN true ELSE false END,
  'aprovar', CASE WHEN permission_level = 'admin' THEN true ELSE false END,
  'alterar_status', CASE WHEN permission_level IN ('write', 'admin') THEN true ELSE false END,
  'mover_kanban', CASE WHEN permission_level IN ('write', 'admin') THEN true ELSE false END
)
WHERE actions = '{}'::jsonb OR actions IS NULL;

-- 3. GARANTIR ESTRUTURA DE AUDIT_LOGS (caso não tenha todos os campos)
-- Audit logs já existe conforme schema.sql, vamos adicionar target_user_id se necessário
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 4. Função para atualizar o last_login/IP
CREATE OR REPLACE FUNCTION public.update_user_session(user_id UUID, ip TEXT, device TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET last_ip = ip,
      last_device = device,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
