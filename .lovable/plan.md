## Footer Redesign — match mockup style

Αλλάζουμε ΜΟΝΟ το `Footer` component στο `src/routes/index.tsx` (γραμμές 913–963). Καμία άλλη αλλαγή στη σελίδα.

### Νέο layout (desktop)

```
[ BRAND + tagline + email ]   [ Πλοήγηση ]   [ Παροχές ]   [ Επικοινωνία ]
```

- Grid 4 στηλών σε desktop (`md:grid-cols-4`), 2 σε tablet, 1 σε mobile.
- Πρώτη στήλη πιο πλατιά (π.χ. `md:col-span-1` με μεγαλύτερο max-width στο tagline) — όπως στο mockup το brand block είναι το πιο "βαρύ".

### Visual style (από το mockup)

- **Background**: ανοιχτό (light) αντί για το τρέχον navy. Θα χρησιμοποιήσω `bg-[hsl(35_35%_96%)]` (ίδιο ivory με το Reviews section) για συνέπεια, με top border `border-border`.
- **Brand**: "Ekaterini <span accent>VIP</span> Villa" σε `font-serif`, σκούρο navy (`text-foreground`), με orange accent στο "VIP" (ήδη υπάρχει).
- **Tagline**: `text-muted-foreground`, μικρότερο, max-w περιορισμένο.
- **Email κάτω από tagline** ως link (`info@katerinavipvilla.gr`) — όπως στο mockup που έχει email κάτω από το tagline.
- **Language switcher**: παραμένει κάτω από το email στην πρώτη στήλη.
- **Column headings**: `Πλοήγηση`, `Παροχές`, `Επικοινωνία` σε bold, σκούρο, μεγαλύτερο (`text-base font-semibold text-foreground`) — όχι uppercase micro-caps όπως τώρα, για να ταιριάζει με το "Quick Links" heading style του mockup.
- **Links / items**: `text-muted-foreground`, hover → `text-accent` (orange).

### Στήλες περιεχομένου

1. **Brand** — logo text + tagline + email + LangSwitch.
2. **Πλοήγηση** — Η Βίλα, Οι Χώροι, Παροχές, Κριτικές, Τοποθεσία (από `NAV_IDS`).
3. **Παροχές** — quick list: Πισίνα, Wi-Fi, Parking, BBQ, Κήπος (static, 4–5 items, μεταφρασμένα μέσω `t.footer` — θα προσθέσω νέο key `amenitiesList` σε `src/lib/i18n.tsx`).
4. **Επικοινωνία** — Plaka Apokoronos Chania, +30 6940 133 837, +30 6948 014 277.
   (Το email μεταφέρεται στην πρώτη στήλη κάτω από το tagline όπως στο mockup, άρα δεν επαναλαμβάνεται εδώ.)

### Bottom bar

- Λεπτή γραμμή (`border-t border-border`) με copyright αριστερά σε `text-muted-foreground`. Ίδια δομή, νέα χρώματα για light bg.

### i18n

Προσθήκη στο `t.footer` (EL + EN):
- `amenitiesCol: "Παροχές" / "Amenities"`
- `amenitiesList: ["Πισίνα", "Wi-Fi", "Parking", "BBQ", "Κήπος"]` (και EN αντίστοιχα)

Χωρίς άλλες αλλαγές. Build αναμένεται να περάσει.
