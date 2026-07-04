// Este middleware verifica el token JWT en las solicitudes protegidas
// Deberás usarlo para los endpoints que requieran la autenticación
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No se proporcionó token' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Error en el token' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token malformado' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id; // añadir el userId del usuario a la request para posible uso futuro
    next();
  });
};

module.exports = authMiddleware;
