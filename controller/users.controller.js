const bcrypt = require('bcrypt');
const User = require('../models/User.model');

// POST /users - Crear usuario
const createUser = async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, name, passwordHash });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

// GET /users - Obtener todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers
};
