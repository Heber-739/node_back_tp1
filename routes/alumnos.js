const express = require('express');
const router = express.Router();
const alumnosController = require('../controller/alumnos.controller');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const checkRole = require('../middlewares/checkRole');

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router

// GET lista de alumnos
router.get('/', checkRole('admin', 'profesor', 'usuario'), alumnosController.getAllAlumnos);

// GET form para editar alumno
router.get('/:id/editar', checkRole('admin', 'usuario'), alumnosController.goToEditarAlumno);

// POST crear alumno
router.post('/', checkRole('admin', 'usuario'), alumnosController.crearAlumno);

// PUT actualizar alumno
router.put('/:id', checkRole('admin', 'usuario'), alumnosController.editarAlumno);

// DELETE eliminar alumno
router.delete('/:id', checkRole('admin', 'usuario'), alumnosController.eliminaAlumno);


module.exports = router; 
