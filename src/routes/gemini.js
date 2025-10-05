const express = require('express');
const {
  chatGemini,
  getGeminiModels,
  testGemini
} = require('../controllers/geminiController');
const { apiKeyAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply API key authentication to all gemini routes
router.use(apiKeyAuth);
router.use(apiLimiter);

// @route   POST /api/tools/chat-gemini
// @desc    Chat with Gemini AI (supports text and file uploads)
// @access  API Key Required
router.post('/chat-gemini', ...chatGemini);

// @route   GET /api/tools/gemini/models
// @desc    Get available Gemini models
// @access  API Key Required
router.get('/gemini/models', getGeminiModels);

// @route   GET /api/tools/gemini/test
// @desc    Test Gemini API connection
// @access  API Key Required
router.get('/gemini/test', testGemini);

module.exports = router;