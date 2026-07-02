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
        <Amenities />
        <Gallery />
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

      <a
        href="#highlights"
        className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 items-center justify-center text-white/70 hover:text-white md:flex"
        aria-label="Scroll"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30">
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </a>
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

/* ---------- Highlights ---------- */

const HIGHLIGHT_ICONS = [Users, BedDouble, Waves, Wifi, Car, Heart, Palmtree, Flame];

function Highlights() {
  const { t } = useI18n();
  return (
    <section id="highlights" className="section-y bg-secondary/40">
      <div className="container-villa">
        <SectionHead eyebrow={t.highlights.eyebrow} title={t.highlights.title} />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {t.highlights.items.map((it, i) => {
            const Icon = HIGHLIGHT_ICONS[i] ?? Sparkles;
            return (
              <div
                key={it.t}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-lg text-foreground">{it.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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

/* ---------- Amenities ---------- */

function Amenities() {
  const { t } = useI18n();
  return (
    <section id="amenities" className="section-y bg-secondary/40">
      <div className="container-villa">
        <SectionHead eyebrow={t.amenities.eyebrow} title={t.amenities.title} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.amenities.groups.map((g, i) => (
            <div
              key={g.h}
              className={`rounded-3xl border border-border/60 p-8 shadow-card ${
                i === 1 ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              <h3
                className={`font-serif text-2xl ${
                  i === 1 ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {g.h}
              </h3>
              <ul className="mt-6 space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        i === 1 ? "text-accent" : "text-accent"
                      }`}
                    />
                    <span className={i === 1 ? "text-primary-foreground/90" : "text-foreground/80"}>
                      {it}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */

const GALLERY = [
  { src: heroImg, tag: 0 },
  { src: poolImg, tag: 1 },
  { src: bedroomImg, tag: 2 },
  { src: livingImg, tag: 3 },
  { src: kitchenImg, tag: 4 },
  { src: bathroomImg, tag: 5 },
  { src: viewImg, tag: 6 },
  { src: verandaImg, tag: 0 },
  { src: exteriorImg, tag: 0 },
];

function Gallery() {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="gallery" className="section-y">
      <div className="container-villa">
        <SectionHead eyebrow={t.gallery.eyebrow} title={t.gallery.title} subtitle={t.gallery.subtitle} />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {t.gallery.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {GALLERY.map((g, i) => {
            const span =
              i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/5]";
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(g.src)}
                className={`group relative overflow-hidden rounded-2xl ${span}`}
              >
                <img
                  src={g.src}
                  alt={t.gallery.tags[g.tag] ?? "Villa"}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                  {t.gallery.tags[g.tag]}
                </span>
              </button>
            );
          })}
        </div>

        <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
          <DialogContent className="max-w-5xl border-none bg-black/95 p-0">
            {open && (
              <img src={open} alt="Villa" className="mx-auto max-h-[85vh] w-auto object-contain" />
            )}
          </DialogContent>
        </Dialog>
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
