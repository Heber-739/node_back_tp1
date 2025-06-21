const Profesor = require('../models/Profesor.model');
const Factura = require('../models/Factura.model');

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 

const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

// GET /facturas-profesores
const getFacturas = async (req, res) => {
  const { profesor, fecha, estadoPago, estadoFactura } = req.query;

  try {
    let filtros = {};
    if (fecha) filtros.fecha = new Date(fecha);
    if (estadoPago) filtros.estadoPago = estadoPago;
    if (estadoFactura) filtros.estadoFactura = estadoFactura;

    let facturas = await Factura.find(filtros).populate('profesor');

    if (profesor) {
      const busqueda = profesor.toLowerCase();
      facturas = facturas.filter(f =>
        `${f.profesor.nombre} ${f.profesor.apellido}`.toLowerCase().includes(busqueda)
      );
    }

    const facturasFormateadas = facturas.map(f => ({
      ...f._doc,
      profesorNombre: `${f.profesor.nombre} ${f.profesor.apellido}`,
      fecha: f.fecha.toISOString().split('T')[0]
    }));

    res.render('facturas-profesores/index', {
      facturas: facturasFormateadas,
      profesor, fecha, estadoPago, estadoFactura
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener facturas');
  }
};

// GET /facturas-profesores/nueva
const getNuevaFactura = async (req, res) => {
  const profesores = await Profesor.find();
  res.render('facturas-profesores/nueva', { profesores });
};

// POST /facturas-profesores
const crearFactura = async (req, res) => {
  const { profesorId, fecha, monto, detalle, numeroFactura } = req.body;
  if (!profesorId || !fecha || !monto || !detalle || !numeroFactura)
    return res.status(400).send('Faltan campos obligatorios');

  try {
    await Factura.create({
      numeroFactura,
      profesor: profesorId,
      fecha,
      monto,
      detalle
    });
    res.redirect('/facturas-profesores');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear factura');
  }
};

// POST /facturas-profesores/pagar/:id
const pagarFactura = async (req, res) => {
  await Factura.findByIdAndUpdate(req.params.id, { estadoPago: 'pagada' });
  res.redirect('/facturas-profesores');
};

// POST /facturas-profesores/anular-pago/:id
const anularPago = async (req, res) => {
  await Factura.findByIdAndUpdate(req.params.id, { estadoPago: 'pendiente' });
  res.redirect('/facturas-profesores');
};

// POST /facturas-profesores/anular-factura/:id
const anularFactura = async (req, res) => {
  await Factura.findByIdAndUpdate(req.params.id, { estadoFactura: 'anulada' });
  res.redirect('/facturas-profesores');
};

// POST /facturas-profesores/reactivar-factura/:id
const reactivarFactura = async (req, res) => {
  await Factura.findByIdAndUpdate(req.params.id, { estadoFactura: 'activa' });
  res.redirect('/facturas-profesores');
};

// GET /facturas-profesores/editar/:id
const editarFactura = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).populate('profesor');
    const profesores = await Profesor.find();

    if (!factura) {
      return res.status(404).send('Factura no encontrada');
    }

    res.render('facturas-profesores/editar', { factura, profesores });
  } catch (error) {
    console.error('Error al cargar factura para edición:', error);
    res.status(500).send('Error interno del servidor');
  }
};





// POST /facturas-profesores/:id
const actualizarFactura = async (req, res) => {
  const { profesorId, fecha, monto, detalle, numeroFactura, estadoPago, estadoFactura } = req.body;

  if (!profesorId || !fecha || !monto || !detalle || !numeroFactura || !estadoPago || !estadoFactura) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  try {
    await Factura.findByIdAndUpdate(req.params.id, {
      profesor: profesorId,
      fecha,
      monto,
      detalle,
      numeroFactura,
      estadoPago,
      estadoFactura
    });
    res.redirect('/facturas-profesores');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar factura');
  }
};

module.exports = {
  getFacturas,
  getNuevaFactura,
  crearFactura,
  pagarFactura,
  anularPago,
  anularFactura,
  reactivarFactura,
  editarFactura,
  actualizarFactura
};
