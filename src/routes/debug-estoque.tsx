import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/debug-estoque")({
  component: DebugEstoque,
});

function DebugEstoque() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [models, setModels] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  const [selModel, setSelModel] = useState<string>("");
  const [selFabric, setSelFabric] = useState<string>("");
  const [selColor, setSelColor] = useState<string>("");
  
  const load = async () => {
    try {
      const { data: mps } = await supabase.from('products').select('id, name, sku, format, model_id, fabric_id, color_id, model:product_models(name), fabric:fabrics(name), color:canonical_colors(name)').eq('format', 'MP');
      const { data: vars } = await supabase.from('product_variants').select('id, product_id, sku_internal, size, active, batches:inventory_batches(id, quantity_available, active)').in('product_id', mps?.map(m => m.id) || []);
      setData({ mps, vars });

      const { data: m } = await supabase.from('product_models').select('*');
      const { data: f } = await supabase.from('fabrics').select('*');
      const { data: c } = await supabase.from('canonical_colors').select('*');
      
      if (m) setModels(m);
      if (f) setFabrics(f);
      if (c) setColors(c);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
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

      // 2. Achar a MP que está errada
      const { data: wrongMps } = await supabase.from('products').select('*').eq('format', 'MP');
      let wrongMp = wrongMps?.find(p => p.sku?.includes('MP-CAM') || p.name?.includes('CAM') || p.sku?.includes('MP-CMS'));
      
      if (!wrongMp) {
         if (wrongMps && wrongMps.length > 0) {
            wrongMp = wrongMps[0]; // Pega a primeira MP que achar se não bater o nome
         } else {
            throw new Error("MP não encontrada! Crie uma MP primeiro no sistema.");
         }
      }

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
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
           <CardTitle>Escolha Exatamente o que o Pedido Pede</CardTitle>
           <p className="text-sm">O Pedido <strong>AUC001-CMS-MML-BCO-P-ER</strong> precisa de: Modelo=CMS, Malha=MML, Cor=BCO. Selecione-os abaixo e clique em Consertar.</p>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                 <Label>Modelo (CMS)</Label>
                 <Select value={selModel} onValueChange={setSelModel}>
                   <SelectTrigger className="bg-white"><SelectValue placeholder="Escolha..."/></SelectTrigger>
                   <SelectContent>{models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label>Malha (MML)</Label>
                 <Select value={selFabric} onValueChange={setSelFabric}>
                   <SelectTrigger className="bg-white"><SelectValue placeholder="Escolha..."/></SelectTrigger>
                   <SelectContent>{fabrics.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label>Cor (BCO)</Label>
                 <Select value={selColor} onValueChange={setSelColor}>
                   <SelectTrigger className="bg-white"><SelectValue placeholder="Escolha..."/></SelectTrigger>
                   <SelectContent>{colors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                 </Select>
              </div>
           </div>

           <Button onClick={runFix} disabled={loading} className="w-full bg-red-600 hover:bg-red-700">🔨 CLIQUE AQUI PARA CONSERTAR O ESTOQUE MAGICALMENTE</Button>
        </CardContent>
      </Card>

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
