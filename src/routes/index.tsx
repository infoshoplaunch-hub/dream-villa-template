import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  BedDouble,
  Waves,
  Wifi,
  Car,
  Heart,
  Palmtree,
  Flame,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  Check,
  Sparkles,
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
import logoAsset from "@/assets/logo.png.asset.json";
const logoUrl = logoAsset.url;
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
        <Highlights />
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

function LangSwitch() {
  const { lang, setLang } = useI18n();
  const opt = (l: Lang) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      className={`px-2 py-1 text-xs font-semibold tracking-wider transition ${
        lang === l ? "text-accent" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {l.toUpperCase()}
    </button>
  );
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-1 py-0.5 backdrop-blur">
      {opt("el")}
      <span className="text-border">/</span>
      {opt("en")}
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = NAV_IDS.filter((id) => id !== "home").map((id) => ({
    id,
    label: t.nav[id],
  }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-villa flex items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt="Ekaterini VIP Villa"
            className={`h-9 w-auto transition-all duration-300 md:h-11 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-foreground/80 hover:text-accent" : "text-white/85 hover:text-white"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch />
          <a
            href="#booking"
            className="hidden md:inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-soft transition hover:brightness-110"
          >
            {t.nav.book}
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`lg:hidden rounded-full p-2 ${scrolled ? "text-foreground" : "text-white"}`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="container-villa flex items-center justify-between py-5">
            <img
              src={logoUrl}
              alt="Ekaterini VIP Villa"
              className="h-8 w-auto"
            />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-villa flex flex-col gap-1 pt-6">
            {navItems.map((n) => (
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
              className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
            >
              {t.nav.book}
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
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Ekaterini VIP Villa στην Κρήτη"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />

      <div className="container-villa relative z-10 flex min-h-[100svh] flex-col justify-end pb-20 pt-32 md:justify-center md:pt-24">
        <div className="max-w-3xl text-white">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent" />
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-soft transition hover:brightness-110"
            >
              {t.hero.cta1}
            </a>
            <a
              href="#villa"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
            >
              {t.hero.cta2}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            {t.hero.highlights.map((h) => (
              <li key={h} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href="#highlights"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 hover:text-white md:block"
        aria-label="Scroll"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
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
  const { t } = useI18n();
  return (
    <section id="villa" className="section-y">
      <div className="container-villa grid gap-14 md:grid-cols-2 md:items-center">
        <div className="relative">
          <img
            src={exteriorImg}
            alt="Villa exterior"
            width={1280}
            height={960}
            loading="lazy"
            className="relative z-10 aspect-[4/5] w-full rounded-3xl object-cover shadow-soft"
          />
          <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-3xl bg-accent/20 md:block" />
          <img
            src={poolImg}
            alt="Villa pool"
            width={1280}
            height={960}
            loading="lazy"
            className="absolute -bottom-10 -left-6 z-20 hidden aspect-square w-48 rounded-2xl object-cover shadow-card md:block"
          />
        </div>

        <div>
          <SectionHead eyebrow={t.villa.eyebrow} title={t.villa.title} center={false} />
          <p className="mt-6 leading-relaxed text-foreground/80">{t.villa.p1}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t.villa.p2}</p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {t.villa.stats.map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl text-accent md:text-4xl">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#booking"
            className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            {t.nav.book}
          </a>
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
