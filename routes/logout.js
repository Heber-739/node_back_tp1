const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // opcional: limpia la cookie de sesión
    res.redirect('/login'); // redirige al login
  });
});

module.exports = router;
