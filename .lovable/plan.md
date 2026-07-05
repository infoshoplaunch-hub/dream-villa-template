## Στόχος
Πιο γρήγορη, ασφαλής και πληροφορημένη διαχείριση του `/admin` ημερολογίου — χωρίς αλλαγή στο design language.

## Τι προτείνω να βελτιώσουμε

### 1. Bulk unblock ολόκληρου εύρους
Σήμερα ξεμπλοκάρεις μία-μία μέρα. Θα προσθέσω ένα δεύτερο κουμπί «Ξεμπλοκάρισμα εύρους» που διαγράφει όλες τις blocked ημέρες μέσα στο επιλεγμένο range με ένα click.

### 2. Quick presets πάνω από το calendar
Chips για γρήγορο block:
- «Αυτό το Σαββατοκύριακο»
- «Επόμενο Σ/Κ»
- «Όλος ο μήνας» (του τρέχοντος view)
Θέτουν αυτόματα το `range` — ο χρήστης απλά πατά «Μπλοκάρισμα».

### 3. Guardrails & έξυπνες προειδοποιήσεις
- Confirm dialog όταν μπλοκάρεις >7 ημέρες.
- Warning αν το range επικαλύπτεται με confirmed κράτηση (block επιτρέπεται αλλά ζητά επιβεβαίωση).
- Αποτροπή block στο παρελθόν (`disabled` past days στο calendar).

### 4. Πληροφορία κράτησης on hover / click σε booked day
Σήμερα τα confirmed είναι απλό χρώμα. Θα προσθέσω tooltip με όνομα guest + check-in→check-out στις booked ημέρες, ώστε ο admin να ξέρει ποια κράτηση είναι.

### 5. Βελτιωμένη λίστα «Μπλοκαρισμένες ημέρες»
- Grouping διαδοχικών ημερών σε ένα row (π.χ. «12–15 Ιουλ 2026» αντί για 4 ξεχωριστές γραμμές) με single delete για όλο το group.
- Search / filter με βάση σημείωση.
- Section «Επερχόμενες» vs «Παρελθόν» με collapse του παρελθόντος.

### 6. Pending bookings quick view (bonus, μικρό)
Μικρό banner στην κορυφή: «X εκκρεμείς κρατήσεις» με link/scroll σε νέο mini-panel για γρήγορο confirm/decline απευθείας από το admin (χρησιμοποιεί υπάρχον RLS `Admins can update bookings`).

### 7. UX polish
- Optimistic updates στο block/unblock (χωρίς αναμονή refetch).
- Keyboard: `Esc` καθαρίζει το επιλεγμένο range.
- Καλύτερο empty state στη λίστα.

## Τεχνικές λεπτομέρειες
- Όλα στο `src/routes/_authenticated/admin.tsx`, χωρίς schema changes.
- Το bulk unblock γίνεται με `.delete().in("date", [...])` στον πίνακα `blocked_dates`.
- Grouping ημερών: απλή client-side συνάρτηση πάνω στο ήδη sorted `blockedQuery.data`.
- Tooltip: shadcn `Tooltip` γύρω από custom `DayContent` του react-day-picker.
- Reduced motion & υπάρχον luxury look διατηρούνται.

## Τι θέλω να μου επιβεβαιώσεις
Θες να τα κάνω **όλα** τα παραπάνω, ή να ξεκινήσουμε με ένα υποσύνολο; Η πρότασή μου είναι priority: **1, 2, 3, 5** τώρα — και **4, 6** σε δεύτερη φάση. Πες μου.
