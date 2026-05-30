import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("eroupas-os.user");
      if (!raw) throw redirect({ to: "/login" });
    } catch (e) {
      if (e && typeof e === "object" && "to" in e) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
  notFoundComponent: () => (
    <div className="p-10 text-sm text-muted-foreground">Página não encontrada.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Erro: {error.message}</div>
  ),
});
