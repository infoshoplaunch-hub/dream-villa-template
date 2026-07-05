import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  format,
  parseISO,
  eachDayOfInterval,
  isSameDay,
  differenceInCalendarDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addDays,
  nextSaturday,
  isBefore,
} from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  LogOut,
  Trash2,
  ShieldCheck,
  CalendarDays,
  Ban,
  Sparkles,
  ChevronDown,
  Search,
  AlertTriangle,
  Eraser,
} from "lucide-react";
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
type BlockedGroup = { key: string; from: Date; to: Date; note: string | null; ids: string[]; dates: string[] };

function groupConsecutive(rows: BlockedRow[]): BlockedGroup[] {
  if (!rows.length) return [];
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const groups: BlockedGroup[] = [];
  let current: BlockedGroup | null = null;
  for (const row of sorted) {
    const d = parseISO(row.date);
    if (
      current &&
      current.note === (row.note ?? null) &&
      differenceInCalendarDays(d, current.to) === 1
    ) {
      current.to = d;
      current.ids.push(row.id);
      current.dates.push(row.date);
    } else {
      current = {
        key: row.id,
        from: d,
        to: d,
        note: row.note ?? null,
        ids: [row.id],
        dates: [row.date],
      };
      groups.push(current);
    }
  }
  return groups;
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [range, setRange] = useState<DateRange | undefined>();
  const [note, setNote] = useState("");
  const [month, setMonth] = useState<Date>(new Date());
  const [filter, setFilter] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [confirmState, setConfirmState] = useState<
    | { kind: "block-long"; days: number }
    | { kind: "block-overlap"; guests: string[] }
    | { kind: "unblock-range"; count: number }
    | null
  >(null);

  const today = useMemo(() => startOfDay(new Date()), []);

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

  // Esc clears selected range
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && range?.from) setRange(undefined);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [range]);

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

  const pendingCount = useMemo(
    () => (bookingsQuery.data ?? []).filter((b) => b.status === "pending").length,
    [bookingsQuery.data],
  );

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
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("blocked_dates").delete().in("id", ids);
      if (error) throw error;
    },
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: ["blocked_dates"] });
      const prev = qc.getQueryData<BlockedRow[]>(["blocked_dates"]);
      qc.setQueryData<BlockedRow[]>(["blocked_dates"], (old) =>
        (old ?? []).filter((r) => !ids.includes(r.id)),
      );
      return { prev };
    },
    onError: (err, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(["blocked_dates"], ctx.prev);
      toast.error(err instanceof Error ? err.message : "Σφάλμα.");
    },
    onSuccess: () => {
      toast.success("Ξεμπλοκαρίστηκε.");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["blocked_dates"] }),
  });

  // ---- Preset helpers ----
  const applyThisWeekend = () => {
    const sat = today.getDay() === 6 ? today : nextSaturday(today);
    setRange({ from: sat, to: addDays(sat, 1) });
    setMonth(sat);
  };
  const applyNextWeekend = () => {
    const sat = addDays(today.getDay() === 6 ? today : nextSaturday(today), 7);
    setRange({ from: sat, to: addDays(sat, 1) });
    setMonth(sat);
  };
  const applyWholeMonth = () => {
    const from = startOfMonth(month);
    const to = endOfMonth(month);
    const clampedFrom = isBefore(from, today) ? today : from;
    setRange({ from: clampedFrom, to });
  };

  // ---- Block flow with guardrails ----
  const runBlock = () => {
    if (!range?.from) return;
    blockMutation.mutate({ from: range.from, to: range.to ?? range.from, note });
  };

  const handleBlock = () => {
    if (!range?.from) {
      toast.error("Επιλέξτε ημερομηνία ή εύρος.");
      return;
    }
    const from = range.from;
    const to = range.to ?? range.from;
    const days = differenceInCalendarDays(to, from) + 1;

    // Overlap with confirmed bookings?
    const rangeDays = eachDayOfInterval({ start: from, end: to });
    const overlapGuests = new Set<string>();
    for (const b of bookingsQuery.data ?? []) {
      if (b.status !== "confirmed") continue;
      const bDays = eachDayOfInterval({ start: parseISO(b.check_in), end: parseISO(b.check_out) });
      if (rangeDays.some((d) => bDays.some((bd) => isSameDay(d, bd) && !isSameDay(bd, parseISO(b.check_out))))) {
        overlapGuests.add(b.guest_name);
      }
    }
    if (overlapGuests.size > 0) {
      setConfirmState({ kind: "block-overlap", guests: Array.from(overlapGuests) });
      return;
    }
    if (days > 7) {
      setConfirmState({ kind: "block-long", days });
      return;
    }
    runBlock();
  };

  const handleUnblockRange = () => {
    if (!range?.from) {
      toast.error("Επιλέξτε ημερομηνία ή εύρος.");
      return;
    }
    const from = range.from;
    const to = range.to ?? range.from;
    const days = eachDayOfInterval({ start: from, end: to }).map((d) => format(d, "yyyy-MM-dd"));
    const ids = (blockedQuery.data ?? []).filter((r) => days.includes(r.date)).map((r) => r.id);
    if (!ids.length) {
      toast.info("Καμία μπλοκαρισμένη μέρα στο εύρος.");
      return;
    }
    setConfirmState({ kind: "unblock-range", count: ids.length });
  };

  const confirmUnblockRange = () => {
    if (!range?.from) return;
    const from = range.from;
    const to = range.to ?? range.from;
    const days = eachDayOfInterval({ start: from, end: to }).map((d) => format(d, "yyyy-MM-dd"));
    const ids = (blockedQuery.data ?? []).filter((r) => days.includes(r.date)).map((r) => r.id);
    unblockMutation.mutate(ids);
    setRange(undefined);
  };

  // ---- Grouped blocked list ----
  const groups = useMemo(() => {
    const rows = blockedQuery.data ?? [];
    const filtered = filter.trim()
      ? rows.filter((r) => (r.note ?? "").toLowerCase().includes(filter.trim().toLowerCase()))
      : rows;
    return groupConsecutive(filtered);
  }, [blockedQuery.data, filter]);

  const upcomingGroups = groups.filter((g) => !isBefore(g.to, today));
  const pastGroups = groups.filter((g) => isBefore(g.to, today));

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

  const selectedDays =
    range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) + 1 : range?.from ? 1 : 0;

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
            Μπλοκάρετε ή ξεμπλοκάρετε ημερομηνίες. Οι μπλοκαρισμένες μέρες δεν είναι διαθέσιμες προς online κράτηση.
          </p>

          {pendingCount > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>
                Έχετε <strong>{pendingCount}</strong> εκκρεμείς κρατήσεις προς έλεγχο.
              </span>
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Calendar */}
            <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
              {/* Presets */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                  Γρήγορα
                </span>
                <button
                  onClick={applyThisWeekend}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:border-accent hover:text-accent"
                >
                  Αυτό το Σ/Κ
                </button>
                <button
                  onClick={applyNextWeekend}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:border-accent hover:text-accent"
                >
                  Επόμενο Σ/Κ
                </button>
                <button
                  onClick={applyWholeMonth}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:border-accent hover:text-accent"
                >
                  Όλος ο μήνας
                </button>
                {range?.from && (
                  <button
                    onClick={() => setRange(undefined)}
                    className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/50 transition hover:text-foreground"
                    title="Καθαρισμός (Esc)"
                  >
                    <Eraser className="h-3 w-3" /> Καθαρισμός
                  </button>
                )}
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-destructive/70" /> Μπλοκαρισμένη
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-accent/60" /> Confirmed κράτηση
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded border border-accent" /> Επιλεγμένο
                </span>
              </div>

              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                locale={el}
                disabled={{ before: today }}
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
                {selectedDays > 0 && (
                  <p className="mt-2 text-xs text-foreground/55">
                    Επιλεγμένες μέρες: <strong>{selectedDays}</strong>
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleBlock}
                    disabled={blockMutation.isPending || !range?.from}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110 disabled:opacity-50"
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
                  <button
                    onClick={handleUnblockRange}
                    disabled={unblockMutation.isPending || !range?.from}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground/75 transition hover:border-destructive hover:text-destructive disabled:opacity-50"
                  >
                    <Eraser className="h-4 w-4" />
                    Ξεμπλοκάρισμα εύρους
                  </button>
                </div>
              </div>
            </div>

            {/* Blocked list */}
            <aside className="h-fit rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
              <h2 className="flex items-center gap-2 font-serif text-xl">
                <CalendarDays className="h-5 w-5 text-accent" /> Μπλοκαρισμένες
              </h2>
              <p className="mt-1 text-xs text-foreground/55">
                {upcomingGroups.length} επερχόμενα · {pastGroups.length} παρελθόν
              </p>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Αναζήτηση σημείωσης…"
                  className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {blockedQuery.isLoading && <p className="text-sm text-foreground/60">Φόρτωση…</p>}
                {!blockedQuery.isLoading && groups.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center">
                    <CalendarDays className="mx-auto h-6 w-6 text-foreground/30" />
                    <p className="mt-2 text-sm text-foreground/60">
                      {filter ? "Καμία αντιστοιχία." : "Καμία μπλοκαρισμένη ημερομηνία."}
                    </p>
                  </div>
                )}
                {upcomingGroups.map((g) => (
                  <GroupRow
                    key={g.key}
                    group={g}
                    onDelete={() => unblockMutation.mutate(g.ids)}
                    disabled={unblockMutation.isPending}
                  />
                ))}

                {pastGroups.length > 0 && (
                  <Collapsible open={showPast} onOpenChange={setShowPast} className="pt-2">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50 transition hover:text-foreground">
                      <span>Παρελθόν ({pastGroups.length})</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition ${showPast ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {pastGroups.map((g) => (
                        <GroupRow
                          key={g.key}
                          group={g}
                          onDelete={() => unblockMutation.mutate(g.ids)}
                          disabled={unblockMutation.isPending}
                          muted
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Confirm dialogs */}
      <AlertDialog
        open={!!confirmState}
        onOpenChange={(open) => !open && setConfirmState(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              {confirmState?.kind === "unblock-range"
                ? "Ξεμπλοκάρισμα εύρους"
                : confirmState?.kind === "block-overlap"
                  ? "Επικάλυψη με κράτηση"
                  : "Μεγάλο εύρος μπλοκαρίσματος"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmState?.kind === "unblock-range" &&
                `Θα ξεμπλοκαριστούν ${confirmState.count} ημέρες. Θέλετε να συνεχίσετε;`}
              {confirmState?.kind === "block-long" &&
                `Πρόκειται να μπλοκάρετε ${confirmState.days} συνεχόμενες μέρες. Είστε σίγουρος/η;`}
              {confirmState?.kind === "block-overlap" &&
                `Το εύρος επικαλύπτεται με confirmed κράτηση (${confirmState.guests.join(", ")}). Το μπλοκάρισμα δεν θα ακυρώσει την κράτηση, αλλά θα εμφανίζεται ως μη διαθέσιμο online.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmState?.kind === "unblock-range") confirmUnblockRange();
                else runBlock();
                setConfirmState(null);
              }}
            >
              Επιβεβαίωση
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GroupRow({
  group,
  onDelete,
  disabled,
  muted,
}: {
  group: BlockedGroup;
  onDelete: () => void;
  disabled: boolean;
  muted?: boolean;
}) {
  const single = isSameDay(group.from, group.to);
  const label = single
    ? format(group.from, "EEE d MMM yyyy", { locale: el })
    : `${format(group.from, "d MMM", { locale: el })} → ${format(group.to, "d MMM yyyy", { locale: el })}`;
  const count = group.ids.length;
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-4 py-3 ${
        muted ? "bg-transparent opacity-70" : "bg-[hsl(35_35%_98%)]"
      }`}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground/60">
          <span>
            {count} {count === 1 ? "μέρα" : "μέρες"}
          </span>
          {group.note && <span className="truncate">· {group.note}</span>}
        </div>
      </div>
      <button
        onClick={onDelete}
        disabled={disabled}
        className="shrink-0 rounded-full p-2 text-foreground/50 transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
        title={single ? "Ξεμπλοκάρισμα" : `Ξεμπλοκάρισμα ${count} ημερών`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
