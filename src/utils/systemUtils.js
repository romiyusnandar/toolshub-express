const os = require('os');

// Helper function to get memory usage in MB
const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100 // MB
  };
};

// Helper function to get system memory info
const getSystemMemory = () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    total: Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    used: Math.round(usedMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    free: Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100, // GB
    usagePercent: Math.round((usedMem / totalMem) * 100 * 100) / 100
  };
};

// Helper function to get CPU info
const getCPUInfo = () => {
  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  return {
    cores: cpus.length,
    model: cpus[0].model,
    speed: cpus[0].speed,
    loadAverage: {
      '1min': Math.round(loadAvg[0] * 100) / 100,
      '5min': Math.round(loadAvg[1] * 100) / 100,
      '15min': Math.round(loadAvg[2] * 100) / 100
    }
  };
};

// Helper function to format uptime
const formatUptime = (uptimeSeconds) => {
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

module.exports = {
  getMemoryUsage,
  getSystemMemory,
  getCPUInfo,
  formatUptime
};