import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate } from "./_libs/tanstack__react-router.mjs";
import { o as Route$c, z as useAuth, y as supabase, B as Button } from "./_ssr/router-BxmJvJdu.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-C5UynAF5.mjs";
import { S as Switch } from "./_ssr/switch-B1byUmMA.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { B as Badge } from "./_ssr/badge-mONeoC2j.mjs";
import { ah as ShieldAlert, c as ArrowLeft, ac as Save, Q as KeyRound, a1 as MonitorSmartphone } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-switch.mjs";
const PERMISSION_AREAS = [
  "Dashboard",
  "Clientes",
  "Pedidos",
  "Produção",
  "Estoque",
  "Compras",
  "Expedição",
  "Financeiro",
  "Relatórios",
  "Usuários",
  "Configurações",
  "Atendimento",
  "Designer"
];
const PERMISSION_ACTIONS = [
  { key: "visualizar", label: "Visualizar" },
  { key: "criar", label: "Criar" },
  { key: "editar", label: "Editar" },
  { key: "excluir", label: "Excluir" },
  { key: "exportar", label: "Exportar" },
  { key: "aprovar", label: "Aprovar" },
  { key: "alterar_status", label: "Status" },
  { key: "mover_kanban", label: "Kanban" }
];
function PermissionsMatrix({ permissions, onChange, disabled = false }) {
  const togglePermission = (area, action, checked) => {
    if (disabled) return;
    const newPerms = { ...permissions };
    if (!newPerms[area]) newPerms[area] = {};
    newPerms[area][action] = checked;
    onChange(newPerms);
  };
  const toggleAllArea = (area, checked) => {
    if (disabled) return;
    const newPerms = { ...permissions };
    newPerms[area] = {};
    PERMISSION_ACTIONS.forEach((a) => {
      newPerms[area][a.key] = checked;
    });
    onChange(newPerms);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Área do Sistema" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-medium w-[80px]", children: "Todos" }),
      PERMISSION_ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-medium", children: action.label }, action.key))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: PERMISSION_AREAS.map((area) => {
      const areaPerms = permissions[area] || {};
      const allChecked = PERMISSION_ACTIONS.every((a) => areaPerms[a.key]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: area }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: allChecked,
            onCheckedChange: (c) => toggleAllArea(area, c),
            disabled
          }
        ) }),
        PERMISSION_ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: !!areaPerms[action.key],
            onCheckedChange: (c) => togglePermission(area, action.key, c),
            disabled
          }
        ) }, action.key))
      ] }, area);
    }) })
  ] }) }) });
}
function EditarUsuario() {
  const {
    id
  } = Route$c.useParams();
  const navigate = useNavigate();
  const {
    user: currentUser
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const [roles, setRoles] = reactExports.useState([]);
  const [logs, setLogs] = reactExports.useState([]);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    status: "Ativo",
    last_ip: "",
    last_device: "",
    created_at: "",
    updated_at: ""
  });
  const [permissions, setPermissions] = reactExports.useState({});
  const roleName = currentUser?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";
  const isDiretoria = roleName === "diretoria";
  reactExports.useEffect(() => {
    if (!isDiretoriaOrAdmin) return;
    loadData();
  }, [id]);
  const loadData = async () => {
    setLoadingData(true);
    const {
      data: rolesData
    } = await supabase.from("roles").select("*");
    if (rolesData) {
      if (rolesData.length === 1 && rolesData[0].name === "Administrador") {
        const missingRoles = ["Sócio", "Diretoria", "Vendedor", "Produção", "Financeiro", "Expedição", "Atendimento", "Designer"];
        const {
          data: newRoles
        } = await supabase.from("roles").insert(missingRoles.map((name) => ({
          name
        }))).select("*");
        if (newRoles) {
          setRoles([...rolesData, ...newRoles]);
        } else {
          setRoles(rolesData);
        }
      } else {
        setRoles(rolesData);
      }
    }
    const {
      data: userData
    } = await supabase.from("users").select("*, roles(name)").eq("id", id).single();
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role_id: userData.role_id || "",
        status: userData.status || (userData.active ? "Ativo" : "Inativo"),
        last_ip: userData.last_ip || "Desconhecido",
        last_device: userData.last_device || "Desconhecido",
        created_at: userData.created_at,
        updated_at: userData.updated_at
      });
    }
    const {
      data: perms
    } = await supabase.from("user_permissions").select("*").eq("user_id", id);
    if (perms) {
      const map = {};
      perms.forEach((p) => {
        map[p.module] = p.actions || {};
      });
      setPermissions(map);
    }
    const {
      data: logsData
    } = await supabase.from("audit_logs").select("*, users!audit_logs_user_id_fkey(name)").eq("target_user_id", id).order("created_at", {
      ascending: false
    }).limit(50);
    if (logsData) setLogs(logsData);
    setLoadingData(false);
  };
  if (!isDiretoriaOrAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-16 h-16 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Acesso Negado" })
    ] });
  }
  const handleSave = async () => {
    if (!formData.name || !formData.role_id) {
      toast.error("Preencha o nome e o cargo.");
      return;
    }
    if (!isDiretoria && userDataRoleName() === "Diretoria") {
      toast.error("Apenas a Diretoria pode modificar um membro da Diretoria.");
      return;
    }
    setLoading(true);
    try {
      const {
        error: userErr
      } = await supabase.from("users").update({
        name: formData.name,
        phone: formData.phone,
        role_id: formData.role_id,
        status: formData.status,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (userErr) throw userErr;
      await supabase.from("user_permissions").delete().eq("user_id", id);
      const permsToInsert = Object.keys(permissions).map((module) => {
        const moduleActions = permissions[module];
        let level = "read";
        if (moduleActions.excluir || moduleActions.admin) level = "admin";
        else if (moduleActions.criar || moduleActions.editar) level = "write";
        return {
          user_id: id,
          module,
          actions: moduleActions,
          granted_by: currentUser?.id,
          permission_level: level
        };
      });
      if (permsToInsert.length > 0) {
        const {
          error: permErr
        } = await supabase.from("user_permissions").insert(permsToInsert);
        if (permErr) throw permErr;
      }
      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "ATUALIZAR_USUARIO",
        after_data: {
          formData,
          permissions
        }
      });
      toast.success("Usuário atualizado com sucesso!");
    } catch (e) {
      toast.error(e.message || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };
  const userDataRoleName = () => {
    return roles.find((r) => r.id === formData.role_id)?.name;
  };
  const resetPassword = async () => {
    const confirm = window.confirm("Gerar uma senha temporária e enviar link de redefinição para o e-mail do usuário?");
    if (!confirm) return;
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(formData.email);
      if (error) throw error;
      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "RESET_SENHA"
      });
      toast.success("Link de redefinição enviado!");
    } catch (e) {
      toast.error("Erro ao resetar: " + e.message);
    }
  };
  const desativarUsuario = async () => {
    const confirm = window.confirm("Tem certeza que deseja desativar este usuário? O histórico será mantido, mas ele não poderá mais acessar o sistema. O status mudará para 'Desligado'.");
    if (!confirm) return;
    try {
      const {
        error
      } = await supabase.from("users").update({
        status: "Desligado"
      }).eq("id", id);
      if (error) throw error;
      setFormData({
        ...formData,
        status: "Desligado"
      });
      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "DESATIVAR_USUARIO"
      });
      toast.success("Usuário desativado com sucesso!");
    } catch (e) {
      toast.error("Erro ao desativar: " + e.message);
    }
  };
  if (loadingData) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Carregando dados do usuário..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate({
          to: "/usuarios"
        }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: formData.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: formData.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: loading, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
        loading ? "Salvando..." : "Salvar Alterações"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "geral", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/50 p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "geral", className: "px-6", children: "Dados Gerais" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "permissoes", className: "px-6", children: "Permissões" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "seguranca", className: "px-6", children: "Segurança" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "historico", className: "px-6", children: "Histórico" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "geral", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl shadow-sm p-6 grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome Completo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.name, onChange: (e) => setFormData({
            ...formData,
            name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail (Login)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.email, disabled: true, className: "bg-muted/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone, onChange: (e) => setFormData({
            ...formData,
            phone: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cargo Base" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.role_id || void 0, onValueChange: (v) => {
            setFormData({
              ...formData,
              role_id: v
            });
            const selectedRole = roles.find((r) => r.id === v);
            if (selectedRole && (selectedRole.name.toLowerCase() === "administrador" || selectedRole.name.toLowerCase() === "sócio")) {
              const allPerms = {};
              PERMISSION_AREAS.forEach((area) => {
                allPerms[area] = {};
                PERMISSION_ACTIONS.forEach((a) => {
                  allPerms[area][a.key] = true;
                });
              });
              setPermissions(allPerms);
              toast.info(`Permissões totais habilitadas automaticamente para ${selectedRole.name}`);
            }
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um cargo..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: roles && roles.length > 0 ? roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "loading", disabled: true, children: "Carregando cargos..." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status de Acesso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (v) => setFormData({
            ...formData,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Ativo", children: "Ativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Inativo", children: "Inativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Bloqueado", children: "Bloqueado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Desligado", children: "Desligado" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Apenas usuários "Ativos" conseguem acessar o sistema.' })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "permissoes", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 p-4 rounded-xl border border-dashed text-sm text-muted-foreground mb-4", children: "Abaixo você define as permissões individuais deste usuário. Alterar o cargo não afeta as permissões já concedidas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionsMatrix, { permissions, onChange: setPermissions })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "seguranca", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl shadow-sm p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-lg font-medium border-b pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-5 h-5 text-primary" }),
            " Credenciais"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "O reset de senha enviará um link para o e-mail do usuário onde ele poderá criar uma nova senha." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetPassword, children: "Enviar Link de Redefinição" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl shadow-sm p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-lg font-medium border-b pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorSmartphone, { className: "w-5 h-5 text-primary" }),
            " Sessão Ativa"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Último IP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formData.last_ip })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Dispositivo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formData.last_device })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Atualizado em" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: new Date(formData.updated_at).toLocaleString() })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-destructive/20 rounded-xl shadow-sm p-6 space-y-4 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-lg font-medium border-b border-destructive/20 pb-3 text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-5 h-5" }),
            " Zona de Risco"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Desativar o usuário impedirá o seu acesso imediato ao sistema, mantendo o histórico de auditoria e operacionais intactos para fins de conformidade." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: desativarUsuario, children: "Desativar (Excluir) Usuário" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "historico", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border rounded-xl shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Data/Hora" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Autor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Ação" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "p-8 text-center text-muted-foreground", children: "Nenhum log registrado para este usuário." }) }) : logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: new Date(log.created_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: log.users?.name || "Sistema" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-slate-50", children: log.action }) })
        ] }, log.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  EditarUsuario as component
};
