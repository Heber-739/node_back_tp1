const express = require('express');
const router = express.Router();
const alumnosController = require('../controller/alumnos.controller');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router

// GET lista de alumnos
router.get('/', alumnosController.getAllAlumnos);

// GET form para editar alumno
router.get('/:id/editar', alumnosController.goToEditarAlumno);

// POST crear alumno
router.post('/', alumnosController.crearAlumno);

// PUT actualizar alumno
router.put('/:id', alumnosController.editarAlumno);

// DELETE eliminar alumno
router.delete('/:id', alumnosController.eliminaAlumno);

module.exports = router; 
