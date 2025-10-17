# PayU Payment Flow - Visual Guide

## 🔄 Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. SHOPPING PHASE
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Browse  │ ──> │ Add to   │ ──> │   View   │
   │ Products │     │   Cart   │     │   Cart   │
   └──────────┘     └──────────┘     └──────────┘

2. CHECKOUT PHASE
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Enter   │ ──> │  Select  │ ──> │  Place   │
   │ Address  │     │ Payment  │     │  Order   │
   └──────────┘     └──────────┘     └──────────┘
                          │
                          ├─> Cash on Delivery ──> Order Confirmed
                          │
                          └─> Online Payment ──> Continue Below

3. PAYMENT PHASE (Online Payment Selected)

   Customer Side                  Server Side                   PayU Side
   ┌──────────┐                  ┌──────────┐                 ┌──────────┐
   │ Click    │                  │  Create  │                 │          │
   │ Pay Now  │ ──────────────>  │  Order   │                 │          │
   │          │                  │  in DB   │                 │          │
   └──────────┘                  └──────────┘                 │          │
                                      │                        │          │
                                      ▼                        │          │
   ┌──────────┐                  ┌──────────┐                 │          │
   │          │                  │  Generate│                 │          │
   │          │ <──────────────  │   Hash   │                 │          │
   │          │  Payment Form    │  (SHA512)│                 │          │
   └──────────┘                  └──────────┘                 │          │
        │                                                      │          │
        │  POST with hash                                     │          │
        └──────────────────────────────────────────────────>  │  PayU    │
                                                               │ Payment  │
   ┌──────────┐                                                │  Page    │
   │  PayU    │ <─────────────────────────────────────────────┤          │
   │ Payment  │  Redirect to Payment Page                     │          │
   │   Page   │                                                └──────────┘
   └──────────┘
        │
        │ Customer enters card/UPI details
        ▼
   ┌──────────┐                                                ┌──────────┐
   │ Enter    │                                                │  PayU    │
   │ Payment  │ ──────────────────────────────────────────>   │ Process  │
   │ Details  │  Submit Payment                                │ Payment  │
   └──────────┘                                                └──────────┘
                                                                     │
                                                                     ▼
                                                              ┌──────────┐
                                                              │ Payment  │
                                                              │ Success/ │
                                                              │  Failure │
                                                              └──────────┘
                                                                  │    │
                ┌─────────────────────────────────────────────────┘    │
                │                                                       │
                ▼                                                       ▼
   ┌──────────────────┐                                    ┌──────────────────┐
   │   Redirect to    │                                    │   Redirect to    │
   │  Success URL     │                                    │  Failure URL     │
   │  with response   │                                    │  with response   │
   └──────────────────┘                                    └──────────────────┘
         │                                                           │
         │                                                           │
         ▼                                                           ▼
   ┌──────────┐     ┌──────────┐                         ┌──────────┐
   │ Validate │ ──> │  Update  │                         │ Validate │
   │   Hash   │     │  Order   │                         │   Hash   │
   └──────────┘     │  Status  │                         └──────────┘
         │          │ (paid)   │                              │
         │          └──────────┘                              │
         │               │                                    │
         ▼               ▼                                    ▼
   ┌──────────┐    ┌──────────┐                        ┌──────────┐
   │  Show    │    │  Send    │                        │  Show    │
   │ Success  │    │ Webhook  │                        │ Failure  │
   │  Page    │    │  to      │                        │  Page    │
   └──────────┘    │ Server   │                        └──────────┘
                   └──────────┘
                        │
                        ▼
                   ┌──────────┐
                   │ Webhook  │
                   │ Handler  │
                   │ Confirms │
                   └──────────┘

4. POST-PAYMENT PHASE
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Order   │ ──> │  Email   │ ──> │ Customer │
   │ Confirmed│     │  Sent    │     │ Redirect │
   └──────────┘     └──────────┘     └──────────┘
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      HASH GENERATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

REQUEST HASH (Payment Initiation):
┌──────────────────────────────────────────────────────────────┐
│ key|txnid|amount|productinfo|firstname|email|||||||||SALT    │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
                  [ SHA-512 ]
                        │
                        ▼
              ┌──────────────────┐
              │  Generated Hash  │
              │ (Sent with form) │
              └──────────────────┘

RESPONSE HASH (Payment Response Verification):
┌──────────────────────────────────────────────────────────────┐
│ SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|..│
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
                  [ SHA-512 ]
                        │
                        ▼
              ┌──────────────────┐
              │  Calculate Hash  │
              └──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Compare with    │
              │ Received Hash    │
              └──────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
        [ Match ]              [ No Match ]
            │                       │
            ▼                       ▼
      ✅ Valid              ❌ Invalid/Tampered
```

## 📊 Database Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORDER STATUS UPDATES                         │
└─────────────────────────────────────────────────────────────────┘

Order Created:
┌──────────────────────────────────────┐
│ Order Document                       │
├──────────────────────────────────────┤
│ orderId: "ORD123456"                │
│ status: "pending"                    │
│ paymentStatus: "pending"             │
│ paymentDetails: {                    │
│   gateway: "payu",                   │
│   status: "pending"                  │
│ }                                    │
└──────────────────────────────────────┘
              │
              ▼
Payment Request Created:
┌──────────────────────────────────────┐
│ Payment Details Updated              │
├──────────────────────────────────────┤
│ paymentDetails: {                    │
│   txnId: "TXN789...",               │
│   amount: 1000,                      │
│   status: "pending",                 │
│   gateway: "payu",                   │
│   initiatedAt: Date()                │
│ }                                    │
└──────────────────────────────────────┘
              │
              ▼
Payment Completed (Success):
┌──────────────────────────────────────┐
│ Order Updated                        │
├──────────────────────────────────────┤
│ status: "confirmed"                  │
│ paymentStatus: "paid"                │
│ paymentDetails: {                    │
│   txnId: "TXN789...",               │
│   mihpayid: "403993715...",         │
│   amount: 1000,                      │
│   status: "success",                 │
│   gateway: "payu",                   │
│   mode: "CC",                        │
│   bankcode: "VISA",                  │
│   bank_ref_no: "2eec20f3...",       │
│   updatedAt: Date()                  │
│ }                                    │
└──────────────────────────────────────┘

Payment Failed:
┌──────────────────────────────────────┐
│ Order Updated                        │
├──────────────────────────────────────┤
│ status: "payment_failed"             │
│ paymentStatus: "failed"              │
│ paymentDetails: {                    │
│   status: "failed",                  │
│   error: "E000",                     │
│   error_Message: "Payment failed"    │
│ }                                    │
└──────────────────────────────────────┘
```

## 🌐 API Endpoints Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        API STRUCTURE                             │
└─────────────────────────────────────────────────────────────────┘

/api/payment/payu/
│
├── /create (POST)
│   ├─> Input: { orderId, amount, customerInfo, productInfo }
│   ├─> Process: Generate hash, create payment params
│   └─> Output: { payUParams, paymentUrl }
│
├── /webhook (POST)
│   ├─> Input: FormData from PayU
│   ├─> Process: Verify hash, update order
│   └─> Output: 200 OK
│
└── /validate (POST)
    ├─> Input: Payment response params
    ├─> Process: Verify hash, update order
    └─> Output: { success, data: { orderId, status, ... } }

/payment/
│
├── /success
│   └─> Display success page, redirect to order
│
├── /failure
│   └─> Display error, option to retry
│
└── /cancel
    └─> Display cancel message, return to cart
```

## 🎨 Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENT HIERARCHY                          │
└─────────────────────────────────────────────────────────────────┘

CartPage
└── PaymentMethodSelection
    ├── CashOnDelivery (Radio)
    └── OnlinePayment (Radio)
        └── [When selected]
            └── PayUPayment Component
                ├── Loading State
                ├── Payment Button
                └── Form Generator
                    ├── Hidden Fields (PayU params)
                    └── Auto-submit to PayU

PayU Payment Page (External)
└── Customer enters payment details

Success/Failure/Cancel Pages
├── Status Icon
├── Transaction Details
├── Action Buttons
└── Auto-redirect
```

## 📱 Mobile Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       MOBILE EXPERIENCE                          │
└─────────────────────────────────────────────────────────────────┘

Mobile Browser
│
├─> Cart Page (Responsive)
│   └─> Select Payment → PayU
│
├─> PayU Mobile Page
│   ├─> Cards
│   ├─> UPI Apps (Intent)
│   │   └─> Opens GPay/PhonePe/Paytm
│   ├─> Wallets
│   └─> Net Banking
│
└─> Return to App
    └─> Success/Failure Page (Responsive)
```

## 🔄 Webhook vs Redirect

```
┌─────────────────────────────────────────────────────────────────┐
│              DUAL UPDATE MECHANISM                               │
└─────────────────────────────────────────────────────────────────┘

                    PayU Payment Processing
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        Browser Redirect          Server Webhook
        (User sees)               (Background)
                │                       │
                ▼                       ▼
    /payment/success              /api/payment/
        page.js                   payu/webhook
                │                       │
                ▼                       ▼
        Validate Hash             Validate Hash
                │                       │
                ▼                       ▼
        Update Order              Update Order
        (First update)            (Confirmation)
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
                    Order Confirmed
                 (Double verification)
```

---

## 💡 Key Takeaways

1. **Security**: Every request and response is hash-verified
2. **Reliability**: Dual update (redirect + webhook) ensures no missed updates
3. **User Experience**: Beautiful pages with clear messaging
4. **Developer Experience**: Clean code, easy integration
5. **Production Ready**: Test mode → Production seamless transition

---

**Need more details?** Check the documentation files!
