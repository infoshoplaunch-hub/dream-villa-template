import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "el" | "en";

export type Dict = {
  nav: Readonly<Record<string, string>>;
  hero: { eyebrow: string; title: string; subtitle: string; cta1: string; cta2: string; highlights: readonly string[] };
  highlights: { eyebrow: string; title: string; items: readonly { t: string; d: string }[] };
  villa: { eyebrow: string; title: string; p1: string; p2: string; stats: readonly { v: string; l: string }[] };
  amenities: { eyebrow: string; title: string; groups: readonly { h: string; items: readonly string[] }[] };
  gallery: { eyebrow: string; title: string; subtitle: string; tags: readonly string[] };
  location: { eyebrow: string; title: string; text: string; address: string; points: readonly string[] };
  booking: Readonly<Record<string, string>>;
  faq: { eyebrow: string; title: string; items: readonly { q: string; a: string }[] };
  contact: Readonly<Record<string, string>>;
  footer: Readonly<Record<string, string>>;
};

export const translations = {
  el: {
    nav: {
      home: "Αρχική",
      villa: "Η Βίλα",
      rooms: "Οι Χώροι",
      amenities: "Παροχές",
      location: "Τοποθεσία",
      booking: "Κράτηση",
      contact: "Επικοινωνία",
      book: "Κάντε Κράτηση",
    },
    hero: {
      eyebrow: "Καλώς ήρθατε",
      title: "Ζήστε την απόλυτη εμπειρία διαμονής στην Κρήτη",
      subtitle:
        "Η Ekaterini VIP Villa στην Πλάκα Αποκορώνου Χανίων προσφέρει ιδιωτική πισίνα, άνετους χώρους και όλες τις παροχές για μια ξεκούραστη διαμονή με οικογένεια ή παρέα.",
      cta1: "Κάντε Κράτηση",
      cta2: "Δείτε τη Βίλα",
      highlights: [
        "Έως 7 επισκέπτες",
        "3 υπνοδωμάτια",
        "Ιδιωτική πισίνα",
        "Δωρεάν Wi-Fi",
        "Δωρεάν πάρκινγκ",
      ],
    },
    highlights: {
      eyebrow: "Γρήγορη ματιά",
      title: "Όλα όσα χρειάζεστε για ήρεμες διακοπές",
      items: [
        { t: "Έως 7 επισκέπτες", d: "Ιδανική για οικογένειες και παρέες." },
        { t: "3 υπνοδωμάτια", d: "Άνετα δωμάτια με φυσικό φως." },
        { t: "Ιδιωτική πισίνα", d: "Εξωτερική πισίνα με θέα." },
        { t: "Δωρεάν Wi-Fi", d: "Γρήγορο ίντερνετ σε όλο τον χώρο." },
        { t: "Δωρεάν πάρκινγκ", d: "Ιδιωτικός χώρος στάθμευσης." },
        { t: "Ιδανική για οικογένειες", d: "Παιδική χαρά & αίθουσα παιχνιδιών." },
        { t: "Κοντά στην παραλία", d: "Λίγα λεπτά από τη θάλασσα." },
        { t: "BBQ & εξωτερικοί χώροι", d: "Κήπος, βεράντα και τραπεζαρία." },
      ],
    },
    villa: {
      eyebrow: "Η Βίλα",
      title: "Ένα κατάλυμα φτιαγμένο για να μένει αξέχαστο",
      p1: "Η Ekaterini VIP Villa βρίσκεται στην Πλάκα Αποκορώνου, στα Χανιά της Κρήτης, και αποτελεί ιδανική επιλογή για επισκέπτες που αναζητούν άνεση, ιδιωτικότητα και χαλάρωση.",
      p2: "Η βίλα διαθέτει 3 υπνοδωμάτια, άνετους εσωτερικούς χώρους, πλήρως εξοπλισμένη κουζίνα, ιδιωτική πισίνα, BBQ, κήπο και δωρεάν ιδιωτικό χώρο στάθμευσης. Είναι ιδανική για οικογένειες και παρέες έως 7 ατόμων που θέλουν να απολαύσουν ήρεμες διακοπές στην Κρήτη.",
      stats: [
        { v: "7", l: "Επισκέπτες" },
        { v: "3", l: "Υπνοδωμάτια" },
        { v: "24/7", l: "Υποστήριξη" },
      ],
    },
    amenities: {
      eyebrow: "Παροχές",
      title: "Κάθε λεπτομέρεια, φροντισμένη",
      groups: [
        {
          h: "Κύριες Παροχές",
          items: [
            "Ιδιωτική πισίνα",
            "Δωρεάν Wi-Fi",
            "Δωρεάν ιδιωτικός χώρος στάθμευσης",
            "Κλιματισμός",
            "Οικογενειακά δωμάτια",
            "Δωμάτια μη καπνιζόντων",
          ],
        },
        {
          h: "Εσωτερικοί Χώροι",
          items: [
            "Πλήρως εξοπλισμένη κουζίνα",
            "Πλυντήριο ρούχων",
            "Πλυντήριο πιάτων",
            "Ψυγείο",
            "Φούρνος",
            "Καφετιέρα",
            "Σαλόνι / καθιστικό",
            "Τηλεόραση",
          ],
        },
        {
          h: "Εξωτερικοί Χώροι",
          items: [
            "Κήπος",
            "Μπαλκόνι",
            "Βεράντα",
            "Τραπεζαρία εξωτερικού χώρου",
            "Εγκαταστάσεις BBQ",
            "Ξαπλώστρες",
            "Πισίνα με θέα",
          ],
        },
        {
          h: "Οικογενειακές Παροχές",
          items: [
            "Παιδική χαρά",
            "Αίθουσα παιχνιδιών",
            "Επιτραπέζια / παζλ",
            "Εξοπλισμός παιδικής χαράς",
          ],
        },
        {
          h: "Άνεση & Υπηρεσίες",
          items: [
            "24ωρη εξυπηρέτηση",
            "Γρήγορο check-in / check-out",
            "Ελληνικά & Αγγλικά",
            "Κοντά στην παραλία",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Ανακαλύψτε τους χώρους της βίλας",
      subtitle: "Μια ματιά στους χώρους που θα σας υποδεχτούν.",
      tags: ["Εξωτερικοί Χώροι", "Πισίνα", "Υπνοδωμάτια", "Σαλόνι", "Κουζίνα", "Μπάνια", "Θέα"],
    },
    location: {
      eyebrow: "Τοποθεσία",
      title: "Στην Πλάκα Αποκορώνου, κοντά στη θάλασσα",
      text: "Η Ekaterini VIP Villa βρίσκεται στην Πλάκα Αποκορώνου, σε μια ήρεμη και γραφική περιοχή των Χανίων. Η τοποθεσία συνδυάζει την ιδιωτικότητα που θέλετε στις διακοπές σας, με εύκολη πρόσβαση στη θάλασσα, σε τοπικές ταβέρνες και στα πιο όμορφα σημεία του Αποκόρωνα.",
      address: "Plaka Apokoronos, 73008 Chania, Crete, Greece",
      points: [
        "Κοντά σε παραλίες και τοπικές ταβέρνες",
        "Ήρεμη περιοχή, ιδανική για οικογένειες",
        "Εύκολη πρόσβαση στα Χανιά και στον Αποκόρωνα",
        "Ιδανική βάση για ημερήσιες εξορμήσεις",
      ],
    },
    booking: {
      eyebrow: "Κράτηση",
      title: "Κάντε Αίτημα Κράτησης",
      subtitle:
        "Συμπληρώστε τις ημερομηνίες που σας ενδιαφέρουν και θα επικοινωνήσουμε μαζί σας για επιβεβαίωση διαθεσιμότητας και τιμής.",
      cardTitle: "Επιλέξτε τη διαμονή σας",
      name: "Ονοματεπώνυμο",
      email: "Email",
      phone: "Τηλέφωνο",
      checkin: "Ημερομηνία Άφιξης",
      checkout: "Ημερομηνία Αναχώρησης",
      adults: "Ενήλικες",
      children: "Παιδιά",
      guests: "Επισκέπτες",
      message: "Μήνυμα / Ειδικές πληροφορίες",
      submit: "Αποστολή Αιτήματος Κράτησης",
      submitting: "Αποστολή...",
      microcopy: "Θα επικοινωνήσουμε μαζί σας σύντομα για επιβεβαίωση διαθεσιμότητας και τιμής.",
      or: "ή επικοινωνήστε απευθείας",
      pickDates: "Επιλέξτε ημερομηνίες",
      selectedRange: "Επιλεγμένη διαμονή",
      nights: "διανυκτερεύσεις",
      unavailableLegend: "Μη διαθέσιμες",
      success: "Το αίτημά σας καταχωρήθηκε με επιτυχία. Θα επικοινωνήσουμε μαζί σας σύντομα.",
      errOverlap: "Οι ημερομηνίες που επιλέξατε δεν είναι διαθέσιμες. Παρακαλώ επιλέξτε διαφορετικές ημερομηνίες.",
      errDates: "Παρακαλώ επιλέξτε ημερομηνίες άφιξης και αναχώρησης.",
      errMaxGuests: "Η βίλα μπορεί να φιλοξενήσει έως 7 επισκέπτες.",
      errRequired: "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.",
      errEmail: "Παρακαλώ εισάγετε έγκυρο email.",
      errGeneric: "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Συχνές Ερωτήσεις",
      items: [
        {
          q: "Πόσους επισκέπτες μπορεί να φιλοξενήσει η βίλα;",
          a: "Η Ekaterini VIP Villa μπορεί να φιλοξενήσει έως 7 επισκέπτες.",
        },
        {
          q: "Πόσα υπνοδωμάτια διαθέτει;",
          a: "Η βίλα διαθέτει 3 υπνοδωμάτια.",
        },
        {
          q: "Υπάρχει ιδιωτική πισίνα;",
          a: "Ναι, η βίλα διαθέτει ιδιωτική / εξωτερική πισίνα.",
        },
        {
          q: "Υπάρχει δωρεάν πάρκινγκ;",
          a: "Ναι, υπάρχει δωρεάν ιδιωτικός χώρος στάθμευσης στον χώρο του καταλύματος.",
        },
        {
          q: "Είναι κατάλληλη για οικογένειες;",
          a: "Ναι, η βίλα είναι ιδανική για οικογένειες και παρέες.",
        },
        {
          q: "Πού βρίσκεται η βίλα;",
          a: "Η βίλα βρίσκεται στην Πλάκα Αποκορώνου, στα Χανιά της Κρήτης.",
        },
      ],
    },
    contact: {
      eyebrow: "Επικοινωνία",
      title: "Ας μιλήσουμε",
      manager: "Υπεύθυνη",
      phone: "Τηλέφωνο",
      email: "Email",
      address: "Διεύθυνση",
      text: "Βρισκόμαστε στα Χανιά της Κρήτης. Για οποιαδήποτε πληροφορία ή αίτημα κράτησης, μπορείτε να επικοινωνήσετε μαζί μας τηλεφωνικά, μέσω email ή συμπληρώνοντας τη φόρμα.",
    },
    footer: {
      tagline: "Πολυτελής διαμονή στην Πλάκα Αποκορώνου, Χανιά.",
      rights: "Με επιφύλαξη κάθε νόμιμου δικαιώματος.",
      explore: "Πλοήγηση",
      contactCol: "Επικοινωνία",
      amenitiesCol: "Παροχές",
    },

  },
  en: {
    nav: {
      home: "Home",
      villa: "The Villa",
      rooms: "Spaces",
      amenities: "Amenities",
      location: "Location",
      booking: "Booking",
      contact: "Contact",
      book: "Book Now",
    },
    hero: {
      eyebrow: "Welcome",
      title: "Live the ultimate stay in Crete",
      subtitle:
        "Ekaterini VIP Villa in Plaka Apokoronos, Chania offers a private pool, spacious living areas and everything you need for a restful stay with family or friends.",
      cta1: "Book Now",
      cta2: "Explore the Villa",
      highlights: [
        "Up to 7 guests",
        "3 bedrooms",
        "Private pool",
        "Free Wi-Fi",
        "Free parking",
      ],
    },
    highlights: {
      eyebrow: "At a glance",
      title: "Everything you need for a serene stay",
      items: [
        { t: "Up to 7 guests", d: "Ideal for families and groups." },
        { t: "3 bedrooms", d: "Comfortable rooms with natural light." },
        { t: "Private pool", d: "Outdoor pool with a view." },
        { t: "Free Wi-Fi", d: "Fast internet across the property." },
        { t: "Free parking", d: "Private parking on-site." },
        { t: "Family friendly", d: "Playground & game room." },
        { t: "Near the beach", d: "Just minutes from the sea." },
        { t: "BBQ & outdoor areas", d: "Garden, veranda and dining." },
      ],
    },
    villa: {
      eyebrow: "The Villa",
      title: "A retreat crafted to be remembered",
      p1: "Ekaterini VIP Villa is located in Plaka Apokoronos, in Chania, Crete, and is an ideal choice for guests looking for comfort, privacy and relaxation.",
      p2: "The villa features 3 bedrooms, spacious interiors, a fully equipped kitchen, a private pool, BBQ, garden and free private parking. It is ideal for families and groups of up to 7 people who want to enjoy peaceful holidays in Crete.",
      stats: [
        { v: "7", l: "Guests" },
        { v: "3", l: "Bedrooms" },
        { v: "24/7", l: "Support" },
      ],
    },
    amenities: {
      eyebrow: "Amenities",
      title: "Every detail, taken care of",
      groups: [
        {
          h: "Main Amenities",
          items: [
            "Private pool",
            "Free Wi-Fi",
            "Free private parking",
            "Air conditioning",
            "Family rooms",
            "Non-smoking rooms",
          ],
        },
        {
          h: "Indoor Spaces",
          items: [
            "Fully equipped kitchen",
            "Washing machine",
            "Dishwasher",
            "Refrigerator",
            "Oven",
            "Coffee machine",
            "Living room",
            "Television",
          ],
        },
        {
          h: "Outdoor Spaces",
          items: [
            "Garden",
            "Balcony",
            "Veranda",
            "Outdoor dining area",
            "BBQ facilities",
            "Sun loungers",
            "Pool with a view",
          ],
        },
        {
          h: "Family Features",
          items: ["Playground", "Game room", "Board games / puzzles", "Playground equipment"],
        },
        {
          h: "Comfort & Services",
          items: [
            "24-hour service",
            "Fast check-in / check-out",
            "Greek & English",
            "Near the beach",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Discover the villa's spaces",
      subtitle: "A glimpse of the spaces that will welcome you.",
      tags: ["Outdoors", "Pool", "Bedrooms", "Living", "Kitchen", "Bathrooms", "View"],
    },
    location: {
      eyebrow: "Location",
      title: "In Plaka Apokoronos, close to the sea",
      text: "Ekaterini VIP Villa is located in Plaka Apokoronos, in a calm and picturesque area of Chania. The location combines the privacy you want on holiday with easy access to the sea, local tavernas and the most beautiful spots of Apokoronas.",
      address: "Plaka Apokoronos, 73008 Chania, Crete, Greece",
      points: [
        "Close to beaches and local tavernas",
        "Quiet area, ideal for families",
        "Easy access to Chania and Apokoronas",
        "Perfect base for day trips",
      ],
    },
    booking: {
      eyebrow: "Booking",
      title: "Request a Booking",
      subtitle:
        "Fill in your details and we will contact you to confirm availability and pricing.",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      checkin: "Check-in Date",
      checkout: "Check-out Date",
      guests: "Number of Guests",
      message: "Message / Special Notes",
      submit: "Send Request",
      or: "or contact us directly",
      success: "Your request has been sent. We will get back to you shortly.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        { q: "How many guests can the villa host?", a: "Ekaterini VIP Villa can host up to 7 guests." },
        { q: "How many bedrooms does it have?", a: "The villa has 3 bedrooms." },
        { q: "Is there a private pool?", a: "Yes, the villa has a private outdoor pool." },
        { q: "Is there free parking?", a: "Yes, free private parking is available on-site." },
        { q: "Is it suitable for families?", a: "Yes, the villa is ideal for families and groups." },
        { q: "Where is the villa located?", a: "The villa is in Plaka Apokoronos, Chania, Crete." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk",
      manager: "Manager",
      phone: "Phone",
      email: "Email",
      address: "Address",
      text: "We are based in Chania, Crete. For any information or booking request, please contact us by phone, email or by filling out the form.",
    },
    footer: {
      tagline: "Luxury stay in Plaka Apokoronos, Chania.",
      rights: "All rights reserved.",
      explore: "Explore",
      contactCol: "Contact",
      amenitiesCol: "Amenities",
    },
  },
} as const;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("el");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "el" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  return (
    <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}>{children}</I18nCtx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
