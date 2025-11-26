// Main Express Server
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const bloodRoutes = require('./routes/blood');
const organRoutes = require('./routes/organ');
const deathRoutes = require('./routes/death');
const authRoutes = require('./routes/auth');
const faqRoutes = require('./routes/faq');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Donate Life API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/blood', bloodRoutes);
app.use('/api/organ', organRoutes);
app.use('/api/death', deathRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faq', faqRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Donate Life Backend API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

