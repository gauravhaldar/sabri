# PayU Payment Integration - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Environment Variables (Already Done ✅)

Your `.env.local` file has been updated with PayU test credentials.

### Step 2: Test the Integration

1. **Start your development server**:

```bash
npm run dev
```

2. **Create a test order**:

   - Add products to cart
   - Go to checkout
   - Select "Online Payment" option
   - Complete the order

3. **Test with PayU test credentials**:
   - **Success Test Card**: 5123 4567 8901 2346
   - **CVV**: 123
   - **Expiry**: Any future date
   - **Name**: Any name

### Step 3: Verify Integration

After payment, you should:

- Be redirected to success page
- See transaction details
- Order status should update to "confirmed"

## 📁 Files Created

### API Routes

1. ✅ `/app/api/payment/payu/create/route.js` - Create payment request
2. ✅ `/app/api/payment/payu/webhook/route.js` - Handle webhooks
3. ✅ `/app/api/payment/payu/validate/route.js` - Validate responses

### Payment Pages

1. ✅ `/app/payment/success/page.js` - Success page
2. ✅ `/app/payment/failure/page.js` - Failure page
3. ✅ `/app/payment/cancel/page.js` - Cancel page

### Components

1. ✅ `/components/PayUPayment.js` - Payment button component

### Documentation

1. ✅ `PAYU-PAYMENT-SETUP.md` - Complete documentation

## 🎯 Integration with Cart Page

### Option 1: Add PayU Button to Cart (Recommended)

Update your cart page to include PayU payment option:

```javascript
// In your cart page (app/cart/page.js)
import PayUPayment from "@/components/PayUPayment";

// After placing order and getting orderId:
const handlePlaceOrder = async () => {
  // ... existing order creation code ...

  if (paymentMethod === "online") {
    // Show PayU payment button
    setShowPayUPayment(true);
  }
};

// Render PayU payment button
{
  showPayUPayment && (
    <PayUPayment
      orderId={orderData.orderId}
      amount={total}
      customerInfo={{
        firstname: user.firstName || user.name?.split(" ")[0],
        lastname: user.lastName || user.name?.split(" ").slice(1).join(" "),
        email: user.email,
        phone: selectedAddress.phone,
      }}
      productInfo="Order Payment"
    />
  );
}
```

### Option 2: Direct Payment Flow

Or integrate directly in your place order function:

```javascript
const handlePlaceOrder = async () => {
  // ... create order first ...

  if (paymentMethod === "online") {
    // Initiate PayU payment
    const paymentResponse = await fetch("/api/payment/payu/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderData.orderId,
        amount: total,
        customerInfo: {
          firstname: user.firstName,
          email: user.email,
          phone: user.phone,
        },
        productInfo: "Order Payment",
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.success) {
      // Create form and submit to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.data.paymentUrl;

      Object.keys(paymentData.data.payUParams).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData.data.payUParams[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  }
};
```

## 🧪 Testing Guide

### Test Payment Scenarios

1. **Successful Payment**:

   - Card: 5123 4567 8901 2346
   - Expected: Redirect to `/payment/success`
   - Order status: "confirmed"

2. **Failed Payment**:

   - Card: 5123 4567 8901 2345
   - Expected: Redirect to `/payment/failure`
   - Order status: "payment_failed"

3. **Cancel Payment**:
   - Click cancel on PayU page
   - Expected: Redirect to `/payment/cancel`
   - Order status: "cancelled"

### Verify Order Status

Check order in database:

```javascript
// In MongoDB or your database
db.orders.findOne({ orderId: "YOUR_ORDER_ID" })

// Should show:
{
  orderId: "ORD123456",
  status: "confirmed",
  paymentStatus: "paid",
  paymentDetails: {
    txnId: "TXN...",
    mihpayid: "...",
    amount: 1000,
    status: "success",
    gateway: "payu",
    mode: "CC"
  }
}
```

## 🔧 Common Issues & Solutions

### Issue 1: Payment Button Not Working

**Check**:

- Order is created first
- User is logged in
- All required customer info is available

### Issue 2: Redirect Not Happening

**Check**:

- URLs in `.env.local` are correct
- No console errors
- Form is being submitted

### Issue 3: Order Status Not Updating

**Check**:

- Webhook URL is accessible (use ngrok for local testing)
- PayU IPs are whitelisted
- Hash verification is passing

## 📞 Need Help?

1. Check the complete documentation: `PAYU-PAYMENT-SETUP.md`
2. Review PayU official docs: https://docs.payu.in/
3. Contact PayU support: integration@payu.in

## ✅ Production Checklist

Before going live:

- [ ] Get production credentials from PayU
- [ ] Update environment variables
- [ ] Configure webhook URL with PayU
- [ ] Test with real ₹1 transaction
- [ ] Update callback URLs to production domain
- [ ] Enable HTTPS
- [ ] Whitelist PayU IPs

## 🎉 You're All Set!

Your PayU payment integration is ready to test. Start your dev server and try a test transaction!

```bash
npm run dev
```

Visit: http://localhost:3000/cart

---

**Questions?** Check `PAYU-PAYMENT-SETUP.md` for detailed documentation.
