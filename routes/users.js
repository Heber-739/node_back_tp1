const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

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

// Listar (solo admin y usuario)
router.get('/', checkRole('admin'), getUsers);

// Crear (solo admin)
router.post('/', checkRole('admin'), createUser);

// Formulario edición (solo admin)
router.get('/:id/editar', checkRole('admin'), getUserEditForm);

// Actualizar (solo admin)
router.post('/:id/editar', checkRole('admin'), updateUser);

// Eliminar (solo admin)
router.delete('/:id', checkRole('admin'), deleteUser);

module.exports = router;