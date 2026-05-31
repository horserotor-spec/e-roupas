import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  permissions: Record<string, string>;
  active: boolean;
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
            setUser(null);
            return;
          }
        }

        // Fetch permissions
        const { data: perms } = await supabase
          .from("user_permissions")
          .select("module, permission_level")
          .eq("user_id", authUserId);

        const permissionsMap: Record<string, string> = {};
        if (perms) {
          perms.forEach(p => {
            permissionsMap[p.module] = p.permission_level;
          });
        }

        if (mounted) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatarUrl: profile.avatar_url,
            role: profile.roles?.name || "Sem Cargo",
            permissions: permissionsMap,
            active: profile.active,
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
        fetchProfile(session.user.id);
      } else {
        if (mounted) setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoading(true);
        fetchProfile(session.user.id);
      } else {
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
