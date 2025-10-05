// Server metrics tracking
const serverStartTime = new Date();
let totalHits = 0;
let healthHits = 0;

// Middleware to count total hits
const hitCounterMiddleware = (req, res, next) => {
  totalHits++;
  next();
};

// Getters for metrics
const getTotalHits = () => totalHits;
const getHealthHits = () => healthHits;
const incrementHealthHits = () => healthHits++;
const getServerStartTime = () => serverStartTime;

module.exports = {
  hitCounterMiddleware,
  getTotalHits,
  getHealthHits,
  incrementHealthHits,
  getServerStartTime
};