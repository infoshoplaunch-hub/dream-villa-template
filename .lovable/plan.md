## Στόχος
Αντικατάσταση του κειμένου "Ekaterini VIP" στο header με το ανεβασμένο λογότυπο, με αφαίρεση του λευκού φόντου για να ταιριάζει με το transparent header.

## Βήματα υλοποίησης

### 1. Επεξεργασία λογοτύπου
- Χρήση `imagegen--edit_image` στο ανεβασμένο `user-uploads://Logo_Ekaterinivipvilla.png`
- Αφαίρεση λευκού φόντου (transparent background)
- Αποθήκευση ως PNG transparent σε `src/assets/logo.png`

### 2. Δημιουργία CDN asset
- `lovable-assets create --file src/assets/logo.png > src/assets/logo.png.asset.json`
- Διαγραφή του τοπικού `src/assets/logo.png` (διατηρείται μόνο το `.asset.json` pointer)

### 3. Τροποποίηση Header component (`src/routes/index.tsx`)
- Αντικατάσταση του text block "Ekaterini VIP" (γραμμές 127–133) με `<img>` που φορτώνει το λογότυπο από το asset URL
- Ρύθμιση ύψους λογοτύπου περίπου 40–48px για desktop και 32–36px για mobile
- Διατήρηση του link behavior (`<a href="#home">`)
- Εφαρμογή `brightness-0 invert` ή αντίστοιχου filter όταν το header είναι πάνω από την hero εικόνα (scrolled = false, text λευκό), ώστε το λογότυπο να φαίνεται και σε σκούρο background
- Όταν scrolled = true, το λογότυπο εμφανίζεται με κανονικά χρώματα (το header έχει light background)
- Αντίστοιχη αντικατάσταση στο mobile menu (γραμμές 171–173)

### 4. Προσαρμογή στυλ
- Επειδή το λογότυπο έχει χρυσά/μαύρα στοιχεία, σε λευκό text state (πάνω από hero) μπορεί να χρειαστεί CSS filter (invert/brightness) ή να χρησιμοποιηθεί μια λευκή εκδοχή. Θα ελέγξουμε πρακτικά αν το κανονικό λογότυπο διαβάζεται επαρκώς πάνω από τη σκούρα hero — αν όχι, θα εφαρμοστεί filter.

### 5. Επαλήθευση
- Build check (`bun run build`) για TypeScript / bundling errors
- Preview check για σωστή εμφάνιση σε desktop και mobile, scrolled και non-scrolled state