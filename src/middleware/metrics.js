const ApiMetrics = require('../models/ApiMetrics');

// Server metrics tracking (in-memory for current instance)
const serverStartTime = new Date();
let totalHits = 0;
let healthHits = 0;
let apiHits = 0; // Track API hits separately

// Database metrics cache (only tools)
let dbMetricsCache = {
  totalHits: 0,
  toolsHits: 0,
  lastUpdated: new Date()
};

// Load database metrics on startup
const loadDbMetrics = async () => {
  try {
    const totalMetrics = await ApiMetrics.getTotalMetrics();
    dbMetricsCache = {
      ...totalMetrics,
      lastUpdated: new Date()
    };
    console.log('📊 Loaded database metrics:', dbMetricsCache);
  } catch (error) {
    console.error('❌ Error loading database metrics:', error.message);
  }
};

// Save hit to database
const saveHitToDatabase = async (req) => {
  try {
    const path = req.path;

    // Only track hits to /api/tools endpoints
    if (!path.startsWith('/api/tools')) {
      return; // Skip tracking for non-tools endpoints
    }

    const todayMetrics = await ApiMetrics.getTodayMetrics();

    // Increment total hits (only for /api/tools)
    todayMetrics.totalHits += 1;
    todayMetrics.toolsHits += 1;

    // Track specific endpoint (clean the path for safe Map key)
    const cleanPath = path.replace(/\./g, '_'); // Replace dots with underscores
    await todayMetrics.incrementEndpoint(cleanPath);

    // Update cache
    const totalMetrics = await ApiMetrics.getTotalMetrics();
    dbMetricsCache = {
      ...totalMetrics,
      lastUpdated: new Date()
    };

  } catch (error) {
    console.error('❌ Error saving hit to database:', error.message);
  }
};// Middleware to count total hits (only /api/tools endpoints)
const hitCounterMiddleware = async (req, res, next) => {
  const path = req.path;

  // Only track hits to /api/tools endpoints
  if (path.startsWith('/api/tools')) {
    // Count in-memory for current instance
    totalHits++;
    apiHits++;

    // Save to database (non-blocking)
    saveHitToDatabase(req).catch(err => {
      console.error('Background save error:', err.message);
    });
  }

  next();
};

// Getters for metrics (combined in-memory + database, tools only)
const getTotalHits = () => dbMetricsCache.totalHits + totalHits;
const getToolsHits = () => dbMetricsCache.toolsHits + totalHits; // Since we only track tools now
const getServerStartTime = () => serverStartTime;

// Get database metrics
const getDbMetrics = () => dbMetricsCache;

// Get detailed metrics (tools only)
const getDetailedMetrics = async () => {
  try {
    const totalMetrics = await ApiMetrics.getTotalMetrics();
    const todayMetrics = await ApiMetrics.getTodayMetrics();

    return {
      allTime: {
        totalHits: totalMetrics.totalHits || 0,
        toolsHits: totalMetrics.toolsHits || 0
      },
      today: {
        totalHits: todayMetrics.totalHits,
        toolsHits: todayMetrics.toolsHits
      },
      currentInstance: {
        totalHits,
        startTime: serverStartTime
      }
    };
  } catch (error) {
    console.error('Error getting detailed metrics:', error.message);
    return null;
  }
};

module.exports = {
  hitCounterMiddleware,
  getTotalHits,
  getToolsHits,
  getServerStartTime,
  getDbMetrics,
  getDetailedMetrics,
  loadDbMetrics
};