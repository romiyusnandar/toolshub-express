const os = require('os');
const { getMemoryUsage, getSystemMemory, getCPUInfo, formatUptime } = require('../utils/systemUtils');
const { getTotalHits, getToolsHits, getServerStartTime, getDetailedMetrics } = require('../middleware/metrics');
const { PORT, NODE_ENV } = require('../config/config');

const getHealth = async (req, res) => {
  const now = new Date();
  const serverStartTime = getServerStartTime();
  const uptimeSeconds = (now - serverStartTime) / 1000;

  // Get detailed metrics from database (tools only)
  const detailedMetrics = await getDetailedMetrics();

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
    traffic: detailedMetrics ? {
      persistent: {
        allTime: {
          totalHits: detailedMetrics.allTime.totalHits,
          toolsHits: detailedMetrics.allTime.toolsHits
        },
        today: {
          totalHits: detailedMetrics.today.totalHits,
          toolsHits: detailedMetrics.today.toolsHits
        }
      },
      currentInstance: {
        totalHits: detailedMetrics.currentInstance.totalHits,
        requestsPerSecond: uptimeSeconds > 0 ? Math.round((detailedMetrics.currentInstance.totalHits / uptimeSeconds) * 100) / 100 : 0
      },
      note: 'Only tracking /api/tools endpoints. Persistent metrics stored in database survive deployments'
    } : {
      totalHits: getTotalHits(),
      toolsHits: getToolsHits(),
      requestsPerSecond: uptimeSeconds > 0 ? Math.round((getTotalHits() / uptimeSeconds) * 100) / 100 : 0,
      note: 'Only tracking /api/tools endpoints. Database metrics not available'
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