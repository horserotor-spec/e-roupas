import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShoppingBag, Factory, Boxes, Wallet,
  Truck, BarChart3, Sparkles, Settings, Package, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/crm", label: "CRM", icon: Users },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag, highlighted: true },
  { to: "/producao", label: "Produção", icon: Factory },
  { to: "/estoque", label: "Estoque", icon: Boxes },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/expedicao", label: "Expedição", icon: Truck },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/ia", label: "IA Assistente", icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col hairline-r bg-sidebar text-sidebar-foreground">
      <div className="h-14 px-5 flex items-center justify-center hairline-b">
        <img src="/logo.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain" />
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as never}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : (item as any).highlighted
                    ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4", active ? "text-primary" : ((item as any).highlighted ? "text-green-600" : "text-muted-foreground group-hover:text-foreground"))} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 hairline-t">
        <div className="rounded-lg bg-muted/60 px-3 py-2.5 text-[11px] text-muted-foreground leading-relaxed">
          Multi-marca: <span className="text-foreground font-medium">e-roupas</span> · <span className="text-foreground font-medium">peagah8</span>
        </div>
      </div>
    </aside>
  );
}
