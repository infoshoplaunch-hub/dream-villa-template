
## Στόχος

Όταν κάποιος υποβάλλει αίτημα κράτησης από το site:
1. Αποθηκεύεται στη βάση ως `pending`
2. Στέλνεται email στον ιδιοκτήτη (`info@katerinavipvilla.gr`) με τα στοιχεία του αιτήματος
3. Στέλνεται email επιβεβαίωσης λήψης στον επισκέπτη

Το αίτημα παραμένει `pending` μέχρι ο ιδιοκτήτης να επιβεβαιώσει χειροκίνητα από το /admin.

## Βήματα υλοποίησης

**1. Email infrastructure (Lovable Emails)**
- Ρύθμιση email domain μέσω Lovable (default sender – χωρίς DNS setup)
- Δημιουργία queue/tables για αξιόπιστη αποστολή με retry
- Αποθήκευση `OWNER_EMAIL = info@katerinavipvilla.gr` ως secret

**2. Έλεγχος διαθεσιμότητας πριν την υποβολή**
- Στη σελίδα `/booking`: πριν σταλεί το αίτημα, ελέγχονται οι επιλεγμένες ημερομηνίες έναντι:
  - `blocked_dates` (admin calendar)
  - Ήδη `confirmed` κρατήσεων
- Αν κάποια ημερομηνία δεν είναι διαθέσιμη → σφάλμα, δεν προχωράει

**3. Public server route για υποβολή αιτήματος**
- Νέο route `/api/public/booking-request` (POST)
- Zod validation (όνομα, email, τηλέφωνο, ημερομηνίες, άτομα, μήνυμα)
- Insert στον πίνακα `bookings` με status `pending`
- Trigger 2 emails μέσω της Lovable email queue

**4. Email templates (React Email, EL + EN)**
- `booking-request-owner.tsx` → προς ιδιοκτήτη
  - Θέμα: «Νέο αίτημα κράτησης — [όνομα], [check-in] → [check-out]»
  - Περιεχόμενο: πλήρη στοιχεία επισκέπτη, ημερομηνίες, άτομα, μήνυμα, link προς /admin
- `booking-request-guest.tsx` → προς επισκέπτη
  - Θέμα: «Λάβαμε το αίτημα κράτησής σας — Ekaterini VIP Villa»
  - Περιεχόμενο: ευχαριστίες, σύνοψη αιτήματος, ξεκάθαρη σημείωση ότι είναι αίτημα και θα επιβεβαιωθεί μέσω email/τηλεφώνου, στοιχεία επικοινωνίας
- Γλώσσα email = τρέχουσα γλώσσα του site (EL/EN)
- Branding: χρώματα/typography της villa

**5. Ενημέρωση φόρμας booking**
- Το `src/routes/booking.tsx` δεν θα ανοίγει πλέον `mailto:` — θα καλεί το νέο endpoint
- Success state: «Λάβαμε το αίτημά σας — θα επικοινωνήσουμε σύντομα»
- Error handling για μη διαθέσιμες ημερομηνίες

**6. Admin panel**
- Οι υπάρχουσες κρατήσεις εμφανίζονται ήδη με status. Καμία αλλαγή στη λειτουργία επιβεβαίωσης.

## Τι ΔΕΝ αλλάζει
- Design, layout, branding, χρώματα
- Admin functionality
- Booking widget / calendar UI
- Blocked dates λογική
