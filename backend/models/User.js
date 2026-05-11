const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Contact Information
  phone: {
    number: String,
    verified: {
      type: Boolean,
      default: false,
    }
  },

  // Profile Information
  dateOfBirth: Date,
  gender: String,
  profileImage: String,

  // Addresses
  addresses: [{
    type: {
      type: String,
      enum: ['shipping', 'billing', 'home', 'work', 'other'],
      default: 'shipping'
    },
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],

  // Payment Methods
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay']
    },
    cardNumber: String,
    cardholderName: String,
    expiryMonth: Number,
    expiryYear: Number,
    cvv: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],

  // Wishlist
  wishlist: [{
    productId: String,
    productName: String,
    price: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Order History Reference
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

  // Account Settings
  preferences: {
    newsletter: {
      type: Boolean,
      default: true,
    },
    promotionalEmails: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    smsUpdates: {
      type: Boolean,
      default: false,
    }
  },

  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,

  // Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockoutUntil: Date,

  // Loyalty/Rewards
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
