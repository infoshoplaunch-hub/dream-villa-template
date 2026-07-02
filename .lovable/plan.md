## Στόχος
Νέα floating booking bar στο στυλ του mockup — Sticky κάτω από το header, με range date picker, guest popover (Ενήλικες/Παιδιά/Βρέφη) και κουμπί «Κράτηση» που ανοίγει νέα καρτέλα με τη συνέχεια της κράτησης.

## Τι θα φτιαχτεί

### 1. Νέο component `BookingBar` (sticky κάτω από το header)
Εμφανίζεται σε όλο το site, κάθεται ακριβώς κάτω από το header (top-[header-height], `sticky`, `z-40`). Στο mobile: collapses σε ένα compact κουμπί «Κράτηση».

Layout (desktop): λευκή pill-shaped bar με 4 sections χωρισμένα με vertical dividers:
- **Άφιξη** — μικρό eyebrow «Άφιξη», μεγάλο text «Επιλέξτε ημερομηνία / dd MMM yyyy» + calendar icon → ανοίγει popover με range picker (μήνας 1)
- **Αναχώρηση** — ίδιο, ανοίγει το ίδιο range picker εστιάζοντας στη 2η ημερομηνία
- **Επισκέπτες** — «2 επισκέπτες» → ανοίγει popover με 3 counters:
  - Ενήλικες 13+ ετών (min 1)
  - Παιδιά 2–12 ετών (min 0)
  - Βρέφη κάτω των 2 (min 0, δωρεάν — δεν προσμετρώνται)
  - Περιορισμός: `adults + children ≤ 7`, με disabled + / inline hint όταν φτάσει το όριο
- **CTA «Κράτηση»** — orange pill button, disabled μέχρι να επιλεγούν και οι δύο ημερομηνίες

### 2. Νέα σελίδα κράτησης `/booking`
Το CTA κάνει `window.open('/booking?checkin=…&checkout=…&adults=…&children=…&infants=…', '_blank')` (νέα καρτέλα, όπως ζήτησες).

Η σελίδα:
- Header/footer του site
- Αριστερά: **Σύνοψη κράτησης** (ημερομηνίες, νύχτες, επισκέπτες, φωτογραφία βίλας, μικρό «περίληψη») — τα values διαβάζονται από search params μέσω `validateSearch`
- Δεξιά: **Φόρμα στοιχείων** (Ονοματεπώνυμο, Email, Τηλέφωνο, Μήνυμα) + κουμπί «Αποστολή Αιτήματος Κράτησης»
- Υποβολή: κάνει insert στον `bookings` πίνακα (υπάρχει ήδη). Σε επιτυχία: success screen με μήνυμα επιβεβαίωσης και «Επιστροφή στην αρχική».
- Server-side re-validation availability μέσω `get_booked_ranges` πριν το insert (αποφυγή race conditions).

### 3. Availability logic (κοινή)
Το `BookingBar` κάνει fetch το `get_booked_ranges` RPC στο mount και disable-άρει τις κρατημένες ημέρες στο calendar (όπως κάνει ήδη η υπάρχουσα φόρμα).

### 4. Καθαρισμός υπάρχοντος `#booking` section
Το τρέχον μεγάλο navy Booking section παραμένει ως δεύτερο entry point (κάτω μέρος σελίδας), αλλά χωρίς αλλαγές — απλώς εξακολουθεί να δουλεύει. (Πες μου αν προτιμάς να αφαιρεθεί εντελώς αφού πλέον υπάρχει η bar + η dedicated σελίδα.)

## Τεχνική υλοποίηση

**Files:**
- `src/components/booking-bar.tsx` — νέο, sticky bar με 2 Popovers (calendar + guests)
- `src/routes/booking.tsx` — νέα route με `validateSearch` (zod) για τα query params
- `src/routes/__root.tsx` — προσθήκη `<BookingBar />` κάτω από το `<Header />`
- `src/lib/i18n.tsx` — νέα keys: `bar.arrival`, `bar.departure`, `bar.guests`, `bar.book`, `bar.pickDate`, `bar.adults13`, `bar.children212`, `bar.infants2`, `bar.freeInfant`, `bar.maxGuestsHint`, καθώς και όλα τα strings της `/booking` σελίδας
- `src/lib/booking.ts` — μικρό shared helper: `fetchBookedRanges()`, `isRangeAvailable()`, zod schema για τη φόρμα (`z.object({ guest_name, email, phone, message? })` με length limits & email validation)

**State/params:** query params με το shape `{ checkin: string(YYYY-MM-DD), checkout: string, adults: number, children: number, infants: number }`. Το `/booking` route κάνει redirect πίσω στην αρχική αν λείπουν/είναι invalid.

**UI primitives:** shadcn `Popover`, `Calendar` (mode="range"), `Button`, `Input`, `Textarea`, custom stepper (ίδιο pattern με το `NumberField` που ήδη υπάρχει).

**Design tokens:** χρήση των υπαρχόντων `--accent` (orange CTA), `--card` (λευκή bar με soft shadow `shadow-soft`), `--muted-foreground` για eyebrows. Καμία hardcoded τιμή.

**Security:** client-side zod validation + server-side check overlap πριν insert. Δεν χρησιμοποιούμε `dangerouslySetInnerHTML`. Email/phone με length limits (255/50).

## Τι ΔΕΝ αλλάζει
- Hero, About, Rooms, Amenities, Reviews, Location, FAQ — όλα ανέπαφα
- Ο πίνακας `bookings` και το RPC — υπάρχουν ήδη, χρησιμοποιούνται ως έχουν
- Υπάρχον `#booking` section — παραμένει (πες αν το θες remove)
