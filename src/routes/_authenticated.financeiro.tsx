import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/financeiro")({
  component: FinanceiroLayout,
});

function FinanceiroLayout() {
  return (
    <div className="h-full bg-slate-50/50">
      <Outlet />
    </div>
  );
}
