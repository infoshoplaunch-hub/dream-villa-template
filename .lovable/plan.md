## Στόχος
Όλα τα κουμπιά "Κάντε Κράτηση" και "Αίτημα Κράτησης" στην αρχική σελίδα να οδηγούν στη σελίδα `/booking` (ημερολόγιο άφιξης-αναχώρησης), αντί να ανοίγουν mailto.

## Αλλαγές

### `src/routes/index.tsx`
- **Hero CTA1 "Κάντε Κράτηση"**: Αντικατάσταση `<a href="mailto:...">` με `<Link to="/booking">`.
- **Header "Κάντε Κράτηση" (desktop + mobile menu)**: Αντικατάσταση `mailto` με `<Link to="/booking">`.
- **BookingSection "Αίτημα Κράτησης"**: Αντικατάσταση `mailto` με `<Link to="/booking">`, διατήρηση ίδιου styling.
- **Sticky mobile CTA**: Αντικατάσταση `mailto` με `<Link to="/booking">`.

### `src/lib/i18n.tsx`
Προσθήκη κειμένου `viewAllCta` ή ενημέρωση υπαρχόντων labels αν χρειάζεται.

## Τι ΔΕΝ αλλάζει
- Το `BookingBar` στο hero ήδη πλοηγείται σωστά στο `/booking` με search params.
- Το `/booking` ήδη υπάρχει και δέχεται `check_in`, `check_out`, `adults`, `children`.

## Εκτιμώμενο αποτέλεσμα
Ο επισκέπτης πατάει οποιοδήποτε κουμπί κράτησης και πηγαίνει κατευθείαν στη σελίδα με το ημερολόγιο και τη φόρμα αιτήματος.