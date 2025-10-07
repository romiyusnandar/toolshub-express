const express = require('express');
const {
  getChatHistory,
  testApiKey
} = require('../controllers/toolsController');
const { roastGitHubProfile } = require('../controllers/githubRoastController');
const { apiKeyAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Import specific tool routes
const geminiRoutes = require('./gemini');

const router = express.Router();

// Apply API key authentication to all tools routes
router.use(apiKeyAuth);
router.use(apiLimiter);

// General tools endpoints
// @route   GET /api/tools/test
// @desc    Test API key authentication
// @access  API Key Required
router.get('/test', testApiKey);

// @route   GET /api/tools/chat/history/:conversationId
// @desc    Get chat conversation history
// @access  API Key Required
router.get('/chat/history/:conversationId', getChatHistory);

// @route   POST /api/tools/github-roast
// @desc    Roast GitHub profile using AI
// @access  API Key Required
router.post('/github-roast', roastGitHubProfile);

// Use specific tool routes
router.use('/', geminiRoutes);

module.exports = router;