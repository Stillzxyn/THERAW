const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  { name: 'Classic T-Shirt', price: 299, category: 'tshirts', image: 'https://picsum.photos/300/300?random=1', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Red'] },
  { name: 'Cotton T-Shirt', price: 349, category: 'tshirts', image: 'https://picsum.photos/300/300?random=2', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Green', 'Navy'] },
  { name: 'Premium T-Shirt', price: 399, category: 'tshirts', image: 'https://picsum.photos/300/300?random=3', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gray', 'Black', 'White'] },
  { name: 'Casual Button Shirt', price: 499, category: 'shirts', image: 'https://picsum.photos/300/300?random=4', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Blue', 'Pink'] },
  { name: 'Denim Shirt', price: 599, category: 'shirts', image: 'https://picsum.photos/300/300?random=5', sizes: ['S', 'M', 'L', 'XL'], colors: ['Light Blue', 'Dark Blue'] },
  { name: 'Formal Shirt', price: 699, category: 'shirts', image: 'https://picsum.photos/300/300?random=6', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Black', 'Cream'] },
  { name: 'Winter Jacket', price: 1299, category: 'jackets', image: 'https://picsum.photos/300/300?random=7', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Gray'] },
  { name: 'Denim Jacket', price: 899, category: 'jackets', image: 'https://picsum.photos/300/300?random=8', sizes: ['S', 'M', 'L', 'XL'], colors: ['Light Blue', 'Dark Blue', 'Black'] },
  { name: 'Leather Jacket', price: 1599, category: 'jackets', image: 'https://picsum.photos/300/300?random=9', sizes: ['M', 'L', 'XL'], colors: ['Black', 'Brown'] },
  { name: 'Hoodie', price: 549, category: 'hoodies', image: 'https://picsum.photos/300/300?random=10', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Gray', 'Navy'] },
  { name: 'Sports Hoodie', price: 649, category: 'hoodies', image: 'https://picsum.photos/300/300?random=11', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Red', 'Blue'] },
  { name: 'Zip Hoodie', price: 699, category: 'hoodies', image: 'https://picsum.photos/300/300?random=12', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Gray', 'Black', 'Navy'] },
  { name: 'Chino Pants', price: 799, category: 'pants', image: 'https://picsum.photos/300/300?random=13', sizes: ['28', '30', '32', '34', '36'], colors: ['Beige', 'Navy', 'Olive'] },
  { name: 'Jeans', price: 899, category: 'pants', image: 'https://picsum.photos/300/300?random=14', sizes: ['28', '30', '32', '34', '36'], colors: ['Light Blue', 'Dark Blue', 'Black'] },
  { name: 'Formal Pants', price: 999, category: 'pants', image: 'https://picsum.photos/300/300?random=15', sizes: ['28', '30', '32', '34', '36'], colors: ['Black', 'Navy', 'Gray'] },
  { name: 'Joggers', price: 499, category: 'pants', image: 'https://picsum.photos/300/300?random=16', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Gray', 'Navy'] },
  { name: 'Sweatshirt', price: 449, category: 'hoodies', image: 'https://picsum.photos/300/300?random=17', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Gray', 'White'] },
  { name: 'Polo Shirt', price: 449, category: 'shirts', image: 'https://picsum.photos/300/300?random=18', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Blue', 'Black', 'White'] },
  { name: 'V-Neck T-Shirt', price: 379, category: 'tshirts', image: 'https://picsum.photos/300/300?random=19', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Burgundy'] },
  { name: 'Oversized T-Shirt', price: 329, category: 'tshirts', image: 'https://picsum.photos/300/300?random=20', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Black', 'Cream'] },
];

async function seedData() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Seeded 20 products successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
}

seedData();
