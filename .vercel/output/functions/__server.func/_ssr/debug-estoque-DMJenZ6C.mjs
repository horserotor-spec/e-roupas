import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, y as supabase } from "./router-BxmJvJdu.mjs";
import { C as Card, d as CardHeader, e as CardTitle, a as CardContent } from "./card-J2pjOAqh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-WVGuRtcH.mjs";
import { L as Label } from "./label-Dffz--9m.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-label.mjs";
function DebugEstoque() {
  const [data, setData] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const [models, setModels] = reactExports.useState([]);
  const [fabrics, setFabrics] = reactExports.useState([]);
  const [colors, setColors] = reactExports.useState([]);
  const [selModel, setSelModel] = reactExports.useState("");
  const [selFabric, setSelFabric] = reactExports.useState("");
  const [selColor, setSelColor] = reactExports.useState("");
  const load = async () => {
    try {
      const {
        data: mps
      } = await supabase.from("products").select("id, name, sku, format, model_id, fabric_id, color_id, model:product_models(name), fabric:fabrics(name), color:canonical_colors(name)").eq("format", "MP");
      const {
        data: vars
      } = await supabase.from("product_variants").select("id, product_id, sku_internal, size, active, batches:inventory_batches(id, quantity_available, active)").in("product_id", mps?.map((m2) => m2.id) || []);
      setData({
        mps,
        vars
      });
      const {
        data: m
      } = await supabase.from("product_models").select("*");
      const {
        data: f
      } = await supabase.from("fabrics").select("*");
      const {
        data: c
      } = await supabase.from("canonical_colors").select("*");
      if (m) setModels(m);
      if (f) setFabrics(f);
      if (c) setColors(c);
    } catch (e) {
      console.error(e);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const runFix = async () => {
    if (!selModel || !selFabric || !selColor) {
      toast.error("Por favor, selecione Modelo, Malha e Cor primeiro!");
      return;
    }
    setLoading(true);
    try {
      const modelId = selModel;
      const fabricId = selFabric;
      const colorId = selColor;
      const {
        data: wrongMps
      } = await supabase.from("products").select("*").eq("format", "MP");
      let wrongMp = wrongMps?.find((p) => p.sku?.includes("MP-CAM") || p.name?.includes("CAM") || p.sku?.includes("MP-CMS"));
      if (!wrongMp) {
        if (wrongMps && wrongMps.length > 0) {
          wrongMp = wrongMps[0];
        } else {
          throw new Error("MP não encontrada! Crie uma MP primeiro no sistema.");
        }
      }
      await supabase.from("products").update({
        model_id: modelId,
        fabric_id: fabricId,
        color_id: colorId,
        sku: "MP-CMS-MML-BCO",
        name: "MATERIA PRIMA CAMISETA REGULAR BRANCA"
      }).eq("id", wrongMp.id);
      const SIZES = ["P", "M", "G", "GG"];
      for (const size of SIZES) {
        const {
          data: existing
        } = await supabase.from("product_variants").select("id").eq("product_id", wrongMp.id).eq("size", size).maybeSingle();
        let varId = existing?.id;
        if (!varId) {
          const {
            data: n
          } = await supabase.from("product_variants").insert([{
            product_id: wrongMp.id,
            size,
            sku_internal: `MP-CMS-MML-BCO-${size}`,
            gender: "Unissex",
            active: true,
            model_id: modelId,
            fabric_id: fabricId,
            color_id: colorId
          }]).select("id").single();
          varId = n?.id;
        } else {
          await supabase.from("product_variants").update({
            sku_internal: `MP-CMS-MML-BCO-${size}`,
            model_id: modelId,
            fabric_id: fabricId,
            color_id: colorId
          }).eq("id", varId);
        }
        if (varId) {
          const {
            data: b
          } = await supabase.from("inventory_batches").select("id").eq("product_variant_id", varId).maybeSingle();
          if (!b) {
            await supabase.from("inventory_batches").insert([{
              product_variant_id: varId,
              quantity_available: 20,
              quantity_total: 20,
              active: true,
              batch_code: "LOTE-FIX-MP"
            }]);
          } else {
            await supabase.from("inventory_batches").update({
              quantity_available: 20
            }).eq("id", b.id);
          }
        }
      }
      toast.success("TUDO CORRIGIDO! MP, VARIANTES E LOTES OK!");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Debug Estoque" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-yellow-50 border-yellow-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Escolha Exatamente o que o Pedido Pede" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
          "O Pedido ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "AUC001-CMS-MML-BCO-P-ER" }),
          " precisa de: Modelo=CMS, Malha=MML, Cor=BCO. Selecione-os abaixo e clique em Consertar."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Modelo (CMS)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selModel, onValueChange: setSelModel, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Escolha..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.name }, m.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Malha (MML)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selFabric, onValueChange: setSelFabric, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Escolha..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fabrics.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.id, children: f.name }, f.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cor (BCO)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selColor, onValueChange: setSelColor, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Escolha..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: runFix, disabled: loading, className: "w-full bg-red-600 hover:bg-red-700", children: "🔨 CLIQUE AQUI PARA CONSERTAR O ESTOQUE MAGICALMENTE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "MPs encontradas no banco" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs overflow-auto max-h-[400px] bg-slate-100 p-4 rounded", children: JSON.stringify(data.mps, null, 2) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Variantes e Lotes dessas MPs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs overflow-auto max-h-[400px] bg-slate-100 p-4 rounded", children: JSON.stringify(data.vars, null, 2) }) })
    ] })
  ] });
}
export {
  DebugEstoque as component
};
