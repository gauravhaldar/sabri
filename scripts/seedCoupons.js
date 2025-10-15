import connectDB from "../lib/db.js";
import Coupon from "../lib/models/Coupon.js";

const sampleCoupons = [
  {
    name: "Welcome Discount",
    code: "WELCOME10",
    type: "percentage",
    amount: 10,
    minValue: 500,
    maxValue: 5000,
    usageLimit: 100,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    name: "Flat Discount",
    code: "SAVE100",
    type: "flat",
    amount: 100,
    minValue: 1000,
    maxValue: 10000,
    usageLimit: 50,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
  },
  {
    name: "Big Sale",
    code: "BIGSALE20",
    type: "percentage",
    amount: 20,
    minValue: 2000,
    maxValue: 20000,
    usageLimit: 25,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    name: "First Order",
    code: "FIRST50",
    type: "flat",
    amount: 50,
    minValue: 300,
    maxValue: 3000,
    usageLimit: 200,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
  },
  {
    name: "Premium Discount",
    code: "PREMIUM15",
    type: "percentage",
    amount: 15,
    minValue: 5000,
    maxValue: 50000,
    usageLimit: 10,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
  },
];

async function seedCoupons() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log("Cleared existing coupons");

    // Insert sample coupons
    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`Created ${createdCoupons.length} sample coupons:`);

    createdCoupons.forEach((coupon) => {
      console.log(
        `- ${coupon.code}: ${coupon.name} (${
          coupon.type === "flat" ? `₹${coupon.amount}` : `${coupon.amount}%`
        } off)`
      );
    });

    console.log("Coupon seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding coupons:", error);
  } finally {
    process.exit(0);
  }
}

seedCoupons();
