// Test script using Ethereal Email (no authentication required)
// Run this with: node test-ethereal.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

async function testEtherealEmail() {
  console.log('🧪 Testing email functionality with Ethereal Email...');
  
  // Create Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  
  console.log('📧 Ethereal Test Account Created:');
  console.log('  User:', testAccount.user);
  console.log('  Pass:', testAccount.pass);
  
  // Create transporter using Ethereal
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Sample order data
  const orderData = {
    orderId: 'SAB000001',
    createdAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  // Format order items for email
  const itemsList = orderData.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price?.toLocaleString() || 'N/A'}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  // Email HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification - ${orderData.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .order-info { background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .summary { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .status-badge { 
          display: inline-block; 
          padding: 4px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: bold; 
          text-transform: uppercase;
        }
        .status-confirmed { background-color: #d4edda; color: #155724; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #333;">🛍️ New Order Received!</h1>
          <p style="margin: 5px 0 0 0; color: #666;">Order ID: <strong>${orderData.orderId}</strong></p>
        </div>

        <div class="order-info">
          <h2 style="margin-top: 0; color: #333;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px;">Order ID:</td>
              <td style="padding: 8px;">${orderData.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Order Date:</td>
              <td style="padding: 8px;">${new Date(orderData.createdAt).toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Status:</td>
              <td style="padding: 8px;">
                <span class="status-badge status-${orderData.status}">${orderData.status}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Payment Method:</td>
              <td style="padding: 8px;">${orderData.paymentMethod === 'online_payment' ? 'Online Payment' : 'Cash on Delivery'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Estimated Delivery:</td>
              <td style="padding: 8px;">${new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</td>
            </tr>
          </table>
        </div>

        <div class="order-info">
          <h2 style="margin-top: 0; color: #333;">Shipping Address</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            ${orderData.shippingAddress.name}<br>
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.pincode}<br>
            Phone: ${orderData.shippingAddress.phone}
          </div>
        </div>

        <div class="order-info">
          <h2 style="margin-top: 0; color: #333;">Order Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
        </div>

        <div class="summary">
          <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Subtotal:</td>
              <td style="padding: 8px; text-align: right;">₹${orderData.orderSummary.subtotal?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Shipping Charges:</td>
              <td style="padding: 8px; text-align: right;">₹${orderData.orderSummary.shippingCharges.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Coupon Applied:</td>
              <td style="padding: 8px; text-align: right;">${orderData.orderSummary.couponCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Discount:</td>
              <td style="padding: 8px; text-align: right;">-₹${orderData.orderSummary.discount?.toLocaleString() || '0'}</td>
            </tr>
            <tr style="border-top: 2px solid #333;">
              <td style="padding: 8px; font-weight: bold; font-size: 16px;">Total Amount:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px;">₹${orderData.orderSummary.total?.toLocaleString() || '0'}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>This is an automated notification from Sabri Jewelry System.</p>
          <p>Please process this order as soon as possible.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email options
  const mailOptions = {
    from: `"Sabri Jewelry" <${testAccount.user}>`,
    to: 'haldarainit@gmail.com',
    subject: `🛍️ New Order Received - ${orderData.orderId}`,
    html: htmlContent,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('');
    console.log('📬 Check the preview URL above to see how the email looks');
    console.log('📧 The email was sent to: haldarainit@gmail.com');
    
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.log('❌ Email failed to send');
    console.log('🔍 Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testEtherealEmail();
