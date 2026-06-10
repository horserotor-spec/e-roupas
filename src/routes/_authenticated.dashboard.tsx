import { createFileRoute, Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowUpRight, Flame, Clock, FileCheck2, UserPlus, Activity, Loader2, ShieldAlert } from "lucide-react";
import { useOrders } from "@/lib/api/orders";
import { useClients } from "@/lib/api/clients";
import { useEffect, useState } from "react";
import { quoteStatusLabel, quoteStatusTone } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · e-roupas OS" }] }),
  component: Dashboard,
});

const statusLabel: Record<string, string> = {
  orcamento: "Orçamento",
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_arte: "Em Arte",
  aguardando_arte: "Aguardando Arte",
  em_producao: "Em Produção",
  pronto_coleta: "Pronto Coleta",
  faturado: "Faturado",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const statusTone: Record<string, string> = {
  orcamento: "default",
  pendente: "warning",
  confirmado: "info",
  em_arte: "info",
  aguardando_arte: "warning",
  em_producao: "primary",
  pronto_coleta: "success",
  faturado: "success",
  enviado: "success",
  entregue: "success",
  cancelado: "danger",
};

function Dashboard() {
  const { data: orders = [], isLoading: loadingOrders } = useOrders();
  const { data: clients = [], isLoading: loadingClients } = useClients();

  // Carregar dados de erros evitados
  const [avoidedErrors, setAvoidedErrors] = useState(0);
  useEffect(() => {
    supabase.from("separation_errors").select("*", { count: "exact", head: true }).then((res) => {
      setAvoidedErrors(res.count || 0);
    });
  }, []);

  if (loadingOrders || loadingClients) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const today = orders.filter((o: any) => (o.sale_date || o.created_at)?.startsWith(todayStr));
  const urgent = orders.filter((o: any) => o.urgent || o.priority === "alta");
  const waitingArt = orders.filter((o: any) => o.status === "aguardando_arte" || o.status === "em_arte");
  
  const isOverdue = (o: any) => {
    if (!o.expected_date) return false;
    const expected = new Date(o.expected_date);
    const now = new Date();
    const isLate = expected < now && expected.toDateString() !== now.toDateString();
    return isLate && !["faturado", "pronto_coleta", "enviado", "entregue", "cancelado"].includes(o.status);
  };
  const overdue = orders.filter(isOverdue);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const newClients = clients.filter((c: any) => c.created_at && new Date(c.created_at) >= sixtyDaysAgo);

  const recentOrders = [...orders].sort((a: any, b: any) => {
    const dA = new Date(a.created_at || a.sale_date || 0).getTime();
    const dB = new Date(b.created_at || b.sale_date || 0).getTime();
    return dB - dA;
  }).slice(0, 5);

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const displayDate = new Date().toLocaleDateString('pt-BR', options);



  return (
    <div className="px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{displayDate}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Visão geral da operação</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <KpiCard to="/pedidos" label="Pedidos do dia" value={today.length} hint="Criados hoje" icon={Activity} accent="primary" />
        <KpiCard to="/pedidos" label="Urgentes" value={urgent.length} hint="Prioridade alta" icon={Flame} accent="warning" />
        <KpiCard to="/pedidos" label="Aguardando arte" value={waitingArt.length} hint="Cliente / designer" icon={FileCheck2} accent="info" />
        <KpiCard to="/pedidos" label="Atrasados" value={overdue.length} hint="Prazo vencido" icon={Clock} accent="danger" />
        <KpiCard to="/crm" label="Clientes novos" value={newClients.length} hint="Últimos 60d" icon={UserPlus} accent="success" />
        <KpiCard to="/producao" label="Erros Evitados" value={avoidedErrors} hint="Separação física" icon={ShieldAlert} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Pedidos recentes</h2>
              <p className="text-xs text-muted-foreground">Últimos pedidos inseridos no sistema.</p>
            </div>
            <Link to="/pedidos" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              Ver todos <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border -mx-2">
            {recentOrders.length === 0 && <p className="px-2 py-4 text-sm text-muted-foreground">Nenhum pedido encontrado.</p>}
            {recentOrders.map((o: any) => {
              const client = clients.find((c: any) => c.id === o.client_id) || { name: o.client_name };
              const itemCount = Array.isArray(o.items) ? o.items.reduce((acc: number, i: any) => acc + (Number(i.quantity) || 0), 0) : 0;
              return (
                <Link
                  key={o.id} to="/pedidos/$id" params={{ id: o.id }}
                  className="flex items-center gap-4 px-2 py-3 hover:bg-muted/60 rounded-lg transition-colors"
                >
                  <div className="text-xs font-mono text-muted-foreground number w-32 shrink-0">{o.code || o.id.split('-')[0]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{client?.name || 'Cliente não identificado'}</div>
                    <div className="text-xs text-muted-foreground truncate">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</div>
                  </div>
                  <StatusBadge tone={(statusTone[o.status] || "default") as any}>{statusLabel[o.status] || o.status}</StatusBadge>
                  <div className="text-sm font-medium number w-24 text-right">{formatCurrency(o.final_total || 0)}</div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold tracking-tight mb-1">Avisos e Lembretes</h2>
          <p className="text-xs text-muted-foreground mb-4">Destaques do sistema.</p>
          <ul className="space-y-3">
            {overdue.length > 0 && (
              <li className="text-xs flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-destructive shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium">Atenção aos Atrasados</span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">Você possui {overdue.length} pedido(s) com o prazo de entrega vencido.</p>
                </div>
              </li>
            )}
            {waitingArt.length > 0 && (
              <li className="text-xs flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-warning shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium">Artes Pendentes</span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">Existem {waitingArt.length} pedido(s) aguardando desenvolvimento ou aprovação de arte.</p>
                </div>
              </li>
            )}
            {urgent.length > 0 && (
              <li className="text-xs flex gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium">Prioridade Alta</span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{urgent.length} pedido(s) marcado(s) como urgentes necessitam de atenção na produção.</p>
                </div>
              </li>
            )}
            {overdue.length === 0 && waitingArt.length === 0 && urgent.length === 0 && (
               <li className="text-xs flex gap-3">
                 <span className="mt-1 size-1.5 rounded-full bg-success shrink-0" />
                 <div className="min-w-0">
                   <span className="font-medium">Tudo em ordem!</span>
                   <p className="text-muted-foreground mt-0.5 leading-relaxed">A operação está fluindo perfeitamente sem atrasos pendentes.</p>
                 </div>
               </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold tracking-tight mb-1">Radar Financeiro</h2>
          <p className="text-xs text-muted-foreground mb-4">Módulo de contas a receber/pagar.</p>
          <FinanceWidget />
        </section>
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabase";

function FinanceWidget() {
  const [metrics, setMetrics] = useState({ atrasadas: 0, vencemHoje: 0, recebidosMes: 0 });

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      
      const { data } = await supabase.from('financial_transactions').select('*');
      if (data) {
        let atrasadas = 0;
        let vencemHoje = 0;
        let recebidosMes = 0;

        data.forEach(t => {
          const amt = Number(t.amount);
          if (t.type === 'pagar' && t.status === 'pendente') {
            if (t.due_date < today) atrasadas++;
          }
          if (t.status === 'pendente' && t.due_date === today) {
            vencemHoje++;
          }
          if (t.type === 'receber' && (t.status === 'recebido' || t.status === 'pago') && t.payment_date >= startOfMonth) {
            recebidosMes += amt;
          }
        });
        setMetrics({ atrasadas, vencemHoje, recebidosMes });
      }
    };
    load();
  }, []);

  return (
    <ul className="space-y-3 font-medium">
      <li className="text-xs flex items-center gap-2">
        <span className="text-lg">⚠</span>
        <span className={metrics.atrasadas > 0 ? "text-red-600 font-bold" : "text-slate-500"}>
          {metrics.atrasadas} contas atrasadas
        </span>
      </li>
      <li className="text-xs flex items-center gap-2">
        <span className="text-lg">💰</span>
        <span className={metrics.vencemHoje > 0 ? "text-amber-600 font-bold" : "text-slate-500"}>
          {metrics.vencemHoje} contas vencem hoje
        </span>
      </li>
      <li className="text-xs flex items-center gap-2">
        <span className="text-lg">✔</span>
        <span className="text-emerald-600 font-bold">
          R$ {metrics.recebidosMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})} recebidos mês
        </span>
      </li>
    </ul>
  );
}

function KpiCard({
  label, value, hint, icon: Icon, accent, to,
}: {
  label: string; value: number; hint: string; icon: typeof Activity;
  accent: "primary" | "warning" | "info" | "danger" | "success"; to: string;
}) {
  const tone = {
    primary: "text-primary bg-primary-soft",
    warning: "text-[color-mix(in_oklab,var(--warning)_55%,black)] dark:text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_16%,transparent)]",
    info: "text-[var(--info)] bg-[color-mix(in_oklab,var(--info)_14%,transparent)]",
    danger: "text-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)]",
    success: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)]",
  }[accent];

  return (
    <Link to={to as never} className="group rounded-2xl border border-border bg-card p-5 hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between">
        <div className={`size-8 rounded-lg grid place-items-center ${tone}`}>
          <Icon className="size-4" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight number">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </Link>
  );
}
