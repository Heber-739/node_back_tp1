const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const controller = require('../controller/factura.controller');

router.use(verifyToken);

router.get('/', controller.getFacturas);
router.get('/nueva', controller.getNuevaFactura);
router.post('/', controller.crearFactura);
router.post('/pagar/:id', controller.pagarFactura);
router.post('/anular-pago/:id', controller.anularPago);
router.post('/anular-factura/:id', controller.anularFactura);
router.post('/reactivar-factura/:id', controller.reactivarFactura);
router.get('/editar/:id', controller.editarFactura);
router.post('/:id', controller.actualizarFactura);

module.exports = router;
