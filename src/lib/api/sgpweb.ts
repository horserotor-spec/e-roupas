import { supabase } from "@/lib/supabase";
import { criarPrepostagemServer, obterEtiquetaServer } from "./sgpweb.server";

// ─── Serviços disponíveis ─────────────────────────────────────────────────────
export const SGPWEB_SERVICES = {
  PAC: { code: "3298", label: "PAC" },
  SEDEX: { code: "3220", label: "SEDEX" },
  PAC_MINI: { code: "4227", label: "PAC Mini" },
} as const;

export type SGPWebService = keyof typeof SGPWEB_SERVICES;

export interface SGPWebPackage {
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
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
  produtos?: string[];
  nota_fiscal?: string;
  chave_nota_fiscal?: string;
  serie_nota_fiscal?: string;
}

export interface SGPWebResult {
  success: boolean;
  pedidoId?: string;
  trackingCode?: string;
  message?: string;
}

// ─── Formatar CEP ─────────────────────────────────────────────────────────────
function formatCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8).padStart(8, "0");
}

// ─── Criar pré-postagem (via server function — sem CORS) ──────────────────────
export async function criarPrepostagemSGPWeb(order: SGPWebOrder): Promise<SGPWebResult> {
  const serviceCode = SGPWEB_SERVICES[order.service].code;

  try {
    const result = await criarPrepostagemServer({
      data: {
        servico: serviceCode,
        referencia: order.orderCode,
        valorDeclarado: order.valorDeclarado,
        observacao: order.observacao || order.orderCode,
        produtos: order.produtos,
        nota_fiscal: order.nota_fiscal,
        chave_nota_fiscal: order.chave_nota_fiscal,
        serie_nota_fiscal: order.serie_nota_fiscal,
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
      },
    });

    if (result.success) {
      // Salvar no banco
      await supabase.from("orders").update({
        tracking_code: result.trackingCode || null,
        logistics_status: "Etiqueta gerada",
      }).eq("id", order.orderId);

      // Timeline
      await supabase.from("order_timeline").insert([{
        order_id: order.orderId,
        event_type: "etiqueta_gerada",
        description: `Etiqueta SGPWeb gerada. ${result.trackingCode ? `Rastreio: ${result.trackingCode}.` : ""} Serviço: ${SGPWEB_SERVICES[order.service].label}. Pedido SGP: ${result.pedidoId || "?"}`,
      }]);
    }

    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Erro ao criar pré-postagem" };
  }
}

// ─── Obter etiqueta em PDF e disparar download ────────────────────────────────
export async function obterEtiquetaSGPWeb(pedidoId: string, orderCode: string): Promise<SGPWebResult> {
  try {
    const result = await obterEtiquetaServer({ data: { pedidoId } });

    if (result.success && result.pdfBase64) {
      // Converter base64 → blob → download
      const binaryStr = atob(result.pdfBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Etiqueta-${orderCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, message: "PDF baixado!" };
    }

    return { success: false, message: result.message || "Não foi possível obter o PDF" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
