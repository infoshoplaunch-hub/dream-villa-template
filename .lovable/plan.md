Plan: Hero subtitle single-line fix

The hero subtitle "Ζήστε την απόλυτη εμπειρία διαμονής στην Κρήτη" currently breaks to two lines on some viewports. The user chose option 1: widen the container.

**Change:**
- In `src/routes/index.tsx`, remove or increase the `max-w-2xl` constraint on the hero text container (`<div className="max-w-2xl text-white">`) so the subtitle can breathe on one line across common desktop widths.
- Keep the existing responsive typography sizes (`text-2xl md:text-3xl`) unchanged.
- Ensure text still remains left-aligned and readable against the dark cinematic overlay.

**Estimated impact:** One line edit in `src/routes/index.tsx`. No other files touched.