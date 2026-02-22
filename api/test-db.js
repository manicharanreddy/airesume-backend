const dbConnect = require('../lib/dbConnect').default;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Test database connection
    await dbConnect();
    
    // Test if we can access the User model
    const User = require('../backend/models/User');
    
    // Try to count users (this will fail if DB connection is bad)
    const userCount = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};