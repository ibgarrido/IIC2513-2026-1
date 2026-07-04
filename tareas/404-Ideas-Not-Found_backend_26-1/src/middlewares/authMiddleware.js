const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No se proporcionó token' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Error en el token' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token malformado' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.sub;
    req.userRol = decoded.rol;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.userRol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = requireAuth;
module.exports.requireAdmin = requireAdmin;
