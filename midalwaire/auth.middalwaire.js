const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Accès interdit. Token manquant.' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token invalide.' });
  }
};
