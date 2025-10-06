const express = require('express');
const cors = require('cors');
const { hitCounterMiddleware } = require('../middleware/metrics');

const setupMiddleware = (app) => {
  // Trust proxy settings for deployment behind reverse proxy (Vercel, Netlify, etc.)
  app.set('trust proxy', true);

  // CORS configuration - allow access from anywhere
  const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-api-key',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: false, // Set to false when using origin: '*'
    preflightContinue: false,
    optionsSuccessStatus: 204 // Some legacy browsers choke on 204
  };

  app.use(cors(corsOptions));

  // Handle preflight requests explicitly
  app.options('*', cors(corsOptions));

  // Additional CORS headers middleware (fallback)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(hitCounterMiddleware);
};

module.exports = { setupMiddleware };