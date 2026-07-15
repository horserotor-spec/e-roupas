import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Shirt, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar · e-roupas OS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "reset">("login");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setMsg(null);
    try {
      if (mode === "login") {
        await login(email, password);
        navigate({ to: "/dashboard" });
      } else {
        await resetPassword(email);
        setMsg("E-mail de redefinição enviado se a conta existir.");
        setMode("login");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Falha na solicitação");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center justify-center space-y-2 mb-8">
            <img src="/logo.png" alt="e-roupas logo" style={{ width: '169px', height: '35px' }} className="object-contain" />
            <div className="text-[11px] text-muted-foreground">Operating system têxtil</div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            {mode === "login" ? "Bem-vindo de volta." : "Redefinir Senha"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Entre para acessar a operação." : "Enviaremos um link para redefinir sua senha."}
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:focus-ring"
              />
            </div>
            
            {mode === "login" && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Senha</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setErr(null);
                      setMsg("Para redefinir sua senha, solicite ao Administrador do sistema.");
                    }} 
                    className="text-[11px] text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
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
            )}

            {err && <p className="text-xs text-destructive">{err}</p>}
            {msg && <p className="text-xs text-primary">{msg}</p>}

            <button
              type="submit" disabled={loading}
              className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Aguarde…" : "Entrar"}
            </button>

            <p className="text-[11px] text-muted-foreground text-center pt-2">
              Acesso restrito. Utilize suas credenciais corporativas para acessar o sistema.
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
