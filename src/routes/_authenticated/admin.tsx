import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  LogOut,
  ShieldCheck,
  CalendarDays,
  Inbox,
  Star,
  Images,
} from "lucide-react";
import { AvailabilityTab } from "@/components/admin/AvailabilityTab";
import { BookingsTab } from "@/components/admin/BookingsTab";
import { ReviewsTab } from "@/components/admin/ReviewsTab";
import { GalleryTab } from "@/components/admin/GalleryTab";

const TABS = ["calendar", "bookings", "reviews", "gallery"] as const;
type TabKey = (typeof TABS)[number];

const searchSchema = z.object({
  tab: fallback(z.enum(TABS), "calendar").default("calendar"),
});

export const Route = createFileRoute("/_authenticated/admin")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Διαχείριση — Ekaterini VIP Villa" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { tab } = Route.useSearch();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (!data.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    });
  }, []);

  const pendingBookingsQuery = useQuery({
    queryKey: ["admin_pending_counts_bookings"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count ?? 0;
    },
    enabled: isAdmin === true,
  });

  const pendingReviewsQuery = useQuery({
    queryKey: ["admin_pending_counts_reviews"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count ?? 0;
    },
    enabled: isAdmin === true,
  });

  const setTab = (next: TabKey) => {
    navigate({ to: "/admin", search: { tab: next }, replace: true });
  };

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const tabs = useMemo(
    () =>
      [
        {
          key: "calendar" as const,
          label: "Ημερολόγιο",
          full: "Ημερολόγιο Διαθεσιμότητας",
          icon: CalendarDays,
          badge: 0,
        },
        {
          key: "bookings" as const,
          label: "Αιτήματα",
          full: "Αιτήματα Κράτησης",
          icon: Inbox,
          badge: pendingBookingsQuery.data ?? 0,
        },
        {
          key: "reviews" as const,
          label: "Κριτικές",
          full: "Κριτικές Πελατών",
          icon: Star,
          badge: pendingReviewsQuery.data ?? 0,
        },
        {
          key: "gallery" as const,
          label: "Gallery",
          full: "Gallery",
          icon: Images,
          badge: 0,
        },
      ],
    [pendingBookingsQuery.data, pendingReviewsQuery.data],
  );

  const current = tabs.find((t) => t.key === tab) ?? tabs[0];

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[hsl(35_35%_96%)]">
        <Toaster position="top-center" />
        <div className="container-villa flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <ShieldCheck className="h-12 w-12 text-accent" />
          <h1 className="font-serif text-3xl">Δεν έχετε πρόσβαση διαχειριστή</h1>
          <p className="text-foreground/60">Ο λογαριασμός {email} δεν είναι διαχειριστής.</p>
          <button
            onClick={handleSignOut}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Αποσύνδεση
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(35_35%_96%)] text-sm text-foreground/60">
        Φόρτωση…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container-villa flex items-center justify-between py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Επιστροφή στο site
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-foreground/60 sm:inline">{email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/70 hover:border-accent hover:text-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Αποσύνδεση
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="container-villa">
          <nav className="-mx-2 flex gap-1 overflow-x-auto pb-3 pt-1 sm:mx-0">
            {tabs.map((tItem) => {
              const active = tItem.key === current.key;
              const Icon = tItem.icon;
              return (
                <button
                  key={tItem.key}
                  onClick={() => setTab(tItem.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-accent bg-accent text-accent-foreground shadow-[0_10px_30px_-14px_rgba(214,120,50,0.7)]"
                      : "border-border bg-background text-foreground/70 hover:border-accent hover:text-accent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tItem.full}</span>
                  <span className="sm:hidden">{tItem.label}</span>
                  {tItem.badge > 0 && (
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold ${
                        active
                          ? "bg-white/25 text-accent-foreground"
                          : "bg-accent/15 text-accent"
                      }`}
                    >
                      {tItem.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container-villa py-10">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-8 bg-accent" /> Διαχείριση
          </span>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">{current.full}</h1>

          <div className="mt-8">
            {current.key === "calendar" && <AvailabilityTab />}
            {current.key === "bookings" && <BookingsTab />}
            {current.key === "reviews" && <ReviewsTab />}
            {current.key === "gallery" && <GalleryTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
