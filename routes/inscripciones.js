const express = require('express');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const checkRole = require('../middlewares/checkRole');
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

// Rutas con permisos para usuario, admin y profesor
router.get('/', checkRole('usuario', 'admin', 'profesor'), getAllInscripciones);
router.post('/', checkRole('usuario', 'admin'), crearInscripcion);
router.get('/editar/:id', checkRole('usuario', 'admin'), goToeditarInscripcion);
router.put('/editar/:id', checkRole('usuario', 'admin'), editarInscripcion);
router.get('/pago/:id', checkRole('usuario', 'admin'), goToAgregarPago);
router.post('/pago/:id', checkRole('usuario', 'admin'), agregarPago);
router.delete('/:id', checkRole('usuario', 'admin'), eliminarInscripcion);

module.exports = router;
