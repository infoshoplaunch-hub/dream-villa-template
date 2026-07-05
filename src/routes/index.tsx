import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Lock,
  ChevronDown,
  MountainSnow as MountainSnowIcon,
  UtensilsCrossed as UtensilsCrossedIcon,
  ShieldCheck as ShieldCheckIcon,
  Award as AwardIcon,
  KeyRound as KeyRoundIcon,
  Zap as ZapIcon,
  BadgeCheck as BadgeCheckIcon,
} from "lucide-react";
import { ParkingIcon, WifiIcon, PoolIcon } from "@/components/villa-icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLuxReveal, useLuxMagnetic } from "@/hooks/use-lux-reveal";



import { format, parseISO, isSameDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { el } from "date-fns/locale";
import { toast } from "sonner";

import { useI18n, translateAmenity, type Lang } from "@/lib/i18n";
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
import villaExteriorDayAsset from "@/assets/villa/villa-exterior-day.jpg.asset.json";
const villaExteriorDayImg = villaExteriorDayAsset.url;
import villaLivingRoomAsset from "@/assets/villa/EKATERINI-33.jpg.asset.json";
const villaLivingRoomImg = villaLivingRoomAsset.url;

const VIBER_CONTACT_LINK = "viber://chat?number=+306999999999";

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.012 0C5.372 0 0 5.373 0 11.988c0 2.17.585 4.284 1.692 6.13L.276 23.723l5.748-1.898c1.7.9 3.7 1.4 5.988 1.538 6.64 0 12.012-5.373 12.012-11.988C24.024 5.373 18.652 0 12.012 0zm6.568 16.56c-.277.78-1.51 1.434-2.116 1.51-.555.075-1.085.252-3.657-.78-3.1-1.235-5.09-4.41-5.24-4.61-.15-.202-1.26-1.664-1.26-3.176 0-1.512.793-2.243 1.083-2.546.29-.302.63-.378.84-.378.21 0 .42 0 .6.013.21.013.487-.075.756.555.277.655.932 2.28 1.008 2.445.076.164.126.354.024.58-.1.227-.15.366-.3.555-.15.19-.315.403-.453.555-.15.164-.3.34-.126.656.176.315.793 1.31 1.7 2.118 1.17 1.032 2.152 1.36 2.467 1.512.315.15.504.125.69-.09.19-.214.805-1.01 1.02-1.36.214-.35.428-.29.717-.156.29.134 1.85 1.035 2.165 1.225.314.19.53.29.605.45.075.16.05.788-.226 1.57z" />
    </svg>
  );
}

export const Route = createFileRoute("/")({
  component: Landing,
});

const NAV_IDS = ["home", "villa", "rooms", "location", "booking", "contact"] as const;

function Landing() {
  useLuxReveal();
  useLuxMagnetic();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <VillaSection />
        <RoomsSection />
        <AmenitiesSection />
        <AvailabilitySection />
        <Reviews />
        <LocationSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
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
          <Link
            to="/gallery"
            className={`relative py-2 text-[13px] font-medium tracking-wide transition-colors ${
              onDark ? "text-white/75 hover:text-white" : "text-foreground/70 hover:text-accent"
            }`}
          >
            {t.nav.gallery}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch onDark={onDark} />
          <a
            href="#booking-bar"
            className="btn-lux btn-lux-primary hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-accent-foreground shadow-soft"
            data-magnetic
          >
            {t.nav.book}
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label={t.nav.openMenu}
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
            <button onClick={() => setOpen(false)} aria-label={t.nav.closeMenu}>
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
            <Link
              to="/gallery"
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-4 font-serif text-2xl"
            >
              {t.nav.gallery}
            </Link>
            <a
              href="#booking-bar"
              onClick={() => setOpen(false)}
              className="btn-lux btn-lux-primary mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
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
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Parallax: bg image moves slower than content on scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Golden particles
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: `${(i * 53) % 100}%`,
        top: `${60 + ((i * 17) % 35)}%`,
        size: 2 + ((i * 7) % 4),
        opacity: 0.15 + ((i * 13) % 25) / 100,
        dx: `${-30 + ((i * 11) % 60)}px`,
        dur: `${12 + ((i * 3) % 10)}s`,
        delay: `${(i * 0.7) % 8}s`,
      })),
    [],
  );

  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-black">
      {/* Parallax background wrapper */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <div className="hero-kenburns absolute inset-0">
          <img
            src={heroImg}
            alt={t.hero.imgAlt}
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Left dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />
      {/* Warm golden sunset glow on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 70% at 90% 40%, rgba(255,170,90,0.28) 0%, rgba(255,140,60,0.12) 35%, transparent 70%)",
        }}
      />
      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Subtle radial light behind headline */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-5%",
          top: "25%",
          width: "70%",
          height: "55%",
          background:
            "radial-gradient(closest-side, rgba(255,220,180,0.18), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {/* Gentle lens flare from the sunset */}
      <div
        className="hero-flare absolute pointer-events-none"
        style={{
          right: "6%",
          top: "22%",
          width: "260px",
          height: "260px",
          background:
            "radial-gradient(closest-side, rgba(255,205,140,0.55), rgba(255,170,80,0.15) 45%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* Pool shimmer reflection band */}
      <div className="absolute inset-x-0 bottom-[18%] h-24 overflow-hidden pointer-events-none">
        <div
          className="hero-shimmer absolute inset-y-0 w-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Floating golden particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p: typeof particles[number], i: number) => (
          <span
            key={i}
            className="hero-particle absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "rgba(255,205,140,0.9)",
              boxShadow: "0 0 6px rgba(255,190,120,0.6)",
              ["--p-opacity" as string]: p.opacity,
              ["--p-dx" as string]: p.dx,
              ["--p-dur" as string]: p.dur,
              ["--p-delay" as string]: p.delay,
            }}
          />
        ))}
      </div>

      {/* Bottom fade to blend into next section */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-background via-black/70 to-transparent pointer-events-none" />

      <div className="container-villa relative z-10 flex min-h-[100svh] flex-col justify-end pb-80 pt-32 md:justify-center md:pb-56 md:pt-24">
        <div className="max-w-4xl text-white">
          <h1
            className="hero-fade-up mt-4 md:mt-6 font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[96px] drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "0.15s" }}
          >
            Ekaterini <span className="text-accent">VIP</span> Villa
          </h1>
          <p
            className="hero-fade-up mt-5 md:mt-8 font-serif text-2xl leading-snug text-white/95 md:text-3xl"
            style={{ animationDelay: "0.35s" }}
          >
            {t.hero.title}
          </p>

          <p
            className="hero-fade-up mt-5 md:mt-7 max-w-xl text-[15px] leading-[1.75] text-white/85 md:text-base"
            style={{ animationDelay: "0.5s" }}
          >
            {t.hero.subtitle}
          </p>

          <div className="mt-6 md:mt-10 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
            <a
              href="#booking-bar"
              className="btn-lux hero-fade-up inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 md:w-auto md:border-transparent md:bg-accent md:py-4 md:text-accent-foreground md:shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] md:hover:bg-accent/90"
              style={{ animationDelay: "0.7s" }}
              data-magnetic
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#villa"
              className="btn-lux hero-fade-up inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 md:w-auto md:border-white/50 md:bg-white/5 md:py-4"
              style={{ animationDelay: "0.85s" }}
              data-magnetic
            >
              {t.hero.cta2}
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* Mobile-only Viber CTA */}
            <a
              href={VIBER_CONTACT_LINK}
              className="btn-lux md:hidden inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ViberIcon className="h-4 w-4" />
              {t.hero.viber}
            </a>
          </div>
          <p className="md:hidden mt-2 text-center text-xs text-white/70">
            {t.hero.viberHelper}
          </p>
        </div>
      </div>

      {/* Premium booking search bar with glassmorphism */}
      <div
        className="absolute inset-x-0 bottom-8 z-10 md:bottom-10 hero-fade-up"
        style={{ animationDelay: "1s" }}
      >
        <div className="container-villa">
          <BookingBar />
        </div>
      </div>

    </section>
  );
}


/* ---------- Booking Bar (Hero) ---------- */

function BookingBar() {
  const { t, lang } = useI18n();
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

  const blockedQuery = useQuery({
    queryKey: ["blocked_dates_public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blocked_dates").select("date");
      if (error) throw error;
      return (data ?? []).map((r) => parseISO(r.date));
    },
    staleTime: 60_000,
  });
  const blockedDates = blockedQuery.data ?? [];
  const isBlocked = (d: Date) => blockedDates.some((b) => isSameDay(b, d));

  const dateLocale = lang === "el" ? el : undefined;
  const fmt = (d?: Date) =>
    d ? format(d, "EEE d MMM", { locale: dateLocale }) : t.bookingBar.pickDate;

  const bump = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number,
  ) => {
    const next = current + delta;
    if (next < min) return;
    if (delta > 0 && total + delta > MAX) {
      toast.error(t.bookingBar.errMaxGuests);
      return;
    }
    setter(next);
  };

  const submit = () => {
    if (!checkIn || !checkOut) {
      toast.error(t.bookingBar.errDates);
      return;
    }
    const hasBlocked = blockedDates.some((b) => b >= checkIn && b < checkOut);
    if (hasBlocked) {
      toast.error(t.bookingBar.errBlocked);
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
    "flex w-full items-center gap-3 px-5 py-3 md:py-4 text-left transition hover:bg-accent/5";
  const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55";
  const value = "mt-0.5 text-sm font-semibold text-foreground truncate";

  return (
    <div id="booking-bar" className="mx-auto w-[calc(100%-32px)] max-w-[420px] md:w-full md:max-w-5xl rounded-3xl border border-white/40 bg-[hsl(35_40%_98%)]/98 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.55)] backdrop-blur-xl">
      <div className="grid grid-cols-1 divide-y divide-border/60 md:grid-cols-[1fr_1fr_1fr_auto] md:divide-x md:divide-y-0">
        {/* Check-in */}
        <Popover open={openCal === "in"} onOpenChange={(o) => setOpenCal(o ? "in" : null)}>
          <PopoverTrigger asChild>
            <button type="button" className={fieldBase}>
              <CalendarIcon className="h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className={`block ${label}`}>{t.bookingBar.arrival}</span>
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
              disabled={(d) => d < today || isBlocked(d)}
              modifiers={{ blocked: blockedDates }}
              modifiersClassNames={{ blocked: "line-through text-foreground/40" }}
              locale={dateLocale}
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
                <span className={`block ${label}`}>{t.bookingBar.departure}</span>
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
              disabled={(d) => d < today || (checkIn ? d <= checkIn : false) || isBlocked(d)}
              modifiers={{ blocked: blockedDates }}
              modifiersClassNames={{ blocked: "line-through text-foreground/40" }}
              locale={dateLocale}
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
                <span className={`block ${label}`}>{t.bookingBar.guests}</span>
                <span className={`block ${value}`}>
                  {total} {total === 1 ? t.bookingBar.guestSingular : t.bookingBar.guestPlural}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="start">
            <GuestRow
              label={t.bookingBar.adults}
              sub={t.bookingBar.adultsSub}
              value={adults}
              onDec={() => bump(setAdults, adults, -1, 1)}
              onInc={() => bump(setAdults, adults, +1, 1)}
            />
            <div className="my-3 h-px bg-border" />
            <GuestRow
              label={t.bookingBar.children}
              sub={t.bookingBar.childrenSub}
              value={children}
              onDec={() => bump(setChildren, children, -1, 0)}
              onInc={() => bump(setChildren, children, +1, 0)}
            />
            <div className="mt-4 text-xs text-foreground/60">
              {t.bookingBar.maxNote}
            </div>
          </PopoverContent>
        </Popover>

        {/* CTA */}
        <div className="p-2 md:p-2.5">
          <button
            type="button"
            onClick={submit}
            data-magnetic
            className="btn-lux btn-lux-primary flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-3 md:py-4 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_rgba(214,120,50,0.7)] md:px-10"
          >
            {t.bookingBar.cta}
            <ArrowRight className="h-4 w-4" />
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
  const { t } = useI18n();
  const bullets = t.villa.bullets;

  return (
    <section id="villa" className="section-y-flow-top surface-warm-to-b">
      <div className="container-villa">
        {/* Eyebrow label */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {t.villa.eyebrow}
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        {/* Block 1 — image left / text right */}
        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 md:items-center md:gap-14">
          <div className="relative">
            <img
              src={villaExteriorDayImg}
              alt={t.villa.imgAltExterior}
              width={1600}
              height={1067}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)]"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
              {t.villa.block1TitleA}
              <span className="text-accent">{t.villa.block1TitleB}</span>
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/80">
              {t.villa.block1P1}
            </p>
            <p className="mt-3 leading-relaxed text-foreground/80">
              {t.villa.block1P2}
            </p>
            <a
              href="#amenities"
              className="btn-lux btn-lux-secondary mt-6 inline-flex items-center rounded-full border border-accent px-7 py-3 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground"
            >
              {t.villa.learnMore}
            </a>
          </div>
        </div>

        {/* Block 2 — text left / image right */}
        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2 md:items-center md:gap-14">

          <div className="order-2 md:order-1">
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-5xl">
              {t.villa.block2TitleA}
              <span className="text-accent">{t.villa.block2TitleB}</span>
              {t.villa.block2TitleC}
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/80">
              {t.villa.block2P}
            </p>

            <ul className="mt-6 divide-y divide-border/70 border-y border-border/70">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/gallery"
              className="btn-lux btn-lux-secondary mt-6 inline-flex items-center rounded-full border border-accent px-7 py-3 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground"
            >
              {t.villa.seeVilla}
            </Link>

          </div>
          <div className="order-1 md:order-2">
            <img
              src={villaLivingRoomImg}
              alt={t.villa.imgAltLiving}
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

const VILLA_MEDIA_SPECS: { id: number; url: string; span: string }[] = [
  { id: 1, url: villa12.url, span: "md:col-span-2 md:row-span-2 col-span-2 row-span-2" },
  { id: 2, url: villa17.url, span: "md:col-span-1 md:row-span-2 col-span-1 row-span-2" },
  { id: 3, url: villa7.url, span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1" },
  { id: 4, url: villa3.url, span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1" },
  { id: 5, url: villa4.url, span: "md:col-span-2 md:row-span-2 col-span-2 row-span-2" },
  { id: 6, url: villa6.url, span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1" },
  { id: 7, url: villa9.url, span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1" },
  { id: 8, url: villa10.url, span: "md:col-span-1 md:row-span-2 col-span-1 row-span-2" },
  { id: 9, url: villa1.url, span: "md:col-span-1 md:row-span-1 col-span-1 row-span-1" },
];

function RoomsSection() {
  const { t } = useI18n();
  const media: MediaItemType[] = VILLA_MEDIA_SPECS.map((s, i) => ({
    id: s.id,
    type: "image",
    title: t.rooms.media[i]?.title ?? "",
    desc: t.rooms.media[i]?.desc ?? "",
    url: s.url,
    span: s.span,
  }));
  return (
    <section id="rooms" className="section-y-flow-bottom surface-warm">
      <div className="container-villa">
        {/* subtle divider connecting from the Villa story above */}
        <div aria-hidden className="mx-auto mb-10 h-px w-24 bg-accent/40 md:mb-14" />

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {t.rooms.eyebrow}
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        {/* Title */}
        <h2 className="mx-auto mt-5 max-w-4xl text-center font-serif text-3xl leading-tight text-foreground md:text-5xl">
          {t.rooms.titleA}
          <span className="text-accent">{t.rooms.titleB}</span>
          {t.rooms.titleC}
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-foreground/70 md:text-base">
          {t.rooms.subtitle}
        </p>

        <div className="mt-8 md:mt-12">
          <InteractiveBentoGallery mediaItems={media} />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/gallery"
            className="btn-lux btn-lux-secondary inline-flex items-center gap-2 rounded-full border border-accent px-8 py-4 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground"
          >
            {t.rooms.seeAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ---------- Amenities ---------- */

import {
  POPULAR_AMENITIES,
  PREVIEW_AMENITIES,
  AMENITY_CATEGORIES,
  TOTAL_AMENITIES_COUNT,
} from "@/data/amenities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Waves,
  Flame,
  TreePine,
  Umbrella,
  MountainSnow,
  Snowflake,
  Tv,
  Bed,
  Sofa,
  UtensilsCrossed,
  Coffee,
  Utensils,
  Refrigerator,
  WashingMachine,
  Wifi,
  Car,
  Wind,
  Users,
  Palmtree,
  type LucideIcon,
} from "lucide-react";

type AmenityChip = { label: string; icon: LucideIcon };
type AmenityGroup = {
  title: string;
  description: string;
  icon: LucideIcon;
  items: AmenityChip[];
};

const AMENITY_GROUPS: AmenityGroup[] = [
  {
    title: "Εξωτερικοί Χώροι",
    description: "Απολαύστε τον ήλιο, τη θέα και την ιδιωτικότητα.",
    icon: Palmtree,
    items: [
      { label: "Ιδιωτική Πισίνα", icon: Waves },
      { label: "Χώρος BBQ", icon: Flame },
      { label: "Κήπος", icon: TreePine },
      { label: "Ξαπλώστρες", icon: Umbrella },
      { label: "Βεράντα με Θέα Θάλασσας", icon: MountainSnow },
    ],
  },
  {
    title: "Άνεση & Χαλάρωση",
    description: "Ζεστοί χώροι, σχεδιασμένοι για ήρεμες στιγμές.",
    icon: Sofa,
    items: [
      { label: "Κλιματισμός", icon: Snowflake },
      { label: "Smart TV", icon: Tv },
      { label: "Υπνοδωμάτια Πολυτελείας", icon: Bed },
      { label: "Ευρύχωρο Σαλόνι", icon: Sofa },
    ],
  },
  {
    title: "Κουζίνα & Τραπεζαρία",
    description: "Πλήρως εξοπλισμένη κουζίνα για κάθε γεύμα.",
    icon: UtensilsCrossed,
    items: [
      { label: "Πλήρως Εξοπλισμένη Κουζίνα", icon: UtensilsCrossed },
      { label: "Μηχανή Καφέ", icon: Coffee },
      { label: "Τραπεζαρία", icon: Utensils },
      { label: "Ψυγείο", icon: Refrigerator },
      { label: "Φούρνος", icon: Flame },
      { label: "Πλυντήριο Πιάτων", icon: WashingMachine },
    ],
  },
  {
    title: "Βασικές Παροχές",
    description: "Ό,τι χρειάζεστε για μια ξένοιαστη διαμονή.",
    icon: Wifi,
    items: [
      { label: "Wi-Fi Υψηλής Ταχύτητας", icon: Wifi },
      { label: "Ιδιωτικό Πάρκινγκ", icon: Car },
      { label: "Πλυντήριο Ρούχων", icon: WashingMachine },
      { label: "Στεγνωτήρας Μαλλιών", icon: Wind },
      { label: "Οικογενειακή Φιλοξενία", icon: Users },
    ],
  },
];

function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AmenityCard({ group, index }: { group: AmenityGroup; index: number }) {
  const Icon = group.icon;
  return (
    <article
      className="amenity-fade-up group relative flex flex-col rounded-[20px] border border-border/60 bg-[oklch(0.98_0.008_85)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.28)] md:p-8"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/5 text-accent transition-all duration-300 group-hover:scale-105 group-hover:border-accent/60 group-hover:bg-accent/10">
          <Icon className="h-7 w-7 transition-transform duration-500 group-hover:-rotate-3" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-tight text-foreground md:text-2xl">
            {group.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
            {group.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Chips */}
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {group.items.map(({ label, icon: ChipIcon }) => (
          <li
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/60 px-3.5 py-2.5 text-sm text-foreground/80 transition-all duration-250 hover:border-accent/40 hover:bg-accent/[0.04] hover:text-foreground"
          >
            <ChipIcon className="h-4 w-4 shrink-0 text-accent/80" strokeWidth={1.75} />
            <span className="truncate">{label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function AmenitiesSection() {
  const { t, lang } = useI18n();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  // Merge translation text with icon definitions from AMENITY_GROUPS
  const groups = AMENITY_GROUPS.map((g, i) => {
    const tGroup = t.amenities.groups[i];
    return {
      icon: g.icon,
      title: tGroup?.title ?? g.title,
      description: tGroup?.description ?? g.description,
      items: g.items.map((it, j) => ({
        icon: it.icon,
        label: tGroup?.items[j] ?? it.label,
      })),
    };
  });
  return (
    <section id="amenities" className="section-y bg-background">
      <div className="container-villa">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {t.amenities.eyebrow}
          </span>
          <span className="h-px w-10 bg-accent" />
        </div>

        <h2 className="mx-auto mt-5 max-w-4xl text-center font-serif text-3xl leading-tight text-foreground md:text-5xl">
          {t.amenities.titleA}
          <span className="text-accent">{t.amenities.titleB}</span>
          {t.amenities.titleC}
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-foreground/70 md:text-base">
          {t.amenities.subtitle}
        </p>

        {/* 4 premium category cards */}
        <div
          ref={ref}
          data-lux-stagger
          className={`mx-auto mt-12 grid max-w-6xl gap-6 md:mt-14 md:grid-cols-2 md:gap-8 ${inView ? "amenity-in-view" : ""}`}

        >
          {groups.map((group, i) => (
            <AmenityCard key={group.title} group={group} index={i} />
          ))}
        </div>

        {/* Full list dialog */}
        <div className="mt-10 flex justify-center md:mt-14">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="btn-lux btn-lux-secondary inline-flex items-center rounded-full border border-accent px-7 py-3 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground"
              >
                {t.amenities.showAll(TOTAL_AMENITIES_COUNT)}
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground md:text-3xl">
                  {t.amenities.dialogTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-8">
                {AMENITY_CATEGORIES.map((cat) => (
                  <section key={cat.title}>
                    <h4 className="font-serif text-lg font-semibold text-foreground">
                      {translateAmenity(cat.title, lang)}
                    </h4>
                    <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {cat.items.map(({ label, icon: Icon }) => (
                        <li
                          key={label}
                          className="flex items-center gap-3 border-b border-border/40 pb-2 text-foreground/85"
                        >
                          <Icon
                            className="h-[18px] w-[18px] shrink-0 text-foreground/70"
                            strokeWidth={1.75}
                          />
                          <span className="text-sm">{translateAmenity(label, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}


/* ---------- Availability Calendar Section ---------- */

function AvailabilitySection() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [openGuests, setOpenGuests] = useState(false);

  const total = adults + children;
  const MAX = 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blockedQuery = useQuery({
    queryKey: ["blocked_dates_public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blocked_dates").select("date");
      if (error) throw error;
      return (data ?? []).map((r) => parseISO(r.date));
    },
    staleTime: 60_000,
  });
  const blockedDates = blockedQuery.data ?? [];
  const isBlocked = (d: Date) => blockedDates.some((b) => isSameDay(b, d));

  const bump = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number,
  ) => {
    const next = current + delta;
    if (next < min) return;
    if (delta > 0 && total + delta > MAX) {
      toast.error(t.availability.errMaxGuests);
      return;
    }
    setter(next);
  };

  const submit = () => {
    if (!range?.from || !range?.to) {
      toast.error(t.availability.errDates);
      return;
    }
    const nights = Math.round((range.to.getTime() - range.from.getTime()) / 86400000);
    if (nights < 3) {
      toast.error(t.availability.errMinNights);
      return;
    }
    const hasBlocked = blockedDates.some((b) => b >= range.from! && b < range.to!);
    if (hasBlocked) {
      toast.error(t.availability.errBlocked);
      return;
    }
    navigate({
      to: "/booking",
      search: {
        check_in: format(range.from, "yyyy-MM-dd"),
        check_out: format(range.to, "yyyy-MM-dd"),
        adults,
        children,
        total_guests: total,
      },
    });
  };

  const fmtDate = (d?: Date) => (d ? format(d, "d/M/yyyy") : t.availability.pickPlaceholder);
  const fieldLabel = "text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55";

  const nights =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000)
      : 0;
  const hasRange = Boolean(range?.from && range?.to);

  const highlightIcons = [UsersIcon, PoolIcon, MountainSnowIcon, UtensilsCrossedIcon, ParkingIcon, WifiIcon];
  const highlights = t.availability.highlights.map((label, i) => ({ label, icon: highlightIcons[i] }));

  const bookDirectPoints = t.availability.bookDirectPoints;

  const trustIcons = [ShieldCheckIcon, AwardIcon, KeyRoundIcon, ZapIcon];
  const trustStrip = t.availability.trust.map((label, i) => ({ label, icon: trustIcons[i] }));

  return (
    <section id="availability" className="bg-background">
      {/* ===== Booking content ===== */}
      <div className="section-y-flow-top">
        <div className="container-villa">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-10">
            {/* ============ LEFT COLUMN ============ */}
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
                  <span className="h-px w-8 bg-accent" />
                  {t.availability.eyebrow}
                </span>
                <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
                  {t.availability.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70 md:text-base">
                  {t.availability.subtitle}
                </p>
              </div>

              {/* Highlights card */}
              <div className="rounded-[20px] border border-border/60 bg-[oklch(0.98_0.008_85)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.25)] md:p-7">
                <h4 className="font-serif text-lg text-foreground md:text-xl">
                  {t.availability.experienceTitle}
                </h4>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map(({ label, icon: Icon }) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-foreground/85">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                        {Icon ? <Icon className="h-4 w-4" strokeWidth={1.75} /> : null}
                      </span>
                      <span className="min-w-0">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Direct card */}
              <div className="rounded-[20px] border border-border/60 bg-[oklch(0.98_0.008_85)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.25)] md:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                    <BadgeCheckIcon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h4 className="font-serif text-lg text-foreground md:text-xl">
                    {t.availability.bookDirectTitle}
                  </h4>
                </div>
                <ul className="mt-5 space-y-4">
                  {bookDirectPoints.map((p) => (
                    <li key={p.title} className="flex gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={2.25} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{p.title}</div>
                        <div className="mt-0.5 text-sm text-foreground/65">{p.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={submit}
                  className="btn-lux btn-lux-primary mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#C86B4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(200,107,74,0.6)] hover:bg-[#b25c3d]"
                  data-magnetic
                >
                  {t.availability.bookNowCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ============ RIGHT COLUMN ============ */}
            <div className="space-y-6">
              {/* Calendar card */}
              <div className="rounded-[20px] border border-border/50 bg-[#FAF7F1] p-5 shadow-[0_20px_60px_-30px_rgba(23,33,43,0.22)] md:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl text-foreground md:text-2xl">
                    {t.availability.calendarTitle}
                  </h3>
                  <span className="text-xs font-medium text-foreground/55">
                    {hasRange
                      ? `${nights} ${nights === 1 ? t.availability.nightSingular : t.availability.nightPlural}`
                      : t.availability.minNights}
                  </span>
                </div>

                <div className="mt-6 booking-calendar w-full">
                  <Calendar
                    mode="range"
                    selected={range as any}
                    onSelect={(r: any) => setRange(r)}
                    numberOfMonths={isMobile ? 1 : 2}
                    min={3}
                    disabled={(d) => d < today || isBlocked(d)}
                    modifiers={{ blocked: blockedDates }}
                    modifiersClassNames={{ blocked: "line-through opacity-40" }}
                    locale={lang === "el" ? el : undefined}
                    className="p-0 pointer-events-auto w-full [--cell-size:2.5rem] sm:[--cell-size:2.75rem] lg:[--cell-size:2.6rem] text-[15px]"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#17212B]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setRange(undefined)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#17212B]/70 underline underline-offset-4 decoration-[#17212B]/25 transition hover:text-[#17212B] hover:decoration-[#17212B]"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {t.availability.clearDates}
                  </button>
                  <div className="hidden items-center gap-4 text-xs text-foreground/55 sm:flex">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#C86B4A]" />
                      {t.availability.selected}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full border border-foreground/30 bg-transparent" />
                      {t.availability.unavailable}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking summary card */}
              <div className="rounded-[20px] border border-border/60 bg-white p-5 shadow-[0_20px_50px_-25px_rgba(23,33,43,0.2)] md:p-7">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <div className={fieldLabel}>{t.availability.arrival}</div>
                    <div className={`mt-1.5 text-sm font-semibold ${range?.from ? "text-foreground" : "text-foreground/40"}`}>
                      {fmtDate(range?.from)}
                    </div>
                  </div>
                  <div>
                    <div className={fieldLabel}>{t.availability.departure}</div>
                    <div className={`mt-1.5 text-sm font-semibold ${range?.to ? "text-foreground" : "text-foreground/40"}`}>
                      {fmtDate(range?.to)}
                    </div>
                  </div>
                  <div>
                    <div className={fieldLabel}>{t.availability.nights}</div>
                    <div className={`mt-1.5 text-sm font-semibold ${hasRange ? "text-foreground" : "text-foreground/40"}`}>
                      {hasRange ? nights : "—"}
                    </div>
                  </div>
                  <div>
                    <Popover open={openGuests} onOpenChange={setOpenGuests}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="group flex w-full flex-col items-start text-left"
                        >
                          <span className={fieldLabel}>{t.availability.guests}</span>
                          <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                            {total}
                            <ChevronDown className="h-3.5 w-3.5 text-foreground/50 transition group-hover:text-foreground" />
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-4" align="end">
                        <div className="space-y-4">
                          {[
                            { label: t.availability.adults, value: adults, setter: setAdults, min: 1 },
                            { label: t.availability.children, value: children, setter: setChildren, min: 0 },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">{row.label}</span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => bump(row.setter, row.value, -1, row.min)}
                                  className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-foreground/70 transition hover:border-accent hover:text-accent disabled:opacity-40"
                                  disabled={row.value <= row.min}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{row.value}</span>
                                <button
                                  type="button"
                                  onClick={() => bump(row.setter, row.value, 1, row.min)}
                                  className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-foreground/70 transition hover:border-accent hover:text-accent"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-foreground/60">{t.availability.maxNote}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex items-center gap-2 text-xs">
                    <span
                      className={`h-2 w-2 rounded-full ${hasRange ? "bg-emerald-500" : "bg-foreground/25"}`}
                    />
                    <span className="text-foreground/70">
                      {hasRange
                        ? nights >= 3
                          ? t.availability.readyToBook
                          : t.availability.minNights
                        : t.availability.pickToContinue}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={submit}
                    data-magnetic
                    className="btn-lux btn-lux-primary inline-flex items-center justify-center gap-2 rounded-full bg-[#C86B4A] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(200,107,74,0.6)] hover:bg-[#b25c3d]"
                  >
                    {t.availability.bookCta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-foreground/55">
                  <Lock className="h-3 w-3" />
                  {t.availability.noChargeYet}
                </p>
              </div>
            </div>
          </div>

          {/* ===== Trust strip ===== */}
          <div className="mt-12 border-t border-border/60 pt-8 md:mt-16 md:pt-10">
            <ul data-lux-stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {trustStrip.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-border/60 hover:bg-[oklch(0.98_0.008_85)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium text-foreground/85">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}







const REVIEW_PLATFORMS = ["booking", "airbnb", "google", "booking"] as const;

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
  const { t } = useI18n();
  return (
    <section id="reviews" className="section-y bg-[hsl(35_35%_96%)]">
      <div className="container-villa">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t.reviews.eyebrow}
          </span>
          <span className="h-px w-8 bg-primary" />
        </div>
        <h2 className="mt-6 text-center font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {t.reviews.titleA}
          <span className="text-primary">{t.reviews.titleB}</span>
          {t.reviews.titleC}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.reviews.subtitle}
        </p>

        <div data-lux-stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.reviews.items.map((r, i) => (
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
                <PlatformBadge platform={REVIEW_PLATFORMS[i] ?? "booking"} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{r.source}</div>
                  <div className="text-xs text-muted-foreground">{t.reviews.verified}</div>
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
                {t.location.openMaps}
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
              {t.location.mapLabel}
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
  const perks = t.booking.perks;
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
              {t.booking.titleA}
              <span className="text-accent">{t.booking.titleB}</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-white/75">
              {t.booking.subtitle}
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
            <div className="font-serif text-2xl md:text-3xl">{t.booking.readyTitle}</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {t.booking.readySubtitle}
            </p>
            <div className="mt-8 space-y-3">
              <a
                href="#booking-bar"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[0_18px_40px_-16px_rgba(214,120,50,0.75)] transition hover:brightness-110"
              >
                {t.booking.requestCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+306940133837"
                className="flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.booking.callCta}
              </a>
            </div>
            <div className="mt-6 text-center text-xs text-white/60">
              {t.booking.langNote}
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
      label: t.contact.email,
      value: "info@katerinavipvilla.gr",
      href: "mailto:info@katerinavipvilla.gr",
    },
    {
      label: t.contact.phone,
      value: "+30 6940 133 837",
      href: "tel:+306940133837",
    },
    {
      label: t.contact.phone,
      value: "+30 6948 014 277",
      href: "tel:+306948014277",
    },
    {
      label: t.contact.address,
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
          {t.contact.titleA}
          <span className="text-accent">{t.contact.titleB}</span>
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
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const links = NAV_IDS.filter((i) => i !== "home").map((id) => ({ id, l: t.nav[id] }));
  const amenitiesList = t.footer.amenities;
  return (
    <footer data-lux-reveal className="border-t border-border bg-[hsl(35_35%_96%)] text-foreground">
      <div className="container-villa py-16">
        <div data-lux-stagger className="grid gap-10 md:grid-cols-4">

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


