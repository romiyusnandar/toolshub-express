const express = require('express');
const cors = require('cors');
const { hitCounterMiddleware } = require('../middleware/metrics');

const setupMiddleware = (app) => {
  // Basic middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(hitCounterMiddleware);
};

module.exports = { setupMiddleware };