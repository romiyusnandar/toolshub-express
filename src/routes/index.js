const express = require('express');
const { getHealth, getWelcome } = require('../controllers/healthController');

const router = express.Router();

// Health endpoint
router.get('/health', getHealth);

// Welcome endpoint
router.get('/', getWelcome);

module.exports = router;