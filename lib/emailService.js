import nodemailer from "nodemailer";

// Function to get email configuration dynamically
const getEmailConfig = () => {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "your-email@gmail.com",
      pass: process.env.SMTP_PASS || "your-app-password",
    },
  };
};

// Function to create transporter dynamically
const createTransporter = () => {
  return nodemailer.createTransport(getEmailConfig());
};

// Function to send order notification email to admin
export async function sendOrderNotificationEmail(orderData) {
  try {
    // Create transporter dynamically to ensure fresh environment variables
    const transporter = createTransporter();
    const {
      orderId,
      createdAt,
      estimatedDelivery,
      status,
      items,
      shippingAddress,
      paymentMethod,
      orderSummary,
      invoice,
      paymentDetails,
    } = orderData;

    // Format order items for email without images
    const itemsList = items
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 15px; border: 1px solid #e0e0e0; vertical-align: middle;">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${
            item.name
          }</div>
          <div style="font-size: 12px; color: #666;">SKU: ${
            item.sku || item.id || "N/A"
          }</div>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: center; vertical-align: middle;">
          <span style="background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${
            item.quantity
          }</span>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right; vertical-align: middle;">
          <span style="font-weight: bold; color: #333;">₹${
            item.price?.toLocaleString() || "N/A"
          }</span>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right; vertical-align: middle;">
          <span style="font-weight: bold; color: #007bff; font-size: 16px;">₹${(
            (item.price || 0) * (item.quantity || 1)
          ).toLocaleString()}</span>
        </td>
      </tr>
    `
      )
      .join("");

    // Format shipping address with enhanced styling
    const addressText = `
      <div style="font-weight: bold; color: #333; margin-bottom: 10px; font-size: 16px;">📦 Shipping Address</div>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
        <div style="font-weight: bold; color: #333; margin-bottom: 8px;">${
          shippingAddress.name || "N/A"
        }</div>
        <div style="color: #666; margin-bottom: 5px;">${
          shippingAddress.addressLine1 || ""
        }</div>
        ${
          shippingAddress.addressLine2
            ? `<div style="color: #666; margin-bottom: 5px;">${shippingAddress.addressLine2}</div>`
            : ""
        }
        <div style="color: #666; margin-bottom: 5px;">${
          shippingAddress.city || "N/A"
        }, ${shippingAddress.state || "N/A"} - ${
      shippingAddress.zipCode || "N/A"
    }</div>
        <div style="color: #666; font-weight: bold;">📞 Phone: ${
          shippingAddress.phone || "N/A"
        }</div>
      </div>
    `;

    // Email HTML template with enhanced design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Notification - ${orderId}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .email-container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 20px; text-align: center; }
          .logo { max-width: 200px; height: auto; margin-bottom: 15px; }
          .header-title { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .header-subtitle { color: #cccccc; font-size: 16px; margin: 5px 0 0 0; }
          .order-info { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #e0e0e0; padding: 15px; text-align: left; }
          .items-table th { background-color: #f8f9fa; font-weight: bold; color: #333; }
          .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e0e0e0; }
          .summary { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 12px; margin: 20px; }
          .status-badge { 
            display: inline-block; 
            padding: 6px 16px; 
            border-radius: 25px; 
            font-size: 12px; 
            font-weight: bold; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-confirmed { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .shipping-address { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
          .footer { margin: 30px 20px; padding: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
          .highlight { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px;">SABRI JEWELRY</h1>
            <h1 class="header-title">🛍️ New Order Received!</h1>
            <p class="header-subtitle">Order ID: <strong>${orderId}</strong></p>
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">📋 Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; font-weight: bold; width: 150px; background-color: #f8f9fa;">Order ID:</td>
                <td style="padding: 12px; font-weight: bold; color: #007bff;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Order Date:</td>
                <td style="padding: 12px;">${new Date(createdAt).toLocaleString(
                  "en-IN",
                  {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Status:</td>
                <td style="padding: 12px;">
                  <span class="status-badge status-${status}">${status}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Payment Method:</td>
                <td style="padding: 12px;">${
                  paymentMethod === "online_payment"
                    ? "💳 Online Payment"
                    : "💰 Cash on Delivery"
                }</td>
              </tr>
            </table>
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🚚 Shipping Address</h2>
            ${addressText}
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🛍️ Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px;">Product Details</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: center;">Quantity</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: right;">Unit Price</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: right;">Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
          </div>

          <div class="summary">
            <h3 style="margin-top: 0; color: #333;">💰 Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">₹${
                  orderSummary.subtotal?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Shipping Charges:</td>
                <td style="padding: 8px; text-align: right;">₹${
                  orderSummary.shippingCharges?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Coupon Applied:</td>
                <td style="padding: 8px; text-align: right;">${
                  orderSummary.couponCode || "None"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Discount:</td>
                <td style="padding: 8px; text-align: right;">-₹${
                  orderSummary.discount?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr style="border-top: 2px solid #333;">
                <td style="padding: 8px; font-weight: bold; font-size: 16px;">Total Amount:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px;">₹${
                  orderSummary.total?.toLocaleString() || "0"
                }</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>This is an automated notification from Sabri Jewelry System.</p>
            <p>Please process this order as soon as possible.</p>
            <p style="margin-top: 15px; font-size: 10px; color: #999;">
              © 2024 Sabri Jewelry. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
      New Order Received - ${orderId}
      
      Order Details:
      - Order ID: ${orderId}
      - Date: ${new Date(createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}
      - Status: ${status}
      - Payment: ${
        paymentMethod === "online_payment"
          ? "Online Payment"
          : "Cash on Delivery"
      }
      
      Shipping Address:
      ${shippingAddress.name || "N/A"}
      ${shippingAddress.addressLine1 || ""}
      ${
        shippingAddress.addressLine2
          ? shippingAddress.addressLine2 + "\n      "
          : ""
      }${shippingAddress.city || "N/A"}, ${shippingAddress.state || "N/A"} - ${
      shippingAddress.zipCode || "N/A"
    }
      Phone: ${shippingAddress.phone || "N/A"}
      
      Order Items:
      ${items
        .map(
          (item) =>
            `- ${item.name} (Qty: ${
              item.quantity
            }) - ₹${item.price?.toLocaleString()}`
        )
        .join("\n")}
      
      Order Summary:
      - Subtotal: ₹${(orderSummary.subtotal || 0).toLocaleString()}
      - Shipping: ₹${(orderSummary.shippingCharges || 150).toLocaleString()}
      - Discount: -₹${(orderSummary.discount || 0).toLocaleString()}
      - Total: ₹${(orderSummary.total || 0).toLocaleString()}
      
      Please process this order as soon as possible.
    `;

    const adminEmail = process.env.ADMIN_EMAIL || "haldarainit@gmail.com";
    const emailConfig = getEmailConfig();

    // Log email configuration (without sensitive data)
    console.log("Email Configuration:", {
      host: emailConfig.host,
      port: emailConfig.port,
      user: emailConfig.auth.user,
      hasPassword: !!emailConfig.auth.pass,
    });

    const mailOptions = {
      from: `"Sabri Jewelry" <${emailConfig.auth.user}>`,
      to: adminEmail,
      subject: `🛍️ New Order Received - ${orderId}`,
      text: textContent,
      html: htmlContent,
    };

    console.log("Attempting to send email to:", adminEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Order notification email sent successfully:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending order notification email:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return { success: false, error: error.message };
  }
}

// Function to send order confirmation email to customer
export async function sendOrderConfirmationEmail(orderData, customerEmail) {
  try {
    const transporter = createTransporter();
    const {
      orderId,
      createdAt,
      estimatedDelivery,
      status,
      items,
      shippingAddress,
      paymentMethod,
      orderSummary,
      invoice,
      paymentDetails,
    } = orderData;

    // Format order items for email
    const itemsList = items
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 15px; border: 1px solid #e0e0e0; vertical-align: middle;">
          <div>
            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${
              item.name
            }</div>
            <div style="font-size: 12px; color: #666;">SKU: ${
              item.sku || item.id || "N/A"
            }</div>
          </div>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: center; vertical-align: middle;">
          <span style="background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${
            item.quantity
          }</span>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right; vertical-align: middle;">
          <span style="font-weight: bold; color: #333;">₹${
            item.price?.toLocaleString() || "N/A"
          }</span>
        </td>
        <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right; vertical-align: middle;">
          <span style="font-weight: bold; color: #007bff; font-size: 16px;">₹${(
            (item.price || 0) * (item.quantity || 1)
          ).toLocaleString()}</span>
        </td>
      </tr>
    `
      )
      .join("");

    // Format shipping address with enhanced styling
    const addressText = `
      <div style="font-weight: bold; color: #333; margin-bottom: 10px; font-size: 16px;">📦 Shipping Address</div>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
        <div style="font-weight: bold; color: #333; margin-bottom: 8px;">${
          shippingAddress.name || "N/A"
        }</div>
        <div style="color: #666; margin-bottom: 5px;">${
          shippingAddress.addressLine1 || ""
        }</div>
        ${
          shippingAddress.addressLine2
            ? `<div style="color: #666; margin-bottom: 5px;">${shippingAddress.addressLine2}</div>`
            : ""
        }
        <div style="color: #666; margin-bottom: 5px;">${
          shippingAddress.city || "N/A"
        }, ${shippingAddress.state || "N/A"} - ${
      shippingAddress.zipCode || "N/A"
    }</div>
        <div style="color: #666; font-weight: bold;">📞 Phone: ${
          shippingAddress.phone || "N/A"
        }</div>
      </div>
    `;

    // Email HTML template with enhanced design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - ${orderId}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .email-container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 20px; text-align: center; }
          .logo { max-width: 200px; height: auto; margin-bottom: 15px; }
          .header-title { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .header-subtitle { color: #cccccc; font-size: 16px; margin: 5px 0 0 0; }
          .order-info { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #e0e0e0; padding: 15px; text-align: left; }
          .items-table th { background-color: #f8f9fa; font-weight: bold; color: #333; }
          .summary { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 12px; margin: 20px; }
          .status-badge { 
            display: inline-block; 
            padding: 6px 16px; 
            border-radius: 25px; 
            font-size: 12px; 
            font-weight: bold; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-confirmed { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .shipping-address { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
          .footer { margin: 30px 20px; padding: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
          .highlight { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px;">SABRI JEWELRY</h1>
            <h1 class="header-title">✨ Order Confirmation</h1>
            <p class="header-subtitle">Thank you for your order! Order ID: <strong>${orderId}</strong></p>
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">📋 Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; font-weight: bold; width: 150px; background-color: #f8f9fa;">Order ID:</td>
                <td style="padding: 12px; font-weight: bold; color: #007bff;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Order Date:</td>
                <td style="padding: 12px;">${new Date(createdAt).toLocaleString(
                  "en-IN",
                  {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Status:</td>
                <td style="padding: 12px;">
                  <span class="status-badge status-${status}">${status}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background-color: #f8f9fa;">Payment Method:</td>
                <td style="padding: 12px;">${
                  paymentMethod === "online_payment"
                    ? "💳 Online Payment"
                    : "💰 Cash on Delivery"
                }</td>
              </tr>
            </table>
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🚚 Shipping Address</h2>
            ${addressText}
          </div>

          <div class="order-info">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🛍️ Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px;">Product Details</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: center;">Quantity</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: right;">Unit Price</th>
                  <th style="background-color: #f8f9fa; font-weight: bold; color: #333; padding: 15px; text-align: right;">Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
          </div>

          <div class="summary">
            <h3 style="margin-top: 0; color: #333;">💰 Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">₹${
                  orderSummary.subtotal?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Shipping Charges:</td>
                <td style="padding: 8px; text-align: right;">₹${
                  orderSummary.shippingCharges?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Coupon Applied:</td>
                <td style="padding: 8px; text-align: right;">${
                  orderSummary.couponCode || "None"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Discount:</td>
                <td style="padding: 8px; text-align: right;">-₹${
                  orderSummary.discount?.toLocaleString() || "0"
                }</td>
              </tr>
              <tr style="border-top: 2px solid #333;">
                <td style="padding: 8px; font-weight: bold; font-size: 16px;">Total Amount:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px;">₹${
                  orderSummary.total?.toLocaleString() || "0"
                }</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for choosing Sabri Jewelry!</p>
            <p>We'll process your order and send you updates via email.</p>
            <p style="margin-top: 15px; font-size: 10px; color: #999;">
              &copy; 2024 Sabri Jewelry. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailConfig = getEmailConfig();

    const mailOptions = {
      from: `"Sabri Jewelry" <${emailConfig.auth.user}>`,
      to: customerEmail,
      subject: `✨ Order Confirmation - ${orderId}`,
      html: htmlContent,
    };

    console.log(
      "Attempting to send confirmation email to customer:",
      customerEmail
    );
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Order confirmation email sent successfully:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return { success: false, error: error.message };
  }
}
