const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/wishlist - fetching wishlist for user:', req.userId);
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Enrich wishlist items with product details
    const enrichedWishlist = await Promise.all(
      (user.wishlist || []).map(async (item) => {
        try {
          console.log('Fetching product details for productId:', item.productId);
          const product = await Product.findById(item.productId);

          if (product) {
            console.log('Product found:', product.name, 'Image:', product.media?.featured);
          } else {
            console.log('Product not found for ID:', item.productId);
          }

          return {
            productId: item.productId,
            productName: item.productName || product?.name,
            price: item.price || product?.price,
            addedAt: item.addedAt,
            productDetails: product ? {
              name: product.name,
              image: product.media?.featured || `/products/${product._id}.jpg`,
              price: product.price,
              media: product.media,
              fullProduct: product
            } : null
          };
        } catch (err) {
          console.error('Error fetching product details for', item.productId, err.message);
          return item;
        }
      })
    );

    console.log('✓ Wishlist fetched with', enrichedWishlist.length, 'items');
    console.log('Enriched wishlist:', JSON.stringify(enrichedWishlist, null, 2));
    res.json(enrichedWishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, productName, price } = req.body;
    console.log('POST /api/wishlist/add - adding product:', productId);

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if item already in wishlist
    const existingItem = user.wishlist.find(item => item.productId === productId);
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push({
      productId,
      productName,
      price,
      addedAt: new Date()
    });

    await user.save();
    console.log('✓ Item added to wishlist');
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove item from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('DELETE /api/wishlist/:productId - removing product:', productId);

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(item => item.productId !== productId);
    await user.save();

    console.log('✓ Item removed from wishlist');
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
