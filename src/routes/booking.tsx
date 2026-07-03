import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Calendar as CalendarIcon, Users as UsersIcon, Check } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const searchSchema = z.object({
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(7).default(2),
  children: z.coerce.number().int().min(0).max(7).default(0),
  total_guests: z.coerce.number().int().min(1).max(7).default(2),
});

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Κράτηση — Ekaterini VIP Villa" },
      { name: "description", content: "Ολοκληρώστε το αίτημα κράτησής σας στην Ekaterini VIP Villa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { check_in, check_out, adults, children, total_guests } = Route.useSearch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const ci = check_in ? parseISO(check_in) : null;
  const co = check_out ? parseISO(check_out) : null;
  const nights = ci && co ? differenceInCalendarDays(co, ci) : 0;

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.");
      return;
    }
    const subject = encodeURIComponent(`Αίτημα Κράτησης - Ekaterini VIP Villa`);
    const body = encodeURIComponent(
      `Ονοματεπώνυμο: ${form.firstName} ${form.lastName}\n` +
        `Email: ${form.email}\n` +
        `Τηλέφωνο: ${form.phone}\n\n` +
        `Άφιξη: ${check_in ?? "-"}\n` +
        `Αναχώρηση: ${check_out ?? "-"}\n` +
        `Διανυκτερεύσεις: ${nights}\n` +
        `Ενήλικες: ${adults}\n` +
        `Παιδιά: ${children}\n` +
        `Σύνολο επισκεπτών: ${total_guests}\n\n` +
        `Μήνυμα:\n${form.message}`,
    );
    window.location.href = `mailto:info@katerinavipvilla.gr?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const fmt = (d: Date | null) => (d ? format(d, "EEEE d MMMM yyyy", { locale: el }) : "—");

  return (
    <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
      <Toaster position="top-center" />
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container-villa flex items-center justify-between py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Επιστροφή
          </Link>
          <div className="font-serif text-xl">
            Ekaterini <span className="text-accent">VIP</span> Villa
          </div>
        </div>
      </header>

      <main className="container-villa py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Κράτηση
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            Ολοκληρώστε το <span className="text-accent">αίτημά</span> σας
          </h1>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Συμπληρώστε τα στοιχεία σας και θα σας απαντήσουμε το συντομότερο δυνατό με διαθεσιμότητα και προσφορά.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <form
              onSubmit={submit}
              className="rounded-3xl border border-border/60 bg-background p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] md:p-10"
            >
              <h2 className="font-serif text-2xl">Τα στοιχεία σας</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Όνομα *" value={form.firstName} onChange={onChange("firstName")} />
                <Field label="Επώνυμο *" value={form.lastName} onChange={onChange("lastName")} />
                <Field label="Email *" type="email" value={form.email} onChange={onChange("email")} />
                <Field label="Τηλέφωνο *" type="tel" value={form.phone} onChange={onChange("phone")} />
              </div>
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
                  Μήνυμα
                </label>
                <textarea
                  value={form.message}
                  onChange={onChange("message")}
                  rows={4}
                  placeholder="Επιπλέον πληροφορίες ή ειδικά αιτήματα..."
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
              >
                Αποστολή Αιτήματος
              </button>
              {sent && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
                  <Check className="h-4 w-4" /> Το αίτημά σας ετοιμάστηκε — ανοίξτε το email σας για να το στείλετε.
                </p>
              )}
            </form>

            {/* Summary */}
            <aside className="rounded-3xl border border-border/60 bg-background p-7 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] h-fit">
              <h2 className="font-serif text-xl">Σύνοψη</h2>
              <div className="mt-5 space-y-4 text-sm">
                <SummaryRow icon={<CalendarIcon className="h-4 w-4" />} label="Άφιξη" value={fmt(ci)} />
                <SummaryRow icon={<CalendarIcon className="h-4 w-4" />} label="Αναχώρηση" value={fmt(co)} />
                <SummaryRow
                  icon={<UsersIcon className="h-4 w-4" />}
                  label="Επισκέπτες"
                  value={`${adults} ενήλικες${children > 0 ? ` · ${children} παιδιά` : ""}`}
                />
                {nights > 0 && (
                  <div className="rounded-xl bg-accent/10 px-4 py-3 text-center text-sm font-semibold text-accent">
                    {nights} {nights === 1 ? "διανυκτέρευση" : "διανυκτερεύσεις"}
                  </div>
                )}
              </div>
              <div className="mt-6 border-t border-border/60 pt-5 text-xs leading-relaxed text-foreground/60">
                Θα σας απαντήσουμε με email σε λίγες ώρες. Καμία χρέωση σε αυτό το βήμα.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/50">
          {label}
        </div>
        <div className="mt-0.5 font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
