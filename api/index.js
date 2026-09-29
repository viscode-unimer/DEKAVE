const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Register models
require('../server/src/models/User');
require('../server/src/models/Portfolio');
require('../server/src/models/Event');
require('../server/src/models/Blog');
require('../server/src/models/Member');
require('../server/src/models/Camavis');

const authRoutes = require('../server/src/routes/authRoutes');
const portfolioRoutes = require('../server/src/routes/portfolioRoutes');
const eventRoutes = require('../server/src/routes/eventRoutes');
const blogRoutes = require('../server/src/routes/blogRoutes');
const memberRoutes = require('../server/src/routes/memberRoutes');
const camavisRoutes = require('../server/src/routes/camavisRoutes');
const userRoutes = require('../server/src/routes/userRoutes');
const { errorHandler, notFound } = require('../server/src/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cached connection for Vercel Serverless Function
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing on Vercel');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  isConnected = true;
};

// Middleware to ensure DB connection before handling request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ success: false, message: 'Database connection error: ' + err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/camavis', camavisRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DKV API is running on Vercel 🚀', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
