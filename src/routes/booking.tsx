import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { el as dfEl, enUS as dfEn } from "date-fns/locale";
import { Check, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import {
  bookingFormSchema,
  fetchBookedRanges,
  MAX_GUESTS,
  parseIsoDate,
  rangeOverlaps,
  toIsoDate,
} from "@/lib/booking";
import heroAsset from "@/assets/villa-hero.jpg.asset.json";

const searchSchema = z.object({
  checkin: fallback(z.string(), "").default(""),
  checkout: fallback(z.string(), "").default(""),
  adults: fallback(z.number().int().min(1).max(MAX_GUESTS), 2).default(2),
  children: fallback(z.number().int().min(0).max(MAX_GUESTS), 0).default(0),
  infants: fallback(z.number().int().min(0).max(5), 0).default(0),
});

export const Route = createFileRoute("/booking")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Booking — Ekaterini VIP Villa" },
      { name: "description", content: "Ολοκληρώστε το αίτημα κράτησης για την Ekaterini VIP Villa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingPage,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl">Κάτι πήγε στραβά</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Link to="/" className="rounded-full bg-primary px-5 py-2 text-primary-foreground">
        Αρχική
      </Link>
    </div>
  ),
});

function BookingPage() {
  const { t, lang } = useI18n();
  const tp = t.bookingPage;
  const locale = lang === "el" ? dfEl : dfEn;
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/booking" });

  const checkin = parseIsoDate(search.checkin);
  const checkout = parseIsoDate(search.checkout);
  const invalid =
    !checkin ||
    !checkout ||
    checkout <= checkin ||
    search.adults + search.children > MAX_GUESTS;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect to home if params are missing/invalid.
  useEffect(() => {
    if (invalid) {
      navigate({ to: "/" });
    }
  }, [invalid, navigate]);

  if (invalid || !checkin || !checkout) return null;

  const nights = Math.round((checkout.getTime() - checkin.getTime()) / 86_400_000);
  const totalGuests = search.adults + search.children;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const parsed = bookingFormSchema.safeParse({
      guest_name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message") ?? "",
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message;
      setError(first === "email" ? tp.errEmail : tp.errRequired);
      return;
    }

    setSubmitting(true);

    // Server-side re-validate availability just before insert.
    const ranges = await fetchBookedRanges();
    if (rangeOverlaps(checkin, checkout, ranges)) {
      setSubmitting(false);
      setError(tp.errOverlap);
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      guest_name: parsed.data.guest_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      check_in: toIsoDate(checkin),
      check_out: toIsoDate(checkout),
      adults: search.adults,
      children: search.children,
      message: parsed.data.message || null,
      status: "pending",
    });

    setSubmitting(false);

    if (insertError) {
      console.error("Booking insert failed", insertError);
      if (insertError.code === "23514" || insertError.message?.toLowerCase().includes("check")) {
        setError(tp.errOverlap);
      } else {
        setError(tp.errGeneric);
      }
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/60 bg-background">
        <div className="container-villa flex items-center justify-between py-4">
          <Link to="/" className="font-serif text-xl">
            Ekaterini <span className="text-accent">VIP</span> Villa
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            {tp.backHome}
          </Link>
        </div>
      </header>

      <main className="container-villa py-8 md:py-14">
        {success ? (
          <SuccessCard />
        ) : (
          <>
            <div className="mb-8 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                {t.booking.eyebrow}
              </span>
              <h1 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">{tp.title}</h1>
              <p className="mt-3 text-muted-foreground">{tp.subtitle}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-5">
              {/* Summary */}
              <aside className="md:col-span-2">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <img
                    src={heroAsset.url}
                    alt={tp.villa}
                    className="h-40 w-full object-cover md:h-48"
                  />
                  <div className="p-5">
                    <div className="font-serif text-xl">{tp.villa}</div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {tp.villaLocation}
                    </div>

                    <div className="mt-5 space-y-3 border-t border-border/70 pt-4 text-sm">
                      <SummaryRow
                        label={tp.dates}
                        value={
                          <>
                            {format(checkin, "dd MMM yyyy", { locale })}
                            <span className="mx-1.5 text-muted-foreground">→</span>
                            {format(checkout, "dd MMM yyyy", { locale })}
                          </>
                        }
                        hint={`${nights} ${nights === 1 ? tp.night : tp.nights}`}
                      />
                      <SummaryRow
                        label={tp.guests}
                        value={`${totalGuests}`}
                        hint={[
                          `${search.adults} ${tp.adults.toLowerCase()}`,
                          search.children > 0 ? `${search.children} ${tp.children.toLowerCase()}` : null,
                          search.infants > 0 ? `${search.infants} ${tp.infants.toLowerCase()}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      />
                    </div>

                    <Link
                      to="/"
                      className="mt-5 inline-block text-xs font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      {tp.changeDates}
                    </Link>
                  </div>
                </div>
              </aside>

              {/* Form */}
              <section className="md:col-span-3">
                <form
                  onSubmit={onSubmit}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"
                >
                  <h2 className="font-serif text-2xl">{tp.details}</h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <FormField label={tp.name} name="name" required maxLength={100} />
                    <FormField label={tp.email} name="email" type="email" required maxLength={255} />
                    <FormField label={tp.phone} name="phone" type="tel" required maxLength={50} />
                  </div>

                  <div className="mt-4">
                    <Label
                      htmlFor="message"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      {tp.message}
                    </Label>
                    <Textarea id="message" name="message" rows={4} maxLength={1000} className="mt-2" />
                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 h-12 w-full rounded-full bg-accent text-accent-foreground hover:brightness-110"
                  >
                    {submitting ? tp.submitting : tp.submit}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">{tp.microcopy}</p>
                </form>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-right">
        <div className="font-medium text-foreground">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className="mt-2"
      />
    </div>
  );
}

function SuccessCard() {
  const { t } = useI18n();
  const tp = t.bookingPage;
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-soft md:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Check className="h-7 w-7" />
      </div>
      <h1 className="mt-6 font-serif text-3xl">{tp.successTitle}</h1>
      <p className="mt-3 text-muted-foreground">{tp.successBody}</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
      >
        {tp.back}
      </Link>
    </div>
  );
}
