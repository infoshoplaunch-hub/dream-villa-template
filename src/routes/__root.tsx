import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";

function getLang(): "el" | "en" {
  if (typeof window === "undefined") return "el";
  const v = window.localStorage.getItem("lang");
  return v === "en" ? "en" : "el";
}

function NotFoundComponent() {
  const lang = getLang();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">
          {lang === "en" ? "Page not found." : "Η σελίδα δεν βρέθηκε."}
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          {lang === "en" ? "Home" : "Αρχική"}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const lang = getLang();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-serif text-2xl">
          {lang === "en" ? "Something went wrong" : "Κάτι πήγε στραβά"}
        </h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          {lang === "en" ? "Try again" : "Δοκιμάστε ξανά"}
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ekaterini VIP Villa — Πολυτελής Διαμονή στα Χανιά, Κρήτη" },
      {
        name: "description",
        content:
          "Ekaterini VIP Villa στην Πλάκα Αποκορώνου, Χανιά. Ιδιωτική πισίνα, 3 υπνοδωμάτια έως 7 άτομα, BBQ, κήπος και δωρεάν πάρκινγκ.",
      },
      { property: "og:title", content: "Ekaterini VIP Villa — Πολυτελής Διαμονή στα Χανιά, Κρήτη" },
      {
        property: "og:description",
        content:
          "Ιδιωτική πισίνα, άνετοι χώροι και όλες οι παροχές για ήρεμες διακοπές στην Κρήτη.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ekaterini VIP Villa — Πολυτελής Διαμονή στα Χανιά, Κρήτη" },
      { name: "twitter:description", content: "Ιδιωτική πισίνα, άνετοι χώροι και όλες οι παροχές για ήρεμες διακοπές στην Κρήτη." },
      { property: "og:site_name", content: "Ekaterini VIP Villa" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="el">
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
      <I18nProvider>
        <Outlet />
      </I18nProvider>
    </QueryClientProvider>
  );
}
