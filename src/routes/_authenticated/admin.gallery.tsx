import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  beforeLoad: () => {
    throw redirect({ to: "/admin", search: { tab: "gallery" }, replace: true });
  },
  component: () => null,
});
