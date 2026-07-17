import { createServerFn } from "@tanstack/react-start";

// ─── Configuração SGPWeb (server-side, nunca exposta ao browser) ──────────────
const SGPWEB_TOKEN = "ua79VynzrgETLsmqUEoQgYjCZV7CrGaUoN9Gh1qY";
const SGPWEB_APP   = "76268b2de7402b74bd6d9b645725c5ff";
const SGPWEB_BASE  = "https://www.sgpweb.com.br/novo";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SGPWebPrepostagemPayload {
  servico: string;
  referencia: string;
  valorDeclarado?: number;
  observacao?: string;
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
  volumes: {
    peso: number;
    altura: number;
    largura: number;
    comprimento: number;
  }[];
}

// ─── Server Function: criar pré-postagem ─────────────────────────────────────
export const criarPrepostagemServer = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: SGPWebPrepostagemPayload }) => {
    const payload = {
      token: SGPWEB_TOKEN,
      app: SGPWEB_APP,
      ...data,
    };

    try {
      const response = await fetch(`${SGPWEB_BASE}/api/prepostagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        // Resposta não é JSON — pode ser HTML de erro
        return {
          success: false,
          message: `Resposta inválida do SGPWeb (${response.status}): ${text.substring(0, 200)}`,
          raw: text.substring(0, 500),
        };
      }

      if (!response.ok || json.erro || json.error) {
        return {
          success: false,
          message: json.mensagem || json.message || json.erro || json.error || `Erro ${response.status}`,
          raw: json,
        };
      }

      return {
        success: true,
        pedidoId: String(json.id || json.pedido_id || json.numero || json.codigo || ""),
        trackingCode: json.codigo_rastreio || json.tracking || json.etiqueta || json.rastreio || "",
        message: "Pré-postagem criada com sucesso!",
        raw: json,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro ao conectar com SGPWeb: ${err.message}`,
      };
    }
  });

// ─── Server Function: obter etiqueta PDF (bytes em base64) ───────────────────
export const obterEtiquetaServer = createServerFn({ method: "GET" })
  .handler(async ({ data }: { data: { pedidoId: string } }) => {
    const urls = [
      `${SGPWEB_BASE}/api/etiqueta/${data.pedidoId}?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`,
      `${SGPWEB_BASE}/api/prepostagem/${data.pedidoId}/etiqueta?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: { Accept: "application/pdf,*/*" },
        });
        if (!response.ok) continue;

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("pdf") || contentType.includes("octet-stream")) {
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          return { success: true, pdfBase64: base64 };
        }
      } catch {
        continue;
      }
    }

    return { success: false, message: "Não foi possível obter o PDF da etiqueta do SGPWeb." };
  });
