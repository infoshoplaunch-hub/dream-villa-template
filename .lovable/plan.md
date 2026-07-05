## Στόχος
Να κατευθύνουμε τους επισκέπτες από την αρχική στη νέα σελίδα `/gallery` μέσω δύο σημείων.

## Αλλαγές

### 1. Section «Γιατί να μας διαλέξετε» — κουμπί «Δείτε τη Βίλα»
`src/routes/index.tsx` (γύρω στη γραμμή 655): αντικατάσταση του `<a href="#gallery">` με TanStack `<Link to="/gallery">`, διατηρώντας το ίδιο styling (outline pill με accent χρώμα).

### 2. Νέο CTA κάτω από το Bento Gallery
Στο section που φιλοξενεί το `<InteractiveBentoGallery>` (γύρω στη γραμμή 789), προσθήκη κάτω από το component ενός centered CTA:

- Κείμενο: «Δείτε όλες τις φωτογραφίες» (EN: «View all photos») — μέσω `t.gallery` string στο `src/lib/i18n.tsx` (νέο κλειδί `viewAllCta`).
- Στοιχείο: `<Link to="/gallery">` με το ίδιο pill styling του hero cta2 (accent border, hover fill) + `ArrowRight` icon.
- Wrapper: `mt-10 flex justify-center`.

### 3. i18n
Στο `src/lib/i18n.tsx` προσθήκη πεδίου `viewAllCta` στο `gallery` object και για τις δύο γλώσσες (el: «Δείτε όλες τις φωτογραφίες», en: «View all photos»), καθώς και στο TS type.

## Εκτός σκοπού
- Δεν αλλάζουμε το hero cta2 (μένει να σκρολάρει στο `#villa`).
- Δεν πειράζουμε τα play icons του bento — παραμένουν για preview των εικόνων/βίντεο in-place.
- Δεν αλλάζουμε το nav link «Gallery» (ήδη οδηγεί στο `/gallery`).
