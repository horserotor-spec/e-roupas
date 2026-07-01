import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  permissions: Record<string, Record<string, boolean>>;
  status: string;
  forcePasswordChange?: boolean;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile(authUserId: string) {
      if (!mounted) return;
      try {
        // Fetch user profile
        let { data: profile, error: profileErr } = await supabase
          .from("users")
          .select("*, roles(name)")
          .eq("id", authUserId)
          .single();

        if (profileErr || !profile) {
          console.warn("Profile not found in public.users, attempting to auto-create...", profileErr);
          // Auto-create fallback for users created manually without trigger
          const { data: { user: sessionUser } } = await supabase.auth.getUser();
          if (sessionUser) {
            const { data: newProfile, error: insertErr } = await supabase
              .from("users")
              .insert({
                id: sessionUser.id,
                name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Usuário',
                email: sessionUser.email,
                status: 'Ativo'
              })
              .select("*, roles(name)")
              .single();
              
            if (!insertErr && newProfile) {
              profile = newProfile;
              profileErr = null;
            } else {
              console.error("Auto-create profile failed:", insertErr);
            }
          }
          
          if (profileErr || !profile) {
            userIdRef.current = null;
            setUser(null);
            return;
          }
        }

        // Bloquear acesso se inativo/bloqueado/desligado
        if (profile.status === 'Bloqueado' || profile.status === 'Inativo' || profile.status === 'Desligado') {
          console.warn(`User is ${profile.status}, denying access.`);
          await supabase.auth.signOut();
          userIdRef.current = null;
          setUser(null);
          return;
        }

        // Fetch permissions (actions column is JSONB, with fallback to permission_level)
        const { data: perms, error: permsErr } = await supabase
          .from("user_permissions")
          .select("module, actions, permission_level")
          .eq("user_id", authUserId);

        const permissionsMap: Record<string, Record<string, boolean>> = {};
        
        if (permsErr && permsErr.code === "42703") {
          // Fallback se a coluna actions não existir ainda
          console.warn("Coluna actions não existe. Rodar SQL de migração.");
          const { data: oldPerms } = await supabase
            .from("user_permissions")
            .select("module, permission_level")
            .eq("user_id", authUserId);
            
          if (oldPerms) {
            oldPerms.forEach(p => {
              permissionsMap[p.module] = {
                visualizar: true,
                criar: p.permission_level === 'write' || p.permission_level === 'admin',
                editar: p.permission_level === 'write' || p.permission_level === 'admin',
                excluir: p.permission_level === 'admin'
              };
            });
          }
        } else if (perms) {
          perms.forEach(p => {
            permissionsMap[p.module] = p.actions || {
              visualizar: true,
              criar: p.permission_level === 'write' || p.permission_level === 'admin',
              editar: p.permission_level === 'write' || p.permission_level === 'admin',
            };
          });
        }

        if (mounted) {
          userIdRef.current = profile.id;
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatarUrl: profile.avatar_url,
            role: profile.roles?.name || "Sem Cargo",
            permissions: permissionsMap,
            status: profile.status || 'Ativo',
            forcePasswordChange: profile.force_password_change,
          });
        }
      } catch (e) {
        console.error("Auth profile fetch error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        userIdRef.current = session.user.id;
        fetchProfile(session.user.id);
      } else {
        userIdRef.current = null;
        if (mounted) setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (userIdRef.current === session.user.id) {
          if (event === "USER_UPDATED") {
            fetchProfile(session.user.id);
          }
          return;
        }
        userIdRef.current = session.user.id;
        setLoading(true);
        fetchProfile(session.user.id);
      } else {
        userIdRef.current = null;
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/redefinir-senha',
    });
    if (error) throw error;
  };

  return <Ctx.Provider value={{ user, loading, login, logout, resetPassword }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth fora de AuthProvider");
  return v;
}
