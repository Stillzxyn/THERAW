const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test 1: Get all products
    console.log('1. Testing GET /api/products (all products)');
    const allProducts = await axios.get(`${baseURL}/api/products`);
    console.log(`✓ Got ${allProducts.data.length} products`);

    if (allProducts.data.length > 0) {
      const testProduct = allProducts.data[0];
      const testId = testProduct._id;

      console.log(`\n2. Testing GET /api/products/${testId} (single product)`);
      console.log(`Product ID: ${testId}`);
      console.log(`Product Name: ${testProduct.name}`);

      try {
        const singleProduct = await axios.get(`${baseURL}/api/products/${testId}`);
        console.log(`✓ Successfully fetched single product`);
        console.log(`Response:`, JSON.stringify(singleProduct.data, null, 2).substring(0, 500) + '...');
      } catch (err) {
        console.log(`✗ Error fetching single product:`);
        console.log(`Status: ${err.response?.status}`);
        console.log(`Error: ${err.response?.data?.message || err.message}`);
      }
    }

    console.log('\n✓ API is running correctly');
  } catch (error) {
    console.error(`✗ Error:`, error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to server at http://localhost:5000');
      console.error('Make sure your backend server is running!');
      console.error('Run: npm start');
    }
  }
}

testAPI();
