const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: String,
  color: String,
  price: Number,
}, { _id: false, strict: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [itemSchema],
    default: [],
  },
  total: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: false });

module.exports = mongoose.model('Cart', cartSchema);
