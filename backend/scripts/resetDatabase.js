const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    const db = mongoose.connection.db;

    // Drop problematic collections
    const collectionsToDrop = ['carts', 'users'];
    for (const collection of collectionsToDrop) {
      try {
        await db.dropCollection(collection);
        console.log(`✓ Dropped ${collection} collection`);
      } catch (err) {
        console.log(`${collection} collection doesn't exist or already dropped`);
      }
    }

    // Recreate models with fresh schema
    const Cart = require('../models/Cart');
    const User = require('../models/User');

    // Create indexes
    await Cart.collection.createIndex({ userId: 1 });
    console.log('✓ Created index on Cart.userId');

    await User.collection.createIndex({ email: 1 });
    console.log('✓ Created index on User.email');

    console.log('\n✅ Database reset complete!');
    console.log('You can now start adding data with the correct schema.');

    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
}

resetDatabase();
