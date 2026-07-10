import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate } from "./_libs/tanstack__react-router.mjs";
import { z as useAuth, y as supabase, B as Button } from "./_ssr/router-C3pqRbRf.mjs";
import { I as Input } from "./_ssr/input-D7a6tjwM.mjs";
import { L as Label } from "./_ssr/label-DkxTpSdj.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-B4kfgWOA.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { ah as ShieldAlert, c as ArrowLeft, ac as Save } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
function NovoUsuario() {
  const navigate = useNavigate();
  const {
    user: currentUser
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [roles, setRoles] = reactExports.useState([]);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    status: "Ativo"
  });
  reactExports.useEffect(() => {
    supabase.from("roles").select("*").then(async ({
      data
    }) => {
      if (data) {
        if (data.length === 1 && data[0].name === "Administrador") {
          const missingRoles = ["Sócio", "Diretoria", "Vendedor", "Produção", "Financeiro", "Expedição", "Atendimento", "Designer"];
          const {
            data: newRoles
          } = await supabase.from("roles").insert(missingRoles.map((name) => ({
            name
          }))).select("*");
          if (newRoles) {
            setRoles([...data, ...newRoles]);
            return;
          }
        }
        setRoles(data);
      }
    });
  }, []);
  const roleName = currentUser?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";
  if (!isDiretoriaOrAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-16 h-16 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Acesso Negado" })
    ] });
  }
  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    try {
      const authClient = supabase;
      const {
        data: authData,
        error: authErr
      } = await authClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      });
      if (authErr) throw authErr;
      const newUserId = authData?.user?.id;
      if (!newUserId) throw new Error("Usuário não criado");
      const {
        error: updateErr
      } = await supabase.from("users").update({
        role_id: formData.role_id,
        phone: formData.phone,
        status: formData.status,
        force_password_change: true
      }).eq("id", newUserId);
      if (updateErr) throw updateErr;
      await supabase.from("audit_logs").insert({
        user_id: currentUser.id,
        target_user_id: newUserId,
        module: "Usuários",
        action: "CRIAR_USUARIO",
        after_data: formData
      });
      toast.success("Usuário criado com sucesso!");
      navigate({
        to: "/usuarios"
      });
    } catch (e) {
      toast.error(e.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => window.history.back(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Novo Usuário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Adicione um novo colaborador ao sistema." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: loading, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
        loading ? "Salvando..." : "Salvar Usuário"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl shadow-sm p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome Completo *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: João da Silva", value: formData.name, onChange: (e) => setFormData({
            ...formData,
            name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "joao@empresa.com", value: formData.email, onChange: (e) => setFormData({
            ...formData,
            email: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "(00) 00000-0000", value: formData.phone, onChange: (e) => setFormData({
            ...formData,
            phone: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Senha Temporária *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", placeholder: "Senha inicial", value: formData.password, onChange: (e) => setFormData({
            ...formData,
            password: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "O usuário será forçado a alterar esta senha no 1º login." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6 border-t pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Perfil Base (Cargo) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.role_id || void 0, onValueChange: (v) => setFormData({
            ...formData,
            role_id: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um cargo..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: roles && roles.length > 0 ? roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "loading", disabled: true, children: "Carregando cargos..." }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Isso preencherá as permissões iniciais do usuário." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status Inicial" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (v) => setFormData({
            ...formData,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Ativo", children: "Ativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Inativo", children: "Inativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Bloqueado", children: "Bloqueado" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  NovoUsuario as component
};
