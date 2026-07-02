import * as React from "react";
import { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { el as dfEl, enUS as dfEn } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { fetchBookedRanges, MAX_GUESTS, type BookedRange } from "@/lib/booking";

type Guests = { adults: number; children: number; infants: number };

function formatGuests(g: Guests, t: (n: number) => string, one: (n: number) => string) {
  const total = g.adults + g.children + g.infants;
  return total === 1 ? one(1) : t(total);
}

export function BookingBar() {
  const { t, lang } = useI18n();
  const locale = lang === "el" ? dfEl : dfEn;

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, infants: 0 });
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [openCal, setOpenCal] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  useEffect(() => {
    fetchBookedRanges().then(setBookedRanges);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledMatchers = [
    { before: today },
    ...bookedRanges.map((r) => {
      const lastNight = new Date(r.to);
      lastNight.setDate(lastNight.getDate() - 1);
      return { from: r.from, to: lastNight };
    }),
  ];

  const canBook = !!(range?.from && range?.to);

  const onBook = () => {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams({
      checkin: toIso(range.from),
      checkout: toIso(range.to),
      adults: String(guests.adults),
      children: String(guests.children),
      infants: String(guests.infants),
    });
    if (typeof window !== "undefined") {
      window.open(`/booking?${params.toString()}`, "_blank", "noopener,noreferrer");
    }
  };

  const guestsLabel = formatGuests(
    guests,
    (n) => t.bar.guestsCount.replace("{n}", String(n)),
    (n) => t.bar.guestCount.replace("{n}", String(n)),
  );

  return (
    <div className="pointer-events-none sticky top-16 z-40 px-3 md:top-24 md:px-6">
      <div className="pointer-events-auto mx-auto max-w-5xl">
        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/95 p-2 shadow-[0_18px_50px_-20px_rgba(15,32,63,0.35)] backdrop-blur md:flex-row md:items-stretch md:gap-0 md:rounded-full md:p-1.5">
          {/* Check-in */}
          <Popover open={openCal} onOpenChange={setOpenCal}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="group flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition hover:bg-muted/60 md:rounded-full md:px-6 md:py-2"
              >
                <CalendarIcon className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
                <span className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {t.bar.arrival}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {range?.from ? format(range.from, "dd MMM yyyy", { locale }) : t.bar.pickDate}
                  </span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0" sideOffset={12}>
              <div className="pointer-events-auto p-3">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={disabledMatchers}
                  numberOfMonths={typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1}
                  locale={locale}
                  showOutsideDays
                  className="[--rdp-accent-color:var(--accent)]"
                  classNames={{
                    day_disabled: "text-muted-foreground/40 line-through",
                  }}
                />
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-sm bg-muted-foreground/25" />
                    {t.bar.unavailable}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenCal(false)}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110"
                  >
                    {t.bar.done}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden w-px self-stretch bg-border/70 md:block" />

          {/* Check-out (opens same picker) */}
          <button
            type="button"
            onClick={() => setOpenCal(true)}
            className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition hover:bg-muted/60 md:rounded-full md:px-6 md:py-2"
          >
            <CalendarIcon className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
            <span className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t.bar.departure}
              </span>
              <span className="text-sm font-medium text-foreground">
                {range?.to ? format(range.to, "dd MMM yyyy", { locale }) : t.bar.pickDate}
              </span>
            </span>
          </button>

          <div className="hidden w-px self-stretch bg-border/70 md:block" />

          {/* Guests */}
          <Popover open={openGuests} onOpenChange={setOpenGuests}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition hover:bg-muted/60 md:rounded-full md:px-6 md:py-2"
              >
                <Users className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
                <span className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {t.bar.guests}
                  </span>
                  <span className="text-sm font-medium text-foreground">{guestsLabel}</span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] p-4" sideOffset={12}>
              <GuestStepper
                label={t.bar.adults13}
                sublabel={t.bar.adults13Sub}
                value={guests.adults}
                min={1}
                canIncrement={guests.adults + guests.children < MAX_GUESTS}
                onChange={(v) => setGuests((g) => ({ ...g, adults: v }))}
              />
              <div className="my-3 h-px bg-border/60" />
              <GuestStepper
                label={t.bar.children212}
                sublabel={t.bar.children212Sub}
                value={guests.children}
                min={0}
                canIncrement={guests.adults + guests.children < MAX_GUESTS}
                onChange={(v) => setGuests((g) => ({ ...g, children: v }))}
              />
              <div className="my-3 h-px bg-border/60" />
              <GuestStepper
                label={t.bar.infants2}
                sublabel={`${t.bar.infants2Sub} · ${t.bar.infantsFree}`}
                value={guests.infants}
                min={0}
                max={5}
                canIncrement={guests.infants < 5}
                onChange={(v) => setGuests((g) => ({ ...g, infants: v }))}
              />
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                {t.bar.maxGuestsHint}
              </p>
              <button
                type="button"
                onClick={() => setOpenGuests(false)}
                className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
              >
                {t.bar.done}
              </button>
            </PopoverContent>
          </Popover>

          {/* CTA */}
          <button
            type="button"
            onClick={onBook}
            disabled={!canBook}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 md:mt-0 md:ml-1 md:min-w-[140px]"
          >
            {t.bar.book}
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestStepper({
  label,
  sublabel,
  value,
  min,
  max = 20,
  canIncrement,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max?: number;
  canIncrement: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sublabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="minus"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={!canIncrement || value >= max}
          aria-label="plus"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
