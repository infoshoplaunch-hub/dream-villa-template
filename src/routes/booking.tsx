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
  MessageSquare,
  Send,
  MapPin,
  Moon,
  Info,
  Lock,
  Wifi,
  Car,
  Waves,
  BedDouble,
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
  firstName: z.string().trim().min(1, "Το όνομα είναι υποχρεωτικό").max(80),
  lastName: z.string().trim().min(1, "Το επώνυμο είναι υποχρεωτικό").max(80),
  email: z.string().trim().email("Μη έγκυρο email").max(200),
  phone: z.string().trim().min(6, "Μη έγκυρο τηλέφωνο").max(30),
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
      toast.error(result.error.issues[0]?.message ?? "Ελέγξτε τα στοιχεία");
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
  const goEdit = () => navigate({ to: "/", hash: "home" });

  const guestSummary = `${adults} ${adults === 1 ? "ενήλικας" : "ενήλικες"}${children > 0 ? `, ${children} ${children === 1 ? "παιδί" : "παιδιά"}` : ""}`;
  const nightsLabel = nights > 0 ? `${nights} ${nights === 1 ? "διανυκτέρευση" : "διανυκτερεύσεις"}` : "—";

  if (sent) {
    return (
      <div className="min-h-screen bg-[hsl(35_35%_96%)] text-foreground">
        <Toaster position="top-center" />
        <TopBar />
        <main className="container-villa flex min-h-[70vh] items-center justify-center py-14">
          <div className="max-w-xl rounded-3xl border border-border/60 bg-background p-10 text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-tight">
              Το αίτημά σας <span className="text-accent">καταχωρήθηκε</span> με επιτυχία
            </h1>
            <p className="mt-4 text-foreground/70">
              Η διαχείριση της Ekaterini VIP Villa θα επικοινωνήσει σύντομα μαζί σας για διαθεσιμότητα, τιμή και επιβεβαίωση.
            </p>
            <p className="mt-3 text-sm text-foreground/55">
              Έχει σταλεί και επιβεβαίωση στο email σας, εφόσον είναι ενεργοποιημένη η αποστολή email.
            </p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110">
              Επιστροφή στην αρχική
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

      <main className="container-villa py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* LEFT */}
            <div className="min-w-0">
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Κράτηση
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
                Ολοκληρώστε το <span className="text-accent italic">αίτημα</span> κράτησης
              </h1>
              <p className="mt-4 max-w-2xl text-foreground/70">
                Συμπληρώστε τα στοιχεία σας και η διαχείριση της Ekaterini VIP Villa θα επικοινωνήσει μαζί σας για διαθεσιμότητα, τιμή και επιβεβαίωση.
              </p>

              {/* Form card */}
              <form
                onSubmit={submit}
                className="mt-8 rounded-3xl border border-border/60 bg-background p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] md:p-9"
              >
                <h2 className="font-serif text-2xl">Τα στοιχεία σας</h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="ΟΝΟΜΑ *" value={form.firstName} onChange={onChange("firstName")} icon={<User className="h-4 w-4" />} />
                  <Field label="ΕΠΩΝΥΜΟ *" value={form.lastName} onChange={onChange("lastName")} icon={<User className="h-4 w-4" />} />
                  <Field label="EMAIL *" type="email" value={form.email} onChange={onChange("email")} icon={<Mail className="h-4 w-4" />} />
                  <Field label="ΤΗΛΕΦΩΝΟ *" type="tel" value={form.phone} onChange={onChange("phone")} icon={<Phone className="h-4 w-4" />} />
                </div>

                <div className="mt-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    ΜΗΝΥΜΑ
                  </label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-3.5 text-foreground/40">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <textarea
                      value={form.message}
                      onChange={onChange("message")}
                      rows={4}
                      placeholder="Επιπλέον πληροφορίες ή ειδικά αιτήματα..."
                      className="w-full rounded-2xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
                >
                  <Send className="h-4 w-4" />
                  Αποστολή Αιτήματος Κράτησης
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-foreground/55">
                  <Lock className="h-3.5 w-3.5" /> Δεν θα χρεωθείτε σε αυτό το βήμα.
                </p>
              </form>

              {/* Info card */}
              <div className="mt-6 rounded-3xl border border-border/60 bg-background/70 p-7 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.25)]">
                <h3 className="font-semibold text-foreground">Χρήσιμες πληροφορίες:</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "Δεν χρειάζεται πιστωτική κάρτα",
                    "Δεν θα χρεωθείτε σε αυτό το βήμα",
                    "Η διαχείριση θα επικοινωνήσει μαζί σας για επιβεβαίωση",
                    "Μπορείτε να αναφέρετε ειδικά αιτήματα στο μήνυμα",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/75">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT — Summary */}
            <aside className="lg:sticky lg:top-8 h-fit">
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img src={heroAsset.url} alt="Ekaterini VIP Villa" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-2xl leading-tight">Ekaterini VIP Villa</h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground/65">
                    <MapPin className="h-4 w-4 text-accent" />
                    Πλάκα Αποκορώνου, Χανιά, Κρήτη
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Pill icon={<UsersIcon className="h-3 w-3" />}>Έως 7 επισκέπτες</Pill>
                    <Pill icon={<BedDouble className="h-3 w-3" />}>3 υπνοδωμάτια</Pill>
                    <Pill icon={<Waves className="h-3 w-3" />}>Ιδιωτική πισίνα</Pill>
                    <Pill icon={<Wifi className="h-3 w-3" />}>Δωρεάν Wi-Fi</Pill>
                    <Pill icon={<Car className="h-3 w-3" />}>Δωρεάν πάρκινγκ</Pill>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-5">
                    <h3 className="font-semibold text-foreground">Τα στοιχεία της κράτησής σας</h3>
                    <div className="mt-4 space-y-3">
                      <SummaryRow icon={<CalendarIcon className="h-4 w-4" />} label="Άφιξη" value={fmt(ci)} onEdit={goEdit} />
                      <SummaryRow icon={<CalendarIcon className="h-4 w-4" />} label="Αναχώρηση" value={fmt(co)} onEdit={goEdit} />
                      <SummaryRow icon={<UsersIcon className="h-4 w-4" />} label="Επισκέπτες" value={guestSummary} onEdit={goEdit} />
                      <SummaryRow icon={<Moon className="h-4 w-4" />} label="Διαμονή" value={nightsLabel} />
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-accent/10 p-4 text-xs leading-relaxed text-foreground/75">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Η κράτηση επιβεβαιώνεται μετά από επικοινωνία με τη διαχείριση.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-villa flex items-center justify-between py-5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition hover:text-accent">
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
      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">{label}</label>
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

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-[hsl(35_35%_97%)] px-2.5 py-1 text-[11px] font-medium text-foreground/75">
      <span className="text-accent">{icon}</span>
      {children}
    </span>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/50">{label}</div>
        <div className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</div>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-foreground/70 transition hover:border-accent hover:text-accent"
        >
          Αλλαγή
        </button>
      )}
    </div>
  );
}
