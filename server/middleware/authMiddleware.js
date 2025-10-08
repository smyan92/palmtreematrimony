const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: check if token expired (jwt.verify already throws if so)
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
// if (req.user.userType !== 'admin') {
//   return res.status(403).json({ message: 'Forbidden: Admin access only' });
// }

    req.user = user; // attach user for next routes
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
