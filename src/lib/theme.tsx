import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "light" | "dark" | "system";
const KEY = "eroupas-os.theme";

interface ThemeCtx { mode: Mode; resolved: "light" | "dark"; setMode: (m: Mode) => void; }
const Ctx = createContext<ThemeCtx | null>(null);

function resolve(m: Mode): "light" | "dark" {
  if (m !== "system") return m;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Mode | null) ?? "system";
    setModeState(stored);
  }, []);

  useEffect(() => {
    const r = resolve(mode);
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
    localStorage.setItem(KEY, mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const fn = () => {
        const nr = mq.matches ? "dark" : "light";
        setResolved(nr);
        document.documentElement.classList.toggle("dark", nr === "dark");
      };
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    }
  }, [mode]);

  return <Ctx.Provider value={{ mode, resolved, setMode: setModeState }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme fora de ThemeProvider");
  return v;
}
