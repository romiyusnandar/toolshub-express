require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const { PORT } = require('./config/config');
const { setupMiddleware } = require('./middleware');
const { loadDbMetrics } = require('./middleware/metrics');
const routes = require('./routes');

const app = express();

// Connect to MongoDB and load metrics
const initializeApp = async () => {
  await connectDB();
  await loadDbMetrics(); // Load database metrics on startup
};

initializeApp();

// Setup middleware
setupMiddleware(app);

// Setup API routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Root: http://localhost:${PORT}/`);
  console.log(`📊 Health API: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/`);
  console.log(`🛠️ Tools API: http://localhost:${PORT}/api/tools/`);
});
