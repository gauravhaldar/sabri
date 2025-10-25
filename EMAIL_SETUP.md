# Email Configuration Guide for Sabri Jewelry

## 🔧 Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=haldarainit@gmail.com
```

### 2. Gmail Setup (Recommended)

If you're using Gmail, you **MUST** create an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Sabri Jewelry" as the name
6. Click **Generate**
7. Copy the 16-character password and use it as `SMTP_PASS`

⚠️ **DO NOT use your regular Gmail password** - it will not work!

### 3. Alternative SMTP Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

#### Amazon SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-access-key-id
SMTP_PASS=your-ses-secret-access-key
```

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check environment variables are loaded:**
   - Restart your Next.js development server after creating/modifying `.env.local`
   - Run: `npm run dev` (or `yarn dev`)

2. **Verify SMTP credentials:**
   - Check the console logs for "Email Configuration" output
   - Look for authentication errors

3. **Common Error Messages:**

   **Error: Invalid login**
   - You're using your regular Gmail password instead of an App Password
   - Generate a new App Password and use that

   **Error: Connection timeout**
   - Check your firewall settings
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Try port 465 with `secure: true` instead

   **Error: self signed certificate**
   - Your network might be blocking SMTP
   - Try using a VPN or different network

4. **Check console logs:**
   ```bash
   # Look for these log messages:
   ✅ Order notification email sent successfully
   ❌ Error sending order notification email
   ```

### Testing Email Functionality

Create a test script to verify email is working:

```javascript
// test-email.js
import { sendOrderNotificationEmail } from './lib/emailService.js';

const testOrder = {
  orderId: 'TEST001',
  createdAt: new Date(),
  status: 'pending',
  items: [
    {
      name: 'Test Product',
      sku: 'TEST-SKU',
      quantity: 1,
      price: 1000
    }
  ],
  shippingAddress: {
    name: 'Test User',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    phone: '1234567890'
  },
  paymentMethod: 'online_payment',
  orderSummary: {
    subtotal: 1000,
    shippingCharges: 0,
    discount: 0,
    total: 1000,
    couponCode: 'None'
  }
};

sendOrderNotificationEmail(testOrder)
  .then(result => console.log('Email Result:', result))
  .catch(error => console.error('Email Error:', error));
```

Run with: `node test-email.js`

## 📝 Changes Made

1. ✅ Removed product images from email templates
2. ✅ Replaced logo URL with "SABRI JEWELRY" text header
3. ✅ Added detailed error logging
4. ✅ Added email configuration logging (without exposing passwords)
5. ✅ Fixed HTML structure for both admin and customer emails

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Add `.env.local` to your `.gitignore` file
- Use App Passwords for Gmail, not your main password
- Rotate your SMTP credentials periodically

## 📧 Email Features

### Admin Notification Email
- Sent when a new order is placed
- Includes complete order details
- Product list with SKU and pricing
- Shipping address information
- Payment method details

### Customer Confirmation Email
- Sent to customer after order placement
- Similar format to admin email
- Personalized thank you message

Both emails are responsive and mobile-friendly!
