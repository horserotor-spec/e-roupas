import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Search, Plus, MoreHorizontal, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/usuarios/")({
  component: UsuariosIndex,
});

function UsuariosIndex() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*, roles(name)")
      .order("created_at", { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Admin / Diretoria check
  const roleName = user?.role?.toLowerCase() || "";
  const isDiretoriaOrAdmin = roleName === "diretoria" || roleName === "admin" || roleName === "administrador";

  if (!isDiretoriaOrAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold tracking-tight">Acesso Negado</h2>
        <p className="text-muted-foreground">Você não tem permissão para visualizar esta página.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.roles?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'Ativo': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Ativo</Badge>;
      case 'Inativo': return <Badge variant="secondary" className="text-slate-600"><XCircle className="w-3 h-3 mr-1"/> Inativo</Badge>;
      case 'Bloqueado': return <Badge variant="destructive"><ShieldAlert className="w-3 h-3 mr-1"/> Bloqueado</Badge>;
      case 'Desligado': return <Badge variant="outline" className="text-slate-400">Desligado</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Usuários do Sistema</h1>
          <p className="text-muted-foreground mt-1">Gerencie os colaboradores, perfis e permissões granulares.</p>
        </div>
        <Link to="/usuarios/novo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, e-mail ou cargo..." 
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Usuário</th>
                <th className="px-6 py-4 font-medium">Cargo</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Contato</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum usuário encontrado.</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={u.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {u.name?.substring(0,2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">Último IP: {u.last_ip || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-medium bg-secondary/50">
                        {u.roles?.name || 'Sem cargo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.status || (u.active ? 'Ativo' : 'Inativo')} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{u.email}</p>
                      {u.phone && <p className="text-xs text-muted-foreground mt-0.5">{u.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/usuarios/${u.id}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
