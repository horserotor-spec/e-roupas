import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShoppingBag, Factory, Boxes, Wallet,
  Truck, BarChart3, Sparkles, Settings, Shirt,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/crm", label: "CRM", icon: Users },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag },
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
      <div className="h-14 px-5 flex items-center gap-2.5 hairline-b">
        <div className="size-7 rounded-lg bg-primary text-primary-foreground grid place-items-center">
          <Shirt className="size-4" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">e-roupas OS</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">v1 · Sprint 1</div>
        </div>
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
                  : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
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
