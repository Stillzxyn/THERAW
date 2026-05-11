const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sku: String,
  name: {
    type: String,
    required: true,
  },
  slug: String,
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  gender: String,
  category: String,
  collection: String,

  details: {
    description: String,
    origin: String,
    care: String,
    materials: [{
      type: { type: String },
      value: { type: Number },
    }],
  },

  media: {
    featured: String,
    gallery: [String],
  },

  variants: [{
    color: String,
    sizes: [String],
    stock: Number,
  }],

  metadata: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
}, { _id: true });

module.exports = mongoose.model('Product', productSchema);
