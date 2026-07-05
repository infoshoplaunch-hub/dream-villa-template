# Αυτόματα email για αιτήματα κράτησης

## Τι λείπει σήμερα

Η φόρμα στο `/booking` ανοίγει απλώς `mailto:` — κανένα αίτημα δεν αποθηκεύεται, κανένα email δεν φεύγει αυτόματα. Το email domain `notify.ekaterinivipvila.gr` είναι στημένο, αλλά δεν υπάρχουν templates ούτε endpoints.

## Τι θα φτιάξω

### 1. Email templates (React Email, EL/EN, branded)
- `booking-request-owner` → σε εσάς (`info@katerinavipvilla.gr`)
  - Θέμα: «Νέο αίτημα κράτησης — [όνομα], [check-in] → [check-out]»
  - Περιεχόμενο: πλήρη στοιχεία επισκέπτη (όνομα, email, τηλέφωνο), ημερομηνίες, διανυκτερεύσεις, ενήλικες/παιδιά, μήνυμα, κουμπί προς `/admin`
- `booking-request-guest` → στον επισκέπτη
  - Θέμα: «Λάβαμε το αίτημα κράτησής σας — Ekaterini VIP Villa»
  - Περιεχόμενο: ευχαριστίες, σύνοψη αιτήματος, ξεκάθαρη σημείωση ότι είναι **αίτημα** και θα επιβεβαιωθεί μέσω email ή τηλεφώνου, στοιχεία επικοινωνίας
  - Γλώσσα (EL/EN) ανάλογα με την τρέχουσα γλώσσα του site

### 2. Public server route `/api/public/booking-request` (POST)
- Zod validation (όνομα, email, τηλέφωνο, ημερομηνίες, άτομα, μήνυμα)
- Έλεγχος διαθεσιμότητας έναντι `blocked_dates` και υπάρχουσων `confirmed` κρατήσεων — αν κάποια ημερομηνία δεν είναι διαθέσιμη → 409 error
- Insert στον πίνακα `bookings` με status `pending`
- Ενεργοποίηση των 2 email μέσω της υπάρχουσας email queue

### 3. Ενημέρωση της φόρμας `/booking`
- Το submit καλεί το νέο endpoint αντί για `mailto:`
- Loading state στο κουμπί
- Error handling για μη διαθέσιμες ημερομηνίες («Οι ημερομηνίες δεν είναι πια διαθέσιμες»)
- Success state όπως ήδη υπάρχει

### 4. Scaffold email send infrastructure
- Κλήση του transactional email scaffold (δημιουργεί `/lovable/email/transactional/send` route + templates registry)
- Εγγραφή των 2 templates
- Ο owner alerting γίνεται μέσω δεύτερης εσωτερικής κλήσης στο ίδιο endpoint με service role — δεν εκτίθεται το `send` route σε public καλέσεις χωρίς auth

## Τι ΔΕΝ αλλάζει
- Design, χρώματα, layout, branding
- Admin panel & flow επιβεβαίωσης (παραμένει χειροκίνητο)
- Booking widget, calendar, blocked dates λογική
- RLS policies του `bookings`

## Αποτέλεσμα
Επισκέπτης υποβάλλει αίτημα → αποθηκεύεται ως `pending` → εσείς λαμβάνετε email στο `info@katerinavipvilla.gr` → ο επισκέπτης λαμβάνει email επιβεβαίωσης λήψης → επιβεβαιώνετε χειροκίνητα από το `/admin`.
