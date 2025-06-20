const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserEditForm,
  updateUser,
  deleteUser
} = require('../controller/users.controller');

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