const express = require('express');
const cors = require('cors');
const path = require('path');
const { hitCounterMiddleware } = require('../middleware/metrics');

const setupMiddleware = (app) => {
  // Basic middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, '../../public')));

  // Custom middleware
  app.use(hitCounterMiddleware);
};

module.exports = { setupMiddleware };