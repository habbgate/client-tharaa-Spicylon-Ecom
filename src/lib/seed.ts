import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import dbConnect from "@/lib/db";
import { Product, User } from "@/models";
import { hashPassword } from "@/lib/auth";

const products = [
  {
    name: "Pepper Powder (100g)",
    description:
      "Experience the bold, pungent heat of premium Sri Lankan Pepper Powder. Sourced from the finest local plantations, this 100g pack delivers an authentic, sharp flavor profile essential for seasoning meats, soups, and savory dishes. Our processing ensures that the natural oils and intense aroma are preserved, offering a superior culinary experience compared to standard varieties. Whether used as a base for marinades or a finishing touch at the table, this 100% pure pepper powder brings the rich heritage of Sri Lankan spices directly to your kitchen with unmatched quality and freshness.",
    images: ["https://placehold.co/600x400/orange/white?text=Pepper+Powder"],
    price: { USD: 1.51, EUR: 1.41, LKR: 450 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "White Pepper (100g)",
    description:
      "Our 100g White Pepper offers a sophisticated, earthy heat with a smoother finish than traditional black pepper. Carefully processed to remove the outer husk, these premium peppercorns are ideal for light-colored sauces, mashed potatoes, and creamy soups where a sharp bite is desired without dark flecks. Cultivated and manufactured in Sri Lanka, this spice is prized for its clean aroma and complex flavor notes. It is a versatile pantry staple for chefs seeking to balance heat and aesthetics, ensuring every dish remains visually pristine while delivering a powerful, refined peppery punch.",
    images: ["https://placehold.co/600x400/orange/white?text=White+Pepper"],
    price: { USD: 2.18, EUR: 2.03, LKR: 650 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Black Pepper (100g)",
    description:
      'Grown in the tropical climate of Sri Lanka, our 100g Black Pepper pack features whole, sun-dried peppercorns known as the "King of Spices". These premium berries offer a robust, woody aroma and a deep, biting heat that enhances almost any savory meal. Perfect for use in a grinder to release fresh volatile oils, these peppercorns provide a textured crunch and intense flavor. Free from additives and locally manufactured, this product represents the pinnacle of Sri Lankan spice exports, ensuring your stews, steaks, and daily meals are infused with authentic, high-quality spice.',
    images: ["https://placehold.co/600x400/orange/white?text=Black+Pepper"],
    price: { USD: 1.85, EUR: 1.72, LKR: 550 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Cinnamon Powder (100g)",
    description:
      "Infuse your cooking with the warm, sweet, and woody notes of our premium Cinnamon Powder. This 100g pack contains finely ground cinnamon sourced from the fertile lands of Sri Lanka, world-renowned for producing the finest varieties. Perfect for both sweet baking and savory curries, our cinnamon powder is 100% pure and highly aromatic. It dissolves easily into beverages like coffee or tea and adds a rich depth to desserts and spiced rice dishes. Locally manufactured with care, it brings a touch of exotic warmth and health-conscious seasoning to your daily culinary creations.",
    images: ["https://placehold.co/600x400/orange/white?text=Cinnamon+Powder"],
    price: { USD: 2.85, EUR: 2.66, LKR: 850 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Cardamom (100g)",
    description:
      'Our 100g Cardamom pack features hand-picked, premium green pods known for their intense, resinous fragrance and sweet-spicy flavor. Often referred to as the "Queen of Spices," these Sri Lankan-grown pods are essential for authentic chai, biryanis, and traditional desserts. Each pod is carefully dried to lock in the essential oils found within the seeds, providing a burst of citrusy and herbal notes. Whether used whole to infuse liquids or ground for spice blends, this high-quality cardamom ensures a luxurious aromatic profile that elevates your cooking to professional standards with natural, local excellence.',
    images: ["https://placehold.co/600x400/orange/white?text=Cardamom"],
    price: { USD: 7.38, EUR: 6.88, LKR: 2200 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Cinnamon C5 (100g)",
    description:
      'For the true connoisseur, our Cinnamon C5 offers the highest grade of "True Cinnamon" quills. This 100g selection features slender, golden-brown sticks characterized by their delicate, multi-layered texture and sweet, subtle flavor. Unlike common cassia, C5 cinnamon is low in coumarin and boasts a refined aroma that is never overpowering. Hand-rolled and processed in Sri Lanka, these quills are perfect for infusing slow-cooked stews, hot chocolates, or as a sophisticated garnish. Experience the premium quality of authentic Ceylon cinnamon, prized globally for its unique taste and numerous wellness benefits.',
    images: ["https://placehold.co/600x400/orange/white?text=Cinnamon+C5"],
    price: { USD: 3.69, EUR: 3.44, LKR: 1100 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Cloves (100g)",
    description:
      "Discover the intense, aromatic power of our premium Sri Lankan Cloves. This 100g pack contains whole, sun-dried flower buds that deliver a warm, sweet, and slightly bitter flavor profile. Essential for spice blends like garam masala or for studding roasted meats, these cloves are rich in essential oils, particularly eugenol. Their deep, woody scent is a hallmark of traditional Sri Lankan cuisine and holiday baking. Locally sourced and manufactured to ensure maximum freshness, our cloves provide a potent punch of flavor, making them an indispensable ingredient for both savory dishes and fragrant infusions.",
    images: ["https://placehold.co/600x400/orange/white?text=Cloves"],
    price: { USD: 3.19, EUR: 2.97, LKR: 950 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Dry Ginger (100g)",
    description:
      "Bring a sharp, zesty warmth to your pantry with our 100g Dry Ginger. Sourced from premium ginger roots grown in Sri Lanka, this product is carefully dried to preserve its pungent, spicy kick and citrusy undertones. It is a versatile ingredient, perfect for brewing soothing ginger tea, flavoring spice cakes, or adding a zingy depth to stir-frys and curries. Locally manufactured to maintain high standards of purity, this dry ginger is an excellent alternative to fresh root, offering a longer shelf life without sacrificing the intense, revitalizing flavor that ginger lovers crave in their cooking.",
    images: ["https://placehold.co/600x400/orange/white?text=Dry+Ginger"],
    price: { USD: 2.01, EUR: 1.88, LKR: 600 },
    stock: 0,
    category: "Spices",
  },
  {
    name: "Turmeric Powder (100g)",
    description:
      'Brighten your dishes with the vibrant hue and earthy flavor of our 100g Turmeric Powder. Ground from high-quality turmeric rhizomes cultivated in Sri Lanka, this 100% pure powder is famous for its warm, slightly bitter taste and powerful coloring properties. A cornerstone of South Asian cuisine, it is essential for curries, lentil dishes, and the trendy "Golden Milk". Beyond its culinary uses, our turmeric is processed with care to maintain its natural curcumin content. Locally manufactured and free from artificial dyes, it provides an authentic, health-focused addition to your daily spice repertoire.',
    images: ["https://placehold.co/600x400/orange/white?text=Turmeric+Powder"],
    price: { USD: 1.34, EUR: 1.25, LKR: 400 },
    stock: 0,
    category: "Spices",
  },
];

async function seed() {
  await dbConnect();

  try {
    // Clean up
    await Product.deleteMany({});
    await User.deleteMany({ role: "admin" });

    // Add Admin
    const hashedPassword = await hashPassword("admin123");
    await User.create({
      name: "Admin",
      email: "admin@spicylon.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    // Add Products
    await Product.insertMany(products);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
