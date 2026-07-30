import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShoppingBag, Factory, Boxes, Wallet,
  Truck, BarChart3, Sparkles, Settings, Package, FileText, UserCog, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: any; exact?: boolean; module?: string; highlighted?: boolean; subItems?: { to: string; label: string }[] };

const allNavItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true, module: "Dashboard" },
  { to: "/crm", label: "CRM", icon: Users, module: "Clientes" },
  { to: "/produtos", label: "Produtos", icon: Package, module: "Estoque" },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText, module: "Pedidos" },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag, module: "Pedidos" },
  { to: "/producao", label: "Produção", icon: Factory, module: "Produção" },
  { to: "/estoque", label: "Estoque", icon: Boxes, module: "Estoque" },
  { 
    to: "/financeiro", 
    label: "Financeiro", 
    icon: Wallet, 
    module: "Financeiro",
    exact: true,
    subItems: [
      { to: "/financeiro", label: "Visão Geral" },
      { to: "/financeiro/receber", label: "Contas a Receber" },
      { to: "/financeiro/pagar", label: "Contas a Pagar" },
      { to: "/financeiro/fluxo-caixa", label: "Fluxo de Caixa" },
      { to: "/financeiro/dre", label: "DRE Gerencial" },
      { to: "/financeiro/centro-custos", label: "Centro de Custos" },
      { to: "/financeiro/conciliacao", label: "Conciliação" },
      { to: "/financeiro/relatorios", label: "Relatórios" },
    ]
  },
  { to: "/expedicao", label: "Expedição", icon: Truck, module: "Expedição" },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3, module: "Relatórios" },
  { to: "/ia", label: "IA Assistente", icon: Sparkles, module: "Dashboard" },
  { to: "/usuarios", label: "Usuários", icon: UserCog, module: "Usuários" },
  { to: "/configuracoes", label: "Configurações", icon: Settings, module: "Configurações" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const roleName = user?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";

  const nav = allNavItems.filter(item => {
    if (item.module === "Usuários") return isDiretoriaOrAdmin;
    if (isDiretoriaOrAdmin) return true;
    if (item.module) {
      const hasPermission = user?.permissions?.[item.module]?.['visualizar'];
      if (!hasPermission && item.module !== "Dashboard") return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 md:sticky md:flex w-60 shrink-0 flex-col hairline-r bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out print:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-14 px-5 flex items-center justify-between hairline-b">
          <div>
            <img src="/logo.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain block dark:hidden" />
            <img src="/logo-dark.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain hidden dark:block" />
          </div>
          <button onClick={onClose} className="md:hidden text-muted-foreground p-1 hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const isModuleActive = item.subItems
              ? (pathname === item.to || pathname.startsWith(item.to + "/"))
              : isActive;
            const Icon = item.icon;
            return (
              <div key={item.to} className="flex flex-col">
                <Link
                  to={item.to as never}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                    isActive && !item.subItems
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : item.highlighted
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
                    isModuleActive && item.subItems ? "text-primary" : ""
                  )}
                >
                  <Icon className={cn("size-4", isModuleActive ? "text-primary" : (item.highlighted ? "text-green-600" : "text-muted-foreground group-hover:text-foreground"))} />
                  <span>{item.label}</span>
                </Link>
                {item.subItems && isModuleActive && (
                  <div className="ml-6 mt-1 flex flex-col space-y-1 border-l pl-2 border-border/50">
                    {item.subItems.map(sub => {
                      const isSubActive = pathname === sub.to;
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to as never}
                          onClick={handleLinkClick}
                          className={cn(
                            "rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
                            isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 hairline-t">
          <div className="rounded-lg bg-muted/60 px-3 py-2.5 text-[11px] text-muted-foreground leading-relaxed">
            Multi-marca: <span className="text-foreground font-medium">e-roupas</span> · <span className="text-foreground font-medium">{user?.name || 'Carregando...'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
