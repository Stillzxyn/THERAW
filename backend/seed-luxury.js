const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Product');

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Read the product data
    const dataPath = path.join(__dirname, '../frontend/public/luxury_products_dataset.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(rawData);

    console.log(`Found ${products.length} products to import`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Test with first product
    console.log('\nTesting with first product...');
    console.log('First product:', JSON.stringify(products[0], null, 2));

    try {
      const testInsert = await Product.create(products[0]);
      console.log('✓ First product inserted successfully');
      console.log('Inserted product:', testInsert);

      // Now try bulk insert
      console.log('\nInserting remaining products...');
      const remaining = products.slice(1);
      const result = await Product.insertMany(remaining, { ordered: false });
      console.log(`✓ Successfully inserted ${result.length} more products`);
      console.log(`✓ Total: ${1 + result.length} products`);
    } catch (insertError) {
      console.error('Insert error:', insertError.message);
      if (insertError.writeErrors) {
        console.log(`${insertError.insertedDocs?.length || 0} products inserted before error`);
      }
    }

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedProducts();
