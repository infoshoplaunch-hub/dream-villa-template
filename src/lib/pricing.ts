// Seasonal nightly pricing for Ekaterini VIP Villa (EUR / night).
// Rules given by owner; only nights inside season are charged (check-out day excluded).

export const PROMO_END = new Date("2026-12-31T23:59:59");
export const PROMO_DISCOUNT = 0.1; // 10%

/** Rate for a single night (the "arrival" date of that night). */
export function nightlyRate(d: Date): number {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (m === 4) return 315; // Apr 20 – Apr 30
  if (m === 5) return 360; // May
  if (m === 6) return 428; // June
  if (m === 7 || m === 8) return 582; // July + August
  if (m === 9) return 428; // September
  if (m === 10 && day <= 20) return 315; // Oct 1 – Oct 20
  return 0; // out of season
}

export type PriceGroup = { nights: number; rate: number; subtotal: number };

export type PriceBreakdown = {
  nights: number;
  groups: PriceGroup[];
  subtotal: number;
  discount: number;   // absolute EUR discount
  total: number;
  promoActive: boolean;
};

export function computeBreakdown(from: Date, to: Date, now: Date = new Date()): PriceBreakdown {
  const groups: PriceGroup[] = [];
  let subtotal = 0;
  let totalNights = 0;

  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor < end) {
    const rate = nightlyRate(cursor);
    subtotal += rate;
    totalNights += 1;
    const last = groups[groups.length - 1];
    if (last && last.rate === rate) {
      last.nights += 1;
      last.subtotal += rate;
    } else {
      groups.push({ nights: 1, rate, subtotal: rate });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const promoActive = now <= PROMO_END;
  const discount = promoActive ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal - discount;

  return { nights: totalNights, groups, subtotal, discount, total, promoActive };
}

export function formatEUR(n: number, locale = "el-GR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
