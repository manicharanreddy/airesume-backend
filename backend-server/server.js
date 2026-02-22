const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000; // Changed default to 3000 to match common Render defaults

console.log(`Starting server on port: ${PORT}`);
console.log(`Environment variables: PORT=${process.env.PORT}`);

// Very minimal setup
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.status(200).json({
    message: 'Root route working',
    version: '1.0.11',
    port: PORT
  });
});

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ message: 'Test route working' });
});

app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.status(200).json({ status: 'OK', port: PORT });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 for ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});