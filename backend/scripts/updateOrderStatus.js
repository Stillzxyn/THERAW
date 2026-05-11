const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../models/Order');

async function updateOrderStatus(orderId, newStatus) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!order) {
      throw new Error('Order not found');
    }

    console.log('✓ Order updated successfully!');
    console.log(`Order ID: ${order._id}`);
    console.log(`Status: ${order.status}`);
    console.log(`Total: $${order.total.toFixed(2)}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get order ID and status from command line arguments
const orderId = process.argv[2];
const newStatus = process.argv[3];

if (!orderId || !newStatus) {
  console.error('Usage: node updateOrderStatus.js <orderId> <status>');
  console.error('Example: node updateOrderStatus.js 6a00411425d49be2930b23ee completed');
  process.exit(1);
}

updateOrderStatus(orderId, newStatus);
