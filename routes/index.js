var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index'); // busca views/index.pug
});

module.exports = router;