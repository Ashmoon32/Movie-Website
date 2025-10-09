const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/favorites', require('./routes/favorites'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Movie API is running!',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Movie API',
    endpoints: {
      movies: '/api/movies',
      favorites: '/api/favorites',
      health: '/api/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movie API Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🛠️  Environment: ${process.env.NODE_ENV || 'development'}`);
});