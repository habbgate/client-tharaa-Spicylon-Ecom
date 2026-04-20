const fs = require('fs');

const en = {
  "Nav": {
    "home": "Home",
    "spices": "Spices",
    "ourStory": "Our Story",
    "switchEn": "Switch to English (EN)",
    "switchDe": "Switch to German (DE)",
    "greeting": "Hi, "
  },
  "Home": {
    "heroSub": "Finest Ceylon Spices",
    "heroTitle1": "Fire Up Your",
    "heroTitle2": "Kitchen",
    "heroText": "Experience the aromatic soul of Sri Lanka. Hand-picked, sun-dried, and delivered fresh to your door.",
    "shopAll": "Shop All Spices",
    "ourJourney": "Our Journey",
    "whyChooseTitle": "Why Choose Us",
    "whyChooseMain": "The Spicylon Difference",
    "whyChooseDesc": "We skip the middlemen to bring you the purest, most potent spices directly from the misty mountain gardens of Sri Lanka.",
    "feat1Title": "100% Sri Lankan Origin",
    "feat1Desc": "Every clove, peppercorn, and cinnamon quill is authentically grown and harvested on Sri Lankan soil, renowned globally for historical spice trading.",
    "feat2Title": "Organic & Pure",
    "feat2Desc": "No preservatives, no artificial colors, no bulking agents. Just pure, unadulterated spices processed in FDA-certified facilities.",
    "feat3Title": "Harvested Fresh",
    "feat3Desc": "We work directly with farmers to ensure our spices spend less time in warehouses and more time retaining their highly volatile aromatic oils.",
    "featuredColl": "Featured Harvest",
    "exploreFeatured": "Explore our top-selling organic spices from the latest collection.",
    "legacyBadge": "A Legacy of Flavor",
    "historicRoute": "The Historic Spice Route of Ceylon",
    "historyText1": "For centuries, ancient mariners from Rome, Arabia, and China navigated perilous oceans for one prize above all: the legendary spices of Taprobane (Sri Lanka). Our island has been the undisputed crown jewel of the global spice trade, famously birthing true \"Ceylon Cinnamon\" (Cinnamomum verum) and the world's sharpest peppercorns.",
    "historyText2": "This volcanic soil, uniquely balanced tropical climate, and generational farming knowledge create a terroir that simply cannot be replicated anywhere else on Earth.",
    "supplierPre": "Our Proud Official Supplier",
    "supplierName": "Ceylon Spice Garden",
    "supplierText": "We have partnered exclusively with Ceylon Spice Garden to source our premium spices directly from the lush, tropical environments of Sri Lanka. Known for their expansive spice gardens and dedication to traditional Ayurvedic practices, they cultivate world-renowned spices, pure botanical extracts, and natural remedies.",
    "visitSupplier": "Visit ceylonspicegarden.com",
    "joinClub": "Join the Spice Club",
    "joinDesc": "Get 15% off your first order and exclusive recipes delivered to your inbox every month.",
    "emailPlace": "Your email address",
    "joinBtn": "Join"
  },
  "About": {
    "title": "The Legacy of Ceylon Spice",
    "subtitle": "Discover the ancient routes, rich soils, and generations of farming that make Sri Lankan spices the most sought-after in the world.",
    "historyTitle": "A History Shaped by Flavor",
    "historyP1": "Sri Lanka's history is inextricably linked to its spices. Mentioned in ancient texts going back thousands of years, the tear-drop island of the Indian Ocean—once known as Taprobane and later Ceylon—was the final destination for merchants traversing the dangerous maritime Silk Road.",
    "historyP2": "It was the allure of Ceylon Cinnamon, a variety unique strictly to the island, that drove European powers—the Portuguese, Dutch, and British—to cross the globe and fight for control of its shores. For centuries, controlling the Spice Island meant controlling global flavor.",
    "supplierPre": "Our Official Supplier",
    "supplierTitle": "Partnering with Ceylon Spice Garden",
    "supplierP1": "At Spicylon, we refused to compromise. Instead of dealing with multiple intermediaries where spices lose their potency and origins become murky, we went straight to the source. We are incredibly proud to partner exclusively with Ceylon Spice Garden.",
    "supplierP2": "Located deeply within Sri Lanka's lush, mist-covered mountain valleys, Ceylon Spice Garden blends centuries-old Ayurvedic cultivation methods with sustainable, modern organic farming. They are our sole provider, ensuring every harvest is packed with peak aromatic oils and unrivaled purity.",
    "link": "Learn more about our supplier",
    "whyTitle": "Why It Matters",
    "whyDesc": "When you buy Sri Lankan spices, you aren't just seasoning a dish. You're partaking in a botanical history that reshaped the globe. You are tasting the exact same aroma that Roman emperors traded gold for, and tasting the soil of an extraordinary tropical island."
  },
  "Cart": {
    "emptyEmoji": "🛒",
    "emptyTitle": "Your cart is cold.",
    "emptyDesc": "Add some spice to warm it up!",
    "browseBtn": "Browse Spices",
    "title": "Shopping",
    "titleHighlight": "Cart",
    "summaryTitle": "Order Summary",
    "subtotal": "Subtotal",
    "shipping": "Shipping Fee",
    "total": "Total",
    "checkout": "Secure Checkout",
    "secureNote": "Secure payments powered by Stripe"
  },
  "Product": {
    "notFound": "Product not found",
    "organic": "100% Organic",
    "shipping": "Global Shipping",
    "fresh": "Fresh Harvest",
    "allSpices": "All Spices",
    "noSpices": "No spices available at the moment."
  }
};

const de = {
  "Nav": {
    "home": "Startseite",
    "spices": "Gewürze",
    "ourStory": "Unsere Geschichte",
    "switchEn": "Englisch (EN)",
    "switchDe": "Deutsch (DE)",
    "greeting": "Hallo, "
  },
  "Home": {
    "heroSub": "Feinste Ceylon-Gewürze",
    "heroTitle1": "Feuer für Ihre",
    "heroTitle2": "Küche",
    "heroText": "Erleben Sie die aromatische Seele Sri Lankas. Handverlesen, sonnengetrocknet und frisch geliefert.",
    "shopAll": "Alle Gewürze ansehen",
    "ourJourney": "Unsere Reise",
    "whyChooseTitle": "Darum wir",
    "whyChooseMain": "Der Spicylon Unterschied",
    "whyChooseDesc": "Wir verzichten auf den Zwischenhandel, um Ihnen die reinsten Gewürze direkt aus Sri Lankas Bergen zu liefern.",
    "feat1Title": "100% Sri Lanka",
    "feat1Desc": "Alle Gewürze werden authentisch auf sri-lankischem Boden angebaut und geerntet.",
    "feat2Title": "Bio & Rein",
    "feat2Desc": "Keine Konservierungsstoffe, keine künstlichen Farbstoffe. Einfach pure, unverfälschte Gewürze.",
    "feat3Title": "Frisch geerntet",
    "feat3Desc": "Wir arbeiten direkt mit den Bauern zusammen, um intensive Aromen zu garantieren.",
    "featuredColl": "Aktuelle Ernte",
    "exploreFeatured": "Entdecken Sie unsere meistverkauften Bio-Gewürze.",
    "legacyBadge": "Ein Erbe des Geschmacks",
    "historicRoute": "Die historische Gewürzroute Ceylons",
    "historyText1": "Schon seit Jahrhunderten ist Sri Lanka das unbestrittene Kronjuwel des globalen Gewürzhandels und Heimat des echten \"Ceylon-Zimts\". Forscher, Araber und Römer überquerten gefährliche Meere, um dorthin zu gelangen.",
    "historyText2": "Die einzigartige Mischung aus vulkanischem Boden und tropischem Klima ermöglicht den perfekten Anbau. Nichts kann damit mithalten.",
    "supplierPre": "Unser offizieller Lieferant",
    "supplierName": "Ceylon Spice Garden",
    "supplierText": "Wir sind eine exklusive Partnerschaft mit dem Ceylon Spice Garden eingegangen, um unsere edlen Gewürze direkt aus Sri Lanka zu beziehen. Bekannt für traditionellen Ayurveda und reinste Extrakte.",
    "visitSupplier": "Besuchen Sie ceylonspicegarden.com",
    "joinClub": "Treten Sie dem Spice Club bei",
    "joinDesc": "Erhalten Sie 15% Rabatt auf Ihre erste Bestellung.",
    "emailPlace": "Ihre E-Mail-Adresse",
    "joinBtn": "Beitreten"
  },
  "About": {
    "title": "Das Erbe der Ceylon-Gewürze",
    "subtitle": "Entdecken Sie die Geschichte, die sri-lankische Gewürze so einzigartig macht.",
    "historyTitle": "Eine von Geschmack geprägte Geschichte",
    "historyP1": "Sri Lankas Geschichte ist untrennbar mit seinen Gewürzen verbunden. Die Insel war einst das ultimative Ziel der Seidenstraße.",
    "historyP2": "Es war die Faszination für Ceylon-Zimt, die europäische Mächte auf die Insel brachte. Wer die Gewürzinsel kontrollierte, kontrollierte den Geschmack der Welt.",
    "supplierPre": "Unser offizieller Lieferant",
    "supplierTitle": "Zusammenarbeit mit dem Ceylon Spice Garden",
    "supplierP1": "Wir beziehen unsere Produkte ohne Umwege direkt von der Quelle: dem Ceylon Spice Garden. Keine Kompromisse bei Reinheit.",
    "supplierP2": "Versteckt in den Bergen Sri Lankas, verbindet der Ceylon Spice Garden traditionellen Ayurveda-Anbau mit moderner Bio-Landwirtschaft. Sie liefern reine Aromen.",
    "link": "Mehr über unseren Lieferanten erfahren",
    "whyTitle": "Warum es wichtig ist",
    "whyDesc": "Wenn Sie Ceylon-Gewürze kaufen, nehmen Sie an einer langen Geschichte teil - Sie schmecken die unberührten Böden einer tropischen Insel."
  },
  "Cart": {
    "emptyEmoji": "🛒",
    "emptyTitle": "Ihr Warenkorb ist kalt.",
    "emptyDesc": "Fügen Sie etwas Würze hinzu, um ihn aufzuwärmen!",
    "browseBtn": "Gewürze ansehen",
    "title": "Ihr",
    "titleHighlight": "Warenkorb",
    "summaryTitle": "Bestellübersicht",
    "subtotal": "Zwischensumme",
    "shipping": "Versandkosten",
    "total": "Gesamtbetrag",
    "checkout": "Sicher zur Kasse",
    "secureNote": "Sichere Zahlungen über Stripe"
  },
  "Product": {
    "notFound": "Produkt nicht gefunden",
    "organic": "100% Bio",
    "shipping": "Weltweiter Versand",
    "fresh": "Frische Ernte",
    "allSpices": "Alle Gewürze",
    "noSpices": "Zurzeit keine Gewürze verfügbar."
  }
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
console.log('Translations updated successfully.');