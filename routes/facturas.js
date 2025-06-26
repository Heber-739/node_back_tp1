const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const controller = require('../controller/factura.controller');

router.use(verifyToken);

// Rutas con permisos para admin y usuario
router.get('/', checkRole('admin', 'usuario'), controller.getFacturas);
router.get('/nueva', checkRole('admin', 'usuario'), controller.getNuevaFactura);
router.post('/', checkRole('admin', 'usuario'), controller.crearFactura);
router.post('/pagar/:id', checkRole('admin', 'usuario'), controller.pagarFactura);
router.post('/anular-pago/:id', checkRole('admin', 'usuario'), controller.anularPago);
router.post('/anular-factura/:id', checkRole('admin', 'usuario'), controller.anularFactura);
router.post('/reactivar-factura/:id', checkRole('admin', 'usuario'), controller.reactivarFactura);
router.get('/editar/:id', checkRole('admin', 'usuario'), controller.editarFactura);
router.post('/:id', checkRole('admin', 'usuario'), controller.actualizarFactura);

module.exports = router;
