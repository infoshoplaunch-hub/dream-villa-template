## Plan: Χρήση της πραγματικής φωτογραφίας της βίλας στο Hero

Η φωτογραφία που ανέβασες (Katerina-6.jpg) είναι εξαιρετική — δείχνει το σπίτι με την πισίνα στο ηλιοβασίλεμα, με ζεστά φώτα και θέα. Ταιριάζει τέλεια σαν κεντρική εικόνα του hero.

### Βήματα

1. **Ανέβασμα ως Lovable Asset** (χωρίς να μπει το binary στο repo)
   - `lovable-assets create --file /mnt/user-uploads/Katerina-6.jpg --filename villa-hero.jpg > src/assets/villa-hero.jpg.asset.json`

2. **Αντικατάσταση του hero image** στο `src/routes/index.tsx`
   - Αφαίρεση του τρέχοντος AI-generated hero image import
   - Import του νέου asset pointer και χρήση του `.url` στο `<img>` / background του hero
   - Διατήρηση του overlay, τυπογραφίας, CTA και layout ως έχουν

3. **SEO / social preview**
   - Ενημέρωση του `og:image` στο head της index route ώστε να δείχνει την πραγματική βίλα (absolute https URL από το asset)
   - Ενημέρωση του `alt` σε κάτι περιγραφικό: "Ekaterini VIP Villa — εξωτερική όψη με πισίνα στο ηλιοβασίλεμα"

### Ερωτήσεις πριν προχωρήσω

- Να **αντικαταστήσω** και τη φωτογραφία στο gallery/exterior με αυτή, ή μόνο στο hero;
- Έχεις κι άλλες πραγματικές φωτογραφίες (υπνοδωμάτια, σαλόνι, κουζίνα κλπ.) για να αντικαταστήσουμε σταδιακά όλες τις AI εικόνες; Αν ναι, ανέβασέ τες και θα τις οργανώσω μαζί.
