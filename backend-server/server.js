const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.status(200).json({
    message: 'AI Career Platform API',
    version: '1.0.9',
    status: 'API is running successfully'
  });
});

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ message: 'Test route working' });
});

app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 for ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;