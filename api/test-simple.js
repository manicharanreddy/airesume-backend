module.exports = async function handler(req, res) {
  res.status(200).json({
    message: 'Simple test endpoint working!',
    timestamp: new Date().toISOString()
  });
};