## Scope
Replace the text-based logo mark ("Ekaterini VIP Villa") in the header of `src/routes/index.tsx` with the newly uploaded logo image (sun + "Villa" + "Luxury Relax Center").

## Steps

1. **Upload the new logo as a Lovable Asset**
   - Run `lovable-assets create --file /mnt/user-uploads/Ανώνυμο_σχέδιο_3.png --filename logo-villa.png > src/assets/logo-villa.png.asset.json`.
   - The uploaded PNG already has a white background but the subject sits on white — we'll generate a transparent version via `imagegen--edit_image` (background removal) so it sits cleanly on the dark hero AND on the light scrolled header.
   - Save transparent version as `src/assets/logo-villa.png` asset pointer.

2. **Update the Header in `src/routes/index.tsx`**
   - Remove the current text `<div>` containing the three `<span>` elements at lines ~74-85 (Ekaterini / VIP / Villa).
   - Replace with a single `<img>` tag using the new transparent logo.
   - Keep the existing behavior: bigger height on hero (transparent header), slightly smaller when scrolled. Use `h-12 md:h-16` at top, `h-10 md:h-12` scrolled.
   - Since the new logo has warm-gold artwork on transparent bg, it will read well on both the dark hero and the light scrolled header without any `invert` filter. Remove the previous conditional filter logic for this element.
   - Update `alt` to "Ekaterini VIP Villa — Luxury Relax Center".
   - Keep the mobile menu logo consistent (use the same new logo).

3. **No other sections touched.** The old `logo.png` asset stays in place for now (still referenced elsewhere if any); if unused after the swap we can delete in a follow-up.

## Files touched
- `src/assets/logo-villa.png.asset.json` — new asset pointer.
- `src/routes/index.tsx` — swap header logo markup.

## Not changing
- Hero, highlights bar, icons, i18n, colors, fonts, or any section below the header.
