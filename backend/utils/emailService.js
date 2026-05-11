const nodemailer = require('nodemailer');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️  Email service not configured. Receipts will not be sent.');
    console.log('Setup: Add EMAIL_USER and EMAIL_PASSWORD to .env file');
  } else {
    console.log('✓ Email service configured and ready');
  }
});

const generateReceiptHTML = (order, user) => {
  const itemsHTML = order.items
    .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.productDetails?.name || 'Product'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `)
    .join('');

  const discountHTML = order.promoCode ? `
    <tr>
      <td colspan="2" style="padding: 12px; text-align: right; font-weight: 500;">
        Discount (${order.promoCode}):
      </td>
      <td style="padding: 12px; text-align: right; color: #4caf50; font-weight: 500;">
        -$${(order.subtotal - order.total).toFixed(2)}
      </td>
    </tr>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
          }
          .header {
            background: #000;
            color: #fff;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 1px;
          }
          .content {
            background: #fff;
            padding: 30px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .section p {
            margin: 8px 0;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            text-align: left;
            padding: 12px;
            background: #f5f5f5;
            font-weight: 500;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .total-section {
            background: #f5f5f5;
            padding: 20px;
            text-align: right;
            font-size: 16px;
            font-weight: 500;
          }
          .total-amount {
            font-size: 24px;
            font-weight: 300;
            color: #000;
          }
          .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .status {
            background: #f0f0f0;
            padding: 15px;
            border-left: 4px solid #4caf50;
            margin-bottom: 20px;
          }
          .status p {
            margin: 0;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ORDER CONFIRMATION</h1>
          </div>

          <div class="content">
            <div class="status">
              <p><strong>Thank you for your order!</strong></p>
              <p>Order #${order._id}</p>
            </div>

            <div class="section">
              <h2>Order Details</h2>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Order Status:</strong> ${order.status.toUpperCase()}</p>
            </div>

            <div class="section">
              <h2>Shipping Address</h2>
              <p>${user.fullName}</p>
              <p>${user.address}</p>
              <p>${user.city}, ${user.province} ${user.postalCode}</p>
              <p>${user.email}</p>
              <p>${user.phone}</p>
            </div>

            <div class="section">
              <h2>Order Summary</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td colspan="2" style="padding: 12px; text-align: right;">Subtotal:</td>
                    <td style="padding: 12px; text-align: right;">$${order.subtotal.toFixed(2)}</td>
                  </tr>
                  ${discountHTML}
                  <tr>
                    <td colspan="2" style="padding: 12px; text-align: right;">Shipping:</td>
                    <td style="padding: 12px; text-align: right;">Calculated at checkout</td>
                  </tr>
                  <tr style="background: #f5f5f5; font-weight: bold; font-size: 14px;">
                    <td colspan="2" style="padding: 15px; text-align: right;">TOTAL:</td>
                    <td style="padding: 15px; text-align: right;">$${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>What's Next?</h2>
              <p>Your order is being prepared. You'll receive a shipping confirmation email once your items are dispatched.</p>
              <p>Questions? Contact us at <strong>support@clothingshop.com</strong></p>
            </div>
          </div>

          <div class="footer">
            <p>&copy; 2024 Clothing Shop. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this address.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendReceiptEmail = async (order, userDetails) => {
  try {
    // Don't send if email service is not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️  Email service not configured. Receipt email skipped.');
      return false;
    }

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderWithSubtotal = {
      ...order.toObject?.() || order,
      subtotal: subtotal
    };

    const htmlContent = generateReceiptHTML(orderWithSubtotal, userDetails);

    const mailOptions = {
      from: `"Clothing Shop" <${process.env.EMAIL_USER}>`,
      to: userDetails.email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Receipt email sent to ${userDetails.email}`);
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return false;
  }
};

module.exports = { sendReceiptEmail };
