## Ανασχεδιασμός Section "Επιλέξτε ημερομηνία άφιξης" σε 2 στήλες (Booking.com style)

### Layout

Αντικαθιστούμε το τρέχον centered layout με **2-column grid** (desktop), όπως στη φωτογραφία-δείγμα:

```
┌─────────────────────────────────────────────┬──────────────────────┐
│  Επιλέξτε ημερομηνία άφιξης                 │  ┌────────────────┐  │
│  Ελάχιστη διάρκεια διαμονής: 3 διαν/σεις    │  │ ΑΦΙΞΗ  ΑΝΑΧ.   │  │
│                                             │  │ 9/7   16/7     │  │
│  ‹  Ιούλιος 2026        Αύγουστος 2026  ›   │  │ ΕΠΙΣΚΕΠΤΕΣ     │  │
│  Δε Τρ Τε Πε Πα Σα Κυ   Δε Τρ Τε Πε ...     │  │ 2 επισκέπτες ▾ │  │
│  ...  (μεγαλύτερα κελιά)  ...               │  │                │  │
│  ...                                        │  │ [ Κράτηση ]    │  │
│                                             │  │ Δεν χρεώνεστε  │  │
│  Εκκαθάριση ημερομηνιών                     │  │  ακόμα         │  │
│                                             │  └────────────────┘  │
└─────────────────────────────────────────────┴──────────────────────┘
```

- Desktop grid: `md:grid-cols-[1fr_360px]` (ημερολόγιο αριστερά, sticky booking card δεξιά).
- Mobile: stacked (calendar πάνω, card κάτω).
- Το wrapper πάει σε μεγαλύτερο max-width (`max-w-6xl`) και το ημερολόγιο αριστερά (χωρίς `justify-center`) ώστε να φαίνεται πιο κοντά στην αριστερή άκρη.

### Μεγαλύτερο ημερολόγιο

Το shadcn `Calendar` υποστηρίζει `--cell-size` (default `2rem`). Το ανεβάζουμε μέσω className σε `2.75rem` και το padding του day σε πιο άνετο:

```
<Calendar className="[--cell-size:2.75rem] text-[15px] p-0 pointer-events-auto" ... />
```

Επίσης font sizes για weekday/caption μεγαλώνουν ελαφρώς μέσω wrapper class.

### Δεξιό card

Νέο `<aside>` με:
- Δύο πεδία (Άφιξη / Αναχώρηση) — read-only summary από το επιλεγμένο range, με ημερομηνία σε format `d/M/yyyy`. Placeholder "Επιλέξτε" όταν δεν υπάρχει.
- Guests selector (Popover + −/+ controls, max 7, ίδια λογική με το υπάρχον BookingBar). State: `adults`, `children`. Default 2 adults.
- Big primary button **"Κάνε κράτηση"** (accent, rounded-full) — καλεί την ίδια validation με το τρέχον `check()` και κάνει `navigate({ to: "/booking", search: {...} })`.
- Μικρό κείμενο "Δεν θα χρεωθείτε ακόμα" κάτω από το κουμπί.
- Sticky σε desktop (`md:sticky md:top-24`).

Το κουμπί "Έλεγχος διαθεσιμότητας" κάτω από το ημερολόγιο **αφαιρείται** — η ενέργεια μεταφέρεται στο δεξί card ως "Κάνε κράτηση". Παραμένει το link "Εκκαθάριση ημερομηνιών" κάτω αριστερά από το ημερολόγιο.

### Τεχνικά

- Αλλαγή μόνο στο `AvailabilitySection` (src/routes/index.tsx, ~line 916).
- Χρήση των υπάρχοντων: `Calendar` (range mode), `Popover` για guests, `useQuery` για blocked_dates, `toast` για validation, `navigate` προς `/booking`.
- Design tokens μόνο (accent/border/foreground) — καμία σκληροκωδικοποιημένη χρώμα.
- Χωρίς αλλαγές σε άλλα sections, BookingBar, ή /booking route.
