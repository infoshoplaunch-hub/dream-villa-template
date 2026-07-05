## Πλάνο: Απλό Scroll στα Κουμπιά Κράτησης

### Στόχος
Τα κουμπιά «Κάντε Κράτηση» και «Αίτημα Κράτησης» να κάνουν smooth scroll στο Section 1 (Hero), όπου βρίσκεται το `BookingBar` με τα ημερολόγια Check-in/Check-out.

### Τεχνικές λεπτομέρειες
1. Προσθήκη `id="booking-bar"` (ή παρόμοιο) στο wrapper του `BookingBar` στο Section 1.
2. Αντικατάσταση των `<Link to="/booking">` στα εξής σημεία με `<a href="#booking-bar">`:
   - Hero CTA1 «Κάντε Κράτηση»
   - Header desktop «Κάντε Κράτηση»
   - Header mobile menu «Κάντε Κράτηση»
   - Sticky mobile CTA «Κάντε Κράτηση»
   - BookingSection «Αίτημα Κράτησης»
3. Προσθήκη CSS `scroll-behavior: smooth` στο root (αν δεν υπάρχει ήδη) για ομαλό scroll.
4. Το `BookingBar` παραμένει ως έχει — ο χρήστης επιλέγει ημερομηνίες εκεί και μετά πατάει «Κράτηση» για να πάει στη σελίδα `/booking`.

### Αρχεία που θα αλλάξουν
- `src/routes/index.tsx` — αλλαγή των 5 κουμπιών σε anchor links + προσθήκη id στο BookingBar wrapper.
- `src/styles.css` (αν χρειάζεται) — προσθήκη `scroll-behavior: smooth`.