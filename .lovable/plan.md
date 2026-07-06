## Στόχος
Προσθήκη εικονιδίου Facebook (circular button) κάτω από το email στη στήλη Brand του footer.

## Τεχνικά βήματα

1. **Custom Facebook SVG icon**
   - Δημιουργία inline `FacebookIcon` component στο `src/routes/index.tsx` (όπως τα υπάρχοντα `ViberIcon` / `WhatsAppIcon`).

2. **Footer edit — στήλη Brand**
   - Μετά το `<a href="mailto:...">`, προσθήκη `<a>` link με:
     - `href="https://www.facebook.com/share/1HurCnSYmv/?mibextid=wwXIfr"`
     - `target="_blank"` + `rel="noopener noreferrer"`
     - Circular container: `flex items-center justify-center rounded-full`
     - Μέγεθος ~40px, background `#D98445` (brand accent), white icon
     - Hover: slightly darker background με 200ms transition
     - `mt-4` spacing από το email
     - aria-label για accessibility

3. **Style tokens**
   - Χρήση υπαρχόντων χρωμάτων: background `#D98445`, hover `#C06A2E`, λευκό εικονίδιο.
   - Shadow: `shadow-sm` για subtle depth.

4. **Verification**
   - Typecheck pass.
   - Visual check: το button εμφανίζεται κάτω από το email, είναι clickable, ανοίγει Facebook σε νέο tab.

## Scope
- Μόνο το `src/routes/index.tsx`.
- Καμία αλλαγή σε άλλο footer content, translations, ή functionality.