# Coupon and Address Features

This document describes the coupon and address features that have been added to the Sabri app, based on the implementations from eyeyoptics and eyey-backend.

## Features Added

### 1. Coupon System

#### Backend Components:

- **Coupon Model** (`lib/models/Coupon.js`): MongoDB schema for coupons
- **API Routes**:
  - `GET /api/coupons` - List all coupons with filtering
  - `POST /api/coupons` - Create new coupon
  - `PUT /api/coupons/[id]` - Update coupon
  - `DELETE /api/coupons/[id]` - Delete coupon
  - `POST /api/coupons/apply` - Apply coupon to order
- **Coupon Utilities** (`utils/couponUtils.js`): Helper functions for coupon calculations

#### Frontend Components:

- **CouponModal** (`components/CouponModal.js`): Modal to browse and select available coupons
- **Cart Integration**: Coupon application in cart page
- **Admin Interface** (`app/admin/coupons/page.js`): Manage coupons

#### Coupon Features:

- Flat amount discounts (e.g., ₹100 off)
- Percentage discounts (e.g., 10% off)
- Minimum and maximum order value restrictions
- Usage limits
- Start and expiry dates
- Real-time validation

### 2. Address System

#### Frontend Components:

- **AddressModal** (`components/AddressModal.js`): Form to add delivery addresses
- **Cart Integration**: Address selection in cart page

#### Address Features:

- Full address form with validation
- Country code selection with phone numbers
- Shipping availability validation
- Address management (add, edit, remove)
- Integration with checkout process

## Usage

### For Users:

1. **Applying Coupons**:

   - Go to cart page
   - Enter coupon code in the "Apply Coupon Code" section
   - Or click "View Available" to browse applicable coupons
   - Coupon discount will be applied to your order total

2. **Adding Address**:
   - Go to cart page
   - Click "Add Delivery Address" in the "Delivery Address" section
   - Fill in your address details
   - System will validate delivery availability
   - Address will be saved for checkout

### For Admins:

1. **Managing Coupons**:
   - Navigate to `/admin/coupons`
   - Create, edit, or delete coupons
   - Set discount amounts, usage limits, and validity periods
   - Monitor coupon usage

## API Endpoints

### Coupons

- `GET /api/coupons` - List coupons (supports filtering by status, type, search)
- `POST /api/coupons` - Create coupon
- `PUT /api/coupons/[id]` - Update coupon
- `DELETE /api/coupons/[id]` - Delete coupon
- `POST /api/coupons/apply` - Apply coupon to order

### Request/Response Examples

#### Apply Coupon

```javascript
// Request
POST /api/coupons/apply
{
  "code": "WELCOME10",
  "orderAmount": 1500
}

// Response
{
  "success": true,
  "data": {
    "couponId": "...",
    "discount": 150,
    "finalAmount": 1350,
    "couponDetails": {
      "name": "Welcome Discount",
      "code": "WELCOME10",
      "type": "percentage",
      "amount": 10
    }
  }
}
```

## Database Schema

### Coupon Model

```javascript
{
  name: String,           // Coupon display name
  code: String,           // Unique coupon code
  type: String,           // "flat" or "percentage"
  amount: Number,          // Discount amount
  minValue: Number,       // Minimum order value
  maxValue: Number,       // Maximum order value
  usageLimit: Number,     // Maximum uses
  usedCount: Number,      // Current usage count
  isActive: Boolean,      // Active status
  startDate: Date,        // Start date (optional)
  expiryDate: Date,       // Expiry date (optional)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## Setup Instructions

1. **Database Setup**: Ensure MongoDB is running and connected
2. **Seed Sample Data**: Run `npm run seed:coupons` to create sample coupons
3. **Environment Variables**: Make sure database connection is configured
4. **Start Development**: Run `npm run dev`

## Testing

### Test Coupons

The seed script creates these test coupons:

- `WELCOME10` - 10% off (₹500-₹5000)
- `SAVE100` - ₹100 off (₹1000-₹10000)
- `BIGSALE20` - 20% off (₹2000-₹20000)
- `FIRST50` - ₹50 off (₹300-₹3000)
- `PREMIUM15` - 15% off (₹5000-₹50000)

### Test Address

- Use any valid Indian address
- Zip codes starting with "1" get free shipping
- Other zip codes have ₹50 shipping charge

## Integration Notes

The features are fully integrated with the existing cart system:

- Coupon discounts are calculated in real-time
- Address validation prevents checkout without delivery address
- All calculations include tax and shipping
- Toast notifications provide user feedback
- Responsive design works on all devices

## Future Enhancements

Potential improvements:

- Coupon usage tracking per user
- Address book for multiple addresses
- Shipping cost calculation based on location
- Coupon analytics and reporting
- Bulk coupon operations
- Coupon categories and targeting
