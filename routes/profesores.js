const express = require('express');
const router = express.Router();
const profesoresController = require('../controller/profesores.controller');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const checkRole = require('../middlewares/checkRole');


// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 

// GET /profesores con búsqueda y filtros
router.get('/', checkRole('admin', 'usuario'), profesoresController.getAllProfesores);

// GET /profesores/:id/editar
router.get('/:id/editar', checkRole('admin', 'usuario'), profesoresController.goToEditarProfesor);

// POST /profesores - crea un nuevo profesor
router.post('/', checkRole('admin', 'usuario'), profesoresController.crearProfesor);

// PUT /profesores/:id - actualizar profesor
router.put('/:id', checkRole('admin', 'usuario'), profesoresController.editarProfesor);

// DELETE /profesores/:id - eliminar profesor
router.delete('/:id', checkRole('admin', 'usuario'), profesoresController.eliminarProfesor);

module.exports = router;