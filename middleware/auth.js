const jwt = require('jsonwebtoken');

// Middleware autentikasi
const auth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Format: "Bearer <token>"
    const bearer = token.split(" ");
    const jwtToken = bearer.length === 2 ? bearer[1] : token;

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded; // simpan payload ke request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

// Middleware cek role (boleh multi role)
const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};

module.exports = { auth, checkRole };
