import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Sprint 1 (mock): app vive dentro de /_authenticated
    throw redirect({ to: "/dashboard" });
  },
});
