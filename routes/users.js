const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserEditForm,
  updateUser,
  deleteUser
} = require('../controller/users.controller');

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router

// Listar
router.get('/', getUsers);

// Crear
router.post('/', createUser);

// Formulario edición
router.get('/:id/editar', getUserEditForm);

// Actualizar
router.post('/:id/editar', updateUser);

// Eliminar
router.delete('/:id', deleteUser);

module.exports = router;
