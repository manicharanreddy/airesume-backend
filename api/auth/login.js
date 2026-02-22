const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database connection function
async function dbConnect() {
  const mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Global caching for serverless functions
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Connect to database
    await dbConnect();

    // Import User model
    const User = require('../../backend/models/User');

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // Compare password
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '30d'
        });

        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'An error occurred. Please try again.',
      error: error.message 
    });
  }
};