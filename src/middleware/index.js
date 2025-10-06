const express = require('express');
const cors = require('cors');
const { hitCounterMiddleware } = require('../middleware/metrics');

const setupMiddleware = (app) => {
  // Trust proxy settings for deployment behind reverse proxy (Vercel, Netlify, etc.)
  app.set('trust proxy', true);

  // Simple and reliable CORS setup
  app.use((req, res, next) => {
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 CORS: ${req.method} ${req.path} from ${req.get('Origin') || 'no origin'}`);
    }

    // Set CORS headers for all requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    res.header('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      console.log('🔄 Handling OPTIONS preflight request');
      return res.status(200).end();
    }

    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(hitCounterMiddleware);
};

module.exports = { setupMiddleware };