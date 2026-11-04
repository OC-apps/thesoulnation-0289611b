import { createFileRoute, redirect } from "@tanstack/react-router";

/** Permanent public player URL; opens the existing live roster profile. */
export const Route = createFileRoute("/legends/$slug")({
  beforeLoad: ({ params }) => {
    const slug = params.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) throw redirect({ to: "/", hash: "legends" });
    throw redirect({ to: "/", search: { member: slug }, hash: "legends" });
  },
  component: () => null,
});
