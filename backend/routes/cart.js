const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/cart - fetching cart for user:', req.userId);
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      console.log('Cart not found, creating new one');
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }
    console.log('Cart found with', cart.items.length, 'items');

    // Enrich cart items with product details
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          return {
            ...item.toObject ? item.toObject() : item,
            productDetails: product ? {
              name: product.name,
              image: product.media?.featured || `/products/${product._id}.jpg`,
              price: product.price,
              media: product.media
            } : null
          };
        } catch (err) {
          console.error('Error fetching product details for', item.productId, err);
          return item;
        }
      })
    );

    res.json(enrichedItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    console.log('POST /api/cart/add - Adding product:', productId);
    console.log('Quantity:', quantity, 'Size:', size, 'Color:', color);

    // Validate productId is not empty
    if (!productId) {
      console.error('Product ID is required');
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists (Product model uses String _id)
    const product = await Product.findById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product found:', product.name, 'Price:', product.price);

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      console.log('Creating new cart for user:', req.userId);
      cart = new Cart({ userId: req.userId, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      console.log('Item already in cart, updating quantity');
      cart.items[itemIndex].quantity += quantity;
    } else {
      console.log('Adding new item to cart');
      // Store as string since Product._id is a string
      cart.items.push({
        productId,
        quantity,
        size,
        color,
        price: product.price
      });
    }

    await cart.save();
    console.log('✓ Item added to cart successfully');
    res.json(cart.items || []);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('POST /api/cart/remove - removing product:', productId);

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);

    await cart.save();
    console.log('✓ Item removed from cart');
    res.json(cart.items);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update quantity
router.post('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log('POST /api/cart/update - updating product:', productId, 'quantity:', quantity);

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId === productId);

    if (item) {
      item.quantity = quantity;
      await cart.save();
      console.log('✓ Item quantity updated');
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json(cart.items);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.post('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
