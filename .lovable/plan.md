## Νέο Section: "Επιλέξτε ημερομηνίες διαμονής"

Ξεχωριστό section στη home page, ανάμεσα στο Amenities και σε ό,τι ακολουθεί, με ημερολόγιο δύο μηνών σε στυλ Booking.com (όπως στη φωτογραφία).

### Τι θα φαίνεται

- Τίτλος: **"Επιλέξτε ημερομηνία άφιξης"**
- Υπότιτλος: **"Ελάχιστη διάρκεια διαμονής: 3 διανυκτερεύσεις"**
- Δύο μήνες δίπλα-δίπλα (τρέχων + επόμενος) με βέλη πλοήγησης ‹ ›
- Range selection: 1ο κλικ = άφιξη, 2ο κλικ = αναχώρηση, με highlighted range ανάμεσα
- Blocked dates (από τη βάση `blocked_dates`) εμφανίζονται disabled/strikethrough
- Παρελθοντικές ημερομηνίες disabled
- Κάτω αριστερά: link **"Εκκαθάριση ημερομηνιών"** (reset)
- Κάτω από το calendar: κουμπί **"Έλεγχος διαθεσιμότητας"** που μεταφέρει τις επιλεγμένες ημερομηνίες στη φόρμα κράτησης (BookingBar / /booking route)
- Responsive: 2 μήνες desktop, 1 μήνας mobile

### Τεχνική υλοποίηση

- Νέο section στο `src/routes/index.tsx` με id `#calendar` (ή `#dates`)
- Χρήση του υπάρχοντος `Calendar` (shadcn / react-day-picker) με:
  - `mode="range"`
  - `numberOfMonths={2}` (responsive: 1 σε mobile via `useIsMobile`)
  - `disabled={[{ before: today }, ...blockedDates]}`
  - `min={3}` για ελάχιστη διάρκεια
- Fetch blocked dates: αν υπάρχει ήδη server fn/query (έλεγχος στο codebase), reuse. Αλλιώς δημιουργία `getBlockedDates` serverFn που διαβάζει `blocked_dates` (public read μέσω anon policy ή server fn).
- State με `useState<DateRange>` — sync με URL search params ώστε το "Έλεγχος διαθεσιμότητας" να κάνει `navigate({ to: '/booking', search: { checkin, checkout } })`.
- Styling με design tokens (warm cream/terracotta), custom classes για range highlight ώστε να δείχνει όπως το screenshot.
- Προσθήκη link στο main nav "Ημερομηνίες" → `#calendar` (αν υπάρχει nav με anchors).

### Τι δεν αλλάζει

- BookingBar, /booking route, υπάρχοντα sections.
- Business logic κρατήσεων.
