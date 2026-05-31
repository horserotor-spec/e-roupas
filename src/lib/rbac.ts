import { User } from './auth';

export type AccessLevel = "sem_acesso" | "visualizacao" | "operacao" | "aprovacao" | "administracao";

export type Module =
  | "dashboard" | "crm" | "pedidos" | "producao" | "estoque"
  | "financeiro" | "expedicao" | "relatorios" | "ia" | "configuracoes";

export const accessLevels: Record<AccessLevel, number> = {
  sem_acesso: 0,
  visualizacao: 1,
  operacao: 2,
  aprovacao: 3,
  administracao: 4,
};

export function hasPermission(user: User | null, module: Module, requiredLevel: AccessLevel = "visualizacao"): boolean {
  if (!user || !user.active) return false;
  
  // Se o usuário for diretoria, pode ter acesso total (ou tratar via banco de dados).
  // A abordagem correta é confiar no campo permissions vindo do banco.
  
  const userLevel = user.permissions[module] || "sem_acesso";
  return accessLevels[userLevel as AccessLevel] >= accessLevels[requiredLevel];
}
