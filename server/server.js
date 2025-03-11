const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import routes
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();

// Configure port
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root route for API info
app.get('/', (req, res) => {
  res.json({
    message: 'Village Shopkeeper API Server',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Unknown error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Using Claude model: ${process.env.CLAUDE_API_MODEL || 'claude-3-opus-20240229'}`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('Server shutting down');
  process.exit(0);
});

module.exports = app; 