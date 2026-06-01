const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Expecting token in header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    
    // Attach admin info to request
    req.admin = decoded;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
