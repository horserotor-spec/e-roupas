import { Outlet, Navigate } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AppShell() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se passou pelo Route Guard mas o profile falhou por algum motivo (ex: usuário deletado do banco)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
