import { supabase } from "@/lib/supabase";

// ─── Configuração SGPWeb ──────────────────────────────────────────────────────
const SGPWEB_TOKEN = "ua79VynzrgETLsmqUEoQgYjCZV7CrGaUoN9Gh1qY";
const SGPWEB_APP   = "76268b2de7402b74bd6d9b645725c5ff";
const SGPWEB_BASE  = "https://novo.sgpweb.com.br";

export const SGPWEB_SERVICES = {
  PAC: { code: "3298", label: "PAC" },
  SEDEX: { code: "3220", label: "SEDEX" },
  PAC_MINI: { code: "4227", label: "PAC Mini" },
} as const;

export type SGPWebService = keyof typeof SGPWEB_SERVICES;

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export interface SGPWebPackage {
  peso: number;        // kg (ex: 0.5)
  altura: number;      // cm
  largura: number;     // cm
  comprimento: number; // cm
}

export interface SGPWebOrder {
  orderId: string;
  orderCode: string;
  service: SGPWebService;
  destinatario: {
    nome: string;
    cpf_cnpj?: string;
    email?: string;
    fone?: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  volume: SGPWebPackage;
  valorDeclarado?: number;
  observacao?: string;
}

export interface SGPWebResult {
  success: boolean;
  pedidoId?: string;
  trackingCode?: string;
  labelUrl?: string;
  message?: string;
  pdfBase64?: string;
}

// ─── Helper: formata CEP ───────────────────────────────────────────────────────
function formatCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8).padStart(8, "0");
}

// ─── Criar pré-postagem no SGPWeb ─────────────────────────────────────────────
export async function criarPrepostagemSGPWeb(order: SGPWebOrder): Promise<SGPWebResult> {
  const serviceCode = SGPWEB_SERVICES[order.service].code;

  const payload = {
    token: SGPWEB_TOKEN,
    app: SGPWEB_APP,
    servico: serviceCode,
    referencia: order.orderCode,
    valor_declarado: order.valorDeclarado || 0,
    observacao: order.observacao || "",
    destinatario: {
      ...order.destinatario,
      cep: formatCep(order.destinatario.cep),
    },
    volumes: [{
      peso: order.volume.peso,
      altura: order.volume.altura,
      largura: order.volume.largura,
      comprimento: order.volume.comprimento,
    }],
  };

  try {
    const response = await fetch(`${SGPWEB_BASE}/api/prepostagem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.erro) {
      return {
        success: false,
        message: data.mensagem || data.erro || `Erro ${response.status} ao criar pré-postagem`,
      };
    }

    const pedidoId = data.id || data.pedido_id || data.numero;
    const trackingCode = data.codigo_rastreio || data.tracking || data.etiqueta;

    // Salvar no banco de dados
    await supabase.from("orders").update({
      sgpweb_pedido_id: String(pedidoId),
      tracking_code: trackingCode,
      logistics_status: "Etiqueta gerada",
    }).eq("id", order.orderId);

    // Timeline
    await supabase.from("order_timeline").insert([{
      order_id: order.orderId,
      event_type: "etiqueta_gerada",
      description: `Etiqueta SGPWeb gerada. Código de rastreio: ${trackingCode || "pendente"}. Serviço: ${SGPWEB_SERVICES[order.service].label}.`,
    }]);

    return {
      success: true,
      pedidoId: String(pedidoId),
      trackingCode,
      message: "Pré-postagem criada com sucesso!",
    };
  } catch (err: any) {
    // Se for erro de CORS (falha de rede), retornar mensagem específica
    const isCorsError = err.message?.includes("fetch") || err.message?.includes("network") || err.name === "TypeError";
    return {
      success: false,
      message: isCorsError
        ? "Erro de conexão com SGPWeb. Verifique se a API está acessível."
        : err.message || "Erro desconhecido ao criar pré-postagem",
    };
  }
}

// ─── Obter etiqueta em PDF do SGPWeb ─────────────────────────────────────────
export async function obterEtiquetaSGPWeb(
  pedidoId: string,
  orderCode: string
): Promise<SGPWebResult> {
  try {
    // Tentar obter PDF da etiqueta
    const url = `${SGPWEB_BASE}/api/etiqueta/${pedidoId}?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`;
    const response = await fetch(url);

    if (!response.ok) {
      // Tentar URL alternativa
      const url2 = `${SGPWEB_BASE}/api/prepostagem/${pedidoId}/etiqueta?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`;
      const response2 = await fetch(url2);
      if (!response2.ok) {
        return {
          success: false,
          message: `Não foi possível obter a etiqueta (status ${response.status})`,
        };
      }

      const blob2 = await response2.blob();
      return downloadPDF(blob2, orderCode);
    }

    const blob = await response.blob();
    return downloadPDF(blob, orderCode);
  } catch (err: any) {
    return { success: false, message: err.message || "Erro ao obter etiqueta" };
  }
}

// ─── Helper: disparar download do PDF ─────────────────────────────────────────
function downloadPDF(blob: Blob, orderCode: string): SGPWebResult {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Etiqueta-${orderCode}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, message: "PDF baixado com sucesso!" };
  } catch (err: any) {
    return { success: false, message: "Erro ao baixar PDF: " + err.message };
  }
}

// ─── Consulta de pré-postagem existente ───────────────────────────────────────
export async function consultarPrepostagemSGPWeb(pedidoId: string): Promise<any> {
  try {
    const response = await fetch(
      `${SGPWEB_BASE}/api/prepostagem/${pedidoId}?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
