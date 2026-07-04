import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  MapPin,
  Menu,
  X,
  Check,
  ArrowRight,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Minus,
  Plus,
} from "lucide-react";


import { format } from "date-fns";
import { el } from "date-fns/locale";
import { toast } from "sonner";

import { useI18n, type Lang } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import heroAsset from "@/assets/villa-hero.jpg.asset.json";
const heroImg = heroAsset.url;
import logoAsset from "@/assets/logo-villa.png.asset.json";
import logoDarkAsset from "@/assets/logo-villa-dark.png.asset.json";
const logoUrl = logoAsset.url;
const logoDarkUrl = logoDarkAsset.url;
import poolAsset from "@/assets/villa/villa-pool.jpg.asset.json";
const poolImg = poolAsset.url;


export const Route = createFileRoute("/")({
  component: Landing,
});

const NAV_IDS = ["home", "villa", "rooms", "location", "booking", "contact"] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <VillaSection />
        <RoomsSection />
        <Reviews />
        <LocationSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyBookCTA />
      <Toaster position="top-center" />
    </div>
  );
}

/* ---------- Header ---------- */

function LangSwitch({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang } = useI18n();
  const opt = (l: Lang) => {
    const active = lang === l;
    return (
      <button
        key={l}
        onClick={() => setLang(l)}
        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
          active
            ? "bg-accent text-accent-foreground shadow-soft"
            : onDark
              ? "text-white/70 hover:text-white"
              : "text-foreground/60 hover:text-foreground"
        }`}
      >
        {l}
      </button>
    );
  };
  return (
    <div
      className={`flex items-center gap-1 rounded-full border p-1 backdrop-blur ${
        onDark ? "border-white/25 bg-white/5" : "border-border/60 bg-background/60"
      }`}
    >
      {opt("el")}
      {opt("en")}
    </div>
  );
}

function BrandLogo({ onDark }: { onDark: boolean }) {
  return (
    <img
      src={onDark ? logoUrl : logoDarkUrl}
      alt="Ekaterini VIP Villa — Luxury Relax Center"
      className={`w-auto transition-all ${onDark ? "h-14 md:h-20" : "h-11 md:h-14"}`}
    />
  );
}

function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const onDark = !scrolled;
  const allNav = NAV_IDS.map((id) => ({ id, label: t.nav[id] }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-villa flex items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <BrandLogo onDark={onDark} />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {allNav.map((n) => {
            const isActive = active === n.id;
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative py-2 text-[13px] font-medium tracking-wide transition-colors ${
                  onDark
                    ? isActive
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                    : isActive
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-accent"
                }`}
              >
                {n.label}
                {isActive && (
                  <span className="absolute left-1/2 -bottom-0.5 h-[2px] w-6 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch onDark={onDark} />
          <a
            href="mailto:info@katerinavipvilla.gr"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-accent-foreground shadow-soft transition hover:brightness-110"
          >
            {t.nav.book}
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`lg:hidden rounded-full p-2 ${onDark ? "text-white" : "text-foreground"}`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="container-villa flex items-center justify-between py-5">
            <img src={logoUrl} alt="Ekaterini VIP Villa" className="h-9 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-villa flex flex-col gap-1 pt-6">
            {allNav.filter((n) => n.id !== "home").map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 font-serif text-2xl"
              >
                {n.label}
              </a>
            ))}
            <a
              href="mailto:info@katerinavipvilla.gr"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              {t.nav.book}
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const { t } = useI18n();
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      <img
        src={heroImg}
        alt="Ekaterini VIP Villa στην Κρήτη"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Cinematic overlays: darker on left, breathable on right; bottom fade to seat highlights bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="container-villa relative z-10 flex min-h-[100svh] flex-col justify-end pb-52 pt-32 md:justify-center md:pb-56 md:pt-24">
        <div className="max-w-4xl text-white">

          <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]">
            Ekaterini <span className="text-accent">VIP</span> Villa
          </h1>
          <p className="mt-5 font-serif text-2xl leading-snug text-white/90 md:text-3xl">
            {t.hero.title}
          </p>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-base">
            {t.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="mailto:info@katerinavipvilla.gr"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#villa"
              className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {t.hero.cta2}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Premium booking search bar */}
      <div className="absolute inset-x-0 bottom-6 z-10 md:bottom-10">
        <div className="container-villa">
          <BookingBar />
        </div>
      </div>

    </section>
  );
}

/* ---------- Booking Bar (Hero) ---------- */

function BookingBar() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [openCal, setOpenCal] = useState<"in" | "out" | null>(null);
  const [openGuests, setOpenGuests] = useState(false);

  const total = adults + children;
  const MAX = 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fmt = (d?: Date) =>
    d ? format(d, "EEE d MMM", { locale: el }) : "Επιλέξτε ημερομηνία";

  const bump = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number,
  ) => {
    const next = current + delta;
    if (next < min) return;
    if (delta > 0 && total + delta > MAX) {
      toast.error("Η βίλα μπορεί να φιλοξενήσει έως 7 επισκέπτες.");
      return;
    }
    setter(next);
  };

  const submit = () => {
    if (!checkIn || !checkOut) {
      toast.error("Παρακαλώ επιλέξτε ημερομηνίες άφιξης και αναχώρησης.");
      return;
    }
    navigate({
      to: "/booking",
      search: {
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        adults,
        children,
        total_guests: total,
      },
    });
  };

  const fieldBase =
    "flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-accent/5";
  const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55";
  const value = "mt-0.5 text-sm font-semibold text-foreground truncate";

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-white/40 bg-[hsl(35_40%_98%)]/98 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.55)] backdrop-blur-xl">
      <div className="grid grid-cols-1 divide-y divide-border/60 md:grid-cols-[1fr_1fr_1fr_auto] md:divide-x md:divide-y-0">
        {/* Check-in */}
        <Popover open={openCal === "in"} onOpenChange={(o) => setOpenCal(o ? "in" : null)}>
          <PopoverTrigger asChild>
            <button type="button" className={fieldBase}>
              <CalendarIcon className="h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className={`block ${label}`}>Άφιξη</span>
                <span className={`block ${value} ${!checkIn && "text-foreground/50"}`}>
                  {fmt(checkIn)}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(d) => {
                setCheckIn(d);
                if (d && checkOut && d >= checkOut) setCheckOut(undefined);
                setOpenCal(d ? "out" : null);
              }}
              disabled={(d) => d < today}
              locale={el}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Check-out */}
        <Popover open={openCal === "out"} onOpenChange={(o) => setOpenCal(o ? "out" : null)}>
          <PopoverTrigger asChild>
            <button type="button" className={fieldBase}>
              <CalendarIcon className="h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className={`block ${label}`}>Αναχώρηση</span>
                <span className={`block ${value} ${!checkOut && "text-foreground/50"}`}>
                  {fmt(checkOut)}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={(d) => {
                setCheckOut(d);
                if (d) setOpenCal(null);
              }}
              disabled={(d) => d < today || (checkIn ? d <= checkIn : false)}
              locale={el}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover open={openGuests} onOpenChange={setOpenGuests}>
          <PopoverTrigger asChild>
            <button type="button" className={fieldBase}>
              <UsersIcon className="h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className={`block ${label}`}>Επισκέπτες</span>
                <span className={`block ${value}`}>
                  {total} {total === 1 ? "επισκέπτης" : "επισκέπτες"}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="start">
            <GuestRow
              label="Ενήλικες"
              sub="Από 13 ετών"
              value={adults}
              onDec={() => bump(setAdults, adults, -1, 1)}
              onInc={() => bump(setAdults, adults, +1, 1)}
            />
            <div className="my-3 h-px bg-border" />
            <GuestRow
              label="Παιδιά"
              sub="0–12 ετών"
              value={children}
              onDec={() => bump(setChildren, children, -1, 0)}
              onInc={() => bump(setChildren, children, +1, 0)}
            />
            <div className="mt-4 text-xs text-foreground/60">
              Μέγιστο {MAX} επισκέπτες συνολικά.
            </div>
          </PopoverContent>
        </Popover>

        {/* CTA */}
        <div className="p-3 md:p-2.5">
          <button
            type="button"
            onClick={submit}
            className="group flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_rgba(214,120,50,0.7)] transition hover:brightness-110 md:px-10"
          >
            Κράτηση
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestRow({
  label,
  sub,
  value,
  onDec,
  onInc,
}: {
  label: string;
  sub: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-foreground/60">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-accent hover:text-accent disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-foreground">{value}</span>
        <button
          type="button"
          onClick={onInc}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-accent hover:text-accent"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


/* ---------- Section header ---------- */

function SectionHead({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {eyebrow}
        <span className="h-px w-8 bg-accent" />
      </span>
      <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}


/* ---------- Villa ---------- */

function VillaSection() {
  const bullets = [
    "Ιδανική για οικογένειες και παρέες",
    "Ιδιωτική πισίνα και εξωτερικοί χώροι",
    "Κοντά στη θάλασσα και στα Χανιά",
    "Άμεση επικοινωνία με τη διαχείριση",
  ];

  return (
    <section id="villa" className="section-y bg-[oklch(0.97_0.012_80)]">
      <div className="container-villa">
        {/* Eyebrow label */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Η Βίλα
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        {/* Block 1 — image left / text right */}
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="relative">
            <img
              src={heroImg}
              alt="Ekaterini VIP Villa exterior with pool"
              width={1600}
              height={1067}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)]"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Ιδιωτικότητα, άνεση και{" "}
              <span className="text-accent">αυθεντική κρητική φιλοξενία</span>
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/80">
              Η Ekaterini VIP Villa βρίσκεται στην Πλάκα Αποκορώνου, στα Χανιά της Κρήτης,
              και προσφέρει έναν ιδανικό συνδυασμό άνεσης, ιδιωτικότητας και χαλάρωσης.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              Με 3 υπνοδωμάτια, ιδιωτική πισίνα, πλήρως εξοπλισμένη κουζίνα, BBQ, κήπο και
              δωρεάν ιδιωτικό πάρκινγκ, η βίλα είναι ιδανική για οικογένειες και παρέες
              έως 7 ατόμων.
            </p>
            <a
              href="#amenities"
              className="mt-8 inline-flex items-center rounded-full border border-accent px-7 py-3 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Μάθετε Περισσότερα
            </a>
          </div>
        </div>

        {/* Block 2 — text left / image right */}
        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Γιατί να επιλέξετε την Ekaterini{" "}
              <span className="text-accent">VIP</span> Villa;
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/80">
              Εδώ δεν κάνετε απλώς μια διαμονή. Έχετε τον δικό σας ιδιωτικό χώρο στην Κρήτη,
              με πισίνα, εξωτερικούς χώρους και άνεση για να απολαύσετε τις διακοπές σας
              χωρίς πίεση και χωρίς περιορισμούς.
            </p>

            <ul className="mt-8 divide-y divide-border/70 border-y border-border/70">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-4 py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>

            <a
              href="#gallery"
              className="mt-8 inline-flex items-center rounded-full border border-accent px-7 py-3 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Δείτε τη Βίλα
            </a>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={heroImg}
              alt="Ekaterini VIP Villa veranda and pool at sunset"
              width={1600}
              height={1067}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Rooms ---------- */

import villa12 from "@/assets/villa/EKATERINI-12.jpg.asset.json";
import villa7 from "@/assets/villa/EKATERINI-7.jpg.asset.json";
import villa3 from "@/assets/villa/EKATERINI-3.jpg.asset.json";
import villa6 from "@/assets/villa/EKATERINI-6.jpg.asset.json";
import villa4 from "@/assets/villa/EKATERINI-4.jpg.asset.json";
import villa17 from "@/assets/villa/EKATERINI-17.jpg.asset.json";
import villa9 from "@/assets/villa/EKATERINI-9.jpg.asset.json";
import villa10 from "@/assets/villa/EKATERINI-10.jpg.asset.json";
import villa1 from "@/assets/villa/EKATERINI-1.jpg.asset.json";
import InteractiveBentoGallery, { type MediaItemType } from "@/components/ui/interactive-bento-gallery";

const VILLA_MEDIA: MediaItemType[] = [
  {
    id: 1,
    type: "image",
    title: "Βεράντα με θέα",
    desc: "Πανοραμική θέα στη θάλασσα της Κρήτης.",
    url: villa12.url,
    span: "md:col-span-2 md:row-span-2 col-span-2 row-span-2",
  },
  {
    id: 2,
    type: "image",
    title: "Master υπνοδωμάτιο",
    desc: "Άνετο δωμάτιο με θέα στον ορίζοντα.",
    url: villa17.url,
    span: "md:col-span-1 md:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Σαλόνι με θέα",
    desc: "Φωτεινός χώρος για χαλάρωση.",
    url: villa7.url,
    span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
  },
  {
    id: 4,
    type: "image",
    title: "Καθιστικό & τραπεζαρία",
    desc: "Ενιαίος χώρος διημέρευσης.",
    url: villa3.url,
    span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
  },
  {
    id: 5,
    type: "image",
    title: "Πλήρως εξοπλισμένη κουζίνα",
    desc: "Όλα όσα χρειάζεστε για μαγείρεμα.",
    url: villa4.url,
    span: "md:col-span-2 md:row-span-2 col-span-2 row-span-2",
  },
  {
    id: 6,
    type: "image",
    title: "Κουζίνα & τραπεζαρία",
    desc: "Ζεστό ξύλινο ντεκόρ.",
    url: villa6.url,
    span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
  },
  {
    id: 7,
    type: "image",
    title: "Δίκλινο υπνοδωμάτιο",
    desc: "Ιδανικό για παρέα ή παιδιά.",
    url: villa9.url,
    span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
  },
  {
    id: 8,
    type: "image",
    title: "Δίκλινο υπνοδωμάτιο",
    desc: "Φωτεινό δωμάτιο με πρόσβαση στη βεράντα.",
    url: villa10.url,
    span: "md:col-span-1 md:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 9,
    type: "image",
    title: "Μπάνιο",
    desc: "Μπανιέρα υδρομασάζ & πλυντήριο.",
    url: villa1.url,
    span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
  },
];

function RoomsSection() {
  return (
    <section id="rooms" className="section-y bg-[oklch(0.97_0.012_80)]">
      <div className="container-villa">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Οι Χώροι Μας
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        {/* Title */}
        <h2 className="mx-auto mt-6 max-w-4xl text-center font-serif text-3xl leading-tight text-foreground md:text-5xl">
          Ανακαλύψτε τους <span className="text-accent">χώρους</span> της βίλας
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-foreground/70 md:text-base">
          Σύρετε τις εικόνες για αναδιάταξη ή πατήστε πάνω τους για μεγέθυνση.
        </p>

        <div className="mt-12 md:mt-16">
          <InteractiveBentoGallery mediaItems={VILLA_MEDIA} />
        </div>
      </div>
    </section>
  );
}



/* ---------- Amenities ---------- */

const AMENITIES = [
  {
    title: "Ιδιωτική Πισίνα",
    desc: "Απολαύστε στιγμές χαλάρωσης στον δικό σας ιδιωτικό χώρο.",
    img: poolImg,
    alt: "Ιδιωτική πισίνα",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 22c2 0 2-1.5 4-1.5S10 22 12 22s2-1.5 4-1.5S18 22 20 22s2-1.5 4-1.5S26 22 28 22" />
        <path d="M4 27c2 0 2-1.5 4-1.5S10 27 12 27s2-1.5 4-1.5S18 27 20 27s2-1.5 4-1.5S26 27 28 27" />
        <path d="M10 18V8a3 3 0 0 1 6 0" />
        <path d="M22 18V8a3 3 0 0 0-6 0" />
        <path d="M10 13h12" />
      </svg>
    ),
  },
  {
    title: "Δωρεάν Wi-Fi",
    desc: "Γρήγορη σύνδεση internet σε όλους τους χώρους της βίλας.",
    img: villa7.url,
    alt: "Σαλόνι με Wi-Fi",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 13c7-6 17-6 24 0" />
        <path d="M8 18c5-4 11-4 16 0" />
        <path d="M12 23c2.5-2 5.5-2 8 0" />
        <circle cx="16" cy="27" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Δωρεάν Πάρκινγκ",
    desc: "Ιδιωτικός χώρος στάθμευσης εντός του καταλύματος.",
    img: exteriorImg,
    alt: "Ιδιωτικός χώρος στάθμευσης",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="6" y="6" width="20" height="20" rx="4" />
        <path d="M13 22V10h5a3.5 3.5 0 0 1 0 7h-5" />
      </svg>
    ),
  },
  {
    title: "BBQ & Εξωτερικοί Χώροι",
    desc: "Ιδανικό για γεύματα, βραδινή χαλάρωση και όμορφες στιγμές με την παρέα.",
    img: verandaImg,
    alt: "BBQ και εξωτερική τραπεζαρία",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M5 13h22l-2 6a7 7 0 0 1-6.5 4.5h-5A7 7 0 0 1 7 19Z" />
        <path d="M11 9c0-1.5 1-2 1-3.5" />
        <path d="M16 9c0-1.5 1-2 1-3.5" />
        <path d="M21 9c0-1.5 1-2 1-3.5" />
        <path d="M13 23v4" />
        <path d="M19 23v4" />
      </svg>
    ),
  },
  {
    title: "Οικογενειακή Διαμονή",
    desc: "Άνετοι χώροι, παιδική χαρά και παροχές για μικρούς και μεγάλους.",
    img: bedroomImg,
    alt: "Οικογενειακή διαμονή",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="11" cy="9" r="3" />
        <circle cx="21" cy="9" r="3" />
        <path d="M5 26v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" />
        <path d="M15 26v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" />
      </svg>
    ),
  },
  {
    title: "Κοντά στην Παραλία",
    desc: "Η τοποθεσία προσφέρει εύκολη πρόσβαση στη θάλασσα και στα Χανιά.",
    img: viewImg,
    alt: "Θέα στη θάλασσα",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="16" cy="14" r="4" />
        <path d="M16 6v2M16 20v2M6 14h2M24 14h2M9 7l1.5 1.5M21.5 18.5 23 20M9 21l1.5-1.5M21.5 9.5 23 8" />
        <path d="M4 26c2 0 2-1.5 4-1.5S10 26 12 26s2-1.5 4-1.5S18 26 20 26s2-1.5 4-1.5S26 26 28 26" />
      </svg>
    ),
  },
] as const;

function Amenities() {
  return (
    <section id="amenities" className="section-y bg-[oklch(0.97_0.012_80)]">
      <div className="container-villa">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Παροχές
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        {/* Title */}
        <h2 className="mx-auto mt-6 max-w-4xl text-center font-serif text-3xl leading-tight text-foreground md:text-5xl">
          Όλα όσα χρειάζεστε για <span className="text-accent">ήρεμες</span> διακοπές
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-foreground/70">
          Η Ekaterini VIP Villa είναι εξοπλισμένη με όλες τις παροχές που θα κάνουν τη
          διαμονή σας άνετη, ξέγνοιαστη και αξέχαστη.
        </p>

        {/* Grid */}
        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => (
            <article
              key={a.title}
              className="group flex flex-col overflow-hidden rounded-3xl bg-background shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-25px_rgba(15,23,42,0.4)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={a.img}
                  alt={a.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 items-start gap-5 p-7 md:p-8">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
                  {a.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl leading-tight text-foreground md:text-2xl">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {a.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------- Reviews ---------- */

const REVIEWS = [
  {
    text: "Υπέροχη βίλα, πολύ άνετοι χώροι και εξαιρετική πισίνα. Ιδανική επιλογή για οικογένεια.",
    source: "Επισκέπτης Booking.com",
    platform: "booking",
  },
  {
    text: "Η τοποθεσία ήταν ήρεμη και η διαμονή μας πολύ ξεκούραστη. Όλα ήταν άψογα.",
    source: "Επισκέπτης Airbnb",
    platform: "airbnb",
  },
  {
    text: "Πολύ καλή επικοινωνία και όμορφος εξωτερικός χώρος. Σίγουρα θα το επιλέξουμε ξανά.",
    source: "Επισκέπτης Google",
    platform: "google",
  },
  {
    text: "Καθαριότητα, άνεση και ιδιωτικότητα. Η καλύτερη επιλογή για ήρεμες διακοπές στα Χανιά.",
    source: "Επισκέπτης Booking.com",
    platform: "booking",
  },
] as const;

function PlatformBadge({ platform }: { platform: "booking" | "airbnb" | "google" }) {
  const base = "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm";
  if (platform === "booking")
    return <div className={`${base} bg-[#003580] text-white`}>B.</div>;
  if (platform === "airbnb")
    return (
      <div className={`${base} bg-white text-[#FF5A5F] ring-1 ring-border`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2c-1.5 0-2.7.9-3.4 2.2C6.4 8.4 3 15.1 3 17.5A4.5 4.5 0 0 0 10.5 21c.6-.6 1.1-1.3 1.5-2 .4.7.9 1.4 1.5 2A4.5 4.5 0 0 0 21 17.5c0-2.4-3.4-9.1-5.6-13.3C14.7 2.9 13.5 2 12 2Zm0 2c.6 0 1.1.4 1.5 1.1 2.1 4 5.5 10.5 5.5 12.4a2.5 2.5 0 0 1-4.4 1.6c-.7-.8-1.3-1.7-1.8-2.6-.3-.6-1.3-.6-1.6 0-.5.9-1.1 1.8-1.8 2.6A2.5 2.5 0 0 1 5 17.5c0-1.9 3.4-8.4 5.5-12.4C10.9 4.4 11.4 4 12 4Z" />
        </svg>
      </div>
    );
  return (
    <div className={`${base} bg-white ring-1 ring-border`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5Z"/>
        <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22Z"/>
        <path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9.8l3.5-3.3Z"/>
        <path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 3.9 1.5l3-3A10 10 0 0 0 2.7 7.1L6.2 9.8C7 7.3 9.3 5.9 12 5.9Z"/>
      </svg>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section-y bg-[hsl(35_35%_96%)]">
      <div className="container-villa">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Εμπειρίες Επισκεπτών
          </span>
          <span className="h-px w-8 bg-primary" />
        </div>
        <h2 className="mt-6 text-center font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Τι λένε οι <span className="text-primary">επισκέπτες</span> μας
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          Η φιλοξενία και η άνεση της Ekaterini VIP Villa δημιουργούν εμπειρίες που μένουν αξέχαστες.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="group flex flex-col rounded-2xl bg-white p-7 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(15,23,42,0.15)]"
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary/70" fill="currentColor" aria-hidden="true">
                <path d="M7 7h4v4H8c0 2 1 3 3 3v3c-4 0-6-2-6-6V7Zm9 0h4v4h-3c0 2 1 3 3 3v3c-4 0-6-2-6-6V7Z"/>
              </svg>
              <div className="mt-5 flex gap-1 text-primary" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                    <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 15l-5.3 2.7 1-5.9L1.5 7.7l5.9-.8L10 1.5Z"/>
                  </svg>
                ))}
              </div>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85">
                {r.text}
              </p>
              <div className="mt-6 border-t border-border/60 pt-5 flex items-center gap-3">
                <PlatformBadge platform={r.platform} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{r.source}</div>
                  <div className="text-xs text-muted-foreground">Επαληθευμένη κριτική</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Location ---------- */


function LocationSection() {
  const { t } = useI18n();
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Plaka+Apokoronos+Chania+Crete";
  return (
    <section id="location" className="section-y bg-[oklch(0.97_0.012_80)]">
      <div className="container-villa grid gap-12 lg:grid-cols-[45fr_55fr] lg:items-center">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-8 bg-accent" />
            {t.location.eyebrow}
            <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-[1.15] text-foreground md:text-5xl">
            {t.location.title}
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-foreground/75">
            {t.location.text}
          </p>

          {/* Location card */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 flex items-center gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-[0_10px_30px_-18px_oklch(0.2_0.02_260/0.25)] transition hover:shadow-[0_18px_40px_-18px_oklch(0.2_0.02_260/0.3)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-foreground">{t.location.address}</div>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:gap-2">
                Άνοιγμα στο Google Maps
                <span aria-hidden>→</span>
              </span>
            </div>
          </a>

          {/* Benefits */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.location.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — Map */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_24px_60px_-24px_oklch(0.2_0.02_260/0.3)]">
          {/* Floating label */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 shadow-[0_8px_24px_-10px_oklch(0.2_0.02_260/0.35)] backdrop-blur">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-medium text-foreground">
              Ekaterini VIP Villa — Πλάκα Αποκορώνου
            </span>
          </div>
          <iframe
            title="Ekaterini VIP Villa location"
            src="https://www.google.com/maps?q=Plaka+Apokoronos+Chania+Crete&z=12&output=embed"
            className="h-[440px] w-full lg:h-[560px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Booking ---------- */

function BookingSection() {
  const { t } = useI18n();
  const perks = [
    "Άμεση απάντηση σε αίτημα κράτησης",
    "Ευέλικτες ημερομηνίες check-in / check-out",
    "Χωρίς κρυφές χρεώσεις",
    "Προσωπική εξυπηρέτηση στα Ελληνικά & Αγγλικά",
  ];
  return (
    <section id="booking" className="section-y bg-[oklch(0.22_0.02_260)] text-white">
      <div className="container-villa">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-8 bg-accent" />
              {t.booking.eyebrow}
              <span className="h-px w-8 bg-accent" />
            </span>
            <h2 className="mt-5 font-serif text-3xl leading-tight md:text-5xl">
              Ζητήστε τη δική σας <span className="text-accent">διαμονή</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-white/75">
              Στείλτε μας τις ημερομηνίες που σας ενδιαφέρουν και τον αριθμό των επισκεπτών.
              Θα σας απαντήσουμε σύντομα με διαθεσιμότητα και προσφορά.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 shadow-2xl backdrop-blur md:p-10">
            <div className="font-serif text-2xl md:text-3xl">Έτοιμοι να κλείσετε;</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Επικοινωνήστε απευθείας μαζί μας για διαθεσιμότητα και προσφορά — απαντάμε σε λίγες ώρες.
            </p>
            <div className="mt-8 space-y-3">
              <a
                href="mailto:info@katerinavipvilla.gr?subject=Αίτημα Κράτησης - Ekaterini VIP Villa"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
              >
                Αίτημα Κράτησης
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+306940133837"
                className="flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Κλήση: +30 6940 133 837
              </a>
            </div>
            <div className="mt-6 text-center text-xs text-white/60">
              Απαντάμε στα Ελληνικά και στα Αγγλικά
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

function ContactSection() {
  const { t } = useI18n();
  const items = [
    {
      label: "Email",
      value: "info@katerinavipvilla.gr",
      href: "mailto:info@katerinavipvilla.gr",
    },
    {
      label: "Τηλέφωνο",
      value: "+30 6940 133 837",
      href: "tel:+306940133837",
    },
    {
      label: "Τηλέφωνο",
      value: "+30 6948 014 277",
      href: "tel:+306948014277",
    },
    {
      label: "Διεύθυνση",
      value: "Plaka Apokoronos, 73008 Chania, Crete",
      href: "https://www.google.com/maps/search/?api=1&query=Plaka+Apokoronos+Chania+Crete",
    },
  ];
  return (
    <section id="contact" className="section-y bg-[oklch(0.97_0.012_80)]">
      <div className="container-villa">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {t.contact.eyebrow}
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        <h2 className="mx-auto mt-6 max-w-3xl text-center font-serif text-3xl leading-tight text-foreground md:text-5xl">
          Ας <span className="text-accent">μιλήσουμε</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-foreground/70">
          {t.contact.text}
        </p>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {items.map((it, i) => (
            <a
              key={i}
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel={it.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-center gap-5 rounded-2xl border border-border/60 bg-background p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {it.label}
                </div>
                <div className="mt-1 font-medium text-foreground group-hover:text-accent">
                  {it.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------- Footer ---------- */

function Footer() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();
  const links = NAV_IDS.filter((i) => i !== "home").map((id) => ({ id, l: t.nav[id] }));
  const amenitiesList =
    lang === "el"
      ? ["Πισίνα", "Wi-Fi", "Parking", "BBQ", "Κήπος"]
      : ["Pool", "Wi-Fi", "Parking", "BBQ", "Garden"];
  return (
    <footer className="border-t border-border bg-[hsl(35_35%_96%)] text-foreground">
      <div className="container-villa py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl">
              Ekaterini <span className="text-accent">VIP</span> Villa
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <a
              href="mailto:info@katerinavipvilla.gr"
              className="mt-4 inline-block text-sm text-muted-foreground hover:text-accent"
            >
              info@katerinavipvilla.gr
            </a>
            
          </div>

          {/* Navigation */}
          <div>
            <div className="text-base font-semibold text-foreground">
              {t.footer.explore}
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-muted-foreground hover:text-accent">
                    {l.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          <div>
            <div className="text-base font-semibold text-foreground">
              {t.footer.amenitiesCol}
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {amenitiesList.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-base font-semibold text-foreground">
              {t.footer.contactCol}
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>Plaka Apokoronos, Chania</li>
              <li><a className="hover:text-accent" href="tel:+306940133837">+30 6940 133 837</a></li>
              <li><a className="hover:text-accent" href="tel:+306948014277">+30 6948 014 277</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          © {year} Ekaterini VIP Villa. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}


/* ---------- Sticky mobile CTA ---------- */

function StickyBookCTA() {
  const { t } = useI18n();
  return (
    <a
      href="mailto:info@katerinavipvilla.gr"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-soft md:hidden"
    >
      {t.nav.book}
    </a>
  );
}
