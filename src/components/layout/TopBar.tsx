import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { UniversalSearch } from "./UniversalSearch";
import { Moon, Sun, Monitor, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function TopBar() {
  const { mode, setMode, resolved } = useTheme();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setMenu(false); };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, []);

  const cycleTheme = () => setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  const Icon = mode === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

  return (
    <header className="sticky top-0 z-30 glass hairline-b">
      <div className="h-14 px-4 md:px-6 flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <UniversalSearch />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={cycleTheme}
            className="size-9 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={`Tema: ${mode}`}
          >
            <Icon className="size-4" />
          </button>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenu((v) => !v)}
              className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-muted transition-colors"
            >
              <div
                className="size-7 rounded-full grid place-items-center text-white text-[11px] font-semibold"
                style={{ background: user?.avatarColor ?? "#0066ff" }}
              >
                {user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-[12px] font-medium">{user?.name}</div>
                <div className="text-[10px] text-muted-foreground">{user?.role}</div>
              </div>
            </button>

            {menu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg p-1.5">
                <div className="px-3 py-2 hairline-b mb-1">
                  <div className="text-sm font-medium truncate">{user?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted text-left"
                >
                  <LogOut className="size-4" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
