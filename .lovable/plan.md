# Interactive Bento Gallery στο section «Οι Χώροι Μας»

Αντικαθιστούμε το τωρινό carousel με ένα διαδραστικό bento gallery (drag-to-reorder + click-to-expand modal με draggable dock).

## Setup
- Εγκατάσταση: `bun add framer-motion` (το lucide-react υπάρχει ήδη).
- Νέο αρχείο: `src/components/ui/interactive-bento-gallery.tsx` — καθαρή, typed υλοποίηση βασισμένη στο snippet:
  - `MediaItem` — υποστηρίζει `image` & `video` με IntersectionObserver autoplay.
  - `GalleryModal` — fullscreen modal + draggable thumbnail dock από κάτω, `AnimatePresence` transitions, close button.
  - `InteractiveBentoGallery` — bento grid, drag-to-reorder, stagger reveal animations.
- Θα καθαρίσω το snippet από τα `"use client"` (δεν χρειάζεται εδώ), θα φτιάξω σωστά JSX/props/refs, θα προσθέσω `HTMLVideoElement` typing, και θα βάλω design-token colors (όχι hardcoded).

## Ενσωμάτωση στο site
Στο `src/routes/index.tsx`:
- Αφαίρεση του `VillaCarousel` component και των imports που χρησιμοποιούσε μόνο αυτό (`ChevronLeft`, `ChevronRight`).
- Κρατάμε τα 9 asset imports (`villa1..villa17`).
- Δημιουργία `VILLA_MEDIA` array με τις 9 πραγματικές φωτογραφίες + captions και ένα ισορροπημένο bento layout:

| # | Φωτογραφία | Caption | span (md) |
|---|---|---|---|
| 1 | EKATERINI-12 (Βεράντα) | Βεράντα με θέα | col-span-2 row-span-2 |
| 2 | EKATERINI-17 (Master) | Master υπνοδωμάτιο | col-span-1 row-span-2 |
| 3 | EKATERINI-7 (Σαλόνι) | Σαλόνι με θέα | col-span-1 row-span-1 |
| 4 | EKATERINI-3 (Καθιστικό) | Καθιστικό & τραπεζαρία | col-span-1 row-span-1 |
| 5 | EKATERINI-4 (Κουζίνα) | Πλήρως εξοπλισμένη κουζίνα | col-span-2 row-span-2 |
| 6 | EKATERINI-6 (Κουζίνα/σκάλα) | Κουζίνα & τραπεζαρία | col-span-1 row-span-1 |
| 7 | EKATERINI-9 (Δίκλινο) | Δίκλινο υπνοδωμάτιο | col-span-1 row-span-1 |
| 8 | EKATERINI-10 (Δίκλινο) | Δίκλινο υπνοδωμάτιο | col-span-1 row-span-2 |
| 9 | EKATERINI-1 (Μπάνιο) | Μπάνιο | col-span-1 row-span-1 |

- Το `RoomsSection` κρατά το eyebrow + τίτλο και μεταφέρει τα `title`/`description` της gallery μέσα στο ίδιο section. (Αφαιρώ τον τίτλο του component για να αποφύγουμε διπλό heading — το εξωτερικό h2 μένει.)
- Χρώματα από design tokens (`accent`, `foreground`, `background`) — καθόλου `text-white`/`bg-black` hardcoded.

## Responsive & UX
- Grid: `grid-cols-2` mobile → `md:grid-cols-4` desktop, με τα `span` κλάσεις του κάθε item.
- Modal: full-viewport με backdrop blur, `Esc` κλείσιμο, click εκτός εικόνας κλείνει.
- Dock: draggable, τα thumbnails ενεργοποιούν εναλλαγή slide.
- `prefers-reduced-motion`: μειώνει scale/rotate animations στο dock.

## Δεν αλλάζει
Όλα τα υπόλοιπα sections (Amenities, Location, Booking, Contact) παραμένουν ως έχουν. Το asset `EKATERINI-*` set μένει ίδιο· η φωτογραφία πισίνας μπορεί να προστεθεί αργότερα ως 10ο item.