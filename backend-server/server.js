const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AI Career Platform API',
    version: '1.0.7',
    status: 'API is running successfully'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test route working' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;