const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');

// Protect routes - JWT authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified. Please verify your email.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// API Key authentication & hit limit check
const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required'
      });
    }

    // Find user by API key
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified'
      });
    }

    // Check hit limit
    if (!user.canMakeApiCall()) {
      return res.status(429).json({
        success: false,
        message: 'API hit limit exceeded',
        hitLimit: user.hitLimit,
        hitCount: user.hitCount,
        hitsRemaining: 0
      });
    }

    // Increment hit count
    await user.incrementHitCount();

    req.user = user;
    req.apiUsage = {
      hitCount: user.hitCount + 1,
      hitLimit: user.hitLimit,
      hitsRemaining: user.hitLimit - (user.hitCount + 1)
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during API key validation'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = {
  protect,
  apiKeyAuth,
  generateToken
};