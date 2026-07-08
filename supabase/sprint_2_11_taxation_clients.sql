-- Migration: Add taxation fields to clients table
-- These fields are used for standard Brazilian NF-e generation

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email_nfe TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS icms_contributor_type TEXT DEFAULT '9';

COMMENT ON COLUMN public.clients.email_nfe IS 'E-mail para envio de Notas Fiscais (NF-e)';
COMMENT ON COLUMN public.clients.icms_contributor_type IS 'Indicador da IE do Destinatário (1 - Contribuinte, 2 - Isento, 9 - Não Contribuinte)';
