const express = require('express');
const { testApiKey, generateImage, downloadVideo } = require('../controllers/toolsController');
const { apiKeyAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply API key authentication to all tools routes
router.use(apiKeyAuth);
router.use(apiLimiter);

// @route   GET /api/tools/test
// @desc    Test API key authentication
// @access  API Key Required
router.get('/test', testApiKey);

// @route   POST /api/tools/generate-image
// @desc    Generate image (placeholder)
// @access  API Key Required
router.post('/generate-image', generateImage);

// @route   POST /api/tools/download-video
// @desc    Download video (placeholder)
// @access  API Key Required
router.post('/download-video', downloadVideo);

module.exports = router;