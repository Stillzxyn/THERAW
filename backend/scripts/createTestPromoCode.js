const mongoose = require('mongoose');
require('dotenv').config();

const PromoCode = require('../models/PromoCode');

async function createTestPromoCode() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: 'FREEORDERTESTERCODE' });
    if (existingCode) {
      console.log('✓ FreeOrderTesterCode already exists');
      await mongoose.connection.close();
      return;
    }

    // Create the test promo code
    const testCode = new PromoCode({
      code: 'FREEORDERTESTERCODE',
      discountType: 'percentage',
      discountValue: 100, // 100% discount
      description: 'Free order tester code - 100% discount for testing',
      maxUses: 100, // Allow up to 100 uses
      minOrderAmount: 0, // No minimum order
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Valid for 1 year
    });

    await testCode.save();
    console.log('✓ Test promo code created successfully!');
    console.log('Code: FREEORDERTESTERCODE');
    console.log('Discount: 100% (Free Order)');
    console.log('Max Uses: 100');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating promo code:', error);
    process.exit(1);
  }
}

createTestPromoCode();
