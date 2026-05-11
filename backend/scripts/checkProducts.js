const mongoose = require('mongoose');
require('dotenv').config();

async function checkProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Count all products
    const count = await collection.countDocuments();
    console.log(`\n✓ Total products in database: ${count}`);

    // Get first 5 products
    const products = await collection.find({}).limit(5).toArray();

    console.log('\nFirst 5 products:');
    products.forEach((product, idx) => {
      console.log(`\n${idx + 1}. Name: ${product.name}`);
      console.log(`   ID Type: ${typeof product._id}`);
      console.log(`   ID Value: ${product._id}`);
      console.log(`   Gender: ${product.gender || 'N/A'}`);
      console.log(`   Category: ${product.category || 'N/A'}`);
      console.log(`   Price: ${product.price || 'N/A'}`);
    });

    // Test if API route would work
    console.log('\n\n--- Testing API Route ---');
    if (products.length > 0) {
      const testId = products[0]._id;
      const foundProduct = await collection.findOne({ _id: testId });
      if (foundProduct) {
        console.log(`✓ Successfully found product by ID: ${testId}`);
        console.log(`  Product name: ${foundProduct.name}`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
