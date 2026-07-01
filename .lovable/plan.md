## Plan: Εγκατάσταση της Cera GR ως γραμματοσειρά του site

Ανέβασες δύο αρχεία της Cera GR (Medium TTF + Bold WOFF). Θα τα χρησιμοποιήσω για ολόκληρο το site, αντικαθιστώντας τα σημερινά Cormorant Garamond / Manrope.

### Βήματα

1. **Ανέβασμα των fonts στο CDN** μέσω `lovable-assets`:
   - `Cera_GR_Medium.ttf` → `src/assets/cera-gr-medium.ttf.asset.json`
   - `Cera-GR-Bold.woff` → `src/assets/cera-gr-bold.woff.asset.json`

2. **Δήλωση @font-face στο `src/styles.css`** στην κορυφή, πριν από κάθε άλλο rule (family: `"Cera GR"`, weights 500 & 700, `font-display: swap`), με τα CDN URLs των assets.

3. **Ενημέρωση των theme tokens** στο `src/styles.css`:
   - `--font-display` και `--font-body` → `"Cera GR", system-ui, sans-serif`
   - Headings 700, body 500

4. **Καθαρισμός**:
   - Αφαίρεση των Google Fonts `<link>` (Cormorant/Manrope) από το `src/routes/__root.tsx`
   - Αφαίρεση αναφορών `font-serif` / Cormorant στα components ώστε όλο το site να χρησιμοποιεί ενιαία την Cera GR

### Σημείωση

Έχουμε μόνο Medium (500) και Bold (700). Ενδιάμεσα βάρη θα γίνουν synthesize από τον browser. Αν αργότερα θες πιο πιστό rendering, ανέβασε και Regular/Book/Light.
