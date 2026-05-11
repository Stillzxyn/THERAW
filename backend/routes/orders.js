const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');
const { sendReceiptEmail } = require('../utils/emailService');

const router = express.Router();

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order (checkout)
router.post('/checkout', auth, async (req, res) => {
  try {
    console.log('=== CHECKOUT START ===');
    console.log('User ID:', req.userId);
    console.log('📥 EXACT REQUEST BODY RECEIVED:');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('Total field from request:', req.body.total);
    console.log('Type of total:', typeof req.body.total);
    console.log('Request body:', req.body);

    // Get cart
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('ERROR: Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log('Cart found with', cart.items.length, 'items');

    // Process items and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);

      console.log(`Processing item - productId: ${item.productId}, price: ${price}, qty: ${quantity}`);

      // Validate
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.productId}`);
      }
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for item: ${item.productId}`);
      }

      calculatedTotal += price * quantity;
      orderItems.push({
        productId: item.productId,
        quantity: quantity,
        price: price
      });
    }

    console.log('Calculated total from cart:', calculatedTotal);

    // Use total from request if valid, otherwise use calculated
    // Important: Check for undefined, not falsy, because 0 is a valid total (free orders)
    const finalTotal = (req.body.total !== undefined && !isNaN(req.body.total))
      ? parseFloat(req.body.total)
      : calculatedTotal;

    console.log('Final total to save:', finalTotal);

    if (isNaN(finalTotal) || finalTotal < 0) {
      throw new Error(`Invalid final total: ${finalTotal}`);
    }

    // Debug logging
    console.log('🔍 Backend Checkout Debug:');
    console.log('Calculated total:', calculatedTotal);
    console.log('Final total:', finalTotal);
    console.log('Promo code:', req.body.promoCode || 'none');
    console.log('Is free order?', finalTotal === 0 && req.body.promoCode);

    // Handle promo code usage if provided
    if (req.body.promoCode) {
      console.log('Processing promo code:', req.body.promoCode);
      const promoCode = await PromoCode.findOne({
        code: req.body.promoCode.toUpperCase(),
        isActive: true
      });

      if (promoCode) {
        // Update usage count and add user to usedBy
        promoCode.usedCount += 1;
        promoCode.usedBy.push({
          userId: req.userId,
          usedAt: new Date()
        });
        await promoCode.save();
        console.log('✓ Promo code usage recorded');
      }
    }

    // Create order
    // Auto-complete if total is 0 (free orders with full discount)
    const orderStatus = finalTotal === 0 && req.body.promoCode ? 'completed' : 'pending';

    const orderData = {
      userId: req.userId,
      items: orderItems,
      total: finalTotal,
      promoCode: req.body.promoCode || null,
      status: orderStatus
    };

    if (orderStatus === 'completed') {
      console.log('✓ Order total is $0 - Auto-completed');
    }

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('Order saved successfully:', savedOrder._id);

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });
    console.log('Cart cleared');

    // Send receipt email
    const userDetails = {
      email: req.body.email,
      fullName: req.body.fullName,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode,
      phone: req.body.phone
    };

    await sendReceiptEmail(savedOrder, userDetails);

    res.json({
      message: 'Order placed successfully!',
      order: savedOrder
    });

  } catch (error) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin endpoint)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, completed, or cancelled' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`✓ Order ${req.params.id} status updated to: ${status}`);
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
