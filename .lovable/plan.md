## Στόχος
Δημιουργία ενός νέου section «Παροχές» ακριβώς κάτω από το section «Οι Χώροι Μας» (InteractiveBentoGallery). Το section θα παρουσιάζει 3 παροχές σε οριζόντια διάταξη με icon cards, παρόμοια με το reference image που έδωσε ο χρήστης.

## Design Direction
- **Layout**: 3 στήλες σε desktop (grid), 1 στήλη σε mobile. Κέντρωση, με αρκετό padding.
- **Card style**: Κάθε παροχή είναι ένα κέντρο-ευθυγραμμισμένο stack:
  - Στρογγυλό background (circle ~64px) με icon μέσα σε χρώμα από το design system
  - Title κάτω από το icon (bold, μεγαλύτερο)
  - Σύντομη περιγραφή κάτω από τον title (muted, μικρότερο)
- **Χρώματα icon backgrounds** (ένα για κάθε παροχή, από το υπάρχον palette):
  - Στάθμευση: warm sand / secondary tint
  - Wi-Fi: warm olive / muted tint
  - Πισίνα: warm sea / primary tint
- **Typography**: Χρήση του υπάρχοντος font stack (Cera GR), design tokens για χρώματα.
- **Animation**: Subtle fade-in + translate-y on scroll (framer-motion, ήδη εγκατεστημένο).

## Περιεχόμενο

| Παροχή | Icon | Περιγραφή |
|---|---|---|
| Δωρεάν Χώρος Στάθμευσης | ParkingIcon | Ιδιωτικός χώρος στάθμευσης για όλα τα οχήματά σας. |
| Δωρεάν Wi-Fi | WifiIcon | Γρήγορο ασύρματο internet σε όλους τους χώρους. |
| Ιδιωτική Πισίνα | PoolIcon | Αποκλειστική πισίνα μόνο για εσάς, με θέα στο Αιγαίο. |

## Ενσωμάτωση

Στο `src/routes/index.tsx`:
- Εισαγωγή των icons από `@/components/villa-icons` (ParkingIcon, WifiIcon, PoolIcon).
- Δημιουργία νέου component `AmenitiesSection` (inline ή ξεχωριστό αρχείο αν είναι μεγάλο).
- Τοποθέτηση `<AmenitiesSection />` ακριβώς κάτω από `<RoomsSection />` μέσα στο `<main>`.

## Τεχνικά
- Δεν χρειάζονται νέα dependencies (framer-motion και lucide-react ήδη υπάρχουν).
- Responsive: `grid-cols-1 md:grid-cols-3`.
- `prefers-reduced-motion`: απενεργοποίηση animation.
