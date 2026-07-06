import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
import { Check, X, Clock, Trash2, Star, MessageSquare } from "lucide-react";

type ReviewStatus = "pending" | "approved" | "rejected";

type ReviewRow = {
  id: string;
  guest_name: string;
  location: string | null;
  email: string | null;
  country: string | null;
  stay_date: string | null;
  title: string | null;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
};

const STATUS_META: Record<ReviewStatus, { label: string; className: string }> = {
  pending: {
    label: "Εκκρεμεί",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  approved: {
    label: "Εγκεκριμένη",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  rejected: {
    label: "Απορρίφθηκε",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

const FILTERS: Array<{ key: "all" | ReviewStatus; label: string }> = [
  { key: "all", label: "Όλες" },
  { key: "pending", label: "Εκκρεμούν" },
  { key: "approved", label: "Εγκεκριμένες" },
  { key: "rejected", label: "Απορριφθείσες" },
];

export function ReviewsTab() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [confirmDelete, setConfirmDelete] = useState<ReviewRow | null>(null);

  const reviewsQuery = useQuery({
    queryKey: ["reviews_admin"],
    queryFn: async (): Promise<ReviewRow[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, guest_name, location, email, country, stay_date, title, rating, comment, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (args: { id: string; status: ReviewStatus }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ status: args.status })
        .eq("id", args.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Η κριτική ενημερώθηκε.");
      qc.invalidateQueries({ queryKey: ["reviews_admin"] });
      qc.invalidateQueries({ queryKey: ["reviews_public"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Σφάλμα."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Η κριτική διαγράφηκε.");
      qc.invalidateQueries({ queryKey: ["reviews_admin"] });
      qc.invalidateQueries({ queryKey: ["reviews_public"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Σφάλμα."),
  });

  const rows = reviewsQuery.data ?? [];
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

      {reviewsQuery.isLoading ? (
        <p className="py-10 text-center text-sm text-foreground/60">Φόρτωση…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 px-4 py-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-foreground/30" />
          <p className="mt-2 text-sm text-foreground/60">
            {rows.length === 0
              ? "Δεν υπάρχουν κριτικές ακόμη."
              : "Καμία κριτική σε αυτή την κατάσταση."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReviewCard
              key={r.id}
              row={r}
              onStatus={(s) => statusMutation.mutate({ id: r.id, status: s })}
              onDelete={() => setConfirmDelete(r)}
              pending={statusMutation.isPending}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Διαγραφή κριτικής;</AlertDialogTitle>
            <AlertDialogDescription>
              Η κριτική από {confirmDelete?.guest_name} θα διαγραφεί οριστικά.
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

function ReviewCard({
  row,
  onStatus,
  onDelete,
  pending,
}: {
  row: ReviewRow;
  onStatus: (s: ReviewStatus) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const meta = STATUS_META[row.status];
  return (
    <div className="rounded-2xl border border-border/60 bg-[hsl(35_35%_98%)] p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold text-foreground">{row.guest_name}</div>
            {row.location && (
              <span className="text-xs text-foreground/60">· {row.location}</span>
            )}
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}
            >
              {meta.label}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < row.rating ? "fill-current" : "text-foreground/20"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-foreground/50">
              {format(parseISO(row.created_at), "d MMM yyyy", { locale: el })}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">{row.comment}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {row.status !== "approved" && (
            <button
              onClick={() => onStatus("approved")}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Έγκριση
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
