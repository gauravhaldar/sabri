// Test script for email functionality
// Run this with: node test-email.js

import { sendOrderNotificationEmail } from './lib/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Sample order data for testing
const sampleOrderData = {
  orderId: 'SAB000001',
  createdAt: new Date(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: 'confirmed',
  items: [
    {
      name: 'Gold Plated Ring',
      quantity: 1,
      price: 2500
    },
    {
      name: 'Silver Necklace',
      quantity: 2,
      price: 1800
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 9876543210'
  },
  paymentMethod: 'online_payment',
  orderSummary: {
    subtotal: 6100,
    shippingCharges: 100,
    discount: 500,
    couponCode: 'WELCOME10',
    total: 5700
  },
  invoice: {
    invoiceId: 'INV-SAB000001-1234567890',
    generatedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    paymentStatus: 'paid'
  },
  paymentDetails: {
    transactionId: 'TXN123456789',
    status: 'success',
    gateway: 'PayU'
  }
};

async function testEmail() {
  console.log('🧪 Testing email functionality...');
  console.log('📧 SMTP Configuration:');
  console.log('  Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
  console.log('  Port:', process.env.SMTP_PORT || '587');
  console.log('  User:', process.env.SMTP_USER || 'Not configured');
  console.log('  Admin Email:', process.env.ADMIN_EMAIL || 'haldarainit@gmail.com');
  console.log('');

  try {
    const result = await sendOrderNotificationEmail(sampleOrderData);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📬 Check the admin email inbox for the order notification.');
    } else {
      console.log('❌ Email failed to send');
      console.log('🔍 Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('1. Make sure you have configured SMTP settings in .env.local');
    console.log('2. For Gmail, use App Password instead of regular password');
    console.log('3. Check if 2-factor authentication is enabled');
    console.log('4. Verify SMTP credentials are correct');
  }
}

// Run the test
testEmail();
