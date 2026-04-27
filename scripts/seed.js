require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

// Sample products
const sampleProducts = [
  {
    name: "Hydrating Face Moisturizer",
    description: "Enriched with hyaluronic acid for deep hydration",
    price: 2500,
    category: "skincare",
    image: "https://via.placeholder.com/300?text=Moisturizer",
    stock: 50,
    rating: 4.5,
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening serum with 20% Vitamin C",
    price: 3500,
    category: "skincare",
    image: "https://via.placeholder.com/300?text=Vitamin+C",
    stock: 30,
    rating: 4.8,
  },
  {
    name: "Liquid Foundation",
    description: "Full coverage liquid foundation with SPF 15",
    price: 2000,
    category: "makeup",
    image: "https://via.placeholder.com/300?text=Foundation",
    stock: 40,
    rating: 4.3,
  },
  {
    name: "Waterproof Mascara",
    description: "24-hour waterproof mascara for dramatic lashes",
    price: 1200,
    category: "makeup",
    image: "https://via.placeholder.com/300?text=Mascara",
    stock: 60,
    rating: 4.6,
  },
  {
    name: "Argan Oil Hair Treatment",
    description: "Restores shine and smoothness to dry hair",
    price: 1800,
    category: "haircare",
    image: "https://via.placeholder.com/300?text=Hair+Oil",
    stock: 45,
    rating: 4.4,
  },
  {
    name: "Body Lotion",
    description: "Nourishing body lotion with shea butter",
    price: 1500,
    category: "bodycare",
    image: "https://via.placeholder.com/300?text=Body+Lotion",
    stock: 80,
    rating: 4.2,
  },
  {
    name: "Rose Perfume",
    description: "Fresh floral fragrance with notes of rose and jasmine",
    price: 4500,
    category: "fragrance",
    image: "https://via.placeholder.com/300?text=Perfume",
    stock: 25,
    rating: 4.7,
  },
  {
    name: "Facial Clay Mask",
    description: "Deep cleansing mask with kaolin clay",
    price: 1600,
    category: "skincare",
    image: "https://via.placeholder.com/300?text=Face+Mask",
    stock: 55,
    rating: 4.5,
  },
];

// Sample test user
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  phone: "+254712345678",
  address: "123 Main Street",
  city: "Nairobi",
  country: "Kenya",
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${createdProducts.length} sample products`);

    // Check if test user exists, if not create it
    const userExists = await User.findOne({ email: testUser.email });
    if (!userExists) {
      const createdUser = await User.create(testUser);
      console.log(`✅ Created test user: ${createdUser.email}`);
    } else {
      console.log(`ℹ️  Test user already exists: ${testUser.email}`);
    }

    // Display products
    console.log("\n📦 Sample Products Created:");
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - KES ${product.price}`);
    });

    console.log("\n🔐 Test Credentials:");
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
