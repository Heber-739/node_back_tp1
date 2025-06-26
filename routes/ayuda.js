const express = require('express');
const router = express.Router();

router.get('/permisos', (req, res) => {
  res.render('ayuda/permisos'); // permisos.pug en tu carpeta views
});

module.exports = router;