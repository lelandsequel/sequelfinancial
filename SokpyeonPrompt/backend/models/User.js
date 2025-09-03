const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'payperuse', 'starter', 'pro', 'unlimited'],
    default: 'free'
  },
  maxUsage: {
    type: Number,
    default: 0
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);