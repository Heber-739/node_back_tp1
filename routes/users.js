const express = require('express');
const router = express.Router();
const usersController = require('../controller/users.controller');

// Ruta GET /users
router.get('/', usersController.getUsers);

// Ruta POST /users
router.post('/', usersController.createUser);

module.exports = router;

