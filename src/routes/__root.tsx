import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { EffectsLayer } from "@/components/effects-layer";
import { BottomBar } from "@/components/bottom-bar";
import { EasterEggProvider } from "@/lib/easter-eggs";
import { EasterEggNotification } from "@/components/easter-egg-notification";
import { ExplorerPanel } from "@/components/explorer-panel";
import { EasterEggCompletion } from "@/components/easter-egg-completion";
import { ExplorationProvider } from "@/lib/exploration";
import { AudioProvider } from "@/hooks/use-audio";

import { ExplorationMax } from "@/components/exploration-max";
import { ExplorationPanel } from "@/components/exploration-panel";

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
      { name: "description", content: "The Soul Nation: comunidad gamer y equipo de creadores de contenido, montagers y jugadores. Conoce nuestro roster, videos y reclutamiento." },
      { name: "author", content: "The Soul Nation" },
      { property: "og:title", content: "The Soul Nation" },
      { property: "og:description", content: "Página Web de The Soul Nation" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thesoulnation.org/" },
      { name: "theme-color", content: "#01039E" },
      { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: "The Soul Nation" },
      { name: "twitter:description", content: "Página Web de The Soul Nation" },
      { property: "og:image", content: "https://thesoulnation.org/soul-share.jpg" },
      { name: "twitter:image", content: "https://thesoulnation.org/soul-share.jpg" },
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
    <html lang="es">
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
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="soul-global-gradient" aria-hidden="true" />
      <EasterEggProvider>
        <ExplorationProvider>
          <AudioProvider>
            <EffectsLayer />
            {location.pathname !== "/" && <BottomBar />}
            <Outlet />
            <EasterEggNotification />
            <ExplorerPanel hideButton />
            <EasterEggCompletion />
            <ExplorationPanel hideButton />
            <ExplorationMax />
          </AudioProvider>
        </ExplorationProvider>
      </EasterEggProvider>
    </QueryClientProvider>
  );
}
