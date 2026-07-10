import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, e as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { J as redirect, I as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { P as Portal$1, C as Content2, R as Root2, T as Trigger } from "../_libs/radix-ui__react-popover.mjs";
import { _ as _e } from "../_libs/cmdk.mjs";
import { R as Root, P as Portal, a as Content, C as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { aA as X, ad as Search } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const appCss = "/assets/styles-C5FGcFUE.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const KEY = "eroupas-os.theme";
const Ctx$1 = reactExports.createContext(null);
function resolve(m) {
  if (m !== "system") return m;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ThemeProvider({ children }) {
  const [mode, setModeState] = reactExports.useState("system");
  const [resolved, setResolved] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const stored = localStorage.getItem(KEY) ?? "system";
    setModeState(stored);
  }, []);
  reactExports.useEffect(() => {
    const r = resolve(mode);
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
    localStorage.setItem(KEY, mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const fn = () => {
        const nr = mq.matches ? "dark" : "light";
        setResolved(nr);
        document.documentElement.classList.toggle("dark", nr === "dark");
      };
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    }
  }, [mode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx$1.Provider, { value: { mode, resolved, setMode: setModeState }, children });
}
function useTheme() {
  const v = reactExports.useContext(Ctx$1);
  if (!v) throw new Error("useTheme fora de ThemeProvider");
  return v;
}
const supabaseUrl = "https://krmcxyafxouhuzapulxj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybWN4eWFmeG91aHV6YXB1bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjM4MzUsImV4cCI6MjA5NTczOTgzNX0.8sHHLRBakYvA8rvg6WIqbMHrjUKHzCUrqf-zro65EvQ";
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
const Ctx = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const userIdRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let mounted = true;
    async function fetchProfile(authUserId) {
      if (!mounted) return;
      try {
        let { data: profile, error: profileErr } = await supabase.from("users").select("*, roles(name)").eq("id", authUserId).single();
        if (profileErr || !profile) {
          console.warn("Profile not found in public.users, attempting to auto-create...", profileErr);
          const { data: { user: sessionUser } } = await supabase.auth.getUser();
          if (sessionUser) {
            const { data: newProfile, error: insertErr } = await supabase.from("users").insert({
              id: sessionUser.id,
              name: sessionUser.user_metadata?.full_name || sessionUser.email?.split("@")[0] || "Usuário",
              email: sessionUser.email,
              status: "Ativo"
            }).select("*, roles(name)").single();
            if (!insertErr && newProfile) {
              profile = newProfile;
              profileErr = null;
            } else {
              console.error("Auto-create profile failed:", insertErr);
            }
          }
          if (profileErr || !profile) {
            userIdRef.current = null;
            setUser(null);
            return;
          }
        }
        if (profile.status === "Bloqueado" || profile.status === "Inativo" || profile.status === "Desligado") {
          console.warn(`User is ${profile.status}, denying access.`);
          await supabase.auth.signOut();
          userIdRef.current = null;
          setUser(null);
          return;
        }
        const { data: perms, error: permsErr } = await supabase.from("user_permissions").select("module, actions, permission_level").eq("user_id", authUserId);
        const permissionsMap = {};
        if (permsErr && permsErr.code === "42703") {
          console.warn("Coluna actions não existe. Rodar SQL de migração.");
          const { data: oldPerms } = await supabase.from("user_permissions").select("module, permission_level").eq("user_id", authUserId);
          if (oldPerms) {
            oldPerms.forEach((p) => {
              permissionsMap[p.module] = {
                visualizar: true,
                criar: p.permission_level === "write" || p.permission_level === "admin",
                editar: p.permission_level === "write" || p.permission_level === "admin",
                excluir: p.permission_level === "admin"
              };
            });
          }
        } else if (perms) {
          perms.forEach((p) => {
            permissionsMap[p.module] = p.actions || {
              visualizar: true,
              criar: p.permission_level === "write" || p.permission_level === "admin",
              editar: p.permission_level === "write" || p.permission_level === "admin"
            };
          });
        }
        if (mounted) {
          userIdRef.current = profile.id;
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatarUrl: profile.avatar_url,
            role: profile.roles?.name || "Sem Cargo",
            permissions: permissionsMap,
            status: profile.status || "Ativo",
            forcePasswordChange: profile.force_password_change
          });
        }
      } catch (e) {
        console.error("Auth profile fetch error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        userIdRef.current = session.user.id;
        fetchProfile(session.user.id);
      } else {
        userIdRef.current = null;
        if (mounted) setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (userIdRef.current === session.user.id) {
          if (event === "USER_UPDATED") {
            fetchProfile(session.user.id);
          }
          return;
        }
        userIdRef.current = session.user.id;
        setLoading(true);
        fetchProfile(session.user.id);
      } else {
        userIdRef.current = null;
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/redefinir-senha"
    });
    if (error) throw error;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { user, loading, login, logout, resetPassword }, children });
}
function useAuth() {
  const v = reactExports.useContext(Ctx);
  if (!v) throw new Error("useAuth fora de AuthProvider");
  return v;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-semibold tracking-tight", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Página não encontrada." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Voltar" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", children: "Algo deu errado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Tentar novamente"
      }
    ) })
  ] }) });
}
const Route$z = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "e-roupas OS" },
      { name: "description", content: "ERP premium para a operação têxtil e de personalização da e-roupas." },
      { property: "og:title", content: "e-roupas OS" },
      { name: "twitter:title", content: "e-roupas OS" },
      { property: "og:description", content: "ERP premium para a operação têxtil e de personalização da e-roupas." },
      { name: "twitter:description", content: "ERP premium para a operação têxtil e de personalização da e-roupas." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2fafaffb-f292-4e99-945f-54a003245c38/id-preview-aa17f4ac--0030311c-d1f1-432f-ab54-adc32ed1382e.lovable.app-1780160080448.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2fafaffb-f292-4e99-945f-54a003245c38/id-preview-aa17f4ac--0030311c-d1f1-432f-ab54-adc32ed1382e.lovable.app-1780160080448.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$z.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) }) });
}
const $$splitComponentImporter$x = () => import("./login-BMCzFXJQ.mjs");
const Route$y = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Entrar · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./debug-estoque-DMJenZ6C.mjs");
const Route$x = createFileRoute("/debug-estoque")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitErrorComponentImporter$2 = () => import("../_authenticated-DtApBCNN.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("../_authenticated-Dtbom--Q.mjs");
const $$splitComponentImporter$v = () => import("../_authenticated-DPRVzDTX.mjs");
const Route$w = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
const Route$v = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  }
});
const $$splitComponentImporter$u = () => import("./print.operacional-D-IHxGQe.mjs");
const Route$u = createFileRoute("/print/operacional")({
  validateSearch: (search) => {
    return {
      orderId: search.orderId || ""
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./print._id-BpdhLl3w.mjs");
const Route$t = createFileRoute("/print/$id")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("../_authenticated.relatorios-BF0rt9HI.mjs");
const Route$s = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [{
      title: "Relatórios · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("../_authenticated.producao-CkVeKqAZ.mjs");
const Route$r = createFileRoute("/_authenticated/producao")({
  head: () => ({
    meta: [{
      title: "Produção · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("../_authenticated.ia-BZZDBxxr.mjs");
const Route$q = createFileRoute("/_authenticated/ia")({
  head: () => ({
    meta: [{
      title: "IA Assistente · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("../_authenticated.financeiro-BQ3n9mu6.mjs");
const Route$p = createFileRoute("/_authenticated/financeiro")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("../_authenticated.expedicao-1TK0GzUf.mjs");
const Route$o = createFileRoute("/_authenticated/expedicao")({
  head: () => ({
    meta: [{
      title: "Expedição Logística · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("../_authenticated.estoque--3FnUn1H.mjs");
const Route$n = createFileRoute("/_authenticated/estoque")({
  head: () => ({
    meta: [{
      title: "Estoque Inteligente · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("../_authenticated.dashboard-CUm0_F1q.mjs");
const Route$m = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("../_authenticated.configuracoes-DYy-FqcX.mjs");
const Route$l = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [{
      title: "Configurações · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("../_authenticated.usuarios.index-CxpLdOt1.mjs");
const Route$k = createFileRoute("/_authenticated/usuarios/")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("../_authenticated.produtos.index-ve3Jg9N2.mjs");
const Route$j = createFileRoute("/_authenticated/produtos/")({
  head: () => ({
    meta: [{
      title: "Produtos · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("../_authenticated.pedidos.index-luaQXmYS.mjs");
const Route$i = createFileRoute("/_authenticated/pedidos/")({
  head: () => ({
    meta: [{
      title: "Pedidos · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("../_authenticated.orcamentos.index-BZ5SCQIb.mjs");
const Route$h = createFileRoute("/_authenticated/orcamentos/")({
  head: () => ({
    meta: [{
      title: "Orçamentos · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("../_authenticated.financeiro.index-D3Z5YdNp.mjs");
const Route$g = createFileRoute("/_authenticated/financeiro/")({
  head: () => ({
    meta: [{
      title: "Visão Geral · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("../_authenticated.crm.index-BPLi6ErM.mjs");
const Route$f = createFileRoute("/_authenticated/crm/")({
  head: () => ({
    meta: [{
      title: "CRM · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./print.etiqueta._id-BEiDmr3I.mjs");
const Route$e = createFileRoute("/print/etiqueta/$id")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("../_authenticated.usuarios.novo-BhuNAAuJ.mjs");
const Route$d = createFileRoute("/_authenticated/usuarios/novo")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("../_authenticated.usuarios._id-BGbVMPM9.mjs");
const Route$c = createFileRoute("/_authenticated/usuarios/$id")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("../_authenticated.producao.separacao-DWik6dk6.mjs");
const Route$b = createFileRoute("/_authenticated/producao/separacao")({
  validateSearch: (search) => {
    return {
      orderId: search.orderId || ""
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatCurrency(value) {
  if (value === null || value === void 0) return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
const $$splitComponentImporter$a = () => import("../_authenticated.pedidos.novo-CWaqQsJt.mjs");
const Route$a = createFileRoute("/_authenticated/pedidos/novo")({
  validateSearch: (search) => {
    return {
      type: search.type || "pedido"
    };
  },
  head: () => ({
    meta: [{
      title: "Novo Pedido · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitErrorComponentImporter$1 = () => import("../_authenticated.pedidos._orderId-C_itxYqA.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("../_authenticated.pedidos._orderId-BHZOglXZ.mjs");
const $$splitComponentImporter$9 = () => import("../_authenticated.pedidos._orderId-B4YAAMjo.mjs");
const Route$9 = createFileRoute("/_authenticated/pedidos/$orderId")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Pedido ${params.orderId} · e-roupas OS`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitComponentImporter$8 = () => import("../_authenticated.pedidos._id-GL0FQ9VB.mjs");
const Route$8 = createFileRoute("/_authenticated/pedidos/$id")({
  head: () => ({
    meta: [{
      title: "Editar Pedido · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_authenticated.financeiro.relatorios-DCWyYJbk.mjs");
const Route$7 = createFileRoute("/_authenticated/financeiro/relatorios")({
  head: () => ({
    meta: [{
      title: "Relatórios Financeiros · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_authenticated.financeiro.receber-BofaF9su.mjs");
const Route$6 = createFileRoute("/_authenticated/financeiro/receber")({
  head: () => ({
    meta: [{
      title: "Contas a Receber · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_authenticated.financeiro.pagar-DJb_cp8H.mjs");
const Route$5 = createFileRoute("/_authenticated/financeiro/pagar")({
  head: () => ({
    meta: [{
      title: "Contas a Pagar · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_authenticated.financeiro.fluxo-caixa-qpecDl4g.mjs");
const Route$4 = createFileRoute("/_authenticated/financeiro/fluxo-caixa")({
  head: () => ({
    meta: [{
      title: "Fluxo de Caixa · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_authenticated.financeiro.dre-CnYyju0E.mjs");
const Route$3 = createFileRoute("/_authenticated/financeiro/dre")({
  head: () => ({
    meta: [{
      title: "DRE Anual · e-roupas OS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_authenticated.financeiro.conciliacao-BlsUlGV9.mjs");
const Route$2 = createFileRoute("/_authenticated/financeiro/conciliacao")({
  head: () => ({
    meta: [{
      title: "Conciliação · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_authenticated.financeiro.centro-custos-Csp0nlIh.mjs");
const Route$1 = createFileRoute("/_authenticated/financeiro/centro-custos")({
  head: () => ({
    meta: [{
      title: "Centro de Custos · Financeiro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitErrorComponentImporter = () => import("../_authenticated.crm._clientId-C_itxYqA.mjs");
const $$splitNotFoundComponentImporter = () => import("../_authenticated.crm._clientId-b_fY7aXx.mjs");
const $$splitComponentImporter = () => import("../_authenticated.crm._clientId-DeJ8GNvg.mjs");
const Route = createFileRoute("/_authenticated/crm/$clientId")({
  loader: async ({
    params
  }) => {
    const {
      data: client,
      error: clientErr
    } = await supabase.from("clients").select("*").eq("id", params.clientId).maybeSingle();
    if (clientErr || !client) {
      throw notFound();
    }
    const {
      data: dbOrders
    } = await supabase.from("orders").select("*").eq("client_id", params.clientId).order("created_at", {
      ascending: false
    });
    const clientOrders = dbOrders || [];
    const total = clientOrders.reduce((sum, o) => sum + Number(o.final_total || 0), 0);
    const ordersCount = clientOrders.length;
    const ticket = ordersCount > 0 ? total / ordersCount : 0;
    return {
      client: {
        ...client,
        total,
        orders: ordersCount,
        ticket
      },
      clientOrders
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.client.name ?? "Cliente"} · CRM`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const LoginRoute = Route$y.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$z
});
const DebugEstoqueRoute = Route$x.update({
  id: "/debug-estoque",
  path: "/debug-estoque",
  getParentRoute: () => Route$z
});
const AuthenticatedRoute = Route$w.update({
  id: "/_authenticated",
  getParentRoute: () => Route$z
});
const IndexRoute = Route$v.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$z
});
const PrintOperacionalRoute = Route$u.update({
  id: "/print/operacional",
  path: "/print/operacional",
  getParentRoute: () => Route$z
});
const PrintIdRoute = Route$t.update({
  id: "/print/$id",
  path: "/print/$id",
  getParentRoute: () => Route$z
});
const AuthenticatedRelatoriosRoute = Route$s.update({
  id: "/relatorios",
  path: "/relatorios",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedProducaoRoute = Route$r.update({
  id: "/producao",
  path: "/producao",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedIaRoute = Route$q.update({
  id: "/ia",
  path: "/ia",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFinanceiroRoute = Route$p.update({
  id: "/financeiro",
  path: "/financeiro",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedExpedicaoRoute = Route$o.update({
  id: "/expedicao",
  path: "/expedicao",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedEstoqueRoute = Route$n.update({
  id: "/estoque",
  path: "/estoque",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$m.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedConfiguracoesRoute = Route$l.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedUsuariosIndexRoute = Route$k.update({
  id: "/usuarios/",
  path: "/usuarios/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedProdutosIndexRoute = Route$j.update({
  id: "/produtos/",
  path: "/produtos/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPedidosIndexRoute = Route$i.update({
  id: "/pedidos/",
  path: "/pedidos/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedOrcamentosIndexRoute = Route$h.update({
  id: "/orcamentos/",
  path: "/orcamentos/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFinanceiroIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedCrmIndexRoute = Route$f.update({
  id: "/crm/",
  path: "/crm/",
  getParentRoute: () => AuthenticatedRoute
});
const PrintEtiquetaIdRoute = Route$e.update({
  id: "/print/etiqueta/$id",
  path: "/print/etiqueta/$id",
  getParentRoute: () => Route$z
});
const AuthenticatedUsuariosNovoRoute = Route$d.update({
  id: "/usuarios/novo",
  path: "/usuarios/novo",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedUsuariosIdRoute = Route$c.update({
  id: "/usuarios/$id",
  path: "/usuarios/$id",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedProducaoSeparacaoRoute = Route$b.update({
  id: "/separacao",
  path: "/separacao",
  getParentRoute: () => AuthenticatedProducaoRoute
});
const AuthenticatedPedidosNovoRoute = Route$a.update({
  id: "/pedidos/novo",
  path: "/pedidos/novo",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPedidosOrderIdRoute = Route$9.update({
  id: "/pedidos/$orderId",
  path: "/pedidos/$orderId",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedPedidosIdRoute = Route$8.update({
  id: "/pedidos/$id",
  path: "/pedidos/$id",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFinanceiroRelatoriosRoute = Route$7.update({
  id: "/relatorios",
  path: "/relatorios",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroReceberRoute = Route$6.update({
  id: "/receber",
  path: "/receber",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroPagarRoute = Route$5.update({
  id: "/pagar",
  path: "/pagar",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroFluxoCaixaRoute = Route$4.update({
  id: "/fluxo-caixa",
  path: "/fluxo-caixa",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroDreRoute = Route$3.update({
  id: "/dre",
  path: "/dre",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroConciliacaoRoute = Route$2.update({
  id: "/conciliacao",
  path: "/conciliacao",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedFinanceiroCentroCustosRoute = Route$1.update({
  id: "/centro-custos",
  path: "/centro-custos",
  getParentRoute: () => AuthenticatedFinanceiroRoute
});
const AuthenticatedCrmClientIdRoute = Route.update({
  id: "/crm/$clientId",
  path: "/crm/$clientId",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFinanceiroRouteChildren = {
  AuthenticatedFinanceiroCentroCustosRoute,
  AuthenticatedFinanceiroConciliacaoRoute,
  AuthenticatedFinanceiroDreRoute,
  AuthenticatedFinanceiroFluxoCaixaRoute,
  AuthenticatedFinanceiroPagarRoute,
  AuthenticatedFinanceiroReceberRoute,
  AuthenticatedFinanceiroRelatoriosRoute,
  AuthenticatedFinanceiroIndexRoute
};
const AuthenticatedFinanceiroRouteWithChildren = AuthenticatedFinanceiroRoute._addFileChildren(
  AuthenticatedFinanceiroRouteChildren
);
const AuthenticatedProducaoRouteChildren = {
  AuthenticatedProducaoSeparacaoRoute
};
const AuthenticatedProducaoRouteWithChildren = AuthenticatedProducaoRoute._addFileChildren(
  AuthenticatedProducaoRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedConfiguracoesRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedEstoqueRoute,
  AuthenticatedExpedicaoRoute,
  AuthenticatedFinanceiroRoute: AuthenticatedFinanceiroRouteWithChildren,
  AuthenticatedIaRoute,
  AuthenticatedProducaoRoute: AuthenticatedProducaoRouteWithChildren,
  AuthenticatedRelatoriosRoute,
  AuthenticatedCrmClientIdRoute,
  AuthenticatedPedidosIdRoute,
  AuthenticatedPedidosOrderIdRoute,
  AuthenticatedPedidosNovoRoute,
  AuthenticatedUsuariosIdRoute,
  AuthenticatedUsuariosNovoRoute,
  AuthenticatedCrmIndexRoute,
  AuthenticatedOrcamentosIndexRoute,
  AuthenticatedPedidosIndexRoute,
  AuthenticatedProdutosIndexRoute,
  AuthenticatedUsuariosIndexRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  DebugEstoqueRoute,
  LoginRoute,
  PrintIdRoute,
  PrintOperacionalRoute,
  PrintEtiquetaIdRoute
};
const routeTree = Route$z._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  useTheme as A,
  Button as B,
  Command as C,
  Dialog as D,
  Popover as P,
  Route$u as R,
  CommandEmpty as a,
  CommandGroup as b,
  CommandInput as c,
  CommandItem as d,
  CommandList as e,
  DialogContent as f,
  DialogDescription as g,
  DialogFooter as h,
  DialogHeader as i,
  DialogTitle as j,
  PopoverContent as k,
  PopoverTrigger as l,
  Route$t as m,
  Route$e as n,
  Route$c as o,
  Route$b as p,
  Route$a as q,
  Route$9 as r,
  Route$8 as s,
  Route as t,
  buttonVariants as u,
  cn as v,
  formatCurrency as w,
  router as x,
  supabase as y,
  useAuth as z
};
