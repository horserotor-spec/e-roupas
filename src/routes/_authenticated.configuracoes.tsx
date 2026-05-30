import { createFileRoute } from "@tanstack/react-router";
import { users, type AccessLevel, type Module } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações · e-roupas OS" }] }),
  component: Config,
});

const modules: Module[] = [
  "dashboard", "crm", "pedidos", "producao", "estoque",
  "financeiro", "expedicao", "relatorios", "ia", "configuracoes",
];

const levelLabel: Record<AccessLevel, string> = {
  sem_acesso: "—",
  visualizacao: "Visualização",
  operacao: "Operação",
  aprovacao: "Aprovação",
  administracao: "Admin",
};

const levelTone: Record<AccessLevel, string> = {
  sem_acesso: "text-muted-foreground bg-muted",
  visualizacao: "text-foreground bg-muted",
  operacao: "text-[var(--info)] bg-[color-mix(in_oklab,var(--info)_14%,transparent)]",
  aprovacao: "text-[color-mix(in_oklab,var(--warning)_55%,black)] dark:text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_18%,transparent)]",
  administracao: "text-primary bg-primary-soft",
};

function Config() {
  return (
    <div className="px-6 md:px-10 py-8 max-w-[1500px] mx-auto">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sistema</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Usuários e permissões</h1>
      <p className="text-sm text-muted-foreground mt-1">Arquitetura: cargo base + permissões adicionais por módulo. 5 níveis de acesso.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5 sticky left-0 bg-muted/40">Usuário</th>
                <th className="text-left font-medium px-4 py-2.5">Cargo</th>
                {modules.map((m) => (
                  <th key={m} className="text-left font-medium px-3 py-2.5 capitalize">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full grid place-items-center text-white text-[10px] font-semibold" style={{ background: u.avatarColor }}>
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{u.role}</td>
                  {modules.map((m) => {
                    const lvl = u.permissions[m];
                    return (
                      <td key={m} className="px-3 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${levelTone[lvl]}`}>
                          {levelLabel[lvl]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Níveis: sem acesso · visualização · operação · aprovação · administração. Editor visual de permissões chega na Sprint 2.
      </div>
    </div>
  );
}
