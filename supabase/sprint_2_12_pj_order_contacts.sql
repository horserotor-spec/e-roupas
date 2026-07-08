-- Migration: Add order contact details for corporate clients (PJ)
-- These fields map the contact name and WhatsApp of the person managing orders on behalf of the corporate client.

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS order_contact_name TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS order_contact_phone TEXT;

COMMENT ON COLUMN public.clients.order_contact_name IS 'Nome do contato responsável pelos pedidos (apenas PJ)';
COMMENT ON COLUMN public.clients.order_contact_phone IS 'Telefone/WhatsApp do contato responsável pelos pedidos (apenas PJ)';
