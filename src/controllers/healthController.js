const os = require('os');
const { getMemoryUsage, getSystemMemory, getCPUInfo, formatUptime } = require('../utils/systemUtils');
const { getTotalHits, getHealthHits, getApiHits, incrementHealthHits, getServerStartTime } = require('../middleware/metrics');
const { PORT, NODE_ENV } = require('../config/config');

const getHealth = (req, res) => {
  incrementHealthHits();

  const now = new Date();
  const serverStartTime = getServerStartTime();
  const uptimeSeconds = (now - serverStartTime) / 1000;

  const healthData = {
    status: 'healthy',
    timestamp: now.toISOString(),
    server: {
      startTime: serverStartTime.toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: formatUptime(uptimeSeconds)
      },
    //   port: PORT,
      environment: NODE_ENV
    },
    system: {
      platform: os.platform(),
      architecture: os.arch(),
      hostname: os.hostname(),
      nodeVersion: process.version
    },
    memory: {
      process: getMemoryUsage(),
      system: getSystemMemory()
    },
    cpu: getCPUInfo(),
    traffic: {
      totalHits: getTotalHits(), // Now excludes health endpoint hits
      apiHits: getApiHits(), // API hits excluding health checks
      healthEndpointHits: getHealthHits(),
      requestsPerSecond: uptimeSeconds > 0 ? Math.round((getTotalHits() / uptimeSeconds) * 100) / 100 : 0
    }
  };

  res.json(healthData);
};

const getWelcome = (req, res) => {
  res.json({
    message: "Welcome to Toolshub API",
    version: "1.0.0",
    author: {
        name: "Romi Yusnandar",
        github: "https://github.com/romiyusnandar"
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealth,
  getWelcome
};