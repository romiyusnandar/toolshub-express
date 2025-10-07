const rateLimit = require('express-rate-limit');

// Rate limiting for authentication endpoints (5 requests per hour per IP)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy configuration that matches main app setting
  trustProxy: process.env.NODE_ENV === 'production' ? 1 : false,
  skip: (req) => {
    // Skip rate limiting in development mode
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  }
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy configuration that matches main app setting
  trustProxy: process.env.NODE_ENV === 'production' ? 1 : false,
});

// Rate limiting for OTP requests (stricter)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 OTP requests per hour
  message: {
    success: false,
    message: 'Too many OTP requests, please try again in an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy configuration that matches main app setting
  trustProxy: process.env.NODE_ENV === 'production' ? 1 : false
});

module.exports = {
  authLimiter,
  apiLimiter,
  otpLimiter
};