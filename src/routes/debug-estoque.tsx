import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/debug-estoque")({
  component: DebugEstoque,
});

function DebugEstoque() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    try {
      const { data: mps } = await supabase.from('products').select('id, name, sku, format, model_id, fabric_id, color_id, model:product_models(name), fabric:fabrics(name), color:canonical_colors(name)').eq('format', 'MP');
      const { data: vars } = await supabase.from('product_variants').select('id, product_id, sku_internal, size, active, batches:inventory_batches(id, quantity_available, active)').in('product_id', mps?.map(m => m.id) || []);
      setData({ mps, vars });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runFix = async () => {
    setLoading(true);
    try {
      // 1. Procurar propriedades CMS, MML, BCO
      const { data: models } = await supabase.from('models').select('id, name').ilike('name', '%CMS%');
      const { data: fabrics } = await supabase.from('fabrics').select('id, name').ilike('name', '%MML%');
      const { data: colors } = await supabase.from('colors').select('id, name').ilike('name', '%BCO%');
      
      let modelId = models?.[0]?.id;
      let fabricId = fabrics?.[0]?.id;
      let colorId = colors?.[0]?.id;
      
      // If not found in 'models', try 'product_models' which is the correct table name!
      if (!modelId) {
         const { data: pm } = await supabase.from('product_models').select('id, name').ilike('code', '%CMS%').maybeSingle();
         if (!pm) {
            const { data: pm2 } = await supabase.from('product_models').select('id, name').ilike('name', '%REGULAR%').maybeSingle();
            modelId = pm2?.id;
         } else { modelId = pm?.id; }
      }
      if (!fabricId) {
         const { data: pf } = await supabase.from('fabrics').select('id, name').ilike('code', '%MML%').maybeSingle();
         if (!pf) {
            const { data: pf2 } = await supabase.from('fabrics').select('id, name').ilike('name', '%MEIA%').maybeSingle();
            fabricId = pf2?.id;
         } else { fabricId = pf?.id; }
      }
      if (!colorId) {
         const { data: pc } = await supabase.from('canonical_colors').select('id, name').ilike('code', '%BCO%').maybeSingle();
         if (!pc) {
            const { data: pc2 } = await supabase.from('canonical_colors').select('id, name').ilike('name', '%BRANCO%').maybeSingle();
            colorId = pc2?.id;
         } else { colorId = pc?.id; }
      }

      if (!modelId || !fabricId || !colorId) throw new Error("Propriedades não encontradas no banco (CMS, MML, BCO)");

      // 2. Achar a MP que está errada
      const { data: wrongMps } = await supabase.from('products').select('*').eq('format', 'MP');
      const wrongMp = wrongMps?.find(p => p.sku?.includes('MP-CAM') || p.name?.includes('CAM') || p.sku?.includes('MP-CMS'));
      
      if (!wrongMp) throw new Error("MP não encontrada!");

      // 3. Atualizar a MP
      await supabase.from('products').update({
         model_id: modelId,
         fabric_id: fabricId,
         color_id: colorId,
         sku: 'MP-CMS-MML-BCO',
         name: 'MATERIA PRIMA CAMISETA REGULAR BRANCA'
      }).eq('id', wrongMp.id);

      // 4. Criar as variantes P e M e lotes
      const SIZES = ["P", "M", "G", "GG"];
      for (const size of SIZES) {
         const { data: existing } = await supabase.from('product_variants').select('id').eq('product_id', wrongMp.id).eq('size', size).maybeSingle();
         let varId = existing?.id;
         
         if (!varId) {
            const { data: n } = await supabase.from('product_variants').insert([{
              product_id: wrongMp.id, 
              size, 
              sku_internal: `MP-CMS-MML-BCO-${size}`, 
              gender: 'Unissex',
              active: true,
              model_id: modelId,
              fabric_id: fabricId,
              color_id: colorId
            }]).select('id').single();
            varId = n?.id;
         } else {
            await supabase.from('product_variants').update({
              sku_internal: `MP-CMS-MML-BCO-${size}`,
              model_id: modelId,
              fabric_id: fabricId,
              color_id: colorId
            }).eq('id', varId);
         }

         if (varId) {
            const { data: b } = await supabase.from('inventory_batches').select('id').eq('product_variant_id', varId).maybeSingle();
            if (!b) {
               await supabase.from('inventory_batches').insert([{
                 product_variant_id: varId, 
                 quantity_available: 20,
                 quantity_total: 20, 
                 active: true, 
                 batch_code: 'LOTE-FIX-MP'
               }]);
            } else {
               await supabase.from('inventory_batches').update({ quantity_available: 20 }).eq('id', b.id);
            }
         }
      }

      toast.success("TUDO CORRIGIDO! MP, VARIANTES E LOTES OK!");
      load();
    } catch(e:any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Estoque</h1>
        <Button onClick={runFix} disabled={loading} className="bg-red-600 hover:bg-red-700">🔨 CLIQUE AQUI PARA CONSERTAR O ESTOQUE MAGICALMENTE</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>MPs encontradas no banco</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-[400px] bg-slate-100 p-4 rounded">{JSON.stringify(data.mps, null, 2)}</pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Variantes e Lotes dessas MPs</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-[400px] bg-slate-100 p-4 rounded">{JSON.stringify(data.vars, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
