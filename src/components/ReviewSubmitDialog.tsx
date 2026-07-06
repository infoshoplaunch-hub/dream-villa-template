import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").trim();

const schema = z.object({
  guest_name: z.string().trim().min(2, "Το ονοματεπώνυμο είναι υποχρεωτικό").max(100),
  email: z.string().trim().email("Μη έγκυρο email").max(200),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  stay_date: z.string().trim().max(40).optional().or(z.literal("")),
  rating: z.number().int().min(1, "Επιλέξτε βαθμολογία").max(5),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  comment: z
    .string()
    .trim()
    .min(30, "Η κριτική πρέπει να έχει τουλάχιστον 30 χαρακτήρες")
    .max(2000),
});

export function ReviewSubmitDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    guest_name: "",
    email: "",
    country: "",
    stay_date: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setForm({ guest_name: "", email: "", country: "", stay_date: "", rating: 0, title: "", comment: "" });
    setHoverRating(0);
    setSubmitted(false);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const clean = {
        guest_name: stripHtml(form.guest_name),
        email: stripHtml(form.email),
        country: stripHtml(form.country),
        stay_date: stripHtml(form.stay_date),
        rating: form.rating,
        title: stripHtml(form.title),
        comment: stripHtml(form.comment),
      };
      const parsed = schema.safeParse(clean);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία");
      }
      const p = parsed.data;
      const { error } = await supabase.from("reviews").insert({
        guest_name: p.guest_name,
        email: p.email,
        country: p.country || null,
        location: p.country || null,
        stay_date: p.stay_date || null,
        rating: p.rating,
        title: p.title || null,
        comment: p.comment,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ["reviews_admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Σφάλμα υποβολής"),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="max-w-lg rounded-3xl border border-[hsl(35_30%_88%)] bg-[hsl(38_45%_97%)] p-0 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-5 font-serif text-2xl text-foreground">Ευχαριστούμε!</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Σας ευχαριστούμε για την κριτική σας. Θα εμφανιστεί στο website μετά από έγκριση.
            </p>
            <button
              onClick={() => onOpenChange(false)}
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Κλείσιμο
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-7 pt-7">
              <DialogTitle className="font-serif text-2xl text-foreground">
                Αφήστε την κριτική σας
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/60">
                Μοιραστείτε την εμπειρία σας από την Ekaterini VIP Villa.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
              className="space-y-4 px-7 pb-7 pt-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Ονοματεπώνυμο *">
                  <input
                    required
                    value={form.guest_name}
                    onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                    maxLength={100}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email *">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={200}
                    className={inputCls}
                  />
                </Field>
                <Field label="Χώρα">
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    maxLength={80}
                    className={inputCls}
                  />
                </Field>
                <Field label="Μήνας διαμονής">
                  <input
                    placeholder="π.χ. Ιούλιος 2025"
                    value={form.stay_date}
                    onChange={(e) => setForm({ ...form, stay_date: e.target.value })}
                    maxLength={40}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Βαθμολογία *">
                <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (hoverRating || form.rating) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        onMouseEnter={() => setHoverRating(n)}
                        className="transition-transform hover:scale-110"
                        aria-label={`${n} αστέρια`}
                      >
                        <Star
                          className={`h-8 w-8 ${active ? "fill-[#F5A524] text-[#F5A524]" : "text-foreground/25"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Τίτλος κριτικής">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={120}
                  className={inputCls}
                />
              </Field>

              <Field label="Η κριτική σας *">
                <textarea
                  required
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  minLength={30}
                  maxLength={2000}
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
                <div className="mt-1 text-right text-[11px] text-foreground/50">
                  {form.comment.trim().length}/30 χαρακτήρες τουλάχιστον
                </div>
              </Field>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Υποβολή κριτικής
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const inputCls =
  "w-full rounded-xl border border-[hsl(35_25%_82%)] bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground/70">
        {label}
      </span>
      {children}
    </label>
  );
}
