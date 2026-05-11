const mongoose = require('mongoose');
require('dotenv').config();

async function updatePerfumeVariants() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/the-raw';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Update all perfume products to have ml sizes
    const result = await collection.updateMany(
      { gender: 'PERFUMERY' },
      {
        $set: {
          'variants': [
            { color: 'Default', sizes: ['10ml', '50ml', '100ml'] }
          ]
        }
      }
    );

    console.log(`✓ Updated ${result.modifiedCount} perfume products with ml sizes`);
    console.log('Perfume sizes: 10ml, 50ml, 100ml');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating perfume variants:', error);
    process.exit(1);
  }
}

updatePerfumeVariants();
