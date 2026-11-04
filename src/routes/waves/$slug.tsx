import { createFileRoute, redirect } from "@tanstack/react-router";

/** Permanent public player URL; opens the existing live roster profile. */
export const Route = createFileRoute("/waves/$slug")({
  beforeLoad: ({ params }) => {
    const slug = params.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) throw redirect({ to: "/", hash: "waves" });
    throw redirect({ to: "/", search: { wave: slug }, hash: "waves" });
  },
  component: () => null,
});
