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
