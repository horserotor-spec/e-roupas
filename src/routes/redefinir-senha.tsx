import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({ meta: [{ title: "Redefinir Senha · e-roupas OS" }] }),
  component: RedefinirSenhaPage,
});

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // Escuta mudanças de hash para lidar com o token da URL se necessário,
    // mas o Supabase client faz isso automaticamente e cria a sessão.
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Sessão de recuperação de senha foi iniciada.
        console.log("Recuperação de senha iniciada");
      }
    });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErr("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true); setErr(null); setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setMsg("Senha atualizada com sucesso!");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (e: any) {
      setErr(e.message || "Falha ao atualizar a senha");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col gap-2 mb-12">
            <img src="/logo.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain block dark:hidden" />
            <img src="/logo-dark.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain hidden dark:block" />
            <div className="text-[11px] text-muted-foreground">Operating system têxtil</div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Nova Senha
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Digite sua nova senha abaixo.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Nova Senha</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="h-10 w-full rounded-lg border border-border bg-surface pl-3 pr-10 text-sm outline-none focus:border-primary focus:focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}
            {msg && <p className="text-xs text-primary">{msg}</p>}

            <button
              type="submit" disabled={loading}
              className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Aguarde…" : "Atualizar senha"}
            </button>
            
            <p className="text-[11px] text-center pt-2">
              <button type="button" onClick={() => navigate({ to: "/login" })} className="text-muted-foreground hover:text-foreground">
                Voltar para o login
              </button>
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
