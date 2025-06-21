const express = require('express');
const router = express.Router();
const { loginUser } = require('../controller/login.controller');

router.post('/', loginUser);

router.get('/', (req, res) => {
  res.render('login', { isLoginPage: true });
});

module.exports = router;