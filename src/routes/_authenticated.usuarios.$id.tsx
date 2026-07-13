import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, ShieldAlert, KeyRound, Clock, Activity, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionsMatrix, PermissionsMap, PERMISSION_AREAS, PERMISSION_ACTIONS } from "@/components/users/PermissionsMatrix";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/usuarios/$id")({
  component: EditarUsuario,
});

function EditarUsuario() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
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
  
  const [permissions, setPermissions] = useState<PermissionsMap>({});

  const roleName = currentUser?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";
  const isDiretoria = roleName === "diretoria";

  useEffect(() => {
    if (!isDiretoriaOrAdmin) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoadingData(true);
    
    // Load roles
    const { data: rolesData } = await supabase.from("roles").select("*");
    if (rolesData) {
      if (rolesData.length === 1 && rolesData[0].name === 'Administrador') {
        const missingRoles = ['Sócio', 'Diretoria', 'Vendedor', 'Produção', 'Financeiro', 'Expedição', 'Atendimento', 'Designer'];
        const { data: newRoles } = await supabase.from('roles').insert(
           missingRoles.map(name => ({ name }))
        ).select('*');
        if (newRoles) {
          setRoles([...rolesData, ...newRoles]);
        } else {
          setRoles(rolesData);
        }
      } else {
        setRoles(rolesData);
      }
    }

    // Load user data
    const { data: userData } = await supabase.from("users").select("*, roles(name)").eq("id", id).single();
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

    // Load permissions
    const { data: perms } = await supabase.from("user_permissions").select("*").eq("user_id", id);
    if (perms) {
      const map: PermissionsMap = {};
      perms.forEach(p => {
        map[p.module] = p.actions || {};
      });
      setPermissions(map);
    }

    // Load Audit Logs
    const { data: logsData } = await supabase
      .from("audit_logs")
      .select("*, users!audit_logs_user_id_fkey(name)")
      .eq("target_user_id", id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (logsData) setLogs(logsData);

    setLoadingData(false);
  };

  if (!isDiretoriaOrAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold tracking-tight">Acesso Negado</h2>
      </div>
    );
  }

  const handleSave = async () => {
    if (!formData.name || !formData.role_id) {
      toast.error("Preencha o nome e o cargo.");
      return;
    }

    // Prevent Admin from changing Diretoria status if he is not Diretoria
    if (!isDiretoria && userDataRoleName() === "Diretoria") {
      toast.error("Apenas a Diretoria pode modificar um membro da Diretoria.");
      return;
    }
    
    setLoading(true);
    try {
      // Update public.users
      const { error: userErr } = await supabase.from("users").update({
        name: formData.name,
        phone: formData.phone,
        role_id: formData.role_id,
        status: formData.status,
        updated_at: new Date().toISOString()
      }).eq("id", id);

      if (userErr) throw userErr;

      // Update permissions
      // To simplify, we delete existing and insert new ones
      await supabase.from("user_permissions").delete().eq("user_id", id);
      
      const permsToInsert = Object.keys(permissions).map(module => {
        const moduleActions = permissions[module];
        // Determine a fallback permission_level based on actions
        let level = 'read';
        if (moduleActions.excluir || moduleActions.admin) level = 'admin';
        else if (moduleActions.criar || moduleActions.editar) level = 'write';
        
        return {
          user_id: id,
          module,
          actions: moduleActions,
          granted_by: currentUser?.id,
          permission_level: level
        };
      });

      if (permsToInsert.length > 0) {
        const { error: permErr } = await supabase.from("user_permissions").insert(permsToInsert);
        if (permErr) throw permErr;
      }

      // Log
      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "ATUALIZAR_USUARIO",
        after_data: { formData, permissions }
      });

      toast.success("Usuário atualizado com sucesso!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const userDataRoleName = () => {
    return roles.find(r => r.id === formData.role_id)?.name;
  };

  const resetPassword = async () => {
    const confirm = window.confirm("Gerar uma senha temporária e enviar link de redefinição para o e-mail do usuário?");
    if (!confirm) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: window.location.origin + '/redefinir-senha',
      });
      if (error) throw error;

      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "RESET_SENHA"
      });

      toast.success("Link de redefinição enviado!");
    } catch(e: any) {
      toast.error("Erro ao resetar: " + e.message);
    }
  };

  const desativarUsuario = async () => {
    const confirm = window.confirm("Tem certeza que deseja desativar este usuário? O histórico será mantido, mas ele não poderá mais acessar o sistema. O status mudará para 'Desligado'.");
    if (!confirm) return;
    
    try {
      const { error } = await supabase.from("users").update({ status: "Desligado" }).eq("id", id);
      if (error) throw error;
      
      setFormData({ ...formData, status: "Desligado" });
      
      await supabase.from("audit_logs").insert({
        user_id: currentUser?.id,
        target_user_id: id,
        module: "Usuários",
        action: "DESATIVAR_USUARIO"
      });
      
      toast.success("Usuário desativado com sucesso!");
    } catch(e: any) {
      toast.error("Erro ao desativar: " + e.message);
    }
  };

  if (loadingData) return <div className="p-8 text-center text-muted-foreground">Carregando dados do usuário...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/usuarios" })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{formData.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{formData.email}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="geral" className="px-6">Dados Gerais</TabsTrigger>
          <TabsTrigger value="permissoes" className="px-6">Permissões</TabsTrigger>
          <TabsTrigger value="seguranca" className="px-6">Segurança</TabsTrigger>
          <TabsTrigger value="historico" className="px-6">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="bg-card border rounded-xl shadow-sm p-6 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>E-mail (Login)</Label>
              <Input value={formData.email} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cargo Base</Label>
              <Select value={formData.role_id || undefined} onValueChange={(v) => {
                setFormData({...formData, role_id: v});
                const selectedRole = roles.find(r => r.id === v);
                if (selectedRole && (selectedRole.name.toLowerCase() === 'administrador' || selectedRole.name.toLowerCase() === 'sócio')) {
                  const allPerms: PermissionsMap = {};
                  PERMISSION_AREAS.forEach(area => {
                    allPerms[area] = {};
                    PERMISSION_ACTIONS.forEach(a => {
                      allPerms[area][a.key] = true;
                    });
                  });
                  setPermissions(allPerms);
                  toast.info(`Permissões totais habilitadas automaticamente para ${selectedRole.name}`);
                }
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo..." />
              </SelectTrigger>
              <SelectContent>
                {roles && roles.length > 0 ? roles.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                )) : (
                  <SelectItem value="loading" disabled>Carregando cargos...</SelectItem>
                )}
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label>Status de Acesso</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                  <SelectItem value="Desligado">Desligado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Apenas usuários "Ativos" conseguem acessar o sistema.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissoes" className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-xl border border-dashed text-sm text-muted-foreground mb-4">
            Abaixo você define as permissões individuais deste usuário. Alterar o cargo não afeta as permissões já concedidas.
          </div>
          <PermissionsMatrix permissions={permissions} onChange={setPermissions} />
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 text-lg font-medium border-b pb-3">
                <KeyRound className="w-5 h-5 text-primary" /> Credenciais
              </div>
              <p className="text-sm text-muted-foreground">O reset de senha enviará um link para o e-mail do usuário onde ele poderá criar uma nova senha.</p>
              <Button variant="outline" onClick={resetPassword}>Enviar Link de Redefinição</Button>
            </div>

            <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 text-lg font-medium border-b pb-3">
                <MonitorSmartphone className="w-5 h-5 text-primary" /> Sessão Ativa
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Último IP</span>
                  <span className="font-medium">{formData.last_ip}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Dispositivo</span>
                  <span className="font-medium">{formData.last_device}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Atualizado em</span>
                  <span className="font-medium">{new Date(formData.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-destructive/20 rounded-xl shadow-sm p-6 space-y-4 md:col-span-2">
              <div className="flex items-center gap-3 text-lg font-medium border-b border-destructive/20 pb-3 text-destructive">
                <ShieldAlert className="w-5 h-5" /> Zona de Risco
              </div>
              <p className="text-sm text-muted-foreground">Desativar o usuário impedirá o seu acesso imediato ao sistema, mantendo o histórico de auditoria e operacionais intactos para fins de conformidade.</p>
              <Button variant="destructive" onClick={desativarUsuario}>Desativar (Excluir) Usuário</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Data/Hora</th>
                  <th className="px-4 py-3 font-medium">Autor</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Nenhum log registrado para este usuário.</td></tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{log.users?.name || 'Sistema'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-slate-50">{log.action}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
