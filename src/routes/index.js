const express = require('express');
const { getHealth, getWelcome } = require('../controllers/healthController');
const { getMetrics, getMetricsRange } = require('../controllers/metricsController');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const toolsRoutes = require('./tools');

const router = express.Router();

// Health endpoint
router.get('/health', getHealth);

// Welcome endpoint
router.get('/', getWelcome);

// Authentication routes
router.use('/auth', authRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Metrics endpoints
router.get('/metrics', getMetrics);
router.get('/metrics/range', getMetricsRange);

// Tools routes (API key protected)
router.use('/tools', toolsRoutes);

module.exports = router;