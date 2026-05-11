const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
// Increase payload size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.path.includes('/orders') || req.path.includes('/checkout')) {
    console.log(`\n📍 INCOMING REQUEST: ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  // Drop Cart collection to fix schema issues
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const cartExists = collections.some(c => c.name === 'carts');

    if (cartExists) {
      console.log('Dropping old Cart collection for schema migration...');
      await db.dropCollection('carts');
      console.log('✓ Cart collection dropped, fresh schema will be created');
    }
  } catch (err) {
    console.log('Cart collection migration info:', err.message);
  }
})
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/promo', require('./routes/promo'));
app.use('/api/addresses', require('./routes/addresses'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
