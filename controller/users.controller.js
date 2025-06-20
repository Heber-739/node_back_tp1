const bcrypt = require('bcrypt');
const User = require('../models/User.model');

// GET /users - Listar usuarios + opcional búsqueda
const getUsers = async (req, res, next) => {
  try {
    const filtro = req.query.nombre;
    let users;

    if (filtro) {
      users = await User.find({
        $or: [
          { name: new RegExp(filtro, 'i') },
          { username: new RegExp(filtro, 'i') }
        ]
      });
    } else {
      users = await User.find({});
    }

    res.render('users/index', { users, nombre: filtro });
  } catch (error) {
    next(error);
  }
};

// POST /users - Crear nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, name, passwordHash });
    await user.save();

    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};

// GET /users/:id/editar - Formulario de edición
const getUserEditForm = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('Usuario no encontrado');
    res.render('users/edit', { user });
  } catch (error) {
    next(error);
  }
};

// POST /users/:id/editar - Actualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    const updateData = { name, username };
    if (password && password.trim() !== '') {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id - Eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserEditForm,
  updateUser,
  deleteUser
};
