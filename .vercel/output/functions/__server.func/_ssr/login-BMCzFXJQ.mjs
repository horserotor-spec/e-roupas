import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { z as useAuth } from "./router-BxmJvJdu.mjs";
import "../_libs/sonner.mjs";
import { H as EyeOff, G as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-popover.mjs";
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
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
function LoginPage() {
  const {
    login,
    resetPassword
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [msg, setMsg] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("login");
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "login") {
        await login(email, password);
        navigate({
          to: "/dashboard"
        });
      } else {
        await resetPassword(email);
        setMsg("E-mail de redefinição enviado se a conta existir.");
        setMode("login");
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Falha na solicitação");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-center px-8 sm:px-16 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.png", alt: "e-roupas logo", style: {
          width: "169px",
          height: "35px"
        }, className: "object-contain dark:invert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Operating system têxtil" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: mode === "login" ? "Bem-vindo de volta." : "Redefinir Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: mode === "login" ? "Entre para acessar a operação." : "Enviaremos um link para redefinir sua senha." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-10 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:focus-ring" })
        ] }),
        mode === "login" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "Senha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("reset"), className: "text-[11px] text-primary hover:underline", children: "Esqueceu a senha?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "h-10 w-full rounded-lg border border-border bg-surface pl-3 pr-10 text-sm outline-none focus:border-primary focus:focus-ring" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", tabIndex: -1, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) })
          ] })
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err }),
        msg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary", children: msg }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity", children: loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Enviar link" }),
        mode === "reset" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("login"), className: "text-muted-foreground hover:text-foreground", children: "Voltar para o login" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center pt-2", children: "Acesso restrito. Utilize suas credenciais corporativas para acessar o sistema." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:block relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "radial-gradient(ellipse at 30% 20%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(ellipse at 80% 80%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 50%), var(--surface-2)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full flex flex-col justify-end p-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-2xl font-medium tracking-tight leading-snug max-w-md", children: [
          "“Menos cliques, mais decisão. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "e-roupas OS" }),
          " conecta atendimento, arte, produção e expedição em uma única timeline.”"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "Sprint 1 · v1.0 · multi-marca · auditável" })
      ] })
    ] })
  ] });
}
export {
  LoginPage as component
};
