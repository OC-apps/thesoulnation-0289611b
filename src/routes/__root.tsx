import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { EffectsLayer } from "@/components/effects-layer";
import { SideNav } from "@/components/side-nav";
import { EasterEggProvider } from "@/lib/easter-eggs";
import { EasterEggNotification } from "@/components/easter-egg-notification";
import { ExplorerPanel } from "@/components/explorer-panel";
import { EasterEggCompletion } from "@/components/easter-egg-completion";
import { ExplorationProvider } from "@/lib/exploration";
import { ExplorationHUD } from "@/components/exploration-hud";
import { ExplorationMax } from "@/components/exploration-max";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Soul Nation" },
      { name: "description", content: "Página Web de The Soul Nation" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "The Soul Nation" },
      { property: "og:description", content: "Página Web de The Soul Nation" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "The Soul Nation" },
      { name: "twitter:description", content: "Página Web de The Soul Nation" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7d1a020-3aab-43f9-aa93-af9dc7a62524/id-preview-6eb22a7b--02db53ff-1cb4-449a-ae22-9eb902ca9aba.lovable.app-1778659605894.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7d1a020-3aab-43f9-aa93-af9dc7a62524/id-preview-6eb22a7b--02db53ff-1cb4-449a-ae22-9eb902ca9aba.lovable.app-1778659605894.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="fixed inset-0 -z-50"
        style={{ background: "oklch(0.30 0.24 255)" }}
      />
      <div
        className="fixed inset-0 -z-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 45% at 85% 10%, rgba(255,130,40,0.22), transparent 70%), radial-gradient(45% 40% at 8% 90%, rgba(255,150,60,0.18), transparent 70%), radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />
      <EasterEggProvider>
        <ExplorationProvider>
          <EffectsLayer />
          <SideNav />
          <ExplorationHUD />
          <Outlet />
          <EasterEggNotification />
          <ExplorerPanel />
          <EasterEggCompletion />
          <ExplorationMax />
        </ExplorationProvider>
      </EasterEggProvider>
    </QueryClientProvider>
  );
}
