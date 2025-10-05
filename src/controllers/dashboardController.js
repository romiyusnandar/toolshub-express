const User = require('../models/User');

// @desc    Get user dashboard
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          memberSince: user.createdAt
        },
        apiKey: {
          key: user.apiKey,
          hasKey: !!user.apiKey
        },
        usage: {
          hitCount: user.hitCount,
          hitLimit: user.hitLimit,
          hitsRemaining: user.hitLimit - user.hitCount,
          usagePercentage: Math.round((user.hitCount / user.hitLimit) * 100),
          lastReset: user.lastHitReset
        },
        account: {
          status: user.isVerified ? 'Active' : 'Pending Verification',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard'
    });
  }
};

// @desc    Generate new API key
// @route   POST /api/dashboard/generate-key
// @access  Private
const generateApiKey = async (req, res) => {
  try {
    const user = req.user;

    // Check if user already has an API key
    if (user.apiKey) {
      return res.status(400).json({
        success: false,
        message: 'You already have an API key. Only one key per account is allowed.'
      });
    }

    // Generate new API key
    const newApiKey = user.generateApiKey();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'API key generated successfully',
      data: {
        apiKey: newApiKey,
        hitLimit: user.hitLimit,
        hitCount: user.hitCount,
        hitsRemaining: user.hitLimit - user.hitCount
      }
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating API key'
    });
  }
};

// @desc    Regenerate API key (replace existing)
// @route   PUT /api/dashboard/regenerate-key
// @access  Private
const regenerateApiKey = async (req, res) => {
  try {
    const user = req.user;

    // Generate new API key (will replace existing one)
    const newApiKey = user.generateApiKey();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'API key regenerated successfully. Your old key is now invalid.',
      data: {
        apiKey: newApiKey,
        hitLimit: user.hitLimit,
        hitCount: user.hitCount,
        hitsRemaining: user.hitLimit - user.hitCount
      }
    });
  } catch (error) {
    console.error('Regenerate API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while regenerating API key'
    });
  }
};

// @desc    Get API usage statistics
// @route   GET /api/dashboard/usage
// @access  Private
const getUsageStats = async (req, res) => {
  try {
    const user = req.user;

    // Calculate usage statistics
    const usagePercentage = Math.round((user.hitCount / user.hitLimit) * 100);
    const hitsRemaining = user.hitLimit - user.hitCount;
    const isNearLimit = usagePercentage >= 80;
    const isAtLimit = hitsRemaining <= 0;

    res.status(200).json({
      success: true,
      message: 'Usage statistics retrieved successfully',
      data: {
        current: {
          hitCount: user.hitCount,
          hitLimit: user.hitLimit,
          hitsRemaining: hitsRemaining,
          usagePercentage: usagePercentage
        },
        status: {
          isNearLimit: isNearLimit,
          isAtLimit: isAtLimit,
          canMakeApiCall: user.canMakeApiCall()
        },
        timestamps: {
          lastReset: user.lastHitReset,
          nextReset: null // You can implement monthly reset logic here
        },
        warnings: {
          nearLimit: isNearLimit ? 'You are approaching your API limit' : null,
          atLimit: isAtLimit ? 'You have reached your API limit' : null
        }
      }
    });
  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching usage statistics'
    });
  }
};

// @desc    Reset hit count (admin function or can be monthly reset)
// @route   POST /api/dashboard/reset-usage
// @access  Private
const resetUsage = async (req, res) => {
  try {
    const user = req.user;

    // Reset hit count
    await user.resetHitCount();

    res.status(200).json({
      success: true,
      message: 'API usage reset successfully',
      data: {
        hitCount: user.hitCount,
        hitLimit: user.hitLimit,
        hitsRemaining: user.hitLimit,
        lastReset: user.lastHitReset
      }
    });
  } catch (error) {
    console.error('Reset usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting usage'
    });
  }
};

module.exports = {
  getDashboard,
  generateApiKey,
  regenerateApiKey,
  getUsageStats,
  resetUsage
};