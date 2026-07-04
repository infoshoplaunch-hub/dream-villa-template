# Section "Οι Χώροι Μας" → Premium Carousel

Αντικαθιστούμε τις 3 στατικές κάρτες (Πισίνα / Υπνοδωμάτια / Εξωτ. Χώροι) με ένα κομψό carousel που παρουσιάζει τις **πραγματικές φωτογραφίες** της βίλας.

## Τι θα κρατήσουμε
- Eyebrow «— ΟΙ ΧΩΡΟΙ ΜΑΣ —»
- Τίτλο «Ανακαλύψτε τους **χώρους** της βίλας»
- Ίδιο cream background, ίδιο section spacing

## Τι θα προστεθεί
Ένα **large-format image carousel** ακριβώς από κάτω, με:

- **Μεγάλη κεντρική εικόνα** (aspect ~16:10, rounded 3xl, soft shadow)
- **Peek** των διπλανών slides αριστερά/δεξιά (~8% το καθένα) για να «καλεί» σε scroll
- **Caption chip** πάνω αριστερά σε κάθε slide (π.χ. «Υπνοδωμάτιο με θέα», «Σαλόνι», «Κουζίνα», «Βεράντα»)
- **Prev / Next arrows** σε στρογγυλά κουμπιά με accent (πορτοκαλί) hover
- **Dot indicators** από κάτω (accent για active)
- **Keyboard support** (← →) και **swipe** σε mobile
- **Autoplay** κάθε 5s, παύση on hover, `prefers-reduced-motion` off

## Φωτογραφίες (initial set)
Οι 9 πραγματικές που ανέβασες, με ελληνικά captions:

| # | Αρχείο | Caption |
|---|---|---|
| 1 | EKATERINI-12.jpg | Βεράντα με θέα στη θάλασσα |
| 2 | EKATERINI-7.jpg  | Σαλόνι με θέα |
| 3 | EKATERINI-3.jpg  | Καθιστικό & τραπεζαρία |
| 4 | EKATERINI-6.jpg  | Κουζίνα & τραπεζαρία |
| 5 | EKATERINI-4.jpg  | Πλήρως εξοπλισμένη κουζίνα |
| 6 | EKATERINI-17.jpg | Master υπνοδωμάτιο |
| 7 | EKATERINI-9.jpg  | Δίκλινο υπνοδωμάτιο |
| 8 | EKATERINI-10.jpg | Δίκλινο υπνοδωμάτιο |
| 9 | EKATERINI-1.jpg  | Μπάνιο |

Η **φωτογραφία πισίνας** θα προστεθεί ως 1ο slide μόλις τη στείλεις.

## Τεχνικές λεπτομέρειες
- Ανέβασμα των 9 εικόνων μέσω `lovable-assets` (CDN) — όχι στο repo
- Νέο component `<VillaCarousel />` μέσα στο `src/routes/index.tsx` (αντικαθιστά το mapping των `ROOMS`)
- Αφαίρεση constant `ROOMS` (μαζί με τα line icons που δεν χρησιμοποιούνται πλέον)
- Χρήση καθαρού React state (χωρίς νέο dependency) για slide index + autoplay
- Lazy-load όλες τις εικόνες εκτός της πρώτης
- Responsive: desktop peek 8%, tablet 4%, mobile 0% (full-bleed slide)
- Χωρίς αλλαγές σε άλλα sections