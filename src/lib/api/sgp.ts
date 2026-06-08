import { supabase } from "../supabase";

// Tipos baseados na documentação típica de integrações logísticas SGP Web
export interface SgpSettings {
  api_url: string;
  token: string;
  app_key: string;
  user: string;
  password?: string;
  environment: "homologacao" | "producao";
  status: "conectado" | "desconectado" | "erro";
}

export interface QuoteRequest {
  originZip: string;
  destinationZip: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  value: number;
}

export interface QuoteResponse {
  carrier: string;
  service: string;
  price: number;
  delivery_days: number;
  error?: string;
}

export interface GenerateLabelRequest {
  orderId: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  clientAddress: {
    zip: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  volumes: number;
  weight: number;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
  invoiceNumber?: string;
  invoiceValue: number;
}

export interface GenerateLabelResponse {
  tracking_code: string;
  label_url: string;
  error?: string;
}

// Busca as configurações do SGP no banco de dados
export async function getSgpSettings(): Promise<SgpSettings | null> {
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "sgp_web_integration")
      .single();

    if (error) {
      console.warn("Erro ao buscar configurações do SGP:", error.message);
      return null;
    }

    return data?.value as SgpSettings;
  } catch (err) {
    console.error("Exceção ao buscar configurações do SGP:", err);
    return null;
  }
}

// Cotação de Frete (Simulada para Desenvolvimento)
export async function quoteShipping(req: QuoteRequest): Promise<QuoteResponse[]> {
  const settings = await getSgpSettings();
  
  if (!settings || settings.status !== "conectado") {
    throw new Error("SGP Web não configurado ou desconectado.");
  }

  // TODO: Substituir por fetch real na API do SGP Web
  // Usando setTimeout para simular delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          carrier: "Correios",
          service: "PAC",
          price: 25.90 + (req.weight * 2),
          delivery_days: 7,
        },
        {
          carrier: "Correios",
          service: "SEDEX",
          price: 45.90 + (req.weight * 3),
          delivery_days: 2,
        },
        {
          carrier: "Transportadora SGP",
          service: "Rodoviário",
          price: 35.00 + (req.weight * 1.5),
          delivery_days: 5,
        }
      ]);
    }, 800);
  });
}

// Geração de Etiqueta (Simulada para Desenvolvimento)
export async function generateLabel(req: GenerateLabelRequest): Promise<GenerateLabelResponse> {
  const settings = await getSgpSettings();
  
  if (!settings || settings.status !== "conectado") {
    throw new Error("SGP Web não configurado ou desconectado.");
  }

  // TODO: Substituir por chamada real na API do SGP Web
  return new Promise((resolve) => {
    setTimeout(() => {
      const trackingCode = "BR" + Math.floor(Math.random() * 1000000000).toString().padStart(9, "0") + "SGP";
      resolve({
        tracking_code: trackingCode,
        label_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      });
    }, 1200);
  });
}

// Rastreamento (Simulada para Desenvolvimento)
export async function trackOrder(trackingCode: string): Promise<any[]> {
  const settings = await getSgpSettings();
  
  if (!settings || settings.status !== "conectado") {
    throw new Error("SGP Web não configurado ou desconectado.");
  }

  // TODO: Substituir por chamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: "Objeto postado",
          location: "Agência dos Correios - Londrina/PR",
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "Em trânsito para Unidade de Tratamento",
          location: "Unidade de Tratamento - Curitiba/PR",
        },
        {
          date: new Date().toISOString(),
          status: "Saiu para entrega ao destinatário",
          location: "Unidade de Distribuição Local",
        }
      ]);
    }, 1000);
  });
}
