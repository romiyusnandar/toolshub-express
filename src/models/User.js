const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    select: false
  },
  otpExpire: {
    type: Date,
    select: false
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  hitLimit: {
    type: Number,
    default: 1000
  },
  hitCount: {
    type: Number,
    default: 0
  },
  lastHitReset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate API key
userSchema.methods.generateApiKey = function() {
  const randomString = Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
  this.apiKey = `key_romztools${randomString}`;
  return this.apiKey;
};

// Check if user can make API call (hit limit)
userSchema.methods.canMakeApiCall = function() {
  return this.hitCount < this.hitLimit;
};

// Increment hit count
userSchema.methods.incrementHitCount = function() {
  this.hitCount += 1;
  return this.save();
};

// Reset hit count (for monthly/daily reset if needed)
userSchema.methods.resetHitCount = function() {
  this.hitCount = 0;
  this.lastHitReset = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);