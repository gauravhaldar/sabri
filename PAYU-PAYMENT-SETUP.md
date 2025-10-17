# PayU Payment Gateway Integration

Complete implementation of PayU payment gateway for the Sabri e-commerce platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Testing](#testing)
- [Production Checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This integration implements PayU's Hosted Checkout solution, which provides:

- Secure payment processing
- Multiple payment methods (Cards, UPI, Net Banking, Wallets, EMI)
- PCI-DSS compliance
- Server-to-server webhooks for reliable payment status updates
- Hash-based security

## ✨ Features

### Implemented Features

- ✅ PayU Hosted Checkout integration
- ✅ SHA-512 hash generation for request security
- ✅ Hash verification for response validation
- ✅ Server-to-server webhook handling
- ✅ Success, Failure, and Cancel payment pages
- ✅ Order status synchronization
- ✅ Payment status tracking
- ✅ Test and Production environment support

### Payment Flow

1. User completes checkout and selects online payment
2. Server creates PayU payment request with hash
3. User is redirected to PayU payment page
4. User completes payment
5. PayU sends response to success/failure URL
6. PayU sends webhook to server for confirmation
7. Order status is updated
8. User sees success/failure page

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# PayU Payment Gateway Configuration

# Test Credentials (Default - Replace with your test credentials)
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW

# Production Credentials (Add when going live)
# PAYU_MERCHANT_KEY=your_production_key
# PAYU_MERCHANT_SALT=your_production_salt

# Payment URLs (Update these with your domain)
PAYU_SUCCESS_URL=http://localhost:3000/payment/success
PAYU_FAILURE_URL=http://localhost:3000/payment/failure
PAYU_CANCEL_URL=http://localhost:3000/payment/cancel

# For production, use your domain:
# PAYU_SUCCESS_URL=https://yourdomain.com/payment/success
# PAYU_FAILURE_URL=https://yourdomain.com/payment/failure
# PAYU_CANCEL_URL=https://yourdomain.com/payment/cancel
```

### 2. Get PayU Credentials

#### Test Credentials

The default test credentials are already configured:

- **Key**: `gtKFFx`
- **Salt**: `4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW`

#### Production Credentials

1. Sign up at [PayU India](https://onboarding.payu.in/app/account/signup)
2. Complete KYC verification
3. Navigate to Dashboard → Settings → API Keys
4. Copy your Production Key and Salt
5. Update environment variables

### 3. Configure Webhook URL

For production, you need to configure webhook URL with PayU:

1. **Using PayU Dashboard** (Recommended):

   - Login to [PayU Dashboard](https://dashboard.payu.in/)
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payment/payu/webhook`
   - Save configuration

2. **Manual Configuration**:

   - Email PayU Integration Team: integration@payu.in
   - Provide your webhook URL: `https://yourdomain.com/api/payment/payu/webhook`
   - Provide your server IP address
   - They will whitelist your webhook URL

3. **Whitelist PayU IPs** in your firewall:
   ```
   52.140.8.88, 52.140.8.89, 180.179.174.2, 180.179.165.250
   52.140.8.64, 52.140.8.65, 3.6.73.183, 3.6.83.44
   3.7.89.1, 3.7.89.2, 3.7.89.3, 3.7.89.8, 3.7.89.9, 3.7.89.10
   ```

## ⚙️ Configuration

### API Endpoints Created

#### 1. Create Payment Request

- **Endpoint**: `POST /api/payment/payu/create`
- **Purpose**: Initiates payment request
- **Request Body**:

```json
{
  "orderId": "ORD123456",
  "amount": 1000.0,
  "customerInfo": {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "productInfo": "Order Payment"
}
```

- **Response**:

```json
{
  "success": true,
  "data": {
    "payUParams": {
      "key": "gtKFFx",
      "txnid": "TXN123456789",
      "amount": "1000.00",
      "productinfo": "Order Payment",
      "firstname": "John",
      "email": "john@example.com",
      "phone": "9876543210",
      "surl": "http://localhost:3000/payment/success",
      "furl": "http://localhost:3000/payment/failure",
      "curl": "http://localhost:3000/payment/cancel",
      "hash": "generated_sha512_hash",
      "udf1": "ORD123456"
    },
    "paymentUrl": "https://test.payu.in/_payment"
  }
}
```

#### 2. Webhook Handler

- **Endpoint**: `POST /api/payment/payu/webhook`
- **Purpose**: Receives payment status from PayU
- **Content-Type**: `application/x-www-form-urlencoded` or `FormData`
- **Response**: `200 OK` on success

#### 3. Validate Payment

- **Endpoint**: `POST /api/payment/payu/validate`
- **Purpose**: Validates payment response from success/failure pages
- **Request Body**: PayU response parameters
- **Response**:

```json
{
  "success": true,
  "data": {
    "orderId": "ORD123456",
    "txnId": "TXN123456789",
    "amount": "1000.00",
    "status": "success",
    "mode": "CC"
  }
}
```

### Pages Created

1. **Success Page**: `/payment/success`

   - Displays success message
   - Shows transaction details
   - Redirects to order details

2. **Failure Page**: `/payment/failure`

   - Shows error message
   - Displays failure reason
   - Option to retry payment

3. **Cancel Page**: `/payment/cancel`
   - Informs user of cancellation
   - Redirects to cart

## 💻 Frontend Integration

### Method 1: Using PayUPayment Component

```jsx
import PayUPayment from "@/components/PayUPayment";

// In your cart/checkout page
<PayUPayment
  orderId={orderData.orderId}
  amount={totalAmount}
  customerInfo={{
    firstname: user.firstName,
    lastname: user.lastName,
    email: user.email,
    phone: user.phone,
  }}
  productInfo="Order Payment"
/>;
```

### Method 2: Custom Implementation

```javascript
const handlePayment = async () => {
  try {
    // 1. Create payment request
    const response = await fetch("/api/payment/payu/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "ORD123456",
        amount: 1000.0,
        customerInfo: {
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          phone: "9876543210",
        },
        productInfo: "Order Payment",
      }),
    });

    const data = await response.json();

    if (data.success) {
      // 2. Create form and submit to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.data.paymentUrl;

      Object.keys(data.data.payUParams).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.data.payUParams[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};
```

## 🧪 Testing

### Test Cards

PayU provides test cards for testing different scenarios:

#### Successful Transaction

- **Card Number**: 5123 4567 8901 2346
- **CVV**: 123
- **Expiry**: Any future date
- **Name**: Any name

#### Failed Transaction

- **Card Number**: 5123 4567 8901 2345
- **CVV**: 123
- **Expiry**: Any future date

#### Pending Transaction

- **Card Number**: 4000 0000 0000 0002
- **CVV**: 123
- **Expiry**: Any future date

### Test UPI IDs

- Success: `success@payu`
- Failure: `failure@payu`

### Test Wallets

Select any wallet and use test credentials provided on the payment page.

### Testing Workflow

1. **Test Payment Creation**:

```bash
curl -X POST http://localhost:3000/api/payment/payu/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST123",
    "amount": 100,
    "customerInfo": {
      "firstname": "Test",
      "email": "test@example.com",
      "phone": "9876543210"
    },
    "productInfo": "Test Product"
  }'
```

2. **Test Success Flow**:

   - Use success test card
   - Complete payment
   - Verify redirect to success page
   - Check order status in database

3. **Test Failure Flow**:

   - Use failure test card
   - Verify redirect to failure page
   - Check order status remains pending

4. **Test Webhook**:
   - Use a tool like ngrok for local testing
   - Configure webhook URL with ngrok URL
   - Complete a test transaction
   - Verify webhook receives callback

## 📦 Production Checklist

Before going live:

- [ ] **Update Environment Variables**:

  - [ ] Add production PAYU_MERCHANT_KEY
  - [ ] Add production PAYU_MERCHANT_SALT
  - [ ] Update PAYU_SUCCESS_URL to production domain
  - [ ] Update PAYU_FAILURE_URL to production domain
  - [ ] Update PAYU_CANCEL_URL to production domain

- [ ] **PayU Dashboard Configuration**:

  - [ ] Complete KYC verification
  - [ ] Get production credentials
  - [ ] Configure webhook URL
  - [ ] Enable required payment modes
  - [ ] Set up notification emails

- [ ] **Server Configuration**:

  - [ ] Whitelist PayU IPs in firewall
  - [ ] Ensure HTTPS is enabled
  - [ ] Test webhook endpoint is accessible
  - [ ] Configure CORS if needed

- [ ] **Testing**:

  - [ ] Test all payment modes (Card, UPI, Net Banking, Wallets)
  - [ ] Test success flow
  - [ ] Test failure flow
  - [ ] Test cancel flow
  - [ ] Test webhook reception
  - [ ] Test hash verification
  - [ ] Test with real small amount (₹1)

- [ ] **Monitoring**:
  - [ ] Set up payment logs
  - [ ] Configure error alerts
  - [ ] Monitor webhook failures
  - [ ] Track payment success rate

## 🔧 Troubleshooting

### Common Issues

#### 1. Hash Mismatch Error

**Problem**: "Invalid hash" error
**Solution**:

- Verify MERCHANT_SALT is correct
- Ensure amount has 2 decimal places
- Check parameter order in hash string
- Verify no extra spaces in parameters

#### 2. Webhook Not Received

**Problem**: Webhook not hitting server
**Solution**:

- Verify webhook URL is accessible publicly
- Check PayU IPs are whitelisted
- Ensure endpoint returns 200 OK
- Check PayU dashboard webhook configuration

#### 3. Payment Success but Order Not Updated

**Problem**: Payment successful but order status not changing
**Solution**:

- Check webhook logs
- Verify orderId in udf1 parameter
- Check database connection
- Review webhook handler code

#### 4. Redirect URL Not Working

**Problem**: Not redirecting after payment
**Solution**:

- Verify success/failure URLs are accessible
- Check URLs in environment variables
- Ensure URLs are whitelisted in PayU dashboard

### Debug Mode

Enable detailed logging:

```javascript
// In route.js files, add:
console.log("PayU Request:", payUParams);
console.log("Hash String:", hashString);
console.log("Generated Hash:", hash);
```

### Support Contacts

- **PayU Integration Team**: integration@payu.in
- **PayU Support**: https://help.payu.in/
- **PayU Documentation**: https://docs.payu.in/

## 📚 Additional Resources

- [PayU Official Documentation](https://docs.payu.in/)
- [PayU Test Credentials](https://docs.payu.in/docs/test-cards-upi-id-and-wallets)
- [PayU Dashboard](https://dashboard.payu.in/)
- [PayU Webhooks Guide](https://docs.payu.in/docs/webhooks)
- [Hash Generation Guide](https://docs.payu.in/docs/generate-hash-payu-hosted)

## 🔐 Security Best Practices

1. **Never expose Salt**: Keep MERCHANT_SALT in environment variables only
2. **Always verify hash**: Verify hash on both request and response
3. **Use HTTPS**: Always use HTTPS in production
4. **Validate amounts**: Cross-check amounts before processing
5. **Log transactions**: Maintain detailed logs for audit
6. **Implement retry logic**: Handle webhook failures gracefully
7. **Monitor suspicious activity**: Track failed payment attempts

## 📝 License

This implementation is part of the Sabri e-commerce platform.

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
