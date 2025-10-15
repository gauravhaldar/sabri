import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../lib/models/Product.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
  process.exit(1);
}

const sampleProducts = [
  {
    name: "Classic Gold Wedding Ring",
    description:
      "Timeless classic gold wedding ring with elegant design. Perfect for special occasions and everyday wear.",
    shortDescription: "Elegant gold wedding ring",
    price: 4599,
    originalPrice: 6599,
    discount: 30,
    category: "rings",
    subcategory: "Wedding Rings",
    stock: 25,
    brand: "Sabri",
    sku: "RING001",
    specifications: {
      material: "Gold",
      metalType: "sterling-silver",
      gemstone: "Diamond",
      dimensions: "6mm band width",
      careInstructions: "Store in dry place, avoid contact with perfumes",
      warranty: "1 year",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Classic Gold Wedding Ring",
        isPrimary: true,
      },
    ],
    tags: ["wedding", "gold", "classic", "rings"],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isGiftable: true,
    isOnSale: true,
    men: true,
    women: true,
    kids: false,
    rating: {
      average: 4.8,
      count: 45,
    },
    viewCount: 120,
    purchaseCount: 15,
  },
  {
    name: "Pearl Drop Necklace",
    description:
      "Elegant pearl drop necklace for special occasions. Handcrafted with premium materials and attention to detail.",
    shortDescription: "Sophisticated pearl drop necklace",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    category: "necklaces",
    subcategory: "Pearl Necklaces",
    stock: 18,
    brand: "Sabri",
    sku: "NECK001",
    specifications: {
      material: "Pearl",
      metalType: "sterling-silver",
      gemstone: "Freshwater Pearl",
      dimensions: "45cm chain length",
      careInstructions: "Clean with soft cloth, avoid harsh chemicals",
      warranty: "2 years",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        alt: "Pearl Drop Necklace",
        isPrimary: true,
      },
    ],
    tags: ["pearl", "necklace", "elegant", "special-occasion"],
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isGiftable: true,
    isOnSale: true,
    men: false,
    women: true,
    kids: false,
    rating: {
      average: 4.9,
      count: 32,
    },
    viewCount: 95,
    purchaseCount: 12,
  },
  {
    name: "Diamond Stud Earrings",
    description:
      "Classic diamond stud earrings for everyday elegance. Perfect for both casual and formal occasions.",
    shortDescription: "Timeless diamond stud earrings",
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    category: "earrings",
    subcategory: "Stud Earrings",
    stock: 22,
    brand: "Sabri",
    sku: "EARR001",
    specifications: {
      material: "Diamond",
      metalType: "sterling-silver",
      gemstone: "Real Diamond",
      dimensions: "6mm studs",
      careInstructions: "Clean with jewelry cleaner, store separately",
      warranty: "Lifetime",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Diamond Stud Earrings",
        isPrimary: true,
      },
    ],
    tags: ["diamond", "stud", "earrings", "classic"],
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isGiftable: true,
    isOnSale: true,
    men: false,
    women: true,
    kids: false,
    rating: {
      average: 4.7,
      count: 28,
    },
    viewCount: 88,
    purchaseCount: 8,
  },
  {
    name: "Gold Chain Bracelet",
    description:
      "Luxurious gold chain bracelet with intricate design. A perfect accessory for any outfit.",
    shortDescription: "Elegant gold chain bracelet",
    price: 3299,
    originalPrice: 4599,
    discount: 28,
    category: "bracelets",
    subcategory: "Chain Bracelets",
    stock: 30,
    brand: "Sabri",
    sku: "BRAC001",
    specifications: {
      material: "Gold",
      metalType: "sterling-silver",
      gemstone: "",
      dimensions: "18cm bracelet length",
      careInstructions: "Store in jewelry box, avoid water contact",
      warranty: "1 year",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        alt: "Gold Chain Bracelet",
        isPrimary: true,
      },
    ],
    tags: ["gold", "bracelet", "chain", "luxury"],
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isGiftable: true,
    isOnSale: true,
    men: true,
    women: true,
    kids: false,
    rating: {
      average: 4.6,
      count: 35,
    },
    viewCount: 110,
    purchaseCount: 18,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing products (optional)
    // await Product.deleteMany({});
    // console.log("Cleared existing products");

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    console.log("Sample products added:");
    insertedProducts.forEach((product) => {
      console.log(
        `- ${product.name} (${product.category}) - ₹${product.price}`
      );
    });
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedProducts();
