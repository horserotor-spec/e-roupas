import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Shirt } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar · e-roupas OS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("ana@e-roupas.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Falha ao entrar");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Shirt className="size-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">e-roupas OS</div>
              <div className="text-[11px] text-muted-foreground">Operating system têxtil</div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Bem-vinda de volta.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entre para acessar a operação.</p>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:focus-ring"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Senha</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:focus-ring"
              />
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button
              type="submit" disabled={loading}
              className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>

            <p className="text-[11px] text-muted-foreground text-center pt-2">
              Sprint 1 · qualquer email cadastrado funciona como login mock.<br />
              Tente <span className="text-foreground font-medium">ana@e-roupas.com</span> (Diretoria) ou <span className="text-foreground font-medium">diego@e-roupas.com</span> (Produção).
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 20%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(ellipse at 80% 80%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 50%), var(--surface-2)",
        }} />
        <div className="relative h-full flex flex-col justify-end p-16">
          <blockquote className="text-2xl font-medium tracking-tight leading-snug max-w-md">
            “Menos cliques, mais decisão. <span className="text-primary">e-roupas OS</span> conecta atendimento, arte, produção e expedição em uma única timeline.”
          </blockquote>
          <p className="mt-4 text-xs text-muted-foreground">Sprint 1 · v1.0 · multi-marca · auditável</p>
        </div>
      </div>
    </div>
  );
}
