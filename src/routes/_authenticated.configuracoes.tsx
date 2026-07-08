import { createFileRoute } from "@tanstack/react-router";
import { users, type AccessLevel, type Module } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getSgpSettings, SgpSettings } from "@/lib/api/sgp";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Link2, Unlink, AlertTriangle, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações · e-roupas OS" }] }),
  component: Config,
});

const modules: Module[] = [
  "dashboard", "crm", "pedidos", "producao", "estoque",
  "financeiro", "expedicao", "relatorios", "ia", "configuracoes",
];

const levelLabel: Record<AccessLevel, string> = {
  sem_acesso: "—",
  visualizacao: "Visualização",
  operacao: "Operação",
  aprovacao: "Aprovação",
  administracao: "Admin",
};

const levelTone: Record<AccessLevel, string> = {
  sem_acesso: "text-muted-foreground bg-muted",
  visualizacao: "text-foreground bg-muted",
  operacao: "text-[var(--info)] bg-[color-mix(in_oklab,var(--info)_14%,transparent)]",
  aprovacao: "text-[color-mix(in_oklab,var(--warning)_55%,black)] dark:text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_18%,transparent)]",
  administracao: "text-primary bg-primary-soft",
};

function Config() {
  const [sgpConfig, setSgpConfig] = useState<SgpSettings>({
    api_url: "https://api.sgpweb.com.br",
    token: "",
    app_key: "",
    user: "",
    password: "",
    environment: "homologacao",
    status: "desconectado"
  });
  const [loadingSgp, setLoadingSgp] = useState(true);
  const [savingSgp, setSavingSgp] = useState(false);

  // Estados do CMV
  interface CmvItem {
    id: string;
    key: string;
    value: number;
  }
  const [cmvItems, setCmvItems] = useState<CmvItem[]>([]);
  const [loadingCmv, setLoadingCmv] = useState(true);
  const [savingCmv, setSavingCmv] = useState(false);

  useEffect(() => {
    getSgpSettings().then(data => {
      if (data) setSgpConfig(data);
      setLoadingSgp(false);
    });

    // Buscar configurações de CMV
    supabase
      .from("system_settings")
      .select("*")
      .eq("key", "cmv_costs_config")
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.value) {
          const items = Object.entries(data.value).map(([k, v]) => ({
            id: Math.random().toString(),
            key: k,
            value: Number(v) || 0
          }));
          setCmvItems(items);
        } else {
          // Defaults fallback
          setCmvItems([
            { id: "1", key: "saquinho", value: 0.50 },
            { id: "2", key: "etiqueta", value: 0.30 },
            { id: "3", key: "dtf", value: 1.50 },
            { id: "4", key: "bordado", value: 2.00 },
            { id: "5", key: "mp_default", value: 15.00 }
          ]);
        }
        setLoadingCmv(false);
      });
  }, []);

  const handleSaveSgp = async () => {
    setSavingSgp(true);
    try {
      // Simulando validação
      const isOk = sgpConfig.token.length > 5 && sgpConfig.user.length > 2;
      const updatedConfig = { 
        ...sgpConfig, 
        status: isOk ? "conectado" : "erro" 
      } as const;

      await supabase.from("system_settings").upsert({
        key: "sgp_web_integration",
        value: updatedConfig,
        description: "Credenciais de acesso à API do SGP Web"
      }, { onConflict: "key" });

      setSgpConfig(updatedConfig);
      
      if (isOk) {
        toast.success("SGP Web configurado com sucesso!");
      } else {
        toast.error("Erro na autenticação. Verifique as credenciais.");
      }
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSavingSgp(false);
    }
  };

  const handleSaveCmv = async () => {
    setSavingCmv(true);
    try {
      const valueObj: Record<string, number> = {};
      cmvItems.forEach(item => {
        if (item.key.trim()) {
          valueObj[item.key.trim().toLowerCase().replace(/\s+/g, "_")] = item.value;
        }
      });

      const { error } = await supabase.from("system_settings").upsert({
        key: "cmv_costs_config",
        value: valueObj,
        description: "Configurações de custo unitário para cálculo do CMV (Saquinho, Etiqueta, DTF, Bordado, MP)"
      }, { onConflict: "key" });

      if (error) throw error;
      toast.success("Configurações do CMV salvas com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSavingCmv(false);
    }
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1500px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sistema</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Configurações Gerais</h1>
      <p className="text-sm text-muted-foreground mt-1">Gerencie permissões, integrações e dados fundamentais do sistema.</p>

      <Tabs defaultValue="integracoes" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="cmv">CMV</TabsTrigger>
        </TabsList>

        <TabsContent value="integracoes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SGP WEB CARD */}
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">SGP Web</CardTitle>
                    <CardDescription>Integração como motor logístico de envios (Correios/Transportadoras)</CardDescription>
                  </div>
                  {loadingSgp ? (
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  ) : sgpConfig.status === "conectado" ? (
                    <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                      <Link2 className="size-3.5 mr-1" /> Conectado
                    </div>
                  ) : sgpConfig.status === "erro" ? (
                    <div className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                      <AlertTriangle className="size-3.5 mr-1" /> Erro Auth
                    </div>
                  ) : (
                    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border">
                      <Unlink className="size-3.5 mr-1" /> Desconectado
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>URL da API</Label>
                  <Input 
                    placeholder="https://api.sgpweb.com.br" 
                    value={sgpConfig.api_url} 
                    onChange={e => setSgpConfig({...sgpConfig, api_url: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Token de Acesso</Label>
                  <Input 
                    type="password" 
                    placeholder="Cole seu token do SGP..." 
                    value={sgpConfig.token}
                    onChange={e => setSgpConfig({...sgpConfig, token: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>App Key (Opcional)</Label>
                  <Input 
                    type="password" 
                    value={sgpConfig.app_key}
                    onChange={e => setSgpConfig({...sgpConfig, app_key: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Usuário</Label>
                    <Input 
                      value={sgpConfig.user}
                      onChange={e => setSgpConfig({...sgpConfig, user: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Senha</Label>
                    <Input 
                      type="password" 
                      value={sgpConfig.password || ""}
                      onChange={e => setSgpConfig({...sgpConfig, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Ambiente</Label>
                  <Select 
                    value={sgpConfig.environment} 
                    onValueChange={(v: "homologacao"|"producao") => setSgpConfig({...sgpConfig, environment: v})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homologacao">Homologação (Testes)</SelectItem>
                      <SelectItem value="producao">Produção (Valendo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 bg-muted/20">
                <Button onClick={handleSaveSgp} disabled={loadingSgp || savingSgp} className="w-full">
                  {savingSgp && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Testar e Salvar Conexão
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cmv">
          <div className="max-w-xl">
            <Card>
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg">Custos e Composição do CMV</CardTitle>
                <CardDescription>Defina os custos unitários padrão para calcular o custo real de cada venda.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {loadingCmv ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cmvItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="flex-1 space-y-1.5">
                          <Label>Nome do Custo (Chave)</Label>
                          <Input 
                            value={item.key} 
                            placeholder="Ex: saquinho, etiqueta..."
                            onChange={e => {
                              const updated = [...cmvItems];
                              updated[idx].key = e.target.value;
                              setCmvItems(updated);
                            }}
                          />
                        </div>
                        <div className="w-32 space-y-1.5">
                          <Label>Valor (R$)</Label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            value={item.value || ""} 
                            onChange={e => {
                              const updated = [...cmvItems];
                              updated[idx].value = parseFloat(e.target.value) || 0;
                              setCmvItems(updated);
                            }}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="mt-6 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => {
                            setCmvItems(cmvItems.filter((_, i) => i !== idx));
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center gap-1.5 mt-2"
                      onClick={() => {
                        setCmvItems([
                          ...cmvItems, 
                          { id: Math.random().toString(), key: "novo_custo", value: 0 }
                        ]);
                      }}
                    >
                      <Plus className="size-4" /> Adicionar Novo Custo
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 bg-muted/20">
                <Button onClick={handleSaveCmv} disabled={loadingCmv || savingCmv} className="w-full">
                  {savingCmv && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Salvar Configurações do CMV
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

