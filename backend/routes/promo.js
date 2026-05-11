const express = require('express');
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');

const router = express.Router();

// Validate and get promo code details
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    console.log(`\n🎟️  Validating promo code: ${code}`);
    console.log(`Order total: $${orderTotal}`);

    if (!code || !orderTotal) {
      return res.status(400).json({ message: 'Code and order total are required' });
    }

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!promoCode) {
      console.log('❌ Promo code not found or inactive');
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    // Check expiration
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      console.log('❌ Promo code expired');
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      console.log('❌ Promo code usage limit reached');
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    // Check if user already used this code (one-time per user) - EXCEPT for test codes
    if (code.toUpperCase() !== 'FREEORDERTESTERCODE') {
      const userUsage = promoCode.usedBy.find(u => u.userId.toString() === req.userId);
      if (userUsage) {
        console.log('❌ User already used this code');
        return res.status(400).json({ message: 'You have already used this promo code' });
      }
    } else {
      console.log('✓ Test code - one-time restriction bypassed');
    }

    // Check minimum order amount
    if (orderTotal < promoCode.minOrderAmount) {
      console.log(`❌ Order total $${orderTotal} below minimum $${promoCode.minOrderAmount}`);
      return res.status(400).json({
        message: `Minimum order amount of $${promoCode.minOrderAmount} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (orderTotal * promoCode.discountValue) / 100;
    } else {
      discount = promoCode.discountValue;
    }

    const finalTotal = Math.max(0, orderTotal - discount);

    console.log(`✓ Promo code valid!`);
    console.log(`Discount type: ${promoCode.discountType}`);
    console.log(`Discount value: ${promoCode.discountValue}${promoCode.discountType === 'percentage' ? '%' : ''}`);
    console.log(`Discount amount: $${discount.toFixed(2)}`);
    console.log(`Final total: $${finalTotal.toFixed(2)}`);

    res.json({
      valid: true,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount: discount,
      originalTotal: orderTotal,
      finalTotal: finalTotal
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create promo code
router.post('/create', async (req, res) => {
  try {
    const { code, discountType, discountValue, description, maxUses, minOrderAmount, expiresAt } = req.body;

    const promoCode = new PromoCode({
      code,
      discountType,
      discountValue,
      description,
      maxUses,
      minOrderAmount,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true
    });

    await promoCode.save();
    console.log(`✓ Promo code created: ${code}`);
    res.json({ message: 'Promo code created', promoCode });
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all active promo codes (admin only)
router.get('/list', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ isActive: true });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
