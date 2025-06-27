const isApi = (req) => {
  const ua = req.get('User-Agent') || '';
  return /postman|thunder client/i.test(ua);
};

const checkRole = (...params) => {
  return (req, res, next) => {
    const allowedRoles = [...params,'admin']
    const user = req.user || req.session.usuario;
    if (!user || !allowedRoles.includes(user.role)) {
      if (isApi(req)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      } else {
        return res.status(403).render('403');
      }
    }
    next();
  };
};

module.exports = checkRole;