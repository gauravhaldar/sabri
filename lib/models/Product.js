import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "rings",
        "necklaces",
        "earrings",
        "bracelets",
        "fine-gold",
        "fine-silver",
        "mens",
        "gifts",
        "new-arrivals",
        "best-sellers",
        "collections",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    brand: {
      type: String,
      default: "Sabri",
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    specifications: {
      material: { type: String, trim: true },
      metalType: { type: String, trim: true },
      gemstone: { type: String, trim: true },
      dimensions: { type: String, trim: true },
      careInstructions: { type: String, trim: true },
      warranty: { type: String, trim: true },
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isGiftable: {
      type: Boolean,
      default: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    men: {
      type: Boolean,
      default: false,
    },
    women: {
      type: Boolean,
      default: true,
    },
    kids: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ slug: 1 });

// Generate slug before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

