require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const memberRoutes = require('./routes/memberRoutes');
const camavisRoutes = require('./routes/camavisRoutes');
const userRoutes = require('./routes/userRoutes');
const pageContentRoutes = require('./routes/pageContentRoutes');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Flexible CORS: allows localhost, CLIENT_URL, and Vercel domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for local uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/camavis', camavisRoutes);
app.use('/api/users', userRoutes);
app.use('/api/page-content', pageContentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DKV API is running 🚀', timestamp: new Date().toISOString() });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DKV Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
