## Redesign σελίδας `/booking` σύμφωνα με το mockup

Επιστρέφουμε από το τρέχον split-screen (cinematic villa panel αριστερά, φόρμα δεξιά) στο layout που δείχνει το mockup: cream σελίδα με φόρμα στα αριστερά και compact villa summary card στα δεξιά.

### Δομή

**Top bar** (ίδιο με τώρα): `← Επιστροφή` αριστερά, `Ekaterini VIP Villa` δεξιά, minimal, subtle border.

**Layout**: 2 στήλες σε desktop με αναλογία περίπου 1fr / 460px. Σε mobile στοιβάζεται (φόρμα πρώτη, card μετά).

### Αριστερή στήλη
1. Eyebrow `— ΚΡΑΤΗΣΗ` σε orange.
2. Τίτλος `Ολοκληρώστε το αίτημα κράτησης` με τη λέξη `αίτημα` σε orange italic serif.
3. Υπότιτλος: `Συμπληρώστε τα στοιχεία σας και η διαχείριση της Ekaterini VIP Villa θα επικοινωνήσει μαζί σας για διαθεσιμότητα, τιμή και επιβεβαίωση.`
4. **Card «Τα στοιχεία σας»** (rounded-3xl, λευκό, soft shadow, subtle border):
   - Grid 2 στηλών: `ΟΝΟΜΑ *` / `ΕΠΩΝΥΜΟ *`, `EMAIL *` / `ΤΗΛΕΦΩΝΟ *`.
   - Full-width `ΜΗΝΥΜΑ / ΕΙΔΙΚΑ ΑΙΤΗΜΑΤΑ` textarea με placeholder «Πείτε μας αν έχετε κάποια ειδική προτίμηση ή αίτημα...».
   - Inputs: rounded-2xl, subtle border, εικονίδιο αριστερά (user / mail / phone / message), orange focus ring.
   - Full-width orange pill CTA `Αποστολή Αιτήματος Κράτησης` με paper-plane icon.
   - Microcopy από κάτω: `🔒 Δεν θα χρεωθείτε σε αυτό το βήμα.`
5. **Card «Χρήσιμες πληροφορίες»** ακριβώς κάτω (ξεχωριστό card, ίδιο radius/shadow):
   - Grid 4 στηλών (desktop) / 2 (mobile) με πράσινα check badges σε ανοιχτόχρωμο κύκλο και κείμενα στοιχισμένα κεντρικά κάτω:
     - `Δεν χρειάζεται πιστωτική κάρτα`
     - `Δεν θα χρεωθείτε τώρα`
     - `Η διαχείριση θα επικοινωνήσει μαζί σας για επιβεβαίωση`
     - `Μπορείτε να αναφέρετε ειδικά αιτήματα`

### Δεξιά στήλη — Villa summary card (sticky σε desktop)
Ένα ενιαίο rounded-3xl card, soft shadow, subtle border:
1. Μεγάλη villa φωτογραφία (`villa-hero.jpg`) στο πάνω μέρος, στρογγυλεμένη με το card (aspect ~4/3).
2. Τίτλος `Ekaterini VIP Villa` (serif).
3. Location row με pin icon: `Πλάκα Αποκορώνου, Χανιά, Κρήτη`.
4. Grid amenity pills σε 2 σειρές με λεπτό border, ανοιχτό background, mini icon αριστερά:
   - `Έως 7 επισκέπτες`, `3 υπνοδωμάτια`
   - `Ιδιωτική πισίνα`, `Δωρεάν Wi-Fi`
   - `Δωρεάν πάρκινγκ`
5. Divider.
6. Section `Τα στοιχεία της κράτησής σας` με 4 rows:
   - Κάθε row: κύκλος με icon (calendar / calendar / users / moon), label uppercase πάνω, value από κάτω, `Αλλαγή` link σε orange δεξιά (εκτός από τη Διαμονή).
   - Values: dynamic από `check_in`, `check_out`, `adults`+`children`, `nights`.
   - `Αλλαγή` → `navigate({ to: "/", hash: "home" })`.
7. Bottom notice box: ανοιχτό orange tint, rounded-2xl, info icon + `Η κράτηση επιβεβαιώνεται μετά από επικοινωνία με τη διαχείριση.`

### Success state
Παραμένει όπως έχει: centered card με check icon, τίτλο, περιγραφή και CTA `Επιστροφή στην αρχική`.

### Functional / validation
Καμία αλλαγή στη λογική: Zod validation στα ίδια πεδία, `mailto:` submit, ελληνικά error messages, τα search params (`check_in`, `check_out`, `adults`, `children`, `total_guests`) τροφοδοτούν και τη σύνοψη και το email body.

### Τεχνικά
- Αρχείο που αλλάζει μόνο: `src/routes/booking.tsx` (πλήρες rewrite του component, `TopBar`/`Field` helpers παραμένουν).
- Καμία αλλαγή σε `styles.css`, `i18n`, ή άλλα routes/components.
- Χρήση υφιστάμενων `lucide-react` icons (`User`, `Mail`, `Phone`, `MessageSquare`, `Send`, `Lock`, `MapPin`, `Calendar`, `Users`, `Moon`, `Info`, `Check`, `Wifi`, `Car`, `Waves`, `BedDouble`).
