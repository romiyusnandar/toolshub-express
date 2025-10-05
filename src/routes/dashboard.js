const express = require('express');
const { getDashboard, generateApiKey, regenerateApiKey, getUsageStats, resetUsage } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(protect);

// @route   GET /api/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/', getDashboard);

// @route   POST /api/dashboard/generate-key
// @desc    Generate new API key (only if user doesn't have one)
// @access  Private
router.post('/generate-key', generateApiKey);

// @route   PUT /api/dashboard/regenerate-key
// @desc    Regenerate API key (replace existing)
// @access  Private
router.put('/regenerate-key', regenerateApiKey);

// @route   GET /api/dashboard/usage
// @desc    Get detailed usage statistics
// @access  Private
router.get('/usage', getUsageStats);

// @route   POST /api/dashboard/reset-usage
// @desc    Reset API usage count
// @access  Private
router.post('/reset-usage', resetUsage);

module.exports = router;