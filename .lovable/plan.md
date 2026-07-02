## Section 3 — «Οι Χώροι της Βίλας»

Τοποθέτηση: αμέσως μετά το About (Section 2), πριν από τις Παροχές. Δεν αλλάζει τίποτε άλλο στη σελίδα.

### Δομή
- Warm off-white background (ίδιο cream tone με τα υπόλοιπα light sections).
- Centered eyebrow «ΟΙ ΧΩΡΟΙ ΜΑΣ» με μικρές πορτοκαλί γραμμές αριστερά/δεξιά.
- Main title: «Ανακαλύψτε τους **χώρους** της βίλας» — η λέξη «χώρους» με orange accent.
- 3 large cards σε 1 row (desktop), 2-col ή stacked σε tablet, 1-col σε mobile.

### Κάθε card
- Πραγματική φωτογραφία top, rounded-top corners, `aspect-[4/3]` crop.
- Λευκό content area κάτω, soft shadow, rounded-2xl.
- Circular soft-orange badge με custom line SVG icon (αριστερά).
- Title (dark charcoal, bold) + short description (muted).
- Hover: subtle lift (`-translate-y-1`), image zoom (`scale-105`), εντονότερο shadow, πιο έντονο orange badge.

### Icons (νέα custom line SVGs στο `src/components/villa-icons.tsx`)
- `PoolLineIcon` — waves + διάγραμμα πισίνας
- `BedroomLineIcon` — minimal bed outline
- `OutdoorLineIcon` — δέντρο/ομπρέλα + πιάτα (outdoor dining)
Όλα stroke-based, `currentColor`, ώστε να πάρουν orange accent.

### Φωτογραφίες
Θα ανεβάσεις 3 πραγματικές φωτογραφίες (pool, bedroom, outdoor). Μόλις τις ανεβάσεις, θα δημιουργήσω 3 asset pointers:
- `src/assets/villa-pool.jpg.asset.json`
- `src/assets/villa-bedroom.jpg.asset.json`
- `src/assets/villa-outdoor.jpg.asset.json`

Καμία AI/stock εικόνα.

### i18n
Νέο block `t.rooms` σε `src/lib/i18n.tsx` (GR/EN) με eyebrow, title (με highlight span), και 3 card titles + descriptions.

### Αρχεία που αλλάζουν
- `src/routes/index.tsx` — νέο `RoomsSection` component + insertion μετά το VillaSection.
- `src/lib/i18n.tsx` — νέο rooms namespace.
- `src/components/villa-icons.tsx` — 3 νέα line icons.
- `src/assets/*.asset.json` — 3 νέα pointers για τις πραγματικές φωτογραφίες.

Hero, About, Amenities, Gallery, Location, FAQ, Contact, Footer — αμετάβλητα.
