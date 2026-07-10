const fullPerms = () => ({
  dashboard: "administracao",
  crm: "administracao",
  pedidos: "administracao",
  producao: "administracao",
  estoque: "administracao",
  financeiro: "administracao",
  expedicao: "administracao",
  relatorios: "administracao",
  ia: "administracao",
  configuracoes: "administracao"
});
const opPerms = (mods) => {
  const base = {
    dashboard: "visualizacao",
    crm: "visualizacao",
    pedidos: "visualizacao",
    producao: "visualizacao",
    estoque: "visualizacao",
    financeiro: "sem_acesso",
    expedicao: "visualizacao",
    relatorios: "visualizacao",
    ia: "visualizacao",
    configuracoes: "sem_acesso"
  };
  mods.forEach((m) => base[m] = "operacao");
  return base;
};
[
  { id: "u1", name: "Ana Souza", email: "ana@e-roupas.com", role: "Diretoria", permissions: fullPerms(), avatarColor: "#0066ff" },
  { id: "u2", name: "Bruno Lima", email: "bruno@e-roupas.com", role: "Comercial", permissions: opPerms(["crm", "pedidos"]), avatarColor: "#7c3aed" },
  { id: "u3", name: "Carla Dias", email: "carla@e-roupas.com", role: "Designer", permissions: opPerms(["pedidos"]), avatarColor: "#db2777" },
  { id: "u4", name: "Diego Rocha", email: "diego@e-roupas.com", role: "Produção", permissions: opPerms(["producao", "pedidos"]), avatarColor: "#059669" },
  { id: "u5", name: "Eduarda M.", email: "edu@e-roupas.com", role: "Financeiro", permissions: opPerms(["financeiro"]), avatarColor: "#ea580c" },
  { id: "u6", name: "Fábio N.", email: "fabio@e-roupas.com", role: "Expedição", permissions: opPerms(["expedicao"]), avatarColor: "#0891b2" }
];
const clients = [
  { id: "c1", name: "Studio Norte", phone: "(11) 99876-1122", email: "contato@studionorte.com", document: "12.345.678/0001-90", brand: "ER", origin: "Instagram", owner: "Bruno Lima", notes: "Cliente recorrente. Prefere bordado.", ticket: 2480, total: 14820, orders: 6, createdAt: "2024-09-14" },
  { id: "c2", name: "Academia Pulse", phone: "(11) 98123-7766", email: "marketing@pulse.fit", document: "22.998.011/0001-10", brand: "ER", origin: "Indicação", owner: "Bruno Lima", notes: "DTF + sublimação. Prazos curtos.", ticket: 3890, total: 23340, orders: 6, createdAt: "2024-10-02" },
  { id: "c3", name: "PEAGAH8 Drop 03", phone: "(11) 99000-3344", email: "drop@peagah8.com", document: "—", brand: "PG8", origin: "Direto", owner: "Ana Souza", notes: "Coleção própria. Pedido grande.", ticket: 9800, total: 29400, orders: 3, createdAt: "2025-01-20" },
  { id: "c4", name: "Colégio Vértice", phone: "(11) 97766-5544", email: "compras@vertice.edu.br", document: "00.221.998/0001-22", brand: "ER", origin: "Google Ads", owner: "Bruno Lima", notes: "Uniformes escolares. Bordado + costura.", ticket: 5400, total: 16200, orders: 3, createdAt: "2025-02-08" },
  { id: "c5", name: "Padaria do Bairro", phone: "(11) 96655-4433", email: "joao@padaria.com", document: "33.445.111/0001-99", brand: "ER", origin: "Walk-in", owner: "Carla Dias", notes: "20 camisetas DTF, urgente.", ticket: 980, total: 980, orders: 1, createdAt: "2025-05-25" }
];
const mkProc = (type, status = "pendente", dependsOn) => ({
  id: type + "_" + Math.random().toString(36).slice(2, 7),
  type,
  status,
  dependsOn
});
const orders = [
  {
    id: "o1",
    code: "ER-260530-0001",
    brand: "ER",
    clientId: "c2",
    status: "em_producao",
    urgent: true,
    deadline: "2026-06-03",
    owner: "Diego Rocha",
    total: 4380,
    createdAt: "2026-05-28",
    items: [
      {
        id: "i1",
        product: "Camiseta Dry",
        color: "Preto",
        size: "P/M/G",
        qty: 60,
        notes: "Bordado peito + DTF costas",
        processes: [
          mkProc("separacao", "concluido"),
          mkProc("bordado", "em_andamento"),
          mkProc("dtf", "em_andamento"),
          mkProc("prensa", "bloqueado", ["bordado", "dtf"])
        ]
      }
    ],
    timeline: [
      { id: "t1", at: "2026-05-28 09:12", kind: "criacao", author: "Bruno Lima", text: "Pedido criado a partir de proposta #4421." },
      { id: "t2", at: "2026-05-28 14:30", kind: "aprovacao", author: "Cliente", text: "Arte aprovada via WhatsApp." },
      { id: "t3", at: "2026-05-29 08:00", kind: "producao", author: "Diego Rocha", text: "Separação concluída. Bordado iniciado." }
    ]
  },
  {
    id: "o2",
    code: "ER-260530-0002",
    brand: "ER",
    clientId: "c5",
    status: "aguardando_arte",
    urgent: true,
    deadline: "2026-06-01",
    owner: "Carla Dias",
    total: 980,
    createdAt: "2026-05-29",
    items: [
      {
        id: "i2",
        product: "Camiseta Algodão",
        color: "Branca",
        size: "M/G",
        qty: 20,
        processes: [mkProc("separacao"), mkProc("dtf"), mkProc("prensa", "bloqueado", ["dtf"])]
      }
    ],
    timeline: [
      { id: "t4", at: "2026-05-29 11:00", kind: "criacao", author: "Carla Dias", text: "Pedido criado." },
      { id: "t5", at: "2026-05-29 11:42", kind: "mensagem", author: "Carla Dias", text: "Aguardando logo em alta resolução do cliente." }
    ]
  },
  {
    id: "o3",
    code: "PG8-260528-0001",
    brand: "PG8",
    clientId: "c3",
    status: "liberado_producao",
    urgent: false,
    deadline: "2026-06-12",
    owner: "Ana Souza",
    total: 9800,
    createdAt: "2026-05-26",
    items: [
      {
        id: "i3",
        product: "Moletom Oversized",
        color: "Off-white",
        size: "P/M/G/GG",
        qty: 80,
        processes: [mkProc("separacao", "concluido"), mkProc("corte", "em_andamento"), mkProc("costura", "bloqueado", ["corte"]), mkProc("bordado", "bloqueado", ["costura"])]
      }
    ],
    timeline: [
      { id: "t6", at: "2026-05-26 10:00", kind: "criacao", author: "Ana Souza", text: "Pedido PG8 Drop 03 confirmado." },
      { id: "t7", at: "2026-05-27 09:00", kind: "financeiro", author: "Eduarda M.", text: "50% sinal recebido." }
    ]
  },
  {
    id: "o4",
    code: "ER-260525-0007",
    brand: "ER",
    clientId: "c4",
    status: "expedicao",
    urgent: false,
    deadline: "2026-05-30",
    owner: "Fábio N.",
    total: 5400,
    createdAt: "2026-05-20",
    items: [
      {
        id: "i4",
        product: "Camisa polo bordada",
        color: "Azul marinho",
        size: "P–GG",
        qty: 90,
        processes: [mkProc("separacao", "concluido"), mkProc("bordado", "concluido"), mkProc("prensa", "concluido")]
      }
    ],
    timeline: [
      { id: "t8", at: "2026-05-29 17:30", kind: "status", author: "Diego Rocha", text: "Produção finalizada, enviado para expedição." }
    ]
  },
  {
    id: "o5",
    code: "ER-260527-0003",
    brand: "ER",
    clientId: "c1",
    status: "aguardando_financeiro",
    urgent: false,
    deadline: "2026-06-05",
    owner: "Eduarda M.",
    total: 2480,
    createdAt: "2026-05-27",
    items: [
      {
        id: "i5",
        product: "Bag personalizada",
        color: "Cinza",
        size: "Único",
        qty: 40,
        processes: [mkProc("separacao"), mkProc("silk")]
      }
    ],
    timeline: [
      { id: "t9", at: "2026-05-27 16:10", kind: "financeiro", author: "Eduarda M.", text: "Aguardando comprovante de pagamento." }
    ]
  }
];
const statusLabel = {
  lead: "Lead",
  atendimento: "Atendimento",
  orcamento: "Orçamento",
  arte_criacao: "Arte em criação",
  aguardando_arte: "Aguardando arte",
  confirmado: "Confirmado",
  aguardando_financeiro: "Aguardando financeiro",
  liberado_producao: "Liberado p/ produção",
  em_producao: "Em produção",
  qualidade: "Qualidade",
  expedicao: "Expedição",
  entregue: "Entregue",
  finalizado: "Finalizado"
};
const statusTone = {
  lead: "neutral",
  atendimento: "neutral",
  orcamento: "neutral",
  arte_criacao: "info",
  aguardando_arte: "warning",
  confirmado: "info",
  aguardando_financeiro: "warning",
  liberado_producao: "primary",
  em_producao: "primary",
  qualidade: "info",
  expedicao: "info",
  entregue: "success",
  finalizado: "success"
};
function clientById(id) {
  return clients.find((c) => c.id === id);
}
export {
  clients as a,
  statusTone as b,
  clientById as c,
  orders as o,
  statusLabel as s
};
