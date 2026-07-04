## Στόχος

Νέα καρτέλα **Gallery** στο μενού, όπου εμφανίζονται όλες οι φωτογραφίες της βίλας. Θα μπορείς να ανεβάζεις/σβήνεις φωτογραφίες μόνος σου από το `/admin` panel, χωρίς να χρειάζεται να τις στέλνεις εδώ κάθε φορά.

## Τι θα δει ο επισκέπτης

- Νέος σύνδεσμος **"Gallery"** στο κεντρικό μενού (header) δίπλα στα υπάρχοντα.
- Σελίδα `/gallery` με:
  - Hero τίτλο "Gallery — Ekaterini VIP Villa"
  - Responsive grid (masonry-style) με όλες τις φωτογραφίες
  - Click σε φωτογραφία → lightbox με μεγέθυνση & πλοήγηση (πρόηγ./επόμ.)
  - Lazy loading για γρήγορη φόρτωση
- Οι φωτογραφίες θα φορτώνονται δυναμικά από τη βάση, ταξινομημένες με τη σειρά που τις ανέβασες (νεότερες πρώτα).

## Τι θα κάνεις εσύ από το /admin

Νέα καρτέλα **"Gallery"** μέσα στο admin panel με:
- **Upload**: drag & drop ή επιλογή αρχείων (πολλαπλή). Δέχεται JPG/PNG/WebP.
- **Λίστα** με όλες τις φωτογραφίες σε thumbnails.
- **Διαγραφή** με ένα click.
- Προαιρετικό πεδίο "λεζάντα" για κάθε φωτογραφία.

## Τεχνικά (σύντομο)

- Νέο route: `src/routes/gallery.tsx` (public) με δικό του `head()` για SEO.
- Νέο route: `src/routes/_authenticated/admin.gallery.tsx` για τη διαχείριση.
- Πίνακας `gallery_photos` (storage_path, caption, sort_order) + RLS: public read, admin-only write.
- Storage bucket `gallery` (public) για τα binary αρχεία.
- Το υπάρχον section "Οι Χώροι Μας" στην αρχική **παραμένει ως έχει** — δεν αγγίζουμε τη hardcoded bento gallery.
- Link "Gallery" προστίθεται στο header nav.
