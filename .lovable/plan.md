## Plan: Swap header logo

The new upload (`Ανώνυμο_σχέδιο.png`) contains everything in one image: sun + "EKATERINI VIP" (white) + "Villa" (gold) + "Luxury Relax Center". This replaces the previous partial logo and removes the need for any extra "Ekaterini VIP" text next to it.

### Steps
1. Upload `user-uploads://Ανώνυμο_σχέδιο.png` to the CDN via `lovable-assets` and remove its black background (transparent PNG) using `imagegen--edit_image` so it sits cleanly on both the hero and the white scrolled header.
2. Save the transparent result as `src/assets/logo-villa.png` + `.asset.json` pointer (replacing the current logo-villa asset).
3. In `src/routes/index.tsx`, keep the existing `BrandLogo` component pointing at the same `logo-villa.png.asset.json` — only the underlying asset changes. Adjust the height classes if needed so the taller logo lockup stays balanced in the header (approx `h-12 md:h-16` on hero, `h-10 md:h-12` when scrolled).
4. Verify with a production build and a Playwright screenshot of the header in both hero (transparent) and scrolled (white) states.

### Out of scope
No other section, copy, or styling changes.
