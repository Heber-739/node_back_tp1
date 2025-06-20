const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token faltante o inválido' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;


// const verifyToken = require('../middlewares/verifyToken');
// router.get('/alumnos', verifyToken, (req, res) => {
//   // req.user.id está disponible
// });
