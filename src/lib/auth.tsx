import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { users, type User } from "./mock-data";

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "eroupas-os.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async (email: string, _password: string) => {
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? users[0];
    setUser(match);
    localStorage.setItem(KEY, JSON.stringify(match));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth fora de AuthProvider");
  return v;
}
