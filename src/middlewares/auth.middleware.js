const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Vérifie le JWT dans Authorization: Bearer <token> et met req.user (id, email)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** N'échoue pas si pas de token ; définit req.user uniquement si token valide (pour routes à accès public ou restreint selon contexte). */
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
  } catch (err) {
    // ignore invalid token for optional auth
  }
  return next();
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};

