var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session.usuario) {
    // Si está logueado, mostrar index (o lo que quieras)
    res.render('index', { usuario: req.session.usuario });
  } else {
    // Si no está logueado, redirigir a login
    res.redirect('/login');
  }
});


module.exports = router;