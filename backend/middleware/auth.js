const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔐 Auth check - Authorization header:', authHeader ? 'Present' : 'Missing');

    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    console.log('✓ Token verified for user:', req.userId);
    next();
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    res.status(401).json({ message: 'Invalid token: ' + error.message });
  }
};

module.exports = auth;
