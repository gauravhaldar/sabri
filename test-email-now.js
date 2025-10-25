// Quick Email Test Script for Sabri Jewelry
// Run this to test if your SMTP credentials are working

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import { sendOrderNotificationEmail } from './lib/emailService.js';

console.log('\n🔧 Testing Email Configuration...\n');

// Test order data
const testOrderData = {
  orderId: 'TEST-' + Date.now(),
  createdAt: new Date(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  status: 'pending',
  items: [
    {
      name: 'Test Gold Ring',
      sku: 'TEST-GOLD-001',
      id: 'test123',
      quantity: 1,
      price: 5000
    },
    {
      name: 'Test Silver Necklace',
      sku: 'TEST-SILVER-001',
      id: 'test456',
      quantity: 2,
      price: 3000
    }
  ],
  shippingAddress: {
    name: 'Test Customer',
    address: '123 Test Street, Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210'
  },
  paymentMethod: 'online_payment',
  orderSummary: {
    subtotal: 11000,
    shippingCharges: 100,
    discount: 500,
    total: 10600,
    couponCode: 'TEST10'
  },
  invoice: {
    invoiceId: 'INV-TEST-001',
    generatedDate: new Date(),
    paymentStatus: 'pending'
  }
};

console.log('📧 Sending test email to:', process.env.ADMIN_EMAIL || 'haldarainit@gmail.com');
console.log('📨 Using SMTP:', process.env.SMTP_USER || 'NOT SET');
console.log('🔑 Password configured:', process.env.SMTP_PASS ? 'YES ✅' : 'NO ❌');
console.log('\n⏳ Sending email...\n');

sendOrderNotificationEmail(testOrderData)
  .then(result => {
    if (result.success) {
      console.log('\n✅ SUCCESS! Email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
      console.log('\n🎉 Your email configuration is working correctly!');
      console.log('📧 Check', process.env.ADMIN_EMAIL || 'haldarainit@gmail.com', 'for the test email.\n');
    } else {
      console.log('\n❌ FAILED! Email could not be sent.');
      console.log('Error:', result.error);
      console.log('\n🔍 Troubleshooting tips:');
      console.log('1. Make sure you\'re using a Gmail App Password (not regular password)');
      console.log('2. Restart your development server');
      console.log('3. Check if 2-Step Verification is enabled on Gmail');
      console.log('4. Verify SMTP credentials in .env file\n');
    }
  })
  .catch(error => {
    console.log('\n❌ ERROR! Something went wrong.');
    console.log('Error details:', error.message);
    console.log('\n🔍 Check your .env file configuration.\n');
  });
