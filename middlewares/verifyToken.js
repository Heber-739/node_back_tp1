const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Intentar obtener token del header Authorization
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7);
  } else if (req.session && req.session.token) {
    // Si no hay token en header, usar token guardado en sesión
    token = req.session.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Token faltante o inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;
