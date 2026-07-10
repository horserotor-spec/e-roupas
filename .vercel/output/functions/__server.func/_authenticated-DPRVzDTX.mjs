import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { N as Navigate, O as Outlet, f as useRouterState, L as Link } from "./_libs/tanstack__react-router.mjs";
import { z as useAuth, v as cn, A as useTheme } from "./_ssr/router-BxmJvJdu.mjs";
import { o as orders, c as clientById, a as clients, s as statusLabel } from "./_ssr/mock-data-DefFmkSt.mjs";
import "./_libs/sonner.mjs";
import { V as LoaderCircle, T as LayoutDashboard, ax as Users, a4 as Package, M as FileText, ai as ShoppingBag, I as Factory, h as Boxes, ay as Wallet, ar as Truck, j as ChartColumn, aj as Sparkles, av as UserCog, af as Settings, aA as X, _ as Menu, a0 as Monitor, a2 as Moon, al as Sun, X as LogOut, ad as Search } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/cmdk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
const allNavItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true, module: "Dashboard" },
  { to: "/crm", label: "CRM", icon: Users, module: "Clientes" },
  { to: "/produtos", label: "Produtos", icon: Package, module: "Estoque" },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText, module: "Pedidos" },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag, highlighted: true, module: "Pedidos" },
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
      { to: "/financeiro/relatorios", label: "Relatórios" }
    ]
  },
  { to: "/expedicao", label: "Expedição", icon: Truck, module: "Expedição" },
  { to: "/relatorios", label: "Relatórios", icon: ChartColumn, module: "Relatórios" },
  { to: "/ia", label: "IA Assistente", icon: Sparkles, module: "Dashboard" },
  { to: "/usuarios", label: "Usuários", icon: UserCog, module: "Usuários" },
  { to: "/configuracoes", label: "Configurações", icon: Settings, module: "Configurações" }
];
function Sidebar({ isOpen, onClose }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const handleLinkClick = () => {
    if (onClose) onClose();
  };
  const roleName = user?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";
  const nav = allNavItems.filter((item) => {
    if (item.module === "Usuários") return isDiretoriaOrAdmin;
    if (isDiretoriaOrAdmin) return true;
    if (item.module) {
      const hasPermission = user?.permissions?.[item.module]?.["visualizar"];
      if (!hasPermission && item.module !== "Dashboard") return false;
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: cn(
      "fixed inset-y-0 left-0 z-50 md:sticky md:flex w-60 shrink-0 flex-col hairline-r bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out print:hidden",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 px-5 flex items-center justify-between hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.png", alt: "e-roupas logo", style: { width: "169px", height: "35px" }, className: "object-contain dark:invert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "md:hidden text-muted-foreground p-1 hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto", children: nav.map((item) => {
        const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const isModuleActive = item.subItems ? pathname === item.to || pathname.startsWith(item.to + "/") : isActive;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              onClick: handleLinkClick,
              className: cn(
                "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                isActive && !item.subItems ? "bg-sidebar-accent text-sidebar-accent-foreground" : item.highlighted ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm" : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
                isModuleActive && item.subItems ? "text-primary" : ""
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("size-4", isModuleActive ? "text-primary" : item.highlighted ? "text-green-600" : "text-muted-foreground group-hover:text-foreground") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
              ]
            }
          ),
          item.subItems && isModuleActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-6 mt-1 flex flex-col space-y-1 border-l pl-2 border-border/50", children: item.subItems.map((sub) => {
            const isSubActive = pathname === sub.to;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: sub.to,
                onClick: handleLinkClick,
                className: cn(
                  "rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
                  isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                ),
                children: sub.label
              },
              sub.to
            );
          }) })
        ] }, item.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 hairline-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/60 px-3 py-2.5 text-[11px] text-muted-foreground leading-relaxed", children: [
        "Multi-marca: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "e-roupas" }),
        " · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: user?.name || "Carregando..." })
      ] }) })
    ] })
  ] });
}
function UniversalSearch() {
  const [open, setOpen] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const results = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { clients: [], orders: [] };
    return {
      clients: clients.filter(
        (c) => [c.name, c.phone, c.email, c.document].some((f) => f.toLowerCase().includes(term))
      ).slice(0, 5),
      orders: orders.filter((o) => {
        const c = clientById(o.clientId);
        return [o.code, c?.name ?? "", o.items.map((i) => i.product).join(" ")].some((f) => f.toLowerCase().includes(term));
      }).slice(0, 6)
    };
  }, [q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(true),
        className: "group flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted-foreground hover:border-border-strong transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Buscar cliente, pedido, telefone…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium", children: "⌘K" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4", onClick: () => setOpen(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-2xl rounded-2xl border border-border bg-popover shadow-lg overflow-hidden",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 h-14 hairline-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  value: q,
                  onChange: (e) => setQ(e.target.value),
                  placeholder: "Busca universal · clientes, pedidos, telefones, produtos",
                  className: "flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "rounded-md p-1 text-muted-foreground hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[60vh] overflow-y-auto py-2", children: [
              !q.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-10 text-center text-sm text-muted-foreground", children: "Comece a digitar — pesquisa em clientes, pedidos, telefones e produtos." }),
              q.trim() && results.orders.length === 0 && results.clients.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-10 text-center text-sm text-muted-foreground", children: [
                "Nada encontrado para “",
                q,
                "”."
              ] }),
              results.orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Pedidos", children: results.orders.map((o) => {
                const c = clientById(o.clientId);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/pedidos/$orderId",
                    params: { orderId: o.id },
                    onClick: () => setOpen(false),
                    className: "flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium truncate", children: [
                          o.code,
                          " · ",
                          c?.name
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: o.items.map((i) => i.product).join(", ") })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground shrink-0", children: statusLabel[o.status] })
                    ]
                  },
                  o.id
                );
              }) }),
              results.clients.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Clientes", children: results.clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/crm/$clientId",
                  params: { clientId: c.id },
                  onClick: () => setOpen(false),
                  className: "flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: c.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                        c.phone,
                        " · ",
                        c.email
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground shrink-0", children: c.brand })
                  ]
                },
                c.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hairline-t bg-muted/40 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Estrutura pronta para busca contextual com IA." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border border-border bg-surface px-1 py-0.5", children: "esc" }),
                " fechar"
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("px-2 pb-2"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children })
  ] });
}
function TopBar({ onMenuClick }) {
  const { mode, setMode, resolved } = useTheme();
  const { user, logout } = useAuth();
  const [menu, setMenu] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const fn = (e) => {
      if (!ref.current?.contains(e.target)) setMenu(false);
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, []);
  const cycleTheme = () => setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  const Icon = mode === "system" ? Monitor : resolved === "dark" ? Moon : Sun;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 glass hairline-b print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 px-4 md:px-6 flex items-center gap-4", children: [
    onMenuClick && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onMenuClick,
        className: "md:hidden size-9 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mr-1",
        title: "Abrir menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UniversalSearch, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: cycleTheme,
          className: "size-9 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
          title: `Tema: ${mode}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setMenu((v) => !v),
            className: "flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-muted transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "size-7 rounded-full grid place-items-center text-white text-[11px] font-semibold",
                  style: { background: user?.avatarColor ?? "#0066ff" },
                  children: user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block text-left leading-tight", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] font-medium", children: user?.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: user?.role })
              ] })
            ]
          }
        ),
        menu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg p-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 hairline-b mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: user?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: user?.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: logout,
              className: "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
                " Sair"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
function AppShell() {
  const { loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex w-full bg-background relative overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { onMenuClick: () => setSidebarOpen(true) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
const SplitComponent = AppShell;
export {
  SplitComponent as component
};
