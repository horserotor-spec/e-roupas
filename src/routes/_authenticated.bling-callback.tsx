import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { updateBlingSettings } from "@/lib/api/bling";

export const Route = createFileRoute("/_authenticated/bling-callback")({
  component: BlingCallbackPage,
});

function BlingCallbackPage() {
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processando autenticação com o Bling...");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          throw new Error("Autorização negada pelo usuário no Bling.");
        }

        if (!code) {
          throw new Error("Código de autorização não encontrado na URL.");
        }

        const savedState = localStorage.getItem("bling_oauth_state");
        if (state !== savedState) {
          throw new Error("Estado inválido. Possível tentativa de falsificação de requisição (CSRF).");
        }

        // We can't do the POST request directly from the client because of CORS.
        // We will need a server function or an edge function. 
        // But wait! Bling v3 might not support CORS for the token endpoint.
        // For now, let's just simulate or save the code if we don't have a backend.
        // Wait! We can use a server function from @tanstack/react-start. 
        // We will implement `exchangeBlingToken` in `bling.ts` or `bling.server.ts`.
        // Let's call a placeholder for now, which I will implement next.
        
        // This relies on `exchangeBlingToken` which we will create in `src/lib/api/bling.server.ts`
        const { exchangeBlingToken } = await import("@/lib/api/bling.server");
        
        const result = await exchangeBlingToken({ data: code });

        if (result.newSettings) {
          await updateBlingSettings(result.newSettings as any);
        }

        setStatus("success");
        setMessage("Integração concluída com sucesso! Redirecionando...");

        setTimeout(() => {
          navigate({ to: "/configuracoes" });
        }, 3000);

      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Ocorreu um erro desconhecido.");
      }
    };

    processCallback();
  }, [search, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
        {status === "loading" && (
          <>
            <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conectando...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="size-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">Conectado ao Bling!</h2>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="size-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Falha na Conexão</h2>
            <div className="mt-6">
              <button onClick={() => navigate({ to: "/configuracoes" })} className="text-sm text-primary hover:underline">
                Voltar para Configurações
              </button>
            </div>
          </>
        )}
        <p className="text-slate-600 text-sm">{message}</p>
      </div>
    </div>
  );
}
