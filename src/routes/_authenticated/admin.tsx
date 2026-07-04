import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, eachDayOfInterval, isSameDay } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogOut, Trash2, ShieldCheck, CalendarDays, Ban } from "lucide-react";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Διαχείριση Ημερολογίου — Ekaterini VIP Villa" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type BlockedRow = { id: string; date: string; note: string | null; created_at: string };
type BookingRow = { id: string; check_in: string; check_out: string; guest_name: string; status: string };

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [range, setRange] = useState<DateRange | undefined>();
  const [note, setNote] = useState("");

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

  const blockedQuery = useQuery({
    queryKey: ["blocked_dates"],
    queryFn: async (): Promise<BlockedRow[]> => {
      const { data, error } = await supabase
        .from("blocked_dates")
        .select("id, date, note, created_at")
        .order("date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings_admin"],
    queryFn: async (): Promise<BookingRow[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, check_in, check_out, guest_name, status")
        .order("check_in", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: isAdmin === true,
  });

  const blockedDates = useMemo(
    () => (blockedQuery.data ?? []).map((r) => parseISO(r.date)),
    [blockedQuery.data],
  );

  const confirmedBookingDates = useMemo(() => {
    const rows = bookingsQuery.data ?? [];
    const days: Date[] = [];
    for (const b of rows) {
      if (b.status !== "confirmed") continue;
      const ci = parseISO(b.check_in);
      const co = parseISO(b.check_out);
      for (const d of eachDayOfInterval({ start: ci, end: co })) {
        if (!isSameDay(d, co)) days.push(d);
      }
    }
    return days;
  }, [bookingsQuery.data]);

  const blockMutation = useMutation({
    mutationFn: async ({ from, to, note }: { from: Date; to: Date; note: string }) => {
      const days = eachDayOfInterval({ start: from, end: to });
      const rows = days.map((d) => ({
        date: format(d, "yyyy-MM-dd"),
        note: note || null,
      }));
      const { error } = await supabase.from("blocked_dates").upsert(rows, { onConflict: "date" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Οι ημερομηνίες μπλοκαρίστηκαν.");
      setRange(undefined);
      setNote("");
      qc.invalidateQueries({ queryKey: ["blocked_dates"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Σφάλμα."),
  });

  const unblockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Η ημερομηνία ξεμπλοκαρίστηκε.");
      qc.invalidateQueries({ queryKey: ["blocked_dates"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Σφάλμα."),
  });

  const handleBlock = () => {
    if (!range?.from) {
      toast.error("Επιλέξτε ημερομηνία ή εύρος.");
      return;
    }
    blockMutation.mutate({ from: range.from, to: range.to ?? range.from, note });
  };

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[hsl(35_35%_96%)]">
        <Toaster position="top-center" />
        <div className="container-villa flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <ShieldCheck className="h-12 w-12 text-accent" />
          <h1 className="font-serif text-3xl">Δεν έχετε πρόσβαση διαχειριστή</h1>
          <p className="text-foreground/60">Ο λογαριασμός {email} δεν είναι διαχειριστής.</p>
          <button onClick={handleSignOut} className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">
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
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Επιστροφή στο site
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition"
            >
              Διαχείριση Gallery
            </Link>
            <span className="hidden text-xs text-foreground/60 sm:inline">{email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/70 hover:border-accent hover:text-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Αποσύνδεση
            </button>
          </div>
        </div>
      </header>

      <main className="container-villa py-10">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-8 bg-accent" /> Διαχείριση
          </span>
          <h1 className="mt-3 font-serif text-4xl">
            Ημερολόγιο <span className="text-accent italic">διαθεσιμότητας</span>
          </h1>
          <p className="mt-3 max-w-2xl text-foreground/65">
            Μπλοκάρετε ημερομηνίες όταν κλείνει κράτηση εκτός site (π.χ. τηλεφωνικά). Οι μπλοκαρισμένες μέρες δεν θα είναι
            διαθέσιμες προς online κράτηση.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Calendar */}
            <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
              <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-destructive/70" /> Μπλοκαρισμένη (από εσάς)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-accent/60" /> Online κράτηση (confirmed)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded border border-accent" /> Επιλεγμένο εύρος
                </span>
              </div>

              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
                locale={el}
                modifiers={{
                  blocked: blockedDates,
                  booked: confirmedBookingDates,
                }}
                modifiersClassNames={{
                  blocked: "bg-destructive/70 text-destructive-foreground hover:bg-destructive/80",
                  booked: "bg-accent/60 text-accent-foreground",
                }}
                className="pointer-events-auto"
              />

              <div className="mt-6 border-t border-border/60 pt-5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
                  Σημείωση (προαιρετικά)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="π.χ. Τηλεφωνική κράτηση — κ. Παπαδόπουλος"
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <button
                  onClick={handleBlock}
                  disabled={blockMutation.isPending || !range?.from}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110 disabled:opacity-50"
                >
                  <Ban className="h-4 w-4" />
                  {blockMutation.isPending
                    ? "Μπλοκάρισμα…"
                    : range?.from && range?.to && !isSameDay(range.from, range.to)
                      ? `Μπλοκάρισμα ${format(range.from, "d MMM", { locale: el })} → ${format(range.to, "d MMM", { locale: el })}`
                      : range?.from
                        ? `Μπλοκάρισμα ${format(range.from, "d MMMM yyyy", { locale: el })}`
                        : "Επιλέξτε ημερομηνία"}
                </button>
              </div>
            </div>

            {/* Blocked list */}
            <aside className="h-fit rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
              <h2 className="flex items-center gap-2 font-serif text-xl">
                <CalendarDays className="h-5 w-5 text-accent" /> Μπλοκαρισμένες ημέρες
              </h2>
              <p className="mt-1 text-xs text-foreground/55">
                {blockedQuery.data?.length ?? 0} συνολικά
              </p>

              <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {blockedQuery.isLoading && <p className="text-sm text-foreground/60">Φόρτωση…</p>}
                {blockedQuery.data?.length === 0 && (
                  <p className="text-sm text-foreground/60">Καμία μπλοκαρισμένη ημερομηνία.</p>
                )}
                {blockedQuery.data?.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-[hsl(35_35%_98%)] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {format(parseISO(row.date), "EEE d MMM yyyy", { locale: el })}
                      </div>
                      {row.note && (
                        <div className="mt-0.5 truncate text-xs text-foreground/60">{row.note}</div>
                      )}
                    </div>
                    <button
                      onClick={() => unblockMutation.mutate(row.id)}
                      disabled={unblockMutation.isPending}
                      className="shrink-0 rounded-full p-2 text-foreground/50 transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                      title="Ξεμπλοκάρισμα"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
