const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser and useUnifiedTopology are now default options in Mongoose 6+
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from frontend build directory in production
if (process.env.NODE_ENV === 'production') {
  // In Vercel, the frontend build is available in the root
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle API routes specifically (these will be handled by Vercel serverless functions)
  // For direct server access, still include routes
  const resumeRoutes = require('./routes/resumeRoutes');
  const careerRoutes = require('./routes/careerRoutes');
  const trendingRoutes = require('./routes/trendingRoutes');
  const authRoutes = require('./routes/authRoutes');

  // API routes for direct server access (fallback)
  app.use('/api/auth', authRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/trending', trendingRoutes);
  
  // Handle client-side routing
  app.get(/^(?!\/api\/).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // For development, we still serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // For development, we serve the API routes
  const resumeRoutes = require('./routes/resumeRoutes');
  const careerRoutes = require('./routes/careerRoutes');
  const trendingRoutes = require('./routes/trendingRoutes');
  const authRoutes = require('./routes/authRoutes');

  // API routes for development
  app.use('/api/auth', authRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/trending', trendingRoutes);
  
  // Handle client-side routing in development
  app.get(/^(?!\/api\/).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
  });
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Career Platform API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});