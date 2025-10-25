// Test script to simulate real order creation with email
// Run this with: node test-real-order.js

import { sendOrderNotificationEmail } from './lib/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Simulate real order data (as it would come from the API)
const simulateOrderCreation = async () => {
  console.log('🛍️ Simulating real order creation...');
  
  // This is how the order data looks when created via the API
  const orderResponse = {
    orderId: 'SAB000123',
    createdAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'confirmed',
    items: [
      {
        name: 'Gold Plated Diamond Ring',
        quantity: 1,
        price: 4500
      },
      {
        name: 'Silver Chain Necklace',
        quantity: 1,
        price: 3200
      },
      {
        name: 'Pearl Earrings Set',
        quantity: 2,
        price: 1800
      }
    ],
    shippingAddress: {
      name: 'Priya Sharma',
      address: 'Flat 201, Green Park Apartments',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110016',
      phone: '+91 9876543210'
    },
    paymentMethod: 'online_payment',
    orderSummary: {
      subtotal: 11300,
      shippingCharges: 150,
      discount: 1000,
      couponCode: 'SAVE10',
      total: 10450
    },
    invoice: {
      invoiceId: 'INV-SAB000123-1703123456789',
      generatedDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentStatus: 'paid'
    },
    paymentDetails: {
      transactionId: 'TXN789456123',
      status: 'success',
      gateway: 'PayU'
    }
  };

  console.log('📋 Order Details:');
  console.log('  Order ID:', orderResponse.orderId);
  console.log('  Customer:', orderResponse.shippingAddress.name);
  console.log('  Items:', orderResponse.items.length);
  console.log('  Total:', `₹${orderResponse.orderSummary.total.toLocaleString()}`);
  console.log('  Payment:', orderResponse.paymentMethod);
  console.log('');

  try {
    console.log('📧 Sending order notification email...');
    const emailResult = await sendOrderNotificationEmail(orderResponse);
    
    if (emailResult.success) {
      console.log('✅ Order notification email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      console.log('📬 Check haldarainit@gmail.com inbox');
      console.log('');
      console.log('🎉 Order creation simulation completed successfully!');
      console.log('📝 This is exactly what happens when a real customer places an order.');
    } else {
      console.log('❌ Failed to send order notification email');
      console.log('🔍 Error:', emailResult.error);
      console.log('');
      console.log('💡 Tip: Use Ethereal Email for testing:');
      console.log('   node test-ethereal.js');
    }
  } catch (error) {
    console.log('❌ Error during order simulation:', error.message);
  }
};

// Run the simulation
simulateOrderCreation();
