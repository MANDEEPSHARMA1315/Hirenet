const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to MongoDB & Auto Seed if empty
const autoSeed = async () => {
  try {
    await connectDB();
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Empty database detected. Seeding demo accounts and job listings...');
      const seedScript = require('./utils/seedDataHelper');
      await seedScript();
    }
  } catch (err) {
    console.error('[AutoSeed Error]:', err.message);
  }
};
autoSeed();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads (Resumes & Logos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'HireNet Job Board Platform API',
    timestamp: new Date()
  });
});

// Database reseed endpoint
app.all('/api/reseed', async (req, res) => {
  try {
    const seedScript = require('./utils/seedDataHelper');
    const result = await seedScript();
    const count = await require('./models/Job').countDocuments();
    res.json({
      success: true,
      message: `Database successfully reseeded with ${count} real job openings!`,
      totalJobs: count
    });
  } catch (err) {
    console.error('[Reseed Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[HireNet Backend API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
