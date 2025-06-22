  const bcrypt = require('bcrypt');
  const User = require('../models/User.model');

  const isApi = (req) => {
    const ua = req.get('User-Agent');
    return /postman|thunder client/i.test(ua);
  };


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

    if (isApi(req)) {
      return res.status(200).json(users);
    } else {
      res.render('users/index', { users, nombre: filtro });
    }
  } catch (error) {
    next(error);
  }
};

// POST /users - Crear nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const { username, name, password, role } = req.body; 
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, name, passwordHash, role });
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

const updateUser = async (req, res, next) => {
  try {
    const { name, username, password, role } = req.body;

    const updateData = { name, username, role };
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