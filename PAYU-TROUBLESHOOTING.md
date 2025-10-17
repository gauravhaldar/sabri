# PayU Payment Gateway - Troubleshooting Guide

## 🔧 Common Issues and Solutions

### 1. Hash Mismatch Error

**Error Message**: "Invalid hash" or "Hash verification failed"

**Possible Causes**:

- Incorrect merchant salt
- Extra spaces in parameters
- Incorrect parameter order
- Amount format issue

**Solutions**:

```javascript
// ✅ Correct - Amount with 2 decimal places
amount: "1000.00"

// ❌ Wrong
amount: "1000"
amount: 1000
amount: "1000.0"

// ✅ Correct - No extra spaces
firstname: "John"

// ❌ Wrong
firstname: " John "
firstname: "John "

// ✅ Correct - Hash string order
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT

// Debug hash generation
console.log("Hash String:", hashString);
console.log("Generated Hash:", hash);
console.log("Expected Hash:", receivedHash);
```

**Quick Fix**:

1. Verify `PAYU_MERCHANT_SALT` in `.env.local`
2. Check amount has exactly 2 decimal places
3. Trim all string parameters
4. Verify parameter order matches PayU documentation

---

### 2. Webhook Not Received

**Symptoms**:

- Payment successful but order not updating
- Webhook endpoint not being called

**Possible Causes**:

- Webhook URL not accessible
- PayU IPs not whitelisted
- Endpoint not returning 200 OK
- Webhook not configured in PayU dashboard

**Solutions**:

**For Local Development (Using ngrok)**:

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run dev

# In another terminal, expose localhost
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
# Use this as webhook: https://abc123.ngrok.io/api/payment/payu/webhook
```

**For Production**:

1. Verify webhook URL is publicly accessible:

```bash
curl -X POST https://yourdomain.com/api/payment/payu/webhook
```

2. Check webhook returns 200 OK:

```javascript
// In webhook route.js
return NextResponse.json(
  { success: true },
  { status: 200 } // Important!
);
```

3. Whitelist PayU IPs in firewall
4. Check PayU dashboard webhook configuration

**Debug Webhook**:

```javascript
// Add detailed logging in webhook/route.js
export async function POST(request) {
  console.log("🔔 Webhook received at:", new Date());
  console.log("Headers:", Object.fromEntries(request.headers));

  const formData = await request.formData();
  console.log("Form Data:", Object.fromEntries(formData));

  // ... rest of code
}
```

---

### 3. Payment Redirect Not Working

**Symptoms**:

- Form submission doesn't redirect to PayU
- Page refreshes but nothing happens
- Console shows errors

**Possible Causes**:

- Form not being submitted
- JavaScript errors
- Incorrect payment URL
- Missing parameters

**Solutions**:

```javascript
// Debug form submission
const initiatePayment = async () => {
  try {
    const response = await fetch("/api/payment/payu/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    console.log("Payment Response:", data);

    if (data.success) {
      // Verify paymentUrl
      console.log("Payment URL:", data.data.paymentUrl);

      // Verify params
      console.log("PayU Params:", data.data.payUParams);

      // Create and submit form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.data.paymentUrl;

      Object.keys(data.data.payUParams).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.data.payUParams[key];
        form.appendChild(input);
        console.log(`Added field: ${key} = ${input.value}`);
      });

      document.body.appendChild(form);
      console.log("Submitting form to PayU...");
      form.submit();
    }
  } catch (error) {
    console.error("Payment Error:", error);
  }
};
```

**Check**:

1. Verify payment URL is correct (test vs production)
2. All required parameters are present
3. No JavaScript errors in console
4. Form is actually being submitted

---

### 4. Order Not Updating After Payment

**Symptoms**:

- Payment successful on PayU
- Order status still "pending"
- Payment details not saved

**Possible Causes**:

- Database connection issue
- Order ID mismatch
- Validation logic error
- Hash verification failing

**Solutions**:

```javascript
// Add debug logging in validate/route.js
export async function POST(request) {
  const data = await request.json();

  console.log("=== PAYMENT VALIDATION START ===");
  console.log("Received Data:", data);

  // Verify hash
  const isValidHash = verifyResponseHash(data);
  console.log("Hash Valid:", isValidHash);

  // Check order ID
  const orderId = data.udf1;
  console.log("Order ID from UDF1:", orderId);

  // Find order
  const order = await Order.findOne({ orderId });
  console.log("Order Found:", order ? "Yes" : "No");

  if (order) {
    console.log("Current Order Status:", order.status);
    console.log("Current Payment Status:", order.paymentStatus);

    // Update order
    order.status = "confirmed";
    order.paymentStatus = "paid";
    await order.save();

    console.log("Updated Order Status:", order.status);
    console.log("Updated Payment Status:", order.paymentStatus);
  }

  console.log("=== PAYMENT VALIDATION END ===");

  return NextResponse.json({ success: true });
}
```

**Check**:

1. Database connection is working
2. Order ID in udf1 matches database
3. Order model has paymentDetails field
4. No errors in save operation

---

### 5. "Order Not Found" Error

**Error Message**: "Order not found" when processing payment

**Cause**: Order ID mismatch between order creation and payment

**Solution**:

```javascript
// When creating payment, ensure orderId is passed correctly
const handlePayment = async () => {
  // 1. Create order first
  const orderResponse = await fetch("/api/orders/create", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

  const order = await orderResponse.json();
  console.log("Created Order ID:", order.data.orderId);

  // 2. Use the SAME orderId for payment
  const paymentResponse = await fetch("/api/payment/payu/create", {
    method: "POST",
    body: JSON.stringify({
      orderId: order.data.orderId, // Use exact orderId from order
      amount: order.data.orderSummary.total,
      // ... other fields
    }),
  });
};

// In create/route.js, verify orderId
const order = await Order.findOne({ orderId });
console.log("Looking for Order:", orderId);
console.log("Order Found:", order ? "Yes" : "No");

if (!order) {
  console.error("Available Orders:", await Order.find().select("orderId"));
  return NextResponse.json(
    { success: false, message: "Order not found" },
    { status: 404 }
  );
}
```

---

### 6. Test Card Not Working

**Symptoms**:

- Test cards showing invalid
- Payment failing in test mode

**Solution**:

1. **Verify Test Mode**:

```javascript
// Check BASE_URL in create/route.js
BASE_URL: process.env.NODE_ENV === "production"
  ? "https://secure.payu.in"
  : "https://test.payu.in"; // Should use test URL
```

2. **Use Correct Test Cards**:

```
✅ Success: 5123 4567 8901 2346
✅ Failure: 5123 4567 8901 2345
✅ CVV: 123 (any 3 digits)
✅ Expiry: Any future date (12/25, 12/26, etc.)
✅ Name: Any name
```

3. **Check Test Credentials**:

```bash
# In .env.local
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW
```

---

### 7. Environment Variables Not Loading

**Symptoms**:

- Using default values instead of .env values
- "undefined" merchant key or salt

**Solutions**:

1. **Verify File Name**: Must be `.env.local` (not `.env` or `env.local`)

2. **Restart Server**: Environment variables load on startup

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

3. **Check File Location**: `.env.local` must be in root directory

```
your-project/
├── .env.local          ✅ Correct
├── app/
│   └── .env.local      ❌ Wrong
└── package.json
```

4. **Verify Syntax**:

```bash
# ✅ Correct
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW

# ❌ Wrong (no spaces around =)
PAYU_MERCHANT_KEY = gtKFFx
PAYU_MERCHANT_SALT = 4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW
```

5. **Debug in Code**:

```javascript
// Add to create/route.js
console.log("Merchant Key:", process.env.PAYU_MERCHANT_KEY);
console.log(
  "Merchant Salt:",
  process.env.PAYU_MERCHANT_SALT ? "Set" : "Not Set"
);
```

---

### 8. CORS Error in Production

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:

PayU redirects don't need CORS, but if you face issues:

```javascript
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/payment/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};
```

---

### 9. Double Payment Issue

**Symptoms**:

- User clicking payment button multiple times
- Multiple payment requests created

**Solution**:

```javascript
// Add loading state and disable button
const [loading, setLoading] = useState(false);

const handlePayment = async () => {
  if (loading) return; // Prevent double click

  setLoading(true);
  try {
    // ... payment logic
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

return (
  <button
    onClick={handlePayment}
    disabled={loading}
    className={loading ? "opacity-50 cursor-not-allowed" : ""}
  >
    {loading ? "Processing..." : "Pay Now"}
  </button>
);
```

---

### 10. Mobile Payment Issues

**Symptoms**:

- Payment works on desktop but not mobile
- UPI apps not opening

**Solutions**:

1. **Test Responsive Design**:

```bash
# Open in mobile view
# Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

2. **UPI Intent on Mobile**:

- PayU handles UPI intent automatically
- Ensure mobile browser allows app opening
- Test on actual device, not just emulator

3. **Mobile Browser Compatibility**:

- Test on Chrome Mobile
- Test on Safari (iOS)
- Check for JavaScript errors in mobile console

---

## 🔍 Debug Checklist

When something goes wrong, check these in order:

1. **Check Console Logs**:

   - Browser console (F12)
   - Server console (terminal)
   - Look for errors or warnings

2. **Verify Environment Variables**:

   ```bash
   # Check .env.local exists
   ls -la .env.local

   # Check values are set
   cat .env.local
   ```

3. **Test API Endpoints**:

   ```bash
   # Test payment creation
   curl -X POST http://localhost:3000/api/payment/payu/create \
     -H "Content-Type: application/json" \
     -d '{"orderId":"TEST123","amount":100,...}'
   ```

4. **Check Database**:

   ```javascript
   // In MongoDB compass or shell
   db.orders.findOne({ orderId: "YOUR_ORDER_ID" });
   ```

5. **Verify PayU Configuration**:

   - Login to PayU dashboard
   - Check merchant key and salt
   - Verify webhook URL
   - Check enabled payment modes

6. **Review Logs**:
   - Check server logs for errors
   - Review PayU dashboard for transaction status
   - Check webhook delivery logs

---

## 📞 Getting Help

### Self-Help Resources

1. Check `PAYU-PAYMENT-SETUP.md` for detailed documentation
2. Review `PAYU-FLOW-DIAGRAM.md` to understand flow
3. Check PayU official docs: https://docs.payu.in/
4. Search PayU knowledge base: https://help.payu.in/

### Contact PayU Support

- **Email**: integration@payu.in
- **Support Portal**: https://help.payu.in/
- **Dashboard**: https://dashboard.payu.in/

### What to Include in Support Request

1. Merchant ID
2. Transaction ID (if applicable)
3. Error message (exact text)
4. Steps to reproduce
5. Screenshots
6. Request/response logs (remove sensitive data)

---

## 💡 Pro Tips

1. **Always Test in Test Mode First**: Use test credentials before production
2. **Log Everything**: Add detailed logging for debugging
3. **Use Ngrok for Local Testing**: Essential for webhook testing
4. **Keep Documentation Handy**: Refer to official PayU docs
5. **Monitor Regularly**: Check transaction logs daily
6. **Backup Before Changes**: Always backup before modifying payment code
7. **Test All Payment Methods**: Cards, UPI, Net Banking, Wallets
8. **Mobile Test**: Always test on actual mobile devices

---

## ✅ Quick Fixes

### Payment Not Initiating

```javascript
// Check these:
1. Is order created? → Check database
2. Is amount correct? → Must have 2 decimals
3. Are env vars set? → Restart server
4. Any console errors? → Check browser console
```

### Webhook Not Working

```bash
# Use ngrok for local testing
ngrok http 3000
# Update webhook URL in PayU dashboard with ngrok URL
```

### Hash Mismatch

```javascript
// Verify parameters:
console.log("Amount:", amount); // Should be "1000.00"
console.log("Salt:", process.env.PAYU_MERCHANT_SALT);
console.log("Key:", process.env.PAYU_MERCHANT_KEY);
```

---

**Last Updated**: October 17, 2025

**Still stuck?** Check the complete documentation or contact PayU support!
