import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database…");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@maisonluxe.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@maisonluxe.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Test customer
  const customerPassword = await bcrypt.hash("Customer1234!", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "customer@example.com",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log("✅ Customer user:", customer.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "watches" },
      update: {},
      create: {
        name: "Watches",
        slug: "watches",
        description: "Precision timepieces from the world's finest maisons",
        imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "jewellery" },
      update: {},
      create: {
        name: "Jewellery",
        slug: "jewellery",
        description: "Exquisite jewellery crafted from the finest materials",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: {
        name: "Bags",
        slug: "bags",
        description: "Iconic leather goods and statement accessories",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "The finest accessories to complete any ensemble",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fragrances" },
      update: {},
      create: {
        name: "Fragrances",
        slug: "fragrances",
        description: "Rare and exclusive perfumery from legendary houses",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
      },
    }),
  ]);

  console.log("✅ Categories:", categories.map((c) => c.name).join(", "));

  const watchCategory = categories[0];
  const jewelleryCategory = categories[1];
  const bagCategory = categories[2];

  // Sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "grand-complications-perpetual-calendar" },
      update: { isAvailable: true, isFeatured: true },
      create: {
        name: "Grand Complications Perpetual Calendar",
        slug: "grand-complications-perpetual-calendar",
        description:
          "A masterpiece of horological engineering, this perpetual calendar watch automatically accounts for months of different lengths, including leap years. Crafted in 18k rose gold with a sapphire exhibition case back revealing the intricate movement within.",
        price: 185000,
        comparePrice: 200000,
        images: [
          "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800",
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
        ],
        categoryId: watchCategory.id,
        stockLevel: 3,
        isAvailable: true,
        isFeatured: true,
        variants: {
          create: [
            { type: "Case", value: "Rose Gold", stock: 2, priceAdj: 0 },
            { type: "Case", value: "Platinum", stock: 1, priceAdj: 25000 },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "diamond-rivière-necklace" },
      update: { isAvailable: true, isFeatured: true },
      create: {
        name: "Diamond Rivière Necklace",
        slug: "diamond-rivière-necklace",
        description:
          "A breathtaking rivière necklace featuring 42 perfectly matched D-colour, internally flawless diamonds totalling 18.5 carats. Each stone is individually set in platinum prongs to maximise light entry, resulting in incomparable brilliance.",
        price: 320000,
        images: [
          "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
        ],
        categoryId: jewelleryCategory.id,
        stockLevel: 2,
        isAvailable: true,
        isFeatured: true,
        variants: {
          create: [
            { type: "Metal", value: "Platinum", stock: 1, priceAdj: 0 },
            { type: "Metal", value: "18k White Gold", stock: 1, priceAdj: -15000 },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "himalaya-birkin-35" },
      update: { isAvailable: true, isFeatured: true },
      create: {
        name: "Himalaya Birkin 35",
        slug: "himalaya-birkin-35",
        description:
          "The most coveted bag in the world. This Himalaya Birkin in niloticus crocodile leather features an extraordinary gradation from chalky white to dove grey, achieved through an intricate bleaching process. Set with 18k white gold and diamond hardware.",
        price: 450000,
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800",
        ],
        categoryId: bagCategory.id,
        stockLevel: 1,
        isAvailable: true,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "royal-oak-offshore-chronograph" },
      update: { isAvailable: true, isFeatured: false },
      create: {
        name: "Royal Oak Offshore Chronograph",
        slug: "royal-oak-offshore-chronograph",
        description:
          "The ultimate sports watch, the Royal Oak Offshore Chronograph combines an ultra-thin automatic movement with bold aesthetics. The 44mm case in forged carbon features the iconic octagonal bezel with exposed screws, a hallmark of the Royal Oak design language.",
        price: 67500,
        images: [
          "https://images.unsplash.com/photo-1600541519467-937869997e34?w=800",
        ],
        categoryId: watchCategory.id,
        stockLevel: 5,
        isAvailable: true,
        isFeatured: false,
        variants: {
          create: [
            { type: "Strap", value: "Rubber", stock: 3, priceAdj: 0 },
            { type: "Strap", value: "Alligator Leather", stock: 2, priceAdj: 2500 },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "emerald-and-diamond-parure" },
      update: { isAvailable: true, isFeatured: false },
      create: {
        name: "Emerald and Diamond Parure",
        slug: "emerald-and-diamond-parure",
        description:
          "An exceptional suite of Colombian emeralds and diamonds comprising a necklace, bracelet, and earrings. The centrepiece is a cushion-cut 22-carat Colombian emerald of exceptional colour and clarity, surrounded by 186 round brilliant-cut diamonds.",
        price: 1200000,
        images: [
          "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800",
        ],
        categoryId: jewelleryCategory.id,
        stockLevel: 1,
        isAvailable: true,
        isFeatured: false,
      },
    }),
  ]);

  console.log("✅ Products:", products.map((p) => p.name).join(", "));
  console.log("\n🎉 Seed complete!\n");
  console.log("Admin credentials:");
  console.log("  Email: admin@maisonluxe.com");
  console.log("  Password: Admin1234!\n");
  console.log("Customer credentials:");
  console.log("  Email: customer@example.com");
  console.log("  Password: Customer1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
