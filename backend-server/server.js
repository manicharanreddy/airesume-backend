const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

// Very minimal setup
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Root route working',
    version: '1.0.10'
  });
});

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test route working' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});