export type Brand = "ER" | "PG8";

export type Role =
  | "Diretoria" | "Comercial" | "Atendimento" | "Designer"
  | "Financeiro" | "Impressão" | "Produção" | "Compras" | "Estoque" | "Expedição";

export type AccessLevel = "sem_acesso" | "visualizacao" | "operacao" | "aprovacao" | "administracao";

export type Module =
  | "dashboard" | "crm" | "pedidos" | "producao" | "estoque"
  | "financeiro" | "expedicao" | "relatorios" | "ia" | "configuracoes";

export type OrderStatus =
  | "lead" | "atendimento" | "orcamento" | "arte_criacao" | "aguardando_arte"
  | "confirmado" | "aguardando_financeiro" | "liberado_producao"
  | "separacao" | "corte" | "costura" | "bordado" | "impressao" | "prensa"
  | "qualidade" | "expedicao" | "entregue" | "finalizado";

export type ProcessType =
  | "separacao" | "corte" | "costura" | "bordado"
  | "dtf" | "silk" | "sublimacao" | "prensa" | "qualidade" | "expedicao";

export const statusLabel: Record<OrderStatus, string> = {
  lead: "Lead", atendimento: "Atendimento", orcamento: "Orçamento",
  arte_criacao: "Arte em criação", aguardando_arte: "Aguardando aprovação arte",
  confirmado: "Pedido confirmado", aguardando_financeiro: "Aguardando financeiro",
  liberado_producao: "Liberado produção", separacao: "Separação", corte: "Corte",
  costura: "Costura", bordado: "Bordado", impressao: "Impressão", prensa: "Prensa",
  qualidade: "Manuseio e qualidade", expedicao: "Expedição", entregue: "Entregue", finalizado: "Finalizado",
};

export const statusTone: Record<OrderStatus, "neutral" | "info" | "warning" | "success" | "primary"> = {
  lead: "neutral", atendimento: "neutral", orcamento: "neutral",
  arte_criacao: "info", aguardando_arte: "warning",
  confirmado: "info", aguardando_financeiro: "warning",
  liberado_producao: "primary", separacao: "primary", corte: "primary",
  costura: "primary", bordado: "primary", impressao: "primary", prensa: "primary",
  qualidade: "info", expedicao: "info", entregue: "success", finalizado: "success",
};

export const processLabel: Record<ProcessType, string> = {
  separacao: "Separação", corte: "Corte", costura: "Costura", bordado: "Bordado",
  dtf: "Impressão DTF", silk: "Silk", sublimacao: "Sublimação", prensa: "Prensa",
  qualidade: "Manuseio e qualidade", expedicao: "Expedição"
};
