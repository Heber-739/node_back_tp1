const express = require('express');
const router = express.Router();
const alumnosController = require('../controller/alumnos.controller');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const checkRole = require('../middlewares/checkRole');

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router

// GET lista de alumnos
router.get('/', checkRole('profesor', 'usuario'), alumnosController.getAllAlumnos);

// GET form para editar alumno
router.get('/:id/editar', checkRole('usuario'), alumnosController.goToEditarAlumno);

// POST crear alumno
router.post('/', checkRole('usuario'), alumnosController.crearAlumno);

// PUT actualizar alumno
router.put('/:id', checkRole('usuario'), alumnosController.editarAlumno);

// DELETE eliminar alumno
router.delete('/:id', checkRole('usuario'), alumnosController.eliminaAlumno);

module.exports = router; 
