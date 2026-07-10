import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./_ssr/tabs-C5UynAF5.mjs";
import { C as Card, d as CardHeader, e as CardTitle, b as CardDescription, a as CardContent, c as CardFooter } from "./_ssr/card-J2pjOAqh.mjs";
import { I as Input } from "./_ssr/input-D9Pn2b9A.mjs";
import { L as Label } from "./_ssr/label-Dffz--9m.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-WVGuRtcH.mjs";
import { y as supabase, B as Button } from "./_ssr/router-BxmJvJdu.mjs";
import { C as CurrencyInput } from "./_ssr/currency-input-a4CB9tfC.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { V as LoaderCircle, U as Link2, aq as TriangleAlert, as as Unlink, an as Trash2, a9 as Plus } from "./_libs/lucide-react.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/cmdk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
async function getSgpSettings() {
  try {
    const { data, error } = await supabase.from("system_settings").select("value").eq("key", "sgp_web_integration").single();
    if (error) {
      console.warn("Erro ao buscar configurações do SGP:", error.message);
      return null;
    }
    return data?.value;
  } catch (err) {
    console.error("Exceção ao buscar configurações do SGP:", err);
    return null;
  }
}
function Config() {
  const [sgpConfig, setSgpConfig] = reactExports.useState({
    api_url: "https://api.sgpweb.com.br",
    token: "",
    app_key: "",
    user: "",
    password: "",
    environment: "homologacao",
    status: "desconectado"
  });
  const [loadingSgp, setLoadingSgp] = reactExports.useState(true);
  const [savingSgp, setSavingSgp] = reactExports.useState(false);
  const [cmvItems, setCmvItems] = reactExports.useState([]);
  const [loadingCmv, setLoadingCmv] = reactExports.useState(true);
  const [savingCmv, setSavingCmv] = reactExports.useState(false);
  reactExports.useEffect(() => {
    getSgpSettings().then((data) => {
      if (data) setSgpConfig(data);
      setLoadingSgp(false);
    });
    supabase.from("system_settings").select("*").eq("key", "cmv_costs_config").maybeSingle().then(({
      data
    }) => {
      if (data && data.value) {
        const items = Object.entries(data.value).map(([k, v]) => ({
          id: Math.random().toString(),
          key: k,
          value: Number(v) || 0
        }));
        setCmvItems(items);
      } else {
        setCmvItems([{
          id: "1",
          key: "saquinho",
          value: 0.5
        }, {
          id: "2",
          key: "etiqueta",
          value: 0.3
        }, {
          id: "3",
          key: "dtf",
          value: 1.5
        }, {
          id: "4",
          key: "bordado",
          value: 2
        }, {
          id: "5",
          key: "mp_default",
          value: 15
        }]);
      }
      setLoadingCmv(false);
    });
  }, []);
  const handleSaveSgp = async () => {
    setSavingSgp(true);
    try {
      const isOk = sgpConfig.token.length > 5 && sgpConfig.user.length > 2;
      const updatedConfig = {
        ...sgpConfig,
        status: isOk ? "conectado" : "erro"
      };
      await supabase.from("system_settings").upsert({
        key: "sgp_web_integration",
        value: updatedConfig,
        description: "Credenciais de acesso à API do SGP Web"
      }, {
        onConflict: "key"
      });
      setSgpConfig(updatedConfig);
      if (isOk) {
        toast.success("SGP Web configurado com sucesso!");
      } else {
        toast.error("Erro na autenticação. Verifique as credenciais.");
      }
    } catch (err) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSavingSgp(false);
    }
  };
  const handleSaveCmv = async () => {
    setSavingCmv(true);
    try {
      const valueObj = {};
      cmvItems.forEach((item) => {
        if (item.key.trim()) {
          valueObj[item.key.trim().toLowerCase().replace(/\s+/g, "_")] = item.value;
        }
      });
      const {
        data: existingSetting
      } = await supabase.from("system_settings").select("id").eq("key", "cmv_costs_config").maybeSingle();
      let result;
      if (existingSetting) {
        result = await supabase.from("system_settings").update({
          value: valueObj,
          description: "Configurações de custo unitário para cálculo do CMV (Saquinho, Etiqueta, DTF, Bordado, MP)"
        }).eq("id", existingSetting.id);
      } else {
        result = await supabase.from("system_settings").insert({
          key: "cmv_costs_config",
          value: valueObj,
          description: "Configurações de custo unitário para cálculo do CMV (Saquinho, Etiqueta, DTF, Bordado, MP)"
        });
      }
      if (result.error) throw result.error;
      toast.success("Configurações do CMV salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSavingCmv(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 md:px-10 py-8 max-w-[1500px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Sistema" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-semibold tracking-tight", children: "Configurações Gerais" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Gerencie permissões, integrações e dados fundamentais do sistema." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "integracoes", className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "integracoes", children: "Integrações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cmv", children: "CMV" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "integracoes", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "SGP Web" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Integração como motor logístico de envios (Correios/Transportadoras)" })
          ] }),
          loadingSgp ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin text-muted-foreground" }) : sgpConfig.status === "conectado" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5 mr-1" }),
            " Conectado"
          ] }) : sgpConfig.status === "erro" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5 mr-1" }),
            " Erro Auth"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Unlink, { className: "size-3.5 mr-1" }),
            " Desconectado"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "URL da API" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "https://api.sgpweb.com.br", value: sgpConfig.api_url, onChange: (e) => setSgpConfig({
              ...sgpConfig,
              api_url: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Token de Acesso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Cole seu token do SGP...", value: sgpConfig.token, onChange: (e) => setSgpConfig({
              ...sgpConfig,
              token: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "App Key (Opcional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: sgpConfig.app_key, onChange: (e) => setSgpConfig({
              ...sgpConfig,
              app_key: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Usuário" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: sgpConfig.user, onChange: (e) => setSgpConfig({
                ...sgpConfig,
                user: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Senha" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: sgpConfig.password || "", onChange: (e) => setSgpConfig({
                ...sgpConfig,
                password: e.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ambiente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sgpConfig.environment, onValueChange: (v) => setSgpConfig({
              ...sgpConfig,
              environment: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "homologacao", children: "Homologação (Testes)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "producao", children: "Produção (Valendo)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "border-t pt-4 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSaveSgp, disabled: loadingSgp || savingSgp, className: "w-full", children: [
          savingSgp && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 size-4 animate-spin" }),
          "Testar e Salvar Conexão"
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cmv", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Custos e Composição do CMV" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Defina os custos unitários padrão para calcular o custo real de cada venda." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 space-y-4", children: loadingCmv ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          cmvItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome do Custo (Chave)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: item.key, placeholder: "Ex: saquinho, etiqueta...", onChange: (e) => {
                const updated = [...cmvItems];
                updated[idx].key = e.target.value;
                setCmvItems(updated);
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-32 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor (R$)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: item.value, onChange: (val) => {
                const updated = [...cmvItems];
                updated[idx].value = val;
                setCmvItems(updated);
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "mt-6 text-muted-foreground hover:text-destructive shrink-0", onClick: () => {
              setCmvItems(cmvItems.filter((_, i) => i !== idx));
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
          ] }, item.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full flex items-center gap-1.5 mt-2", onClick: () => {
            setCmvItems([...cmvItems, {
              id: Math.random().toString(),
              key: "novo_custo",
              value: 0
            }]);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            " Adicionar Novo Custo"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "border-t pt-4 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSaveCmv, disabled: loadingCmv || savingCmv, className: "w-full", children: [
          savingCmv && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 size-4 animate-spin" }),
          "Salvar Configurações do CMV"
        ] }) })
      ] }) }) })
    ] })
  ] });
}
export {
  Config as component
};
