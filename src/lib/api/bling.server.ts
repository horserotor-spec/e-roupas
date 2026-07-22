import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../supabase";

const BLING_TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

export const exchangeBlingToken = createServerFn("POST", async (code: string) => {
  // Get credentials from system_settings
  const { data, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("key", "bling_integration")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Configurações do Bling não encontradas no banco de dados.");
  }

  const settings = data.value;
  if (!settings.client_id || !settings.client_secret) {
    throw new Error("Client ID ou Client Secret não configurados.");
  }

  const credentials = Buffer.from(`${settings.client_id}:${settings.client_secret}`).toString("base64");

  const response = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "1.0"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code
    }).toString()
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error_description || result.error || "Erro ao obter token do Bling.");
  }

  // Update settings in database
  const newSettings = {
    ...settings,
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: Date.now() + (result.expires_in * 1000), // convert seconds to ms
    status: "conectado"
  };

  await supabase
    .from("system_settings")
    .update({ value: newSettings })
    .eq("id", data.id);

  return { success: true };
});

export const emitirNFSeBling = createServerFn("POST", async (orderId: string) => {
  // 1. Get the Bling token
  const { data: settingsData } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "bling_integration")
    .maybeSingle();

  if (!settingsData || !settingsData.value?.access_token) {
    throw new Error("Bling não está configurado ou não autorizado.");
  }

  // TODO: Check if token is expired, if so, refresh it using refresh_token

  // 2. Get order details
  const { data: order } = await supabase
    .from("orders")
    .select("*, clients(*), order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("Pedido não encontrado.");

  // 3. Mount payload for Bling API v3
  // Since taxes are configured in Bling, we just pass the basic required fields
  const payload = {
    data: order.created_at, // Date of issue
    contato: {
      nome: order.clients?.name || "Consumidor Final",
      numeroDocumento: order.clients?.cpf_cnpj || "00000000000",
      tipoPessoa: order.clients?.entity_type === "pj" ? "J" : "F",
      email: order.clients?.email || "",
      telefone: order.clients?.phone || ""
    },
    // Map items to Bling format
    itens: order.order_items?.map((item: any) => ({
      descricao: item.product_name,
      valor: item.unit_price || 0,
      quantidade: item.quantity || 1
    })),
    // We don't send specific tax variables, Bling applies defaults
  };

  const response = await fetch("https://www.bling.com.br/Api/v3/nfse", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${settingsData.value.access_token}`,
      "Content-Type": "application/json",
      "Accept": "1.0"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Erro ao emitir NFS-e no Bling.");
  }

  // result.data contains the new NFS-e ID and potentially a link
  // Save the reference in the order metadata
  const newMeta = {
    ...(order.metadata || {}),
    nfse_bling_id: result.data?.id,
    nfse_status: "emitida"
  };

  await supabase.from("orders").update({ metadata: newMeta }).eq("id", orderId);

  return result.data;
});
 
