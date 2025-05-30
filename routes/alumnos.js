const express = require('express');
const router = express.Router();
const alumnosController = require('../controller/alumnos.controller');

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