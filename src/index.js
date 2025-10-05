require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const { PORT } = require('./config/config');
const { setupMiddleware } = require('./middleware');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Welcome endpoint: http://localhost:${PORT}/api/`);
});
