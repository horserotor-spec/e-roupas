import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
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
