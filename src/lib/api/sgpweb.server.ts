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
  produtos?: string[];
  nota_fiscal?: string;
  chave_nota_fiscal?: string;
  serie_nota_fiscal?: string;
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
  remetente?: {
    nome?: string;
    cpf_cnpj?: string;
    email?: string;
    telefone?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
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
      objetos: [
        {
          uf: data.destinatario.uf,
          cep: data.destinatario.cep.replace(/\D/g, ""),
          peso: data.volumes[0]?.peso || 1000,
          tipo: 1,
          email: data.destinatario.email || "sal.luz@outlook.com",
          bairro: data.destinatario.bairro,
          cartao: "",
          cidade: data.destinatario.cidade,
          numero: data.destinatario.numero || "S/N",
          empresa: "",
          produto: data.produtos || ["Produto E-Roupas"],
          cpf_cnpj: (data.destinatario.cpf_cnpj || "00000000000").replace(/\D/g, ""),
          endereco: data.destinatario.logradouro,
          telefone: data.destinatario.fone || "(88) 99452-8989",
          remetente: data.remetente?.nome || "e-roupas lab têxtil ltda.",
          observacao: data.observacao || `Envio SGP - Ref: ${data.referencia}`,
          complemento: data.destinatario.complemento || "Casa",
          nota_fiscal: data.nota_fiscal || "",
          destinatario: data.destinatario.nome,
          uf_remetente: data.remetente?.uf || "PR",
          cep_remetente: data.remetente?.cep || "86063380",
          identificador: data.referencia,
          email_remetente: data.remetente?.email || "contato@e-roupas.com.br",
          valor_declarado: data.valorDeclarado ? String(data.valorDeclarado.toFixed(2)) : "0.00",
          bairro_remetente: data.remetente?.bairro || "Térreo",
          cidade_remetente: data.remetente?.cidade || "Londrina",
          numero_remetente: data.remetente?.numero || "71",
          servico_correios: data.servico,
          aviso_recebimento: "2",
          chave_nota_fiscal: data.chave_nota_fiscal || "",
          empresa_remetente: data.remetente?.nome || "e-roupas lab têxtil ltda.",
          serie_nota_fiscal: data.serie_nota_fiscal || "1",
          cpf_cnpj_remetente: data.remetente?.cpf_cnpj || "",
          endereco_remetente: data.remetente?.logradouro || "Rua Etienne Lenoir",
          telefone_remetente: data.remetente?.telefone || ""
        }
      ]
    };

    try {
      const url = `${SGPWEB_BASE}/api/pre-postagem?chave_integracao=${SGPWEB_APP}`;
      const response = await fetch(url, {
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

      let trackingCode = "";
      let pedidoId = "";
      
      const findData = (obj: any) => {
        if (Array.isArray(obj) && obj.length > 0) {
           pedidoId = obj[0].id || obj[0].pedido_id || obj[0].numero || obj[0].codigo || pedidoId;
           trackingCode = obj[0].codigo_rastreio || obj[0].tracking || obj[0].etiqueta || obj[0].rastreio || trackingCode;
        } else if (typeof obj === 'object' && obj !== null) {
           pedidoId = obj.id || obj.pedido_id || obj.numero || obj.codigo || pedidoId;
           trackingCode = obj.codigo_rastreio || obj.tracking || obj.etiqueta || obj.rastreio || trackingCode;
           
           if (!trackingCode && obj.data) findData(obj.data);
           if (!trackingCode && obj.objetos) findData(obj.objetos);
           if (!trackingCode && obj.retorno) findData(obj.retorno);
        }
      }
      findData(json);

      return {
        success: true,
        pedidoId: String(pedidoId || ""),
        trackingCode: trackingCode || "",
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
      `${SGPWEB_BASE}/api/pre-postagem/${data.pedidoId}/etiqueta?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`,
      `${SGPWEB_BASE}/api/pre-postagem/etiqueta/${data.pedidoId}?token=${SGPWEB_TOKEN}&app=${SGPWEB_APP}`,
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
