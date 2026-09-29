const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Allows both Superadmin and Contributor (managers of content)
const adminOnly = (req, res, next) => {
  if (req.user && ['superadmin', 'contributor', 'admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Akses ditolak: Hanya untuk pengurus (Superadmin / Contributor)' });
  }
};

// Allows ONLY Superadmin (can manage users, assign contributors, delete data)
const superadminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Akses ditolak: Hanya untuk Superadmin' });
  }
};

module.exports = { protect, adminOnly, superadminOnly };
