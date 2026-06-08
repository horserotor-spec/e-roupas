import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/usuarios/novo")({
  component: NovoUsuario,
});

function NovoUsuario() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    status: "Ativo"
  });

  useEffect(() => {
    supabase.from("roles").select("*").then(async ({ data }) => {
      if (data) {
        if (data.length === 1 && data[0].name === 'Administrador') {
          const missingRoles = ['Sócio', 'Diretoria', 'Vendedor', 'Produção', 'Financeiro', 'Expedição', 'Atendimento', 'Designer'];
          const { data: newRoles } = await supabase.from('roles').insert(
             missingRoles.map(name => ({ name }))
          ).select('*');
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
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold tracking-tight">Acesso Negado</h2>
      </div>
    );
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    try {
      // Criação usando um workaround via REST na API pública, ou dependendo da setup
      // Como não temos Admin API exposta aqui, vamos simular a criação usando authClient separado:
      const authClient = supabase; // Idealmente aqui seria um client separado
      
      const { data: authData, error: authErr } = await authClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      });

      if (authErr) throw authErr;
      
      const newUserId = authData?.user?.id;
      if (!newUserId) throw new Error("Usuário não criado");

      // O trigger do Supabase deve ter criado a linha em public.users. Vamos atualizar
      const { error: updateErr } = await supabase.from('users').update({
        role_id: formData.role_id,
        phone: formData.phone,
        status: formData.status,
        force_password_change: true
      }).eq('id', newUserId);
      
      if (updateErr) throw updateErr;

      // Registrar Audit
      await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        target_user_id: newUserId,
        module: 'Usuários',
        action: 'CRIAR_USUARIO',
        after_data: formData
      });

      toast.success("Usuário criado com sucesso!");
      navigate({ to: "/usuarios" });
    } catch (e: any) {
      toast.error(e.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Novo Usuário</h1>
            <p className="text-muted-foreground text-sm mt-1">Adicione um novo colaborador ao sistema.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Usuário"}
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nome Completo *</Label>
            <Input 
              placeholder="Ex: João da Silva" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>E-mail *</Label>
            <Input 
              type="email" 
              placeholder="joao@empresa.com" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input 
              placeholder="(00) 00000-0000" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Senha Temporária *</Label>
            <Input 
              type="text" 
              placeholder="Senha inicial" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
            <p className="text-xs text-muted-foreground">O usuário será forçado a alterar esta senha no 1º login.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-2">
            <Label>Perfil Base (Cargo) *</Label>
            <Select value={formData.role_id || undefined} onValueChange={(v) => setFormData({...formData, role_id: v})}>
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
            <p className="text-xs text-muted-foreground mt-1">Isso preencherá as permissões iniciais do usuário.</p>
          </div>
          <div className="space-y-2">
            <Label>Status Inicial</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
