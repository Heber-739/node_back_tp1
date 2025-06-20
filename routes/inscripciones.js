const express = require('express');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const router = express.Router();
const {
  getAllInscripciones,
  crearInscripcion,
  goToeditarInscripcion,
  editarInscripcion,
  goToAgregarPago,
  agregarPago,
  eliminarInscripcion
} = require('../controller/inscripciones.controller');

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router

// GET todas las inscripciones
router.get('/', getAllInscripciones);

// POST nueva inscripción
router.post('/', crearInscripcion);

// GET editar inscripción
router.get('/editar/:id', goToeditarInscripcion);

// PUT editar inscripción
router.put('/editar/:id', editarInscripcion);

// GET formulario para agregar pago
router.get('/pago/:id', goToAgregarPago);

// POST registrar pago
router.post('/pago/:id', agregarPago);

// DELETE eliminar inscripción
router.delete('/:id', eliminarInscripcion);

module.exports = router;
