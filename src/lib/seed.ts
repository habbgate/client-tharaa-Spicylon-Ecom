import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import dbConnect from '@/lib/db';
import { Product, User } from '@/models';
import { hashPassword } from '@/lib/auth';

const products = [
  {
    name: "Ceylon Cinnamon Quills",
    description: "Authentic Grade C5 Ceylon Cinnamon quills from the gardens of Sri Lanka. Known for its delicate flavor and medicinal properties.",
    images: ["https://placehold.co/600x400/orange/white?text=Spice"],
    price: { USD: 12.00, EUR: 11.50, LKR: 3600 },
    stock: 100,
    category: "Spices"
  },
  {
    name: "Organic Black Pepper",
    description: "Tellicherry bold black peppercorns, sun-dried to perfection. Intense aroma and sharp heat.",
    images: ["https://placehold.co/600x400/orange/white?text=Spice"],
    price: { USD: 8.50, EUR: 8.00, LKR: 2500 },
    stock: 150,
    category: "Spices"
  },
  {
    name: "Spicy Ghost Pepper Flakes",
    description: "Extra hot Bhut Jolokia flakes for the brave. One of the world's hottest peppers.",
    images: ["https://placehold.co/600x400/orange/white?text=Spice"],
    price: { USD: 15.00, EUR: 14.00, LKR: 4500 },
    stock: 50,
    category: "Spices"
  },
  {
    name: "Turmeric Powder (Curcumin High)",
    description: "Pure heirloom turmeric powder with high curcumin content. Vibrant color and earthy flavor.",
    images: ["https://placehold.co/600x400/orange/white?text=Spice"],
    price: { USD: 7.00, EUR: 6.50, LKR: 2100 },
    stock: 200,
    category: "Spices"
  },
  {
      name: "Green Cardamom Pods",
      description: "Premium jumbo green cardamom pods. Aromatic and sweet, perfect for desserts and savory dishes.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 18.00, EUR: 16.50, LKR: 5400 },
      stock: 75,
      category: "Spices"
  },
  {
      name: "Cloves (Hand-picked)",
      description: "Carefully hand-picked cloves from Sri Lanka. Strong, pungent, and intensely aromatic.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 10.00, EUR: 9.30, LKR: 3000 },
      stock: 80,
      category: "Spices"
  },
  {
      name: "Smoked Paprika",
      description: "Pimentón de la Vera style smoked paprika. Deep red color and rich smoky flavor.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 6.50, EUR: 6.00, LKR: 1950 },
      stock: 120,
      category: "Spices"
  },
  {
      name: "Star Anise Whole",
      description: "Beautiful star-shaped anise seeds. Licorice-like flavor common in Asian cuisine.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 9.00, EUR: 8.50, LKR: 2700 },
      stock: 60,
      category: "Spices"
  },
  {
      name: "Cumin Seeds (Kala Jeera)",
      description: "Premium cumin seeds. Nutty, earthy, and warm aroma.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 5.50, EUR: 5.00, LKR: 1650 },
      stock: 150,
      category: "Spices"
  },
  {
      name: "Nutmeg Whole with Mace",
      description: "Whole nutmeg seeds with their bright red lacy coating (mace). Sweet and pungent.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 14.00, EUR: 13.00, LKR: 4200 },
      stock: 45,
      category: "Spices"
  },
  {
      name: "Fennel Seeds",
      description: "Sweet and crunchy fennel seeds. Great as a digestive aid or for cooking.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 4.50, EUR: 4.00, LKR: 1350 },
      stock: 100,
      category: "Spices"
  },
  {
      name: "Corriander Seeds",
      description: "Mild and citrusy whole coriander seeds.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 4.00, EUR: 3.50, LKR: 1200 },
      stock: 200,
      category: "Spices"
  },
  {
      name: "Kashmiri Chili Powder",
      description: "Known for its bright red color and mild heat. Essential for curries.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 7.50, EUR: 7.00, LKR: 2250 },
      stock: 130,
      category: "Spices"
  },
  {
      name: "Fenugreek Seeds",
      description: "Bitter-sweet seeds used in many spice blends and health tonics.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 5.00, EUR: 4.50, LKR: 1500 },
      stock: 90,
      category: "Spices"
  },
  {
      name: "Mustard Seeds (Black)",
      description: "Pungent and nutty seeds that pop in hot oil to release flavor.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 3.50, EUR: 3.00, LKR: 1050 },
      stock: 180,
      category: "Spices"
  },
  {
      name: "Curry Leaves (Dried)",
      description: "Essential aromatic leaves for authentic South Asian cooking.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 3.00, EUR: 2.80, LKR: 900 },
      stock: 300,
      category: "Spices"
  },
  {
      name: "Garlic Powder",
      description: "Sun-dried and finely ground pure garlic.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 6.00, EUR: 5.50, LKR: 1800 },
      stock: 150,
      category: "Spices"
  },
  {
      name: "Ginger Powder",
      description: "Zesty and warm dried ginger powder.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 6.50, EUR: 6.00, LKR: 1950 },
      stock: 140,
      category: "Spices"
  },
  {
      name: "Spicylon House Blend",
      description: "Our secret signature spice blend for the perfect meat curry.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 12.50, EUR: 11.50, LKR: 3750 },
      stock: 80,
      category: "Spices"
  },
  {
      name: "Goraka (Garcinia Cambogia)",
      description: "Traditional sun-dried fruit used for souring curries in Sri Lanka.",
      images: ["https://placehold.co/600x400/orange/white?text=Spice"],
      price: { USD: 8.00, EUR: 7.50, LKR: 2400 },
      stock: 70,
      category: "Spices"
  }
];

async function seed() {
  await dbConnect();

  try {
    // Clean up
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });

    // Add Admin
    const hashedPassword = await hashPassword('admin123');
    await User.create({
      name: 'Admin',
      email: 'admin@spicylon.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    // Add Products
    await Product.insertMany(products);

    console.log('Seeding completed successfully!');
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
