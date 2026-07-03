import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Check,
  User,
  Mail,
  Phone,
  Send,
  MapPin,
  Moon,
  Lock,
  Waves,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import heroAsset from "@/assets/villa-hero.jpg.asset.json";

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

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Παρακαλώ συμπληρώστε το όνομά σας").max(80),
  lastName: z.string().trim().min(1, "Παρακαλώ συμπληρώστε το επώνυμό σας").max(80),
  email: z.string().trim().email("Παρακαλώ εισάγετε ένα έγκυρο email").max(200),
  phone: z.string().trim().min(6, "Παρακαλώ εισάγετε ένα έγκυρο τηλέφωνο").max(30),
  message: z.string().trim().max(1000).optional(),
});

function BookingPage() {
  const { check_in, check_out, adults, children, total_guests } = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const ci = check_in ? parseISO(check_in) : null;
  const co = check_out ? parseISO(check_out) : null;
  const nights = ci && co ? differenceInCalendarDays(co, ci) : 0;

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.");
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

  const fmtLong = (d: Date | null) => (d ? format(d, "EEEE d MMMM yyyy", { locale: el }) : "—");
  const fmtShort = (d: Date | null) => (d ? format(d, "d MMM", { locale: el }) : "—");
  const goEdit = () => navigate({ to: "/", hash: "home" });

  const guestSummary = `${adults} ${adults === 1 ? "ενήλικας" : "ενήλικες"}${children > 0 ? `, ${children} ${children === 1 ? "παιδί" : "παιδιά"}` : ""}`;
  const nightsLabel = nights > 0 ? `${nights} ${nights === 1 ? "διανυκτέρευση" : "διανυκτερεύσεις"}` : "—";
  const rangeChip = ci && co ? `${fmtShort(ci)} — ${fmtShort(co)}` : "Επιλέξτε ημερομηνίες";

  if (sent) {
    return (
      <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
        <Toaster position="top-center" />
        <TopBar />
        <main className="container-villa flex min-h-[75vh] items-center justify-center py-14">
          <div className="max-w-xl rounded-3xl border border-border/60 bg-background p-10 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
              Το αίτημά σας <span className="text-accent italic">καταχωρήθηκε</span> με επιτυχία
            </h1>
            <p className="mt-4 text-foreground/70">
              Η διαχείριση της Ekaterini VIP Villa θα επικοινωνήσει σύντομα μαζί σας για επιβεβαίωση διαθεσιμότητας και τιμής.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
            >
              Επιστροφή στην αρχική
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
      <Toaster position="top-center" />
      <TopBar />

      <main className="lg:grid lg:grid-cols-[45fr_55fr] lg:min-h-[calc(100vh-68px)]">
        {/* LEFT — visual panel */}
        <aside className="relative min-h-[70vh] overflow-hidden lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:min-h-0">
          <img
            src={heroAsset.url}
            alt="Ekaterini VIP Villa"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-transparent mix-blend-overlay" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12 lg:p-14 text-white">
            <div>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/85">
                <span className="h-px w-8 bg-white/70" />
                Ιδιωτική Βίλα
              </span>
            </div>

            <div>
              <h2 className="font-serif text-4xl leading-[1.05] md:text-5xl lg:text-[3.5rem]">
                Ekaterini VIP Villa
              </h2>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                Πλάκα Αποκορώνου, Χανιά, Κρήτη
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                Ιδιωτική βίλα με πισίνα για ήρεμες διακοπές στην Κρήτη.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <GlassChip icon={<CalendarIcon className="h-3.5 w-3.5" />}>{rangeChip}</GlassChip>
                <GlassChip icon={<UsersIcon className="h-3.5 w-3.5" />}>{guestSummary}</GlassChip>
                <GlassChip icon={<Moon className="h-3.5 w-3.5" />}>{nightsLabel}</GlassChip>
              </div>

              <div className="mt-8 h-px w-24 bg-white/25" />

              <div className="mt-6 flex flex-wrap gap-2">
                <FeatureChip icon={<UsersIcon className="h-3 w-3" />}>Έως 7 επισκέπτες</FeatureChip>
                <FeatureChip icon={<BedDouble className="h-3 w-3" />}>3 υπνοδωμάτια</FeatureChip>
                <FeatureChip icon={<Waves className="h-3 w-3" />}>Ιδιωτική πισίνα</FeatureChip>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — form panel */}
        <section className="bg-[hsl(35_35%_96%)] px-6 py-12 md:px-12 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-xl">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Κράτηση
            </span>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-[2.75rem]">
              Συμπληρώστε τα <span className="text-accent italic">στοιχεία</span> σας
            </h1>
            <p className="mt-4 text-foreground/70">
              Η διαχείριση της Ekaterini VIP Villa θα επικοινωνήσει μαζί σας για διαθεσιμότητα, τιμή και επιβεβαίωση.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground/55">
              <Lock className="h-3.5 w-3.5" /> Δεν θα χρεωθείτε σε αυτό το βήμα.
            </p>

            {/* Summary */}
            <div className="mt-10">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/55">
                  Σύνοψη αιτήματος
                </h3>
                <button
                  type="button"
                  onClick={goEdit}
                  className="text-xs font-medium text-accent underline-offset-4 hover:underline"
                >
                  Αλλαγή
                </button>
              </div>
              <dl className="mt-4 divide-y divide-border/60 border-y border-border/60">
                <SummaryRow label="Άφιξη" value={fmtLong(ci)} />
                <SummaryRow label="Αναχώρηση" value={fmtLong(co)} />
                <SummaryRow label="Επισκέπτες" value={guestSummary} onEdit={goEdit} />
                <SummaryRow label="Διαμονή" value={nightsLabel} />
              </dl>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Όνομα *" value={form.firstName} onChange={onChange("firstName")} icon={<User className="h-4 w-4" />} />
                <Field label="Επώνυμο *" value={form.lastName} onChange={onChange("lastName")} icon={<User className="h-4 w-4" />} />
                <Field label="Email *" type="email" value={form.email} onChange={onChange("email")} icon={<Mail className="h-4 w-4" />} />
                <Field label="Τηλέφωνο *" type="tel" value={form.phone} onChange={onChange("phone")} icon={<Phone className="h-4 w-4" />} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
                  Μήνυμα / Ειδικά αιτήματα
                </label>
                <textarea
                  value={form.message}
                  onChange={onChange("message")}
                  rows={4}
                  placeholder="Πείτε μας αν έχετε κάποια ειδική προτίμηση ή αίτημα..."
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-foreground/40 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <button
                type="submit"
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
              >
                <Send className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Αποστολή Αιτήματος Κράτησης
              </button>
              <p className="text-center text-xs text-foreground/55">Δεν θα χρεωθείτε σε αυτό το βήμα.</p>
            </form>

            {/* Helpful info — integrated */}
            <div className="mt-12">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/55">
                Χρήσιμες πληροφορίες
              </h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Δεν χρειάζεται πιστωτική κάρτα",
                  "Δεν θα χρεωθείτε τώρα",
                  "Η κράτηση επιβεβαιώνεται μετά από επικοινωνία",
                  "Μπορείτε να αναφέρετε ειδικά αιτήματα",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-foreground/70">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-villa flex items-center justify-between py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Επιστροφή
        </Link>
        <div className="font-serif text-lg md:text-xl">
          Ekaterini <span className="text-accent">VIP</span> Villa
        </div>
      </div>
    </header>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  icon,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">{label}</label>
      <div className="relative mt-2">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border border-border bg-background ${icon ? "pl-11" : "pl-4"} pr-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20`}
        />
      </div>
    </div>
  );
}

function GlassChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
      <span className="text-white/85">{icon}</span>
      {children}
    </span>
  );
}

function FeatureChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/85 backdrop-blur">
      <span className="text-accent">{icon}</span>
      {children}
    </span>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/50">{label}</dt>
      <dd className="flex items-center gap-3 text-right">
        <span className="text-sm font-medium text-foreground">{value}</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-accent underline-offset-4 hover:underline"
          >
            Αλλαγή
          </button>
        )}
      </dd>
    </div>
  );
}
