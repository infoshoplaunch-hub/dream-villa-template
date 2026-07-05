### Στόχος
Να αφαιρεθούν τα side margins/paddings που περιορίζουν το availability section στο κέντρο, ώστε το ημερολόγιο και το booking panel να απλώνονται σε όλο το πλάτος της οθόνης.

### Τρέχουσα κατάσταση
Το section `AvailabilitySection` (`src/routes/index.tsx`, γραμμή 993) έχει δύο επίπεδα περιορισμού πλάτους:
1. `container-villa` utility → `max-width: 80rem` + `padding-inline`
2. `mx-auto max-w-[1180px]` wrapper → επιπλέον στενότερο όριο

Μεταξύ τους δημιουργούν μεγάλα κενά αριστερά και δεξιά.

### Αλλαγές

**`src/routes/index.tsx`**
- Αντικατάσταση του `<div className="container-villa">` με `<div className="px-4 md:px-6 lg:px-8">` (ή παρόμοιο minimal horizontal padding) για να μην υπάρχει `max-width`.
- Αφαίρεση του `<div className="mx-auto max-w-[1180px]">` wrapper.
- Το εσωτερικό rounded card (`bg-[#FAF7F1]`) και το grid (`lg:grid-cols-[minmax(0,1fr)_380px]`) παραμένουν ως έχουν — απλώς θα απλώνονται στο διαθέσιμο πλάτος.

**`src/styles.css`**
- Καμία αλλαγή — το `container-villa` utility χρησιμοποιείται και από άλλα sections και δεν πρέπει να τροποποιηθεί globally.

### Τι δεν αλλάζει
- Η λειτουργικότητα του date picker και του booking card.
- Τα χρώματα, typography, shadows, και το internal layout του calendar / card.
- Τα υπόλοιπα sections της σελίδας.

### Αποτέλεσμα
Το ημερολόγιο θα καθίσταται αριστερά και το booking panel δεξιά, χρησιμοποιώντας σχεδόν όλο το viewport width, χωρίς τα μεγάλα εξωτερικά margins που υπάρχουν σήμερα.