import { supabase } from "../supabase";

const BLING_API_BASE = "https://www.bling.com.br/Api/v3";
const BLING_OAUTH_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";
const BLING_TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

export interface BlingSettings {
  client_id: string;
  client_secret: string;
  access_token: string;
  refresh_token: string;
  expires_at: number; // timestamp
  status: "conectado" | "desconectado" | "erro";
}

export async function getBlingSettings(): Promise<BlingSettings | null> {
  const { data, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("key", "bling_integration")
    .maybeSingle();

  if (error || !data) return null;
  return data.value as BlingSettings;
}

export async function updateBlingSettings(settings: Partial<BlingSettings>) {
  const current = await getBlingSettings() || {} as BlingSettings;
  const newValue = { ...current, ...settings };
  
  const { data: existing } = await supabase
    .from("system_settings")
    .select("id")
    .eq("key", "bling_integration")
    .maybeSingle();

  if (existing) {
    await supabase.from("system_settings").update({ value: newValue }).eq("id", existing.id);
  } else {
    await supabase.from("system_settings").insert({
      key: "bling_integration",
      value: newValue,
      description: "Credenciais e tokens para integracao com API v3 do Bling (NFS-e)"
    });
  }
  
  return newValue;
}

// Retorna a URL para o usuario autorizar o aplicativo
export function getBlingAuthorizationUrl(clientId: string, state: string) {
  return `${BLING_OAUTH_URL}?response_type=code&client_id=${clientId}&state=${state}`;
}
