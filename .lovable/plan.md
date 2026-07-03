Move the floating booking bar down so it sits exactly on the seam between Hero (Section 1) and "Η Βίλα" (Section 2) — the top half overlapping the Hero photo, the bottom half over the cream Section 2 background.

## Changes (src/routes/index.tsx only)

1. **Wrapper overlap** — change the container that currently uses `-mt-12 md:-mt-20` (which keeps the bar mostly inside the Hero) to a stronger negative margin equal to roughly half the bar's height, e.g. `-mt-[52px] md:-mt-[64px]` so ~50% of the bar sits above the Hero/Section-2 boundary and ~50% below.

2. **Hero bottom padding** — remove the extra bottom padding added last time (`pb-28 md:pb-36`) and restore the original hero bottom spacing (`pb-16 md:pb-24`) so the Hero visually ends right under the bar's midpoint instead of leaving a dark strip below it.

3. **Villa Section top padding** — reduce top padding from `pt-32 md:pt-44` back to about `pt-24 md:pt-32` so the "Η ΒΙΛΑ" label has appropriate breathing room from the bar's lower half without excessive whitespace (matches the balance shown in the reference screenshot).

No other sections, styles, or booking-bar internals change.