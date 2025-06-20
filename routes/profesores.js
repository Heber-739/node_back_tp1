const express = require('express');
const router = express.Router();
const profesoresController = require('../controller/profesores.controller');

// GET /profesores con búsqueda y filtros
router.get('/', profesoresController.getAllProfesores);

// GET /profesores/:id/editar
router.get('/:id/editar', profesoresController.goToEditarProfesor);

// POST /profesores - crea un nuevo profesor
router.post('/', profesoresController.crearProfesor);

// PUT /profesores/:id - actualizar profesor
router.put('/:id', profesoresController.editarProfesor);

// DELETE /profesores/:id - eliminar profesor
router.delete('/:id', profesoresController.eliminarProfesor);

module.exports = router;