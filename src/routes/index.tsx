import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { HERO_HIGHLIGHT_ICONS } from "@/components/villa-icons";

import { useI18n, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import heroAsset from "@/assets/villa-hero.jpg.asset.json";
const heroImg = heroAsset.url;
import logoAsset from "@/assets/logo-villa.png.asset.json";
import logoDarkAsset from "@/assets/logo-villa-dark.png.asset.json";
const logoUrl = logoAsset.url;
const logoDarkUrl = logoDarkAsset.url;
import poolImg from "@/assets/pool.jpg";
import bedroomImg from "@/assets/bedroom.jpg";
import livingImg from "@/assets/living.jpg";
import kitchenImg from "@/assets/kitchen.jpg";
import verandaImg from "@/assets/veranda.jpg";
import viewImg from "@/assets/view.jpg";
import exteriorImg from "@/assets/exterior.jpg";
import bathroomImg from "@/assets/bathroom.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const NAV_IDS = ["home", "villa", "amenities", "gallery", "location", "booking", "contact"] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <VillaSection />
        <RoomsSection />
        <Amenities />
        <Reviews />
        <LocationSection />
        <Booking />
        <FAQ />
        <Contact />
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
            href="#booking"
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
              href="#booking"
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
              href="#booking"
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

      {/* Premium dark-glass highlights bar */}
      <div className="absolute inset-x-0 bottom-8 z-10 md:bottom-14">
        <div className="container-villa">
          <div className="rounded-2xl border border-white/15 bg-black/45 shadow-2xl backdrop-blur-md">
            <ul className="grid grid-cols-2 divide-y divide-white/10 md:grid-cols-5 md:divide-x md:divide-y-0">
              {t.hero.highlights.map((h, i) => {
                const Icon = HERO_HIGHLIGHT_ICONS[i] ?? HERO_HIGHLIGHT_ICONS[0];
                return (
                  <li
                    key={h}
                    className="flex items-center gap-3 px-4 py-4 md:px-5 md:py-5"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-black/40 text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[13px] font-medium leading-snug text-white/90 md:text-sm">
                      {h}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

    </section>
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

const ROOMS = [
  {
    title: "Χώρος Πισίνας",
    desc: "Ιδιωτική πισίνα με θέα, ιδανική για στιγμές χαλάρωσης από το πρωί μέχρι το βράδυ.",
    img: poolImg,
    alt: "Ιδιωτική πισίνα Ekaterini VIP Villa",
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
    title: "Υπνοδωμάτια",
    desc: "3 άνετα υπνοδωμάτια για ξεκούραστη διαμονή με οικογένεια ή παρέα.",
    img: bedroomImg,
    alt: "Υπνοδωμάτιο Ekaterini VIP Villa",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 22V10" />
        <path d="M28 22v-6a4 4 0 0 0-4-4H4" />
        <path d="M4 18h24" />
        <path d="M4 22h24" />
        <path d="M9 12v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Εξωτερικοί Χώροι",
    desc: "BBQ, βεράντα, κήπος και χώροι για φαγητό ή χαλάρωση κάτω από τον κρητικό ουρανό.",
    img: verandaImg,
    alt: "Εξωτερικοί χώροι και BBQ Ekaterini VIP Villa",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M16 4v4" />
        <path d="M4 14C4 9 9 6 16 6s12 3 12 8Z" />
        <path d="M16 14v14" />
        <path d="M11 28h10" />
        <path d="M8 20h4" />
        <path d="M20 20h4" />
      </svg>
    ),
  },
] as const;

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

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <article
              key={room.title}
              className="group flex flex-col overflow-hidden rounded-3xl bg-background shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-25px_rgba(15,23,42,0.4)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={room.img}
                  alt={room.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 items-start gap-5 p-7 md:p-8">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
                  {room.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-2xl leading-tight text-foreground">
                    {room.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {room.desc}
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
    img: livingImg,
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
  return (
    <section id="location" className="section-y bg-secondary/40">
      <div className="container-villa grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionHead eyebrow={t.location.eyebrow} title={t.location.title} center={false} />
          <p className="mt-6 leading-relaxed text-foreground/80">{t.location.text}</p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{t.location.address}</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Plaka+Apokoronos+Chania+Crete"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-accent hover:underline"
                >
                  Google Maps →
                </a>
              </div>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {t.location.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="h-4 w-4 text-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border shadow-card">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=Plaka+Apokoronos+Chania+Crete&output=embed"
            className="h-[420px] w-full md:h-[520px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Booking ---------- */

function Booking() {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success(t.booking.success);
    }, 700);
  };

  return (
    <section id="booking" className="section-y">
      <div className="container-villa">
        <div className="grid gap-10 rounded-3xl bg-primary p-8 text-primary-foreground shadow-soft md:grid-cols-5 md:p-14">
          <div className="md:col-span-2">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent" />
              {t.booking.eyebrow}
            </span>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
              {t.booking.title}
            </h2>
            <p className="mt-4 text-primary-foreground/80">{t.booking.subtitle}</p>

            <div className="mt-8 space-y-4 text-sm">
              <p className="text-primary-foreground/70">{t.booking.or}</p>
              <a
                href="tel:+306940133837"
                className="flex items-center gap-3 text-primary-foreground hover:text-accent"
              >
                <Phone className="h-4 w-4" /> +30 6940 133 837
              </a>
              <a
                href="tel:+306948014277"
                className="flex items-center gap-3 text-primary-foreground hover:text-accent"
              >
                <Phone className="h-4 w-4" /> +30 6948 014 277
              </a>
              <a
                href="mailto:info@katerinavipvilla.gr"
                className="flex items-center gap-3 text-primary-foreground hover:text-accent"
              >
                <Mail className="h-4 w-4" /> info@katerinavipvilla.gr
              </a>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-3 rounded-2xl bg-card p-6 text-foreground shadow-card md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.booking.name} name="name" required />
              <Field label={t.booking.email} name="email" type="email" required />
              <Field label={t.booking.phone} name="phone" type="tel" />
              <Field label={t.booking.guests} name="guests" type="number" min={1} max={7} defaultValue={2} />
              <Field label={t.booking.checkin} name="checkin" type="date" required />
              <Field label={t.booking.checkout} name="checkout" type="date" required />
            </div>
            <div className="mt-4">
              <Label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.booking.message}
              </Label>
              <Textarea id="message" name="message" rows={4} className="mt-2" />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 h-12 w-full rounded-full bg-accent text-accent-foreground hover:brightness-110"
            >
              {submitting ? "..." : t.booking.submit}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input id={name} name={name} type={type} className="mt-2" {...rest} />
    </div>
  );
}

/* ---------- FAQ ---------- */

function FAQ() {
  const { t } = useI18n();
  return (
    <section className="section-y bg-secondary/40">
      <div className="container-villa max-w-3xl">
        <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-border bg-card px-2">
          {t.faq.items.map((it, i) => (
            <AccordionItem key={i} value={`i${i}`} className="border-border">
              <AccordionTrigger className="px-4 text-left font-serif text-lg hover:no-underline">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

function Contact() {
  const { t } = useI18n();
  const items = [
    { icon: Users, label: t.contact.manager, value: "Mrs Aggeliki Gogolaki" },
    { icon: MapPin, label: t.contact.address, value: "Plaka Apokoronos, 73008 Chania, Crete" },
    { icon: Phone, label: t.contact.phone, value: "+30 6940 133 837", href: "tel:+306940133837" },
    { icon: Phone, label: t.contact.phone, value: "+30 6948 014 277", href: "tel:+306948014277" },
    { icon: Mail, label: t.contact.email, value: "info@katerinavipvilla.gr", href: "mailto:info@katerinavipvilla.gr" },
  ];
  return (
    <section id="contact" className="section-y">
      <div className="container-villa">
        <SectionHead eyebrow={t.contact.eyebrow} title={t.contact.title} subtitle={t.contact.text} />
        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            const inner = (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                  {it.label}
                </div>
                <div className="mt-1 font-medium text-foreground">{it.value}</div>
              </div>
            );
            return it.href ? (
              <a key={i} href={it.href}>{inner}</a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
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
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-villa py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl">
              Ekaterini <span className="text-accent">VIP</span> Villa
            </div>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">{t.footer.tagline}</p>
            <div className="mt-6"><LangSwitch /></div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-primary-foreground/60">
              {t.footer.explore}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-primary-foreground/80 hover:text-accent">
                    {l.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-primary-foreground/60">
              {t.footer.contactCol}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              <li>Plaka Apokoronos, Chania</li>
              <li><a className="hover:text-accent" href="tel:+306940133837">+30 6940 133 837</a></li>
              <li><a className="hover:text-accent" href="tel:+306948014277">+30 6948 014 277</a></li>
              <li><a className="hover:text-accent" href="mailto:info@katerinavipvilla.gr">info@katerinavipvilla.gr</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/60">
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
      href="#booking"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-soft md:hidden"
    >
      {t.nav.book}
    </a>
  );
}
