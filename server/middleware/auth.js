const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Authenticated user:', user); // Log user object to check if companyIdentifier is there
    req.user = user; // Attach user data to request object
    next();
  });
};

module.exports = authenticateToken;