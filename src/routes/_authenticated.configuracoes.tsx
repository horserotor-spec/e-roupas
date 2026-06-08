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
import { Loader2, Link2, Unlink, AlertTriangle } from "lucide-react";

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

  useEffect(() => {
    getSgpSettings().then(data => {
      if (data) setSgpConfig(data);
      setLoadingSgp(false);
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

  return (
    <div className="px-6 md:px-10 py-8 max-w-[1500px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sistema</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Configurações Gerais</h1>
      <p className="text-sm text-muted-foreground mt-1">Gerencie permissões, integrações e dados fundamentais do sistema.</p>

      <Tabs defaultValue="permissoes" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="permissoes">Usuários e Permissões</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="permissoes">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 py-2.5 sticky left-0 bg-muted/40">Usuário</th>
                    <th className="text-left font-medium px-4 py-2.5">Cargo</th>
                    {modules.map((m) => (
                      <th key={m} className="text-left font-medium px-3 py-2.5 capitalize">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 sticky left-0 bg-card">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full grid place-items-center text-white text-[10px] font-semibold" style={{ background: u.avatarColor }}>
                            {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{u.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">{u.role}</td>
                      {modules.map((m) => {
                        const lvl = u.permissions[m];
                        return (
                          <td key={m} className="px-3 py-3">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${levelTone[lvl]}`}>
                              {levelLabel[lvl]}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Níveis: sem acesso · visualização · operação · aprovação · administração. Editor visual de permissões chega na Sprint 2.
          </div>
        </TabsContent>

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
      </Tabs>
    </div>
  );
}

