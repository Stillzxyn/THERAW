const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('../models/Order');

async function listAllOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB\n');

    const orders = await Order.find().sort({ createdAt: -1 });

    if (orders.length === 0) {
      console.log('No orders found');
      await mongoose.connection.close();
      return;
    }

    console.log(`Found ${orders.length} order(s):\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}`);
      console.log(`   Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: $${order.total.toFixed(2)}`);
      console.log(`   Items: ${order.items.length}\n`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listAllOrders();
