const jwt = require('jsonwebtoken');
const SECRET_KEY = 'myvet_super_secret_key1501';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const clinicOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'clinic') {
      next();
    } else {
      res.status(403).json({ message: 'Clinic access only' });
    }
  });
};

const petOwnerOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'petowner') {
      next();
    } else {
      res.status(403).json({ message: 'Pet owner access only' });
    }
  });
};

module.exports = { verifyToken, clinicOnly, petOwnerOnly };