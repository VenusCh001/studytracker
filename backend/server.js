const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// MongoDB Connection
// Use environment-specific database names to avoid data mixing
const NODE_ENV = process.env.NODE_ENV || 'development';
const DEFAULT_DB = NODE_ENV === 'production' 
  ? 'mongodb://localhost:27017/studytracker_prod'
  : 'mongodb://localhost:27017/studytracker_dev';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_DB;

mongoose.connect(MONGODB_URI)
  .then(() => console.log(`✅ Connected to MongoDB (${NODE_ENV})`))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/progress', require('./routes/progress'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudyTrackr API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 StudyTrackr server running on port ${PORT}`);
});

module.exports = app;
