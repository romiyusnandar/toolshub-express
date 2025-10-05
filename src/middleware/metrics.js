// Server metrics tracking
const serverStartTime = new Date();
let totalHits = 0;
let healthHits = 0;
let apiHits = 0; // Track API hits separately

// Middleware to count total hits (excluding health checks)
const hitCounterMiddleware = (req, res, next) => {
  // Don't count health endpoint hits in total hits to avoid inflation
  if (req.path !== '/api/health') {
    totalHits++;

    // Count API hits separately (excluding static files and dashboard)
    if (req.path.startsWith('/api/') && req.path !== '/api/health') {
      apiHits++;
    }
  }
  next();
};

// Getters for metrics
const getTotalHits = () => totalHits;
const getHealthHits = () => healthHits;
const getApiHits = () => apiHits;
const incrementHealthHits = () => healthHits++;
const getServerStartTime = () => serverStartTime;

module.exports = {
  hitCounterMiddleware,
  getTotalHits,
  getHealthHits,
  getApiHits,
  incrementHealthHits,
  getServerStartTime
};