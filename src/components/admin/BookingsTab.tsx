import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Check,
  X,
  Clock,
  Trash2,
  Mail,
  Phone,
  Users as UsersIcon,
  CalendarDays,
  Eye,
  Inbox,
} from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

type BookingRow = {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  message: string | null;
  status: BookingStatus;
  created_at: string;
};

const STATUS_META: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: "Εκκρεμεί",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  confirmed: {
    label: "Επιβεβαιωμένη",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  rejected: {
    label: "Απορρίφθηκε",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  cancelled: {
    label: "Ακυρώθηκε",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const FILTERS: Array<{ key: "all" | BookingStatus; label: string }> = [
  { key: "all", label: "Όλα" },
  { key: "pending", label: "Εκκρεμούν" },
  { key: "confirmed", label: "Επιβεβαιωμένα" },
  { key: "rejected", label: "Απορριφθέντα" },
  { key: "cancelled", label: "Ακυρωμένα" },
];

export function BookingsTab() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BookingRow | null>(null);

  const bookingsQuery = useQuery({
    queryKey: ["bookings_admin_full"],
    queryFn: async (): Promise<BookingRow[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, guest_name, email, phone, check_in, check_out, adults, children, message, status, created_at",
        )
        .order("check_in", { ascending: true });
      if (error) throw error;
      return (data ?? []) as BookingRow[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (args: { id: string; status: BookingStatus }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: args.status })
        .eq("id", args.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Η κατάσταση ενημερώθηκε.");
      qc.invalidateQueries({ queryKey: ["bookings_admin_full"] });
      qc.invalidateQueries({ queryKey: ["bookings_admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Σφάλμα."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Το αίτημα διαγράφηκε.");
      qc.invalidateQueries({ queryKey: ["bookings_admin_full"] });
      qc.invalidateQueries({ queryKey: ["bookings_admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Σφάλμα."),
  });

  const rows = bookingsQuery.data ?? [];
  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  return (
    <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count = counts[f.key] ?? 0;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? "bg-white/25 text-accent-foreground" : "bg-foreground/5 text-foreground/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {bookingsQuery.isLoading ? (
        <p className="py-10 text-center text-sm text-foreground/60">Φόρτωση…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 px-4 py-10 text-center">
          <Inbox className="mx-auto h-8 w-8 text-foreground/30" />
          <p className="mt-2 text-sm text-foreground/60">Κανένα αίτημα σε αυτή την κατάσταση.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRowCard
              key={b.id}
              row={b}
              onView={() => setSelected(b)}
              onStatus={(status) => statusMutation.mutate({ id: b.id, status })}
              onDelete={() => setConfirmDelete(b)}
              pending={statusMutation.isPending}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {selected?.guest_name}
            </DialogTitle>
            <DialogDescription>
              Αίτημα υποβλήθηκε{" "}
              {selected &&
                format(parseISO(selected.created_at), "d MMM yyyy, HH:mm", { locale: el })}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    Κατάσταση
                  </div>
                  <StatusPill status={selected.status} />
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    Διανυκτερεύσεις
                  </div>
                  <div className="font-semibold">
                    {differenceInCalendarDays(
                      parseISO(selected.check_out),
                      parseISO(selected.check_in),
                    )}
                  </div>
                </div>
              </div>

              <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Άφιξη">
                {format(parseISO(selected.check_in), "EEE d MMM yyyy", { locale: el })}
              </DetailRow>
              <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Αναχώρηση">
                {format(parseISO(selected.check_out), "EEE d MMM yyyy", { locale: el })}
              </DetailRow>
              <DetailRow icon={<UsersIcon className="h-4 w-4" />} label="Επισκέπτες">
                {selected.adults} ενήλικες
                {selected.children > 0 ? `, ${selected.children} παιδιά` : ""}
              </DetailRow>
              <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
                <a href={`mailto:${selected.email}`} className="text-accent hover:underline">
                  {selected.email}
                </a>
              </DetailRow>
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Τηλέφωνο">
                <a href={`tel:${selected.phone}`} className="text-accent hover:underline">
                  {selected.phone}
                </a>
              </DetailRow>
              {selected.message && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    Μήνυμα
                  </div>
                  <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-foreground/80">
                    {selected.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Διαγραφή αιτήματος;</AlertDialogTitle>
            <AlertDialogDescription>
              Το αίτημα από {confirmDelete?.guest_name} θα διαγραφεί οριστικά.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDelete) deleteMutation.mutate(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >
              Διαγραφή
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          {label}
        </div>
        <div className="mt-0.5 text-sm text-foreground/85">{children}</div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function BookingRowCard({
  row,
  onView,
  onStatus,
  onDelete,
  pending,
}: {
  row: BookingRow;
  onView: () => void;
  onStatus: (s: BookingStatus) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const nights = differenceInCalendarDays(parseISO(row.check_out), parseISO(row.check_in));
  return (
    <div className="rounded-2xl border border-border/60 bg-[hsl(35_35%_98%)] p-4 transition hover:border-accent/40 hover:shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate font-semibold text-foreground">{row.guest_name}</div>
            <StatusPill status={row.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/65">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(parseISO(row.check_in), "d MMM", { locale: el })} →{" "}
              {format(parseISO(row.check_out), "d MMM yyyy", { locale: el })} · {nights}{" "}
              {nights === 1 ? "νύχτα" : "νύχτες"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon className="h-3.5 w-3.5" />
              {row.adults + row.children}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <a href={`mailto:${row.email}`} className="hover:text-accent hover:underline">
                {row.email}
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <a href={`tel:${row.phone}`} className="hover:text-accent hover:underline">
                {row.phone}
              </a>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-accent hover:text-accent"
          >
            <Eye className="h-3.5 w-3.5" />
            Λεπτομέρειες
          </button>
          {row.status !== "confirmed" && (
            <button
              onClick={() => onStatus("confirmed")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Επιβεβαίωση
            </button>
          )}
          {row.status !== "rejected" && (
            <button
              onClick={() => onStatus("rejected")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Απόρριψη
            </button>
          )}
          {row.status !== "pending" && (
            <button
              onClick={() => onStatus("pending")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <Clock className="h-3.5 w-3.5" />
              Εκκρεμεί
            </button>
          )}
          <button
            onClick={onDelete}
            className="inline-flex items-center rounded-full p-1.5 text-foreground/40 transition hover:bg-destructive/10 hover:text-destructive"
            title="Διαγραφή"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
