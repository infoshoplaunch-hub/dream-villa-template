
## Scope
Touch only the Hero and Header (in `src/routes/index.tsx`). Leave all other sections, copy, and one-page structure intact. Continue using the real villa photo (`villa-hero.jpg`) as background — no new stock/AI images.

## Changes

### 1. Logo visibility (Header)
Current issue: dark logo mark barely visible on the dark hero, and `brightness-0 invert` washes color detail away.
- Generate a light/gold-adapted version of the existing logo via `imagegen--edit_image` on `src/assets/logo.png` → `src/assets/logo-light.png` (white + warm-gold accents, transparent bg).
- Use light logo when header is transparent over hero; use original logo when scrolled (light background).
- Slightly increase logo height (h-11 / md:h-14) for better presence.

### 2. Language switcher (Header)
Rebuild `LangSwitch` as an elegant pill:
- Transparent-over-hero variant: white border 1px, `bg-white/5` backdrop-blur, active language gets a filled accent pill; inactive is white/70.
- Scrolled variant: border-border, active accent pill.
- Slightly larger touch target, uppercase tracking.

### 3. Nav polish
- Add small orange underline on the active `Αρχική` (home) item — implement via IntersectionObserver tracking current section, defaulting to `home`.
- Tighter, more refined spacing; keep existing links.
- Rename booking CTA label to keep current wording; add subtle right arrow icon.

### 4. Hero background overlay
Replace the current tri-stop gradient with a cinematic left→right dark gradient:
- `bg-gradient-to-r from-black/85 via-black/55 to-black/25`
- Add a second subtle `bg-gradient-to-t from-black/70 to-transparent` at bottom to seat the highlights bar.

### 5. Hero content hierarchy
- Eyebrow: keep "ΚΑΛΩΣ ΗΡΘΑΤΕ" (already in i18n), gold accent with decorative line.
- Headline: split into two lines — display "Ekaterini VIP Villa" (with `VIP` wrapped in accent-colored span) as the main title, then the current subtitle "Ζήστε την απόλυτη εμπειρία…" as a lighter subheadline below.
- Description paragraph unchanged text, tighter max-width, better leading.
- Slightly bigger, tighter type: `text-5xl md:text-7xl lg:text-8xl` with `tracking-tight`.

### 6. CTA buttons
- Primary: warm-orange filled, rounded-full, subtle glow (`shadow-[0_10px_30px_-10px_rgba(orange)]`), right ArrowRight icon.
- Secondary: transparent, white border, white text, rounded-full, ArrowRight icon; hover fills white/10.
- Larger padding, gap-4.

### 7. Highlights bar (inside Hero)
Move the highlight list out of its current inline `<ul>` into a **premium dark-glass bar** floating at the bottom of the hero:
- Container: `rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md shadow-2xl`, centered, negative margin so it visually sits at hero bottom.
- 5 columns on md+, 2 columns on sm, stacked on xs.
- Each item: custom SVG icon in a circular gold-outlined badge (48px) + label to the right.
- Vertical dividers between items on md+ (`divide-x divide-white/10`).

The separate `Highlights` section below hero remains unchanged (that's a different section — cards grid with descriptions).

### 8. Custom icons
Create 5 hand-drawn minimal-line SVG components matching the boutique/gold badge mockup, saved in `src/components/villa-icons.tsx`:
- `GuestsIcon` (group of figures under a laurel arc)
- `BedroomIcon` (bed with lampshades under an arch + small ornament)
- `PoolIcon` (pool ladder + waves + potted plant + sun arch)
- `WifiIcon` (wifi waves + laurel)
- `ParkingIcon` (car under arch with cypress trees)
Style: 1.25-stroke, `stroke-accent`, `fill-none`, viewBox 64×64. No external icon library needed.

### 9. Scroll indicator
Keep the chevron; refine to a thin outlined circle + chevron, hidden on mobile, subtle float animation.

## Files touched
- `src/routes/index.tsx` — Header, LangSwitch, Hero, active-nav observer.
- `src/components/villa-icons.tsx` — new, 5 SVG icons.
- `src/assets/logo-light.png` — generated light logo variant.
- `src/assets/logo-light.png.asset.json` — asset pointer.

## Not changing
- Any section below the hero (`Highlights`, `VillaSection`, `Amenities`, `Gallery`, `LocationSection`, `Booking`, `FAQ`, `Contact`, `Footer`, `StickyBookCTA`).
- i18n strings (reusing existing `t.hero.*` and `t.nav.*`).
- Colors/tokens in `styles.css` (accent already warm orange).
- Real villa photo — reused as-is.
