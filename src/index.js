require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const { PORT } = require('./config/config');
const { setupMiddleware } = require('./middleware');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// Setup middleware
setupMiddleware(app);

// Main dashboard route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Setup API routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Dashboard: http://localhost:${PORT}/`);
  console.log(`📊 Health API: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/`);
  console.log(`🛠️ Tools API: http://localhost:${PORT}/api/tools/`);
});
