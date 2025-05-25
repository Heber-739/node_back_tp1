const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const FACTURAS_FILE = path.join(__dirname, '../data/facturas-profesores.json');
const PROFESORES_FILE = path.join(__dirname, '../data/profesores.json');

const leerFacturas = () => JSON.parse(fs.readFileSync(FACTURAS_FILE, 'utf8'));
const escribirFacturas = (data) => fs.writeFileSync(FACTURAS_FILE, JSON.stringify(data, null, 2));
const leerProfesores = () => JSON.parse(fs.readFileSync(PROFESORES_FILE, 'utf8'));


// GET /facturas-profesores con búsqueda y filtros
router.get('/', (req, res) => {
  const { profesor, fecha, estadoPago, estadoFactura } = req.query;
  const facturas = leerFacturas();
  const profesores = leerProfesores();

  let facturasConNombre = facturas.map(f => {
    const profe = profesores.find(p => p.id === f.profesorId);
    return {
      ...f,
      profesorNombre: profe ? `${profe.nombre} ${profe.apellido}` : 'Desconocido',
      estadoFactura: f.estadoFactura || "activa",
      estadoPago: f.estadoPago === "pagada" ? "pagada" : "pendiente"
    };
  });

  // Aplicar filtros
  if (profesor) {
    const busqueda = profesor.toLowerCase();
    facturasConNombre = facturasConNombre.filter(f =>
      f.profesorNombre.toLowerCase().includes(busqueda)
    );
  }

  if (fecha) {
    facturasConNombre = facturasConNombre.filter(f => f.fecha === fecha);
  }

  if (estadoPago) {
    facturasConNombre = facturasConNombre.filter(f => f.estadoPago === estadoPago);
  }

  if (estadoFactura) {
    facturasConNombre = facturasConNombre.filter(f => f.estadoFactura === estadoFactura);
  }

  res.render('facturas-profesores/index', {
    facturas: facturasConNombre,
    profesor,
    fecha,
    estadoPago,
    estadoFactura
  });
});


// GET /facturas-profesores/nueva
router.get('/nueva', (req, res) => {
  const profesores = leerProfesores();
  res.render('facturas-profesores/nueva', { profesores });
});

// POST /facturas-profesores
router.post('/', (req, res) => {
  const facturas = leerFacturas();
  const { profesorId, fecha, monto, detalle, numeroFactura } = req.body;

  if (!profesorId || !fecha || !monto || !detalle || !numeroFactura)
    return res.status(400).send('Faltan campos obligatorios');

  const nuevaFactura = {
    id: facturas.length > 0 ? facturas[facturas.length - 1].id + 1 : 1,
    numeroFactura,
    profesorId: parseInt(profesorId),
    fecha,
    monto: parseFloat(monto),
    detalle,
    estadoPago: "pendiente", // solo pendiente o pagada
    estadoFactura: "activa"  // solo activa o anulada
  };

  facturas.push(nuevaFactura);
  escribirFacturas(facturas);
  res.redirect('/facturas-profesores');
});

// POST /facturas-profesores/pagar/:id
router.post('/pagar/:id', (req, res) => {
  const facturas = leerFacturas();
  const id = parseInt(req.params.id);
  const index = facturas.findIndex(f => f.id === id);

  if (index !== -1) {
    facturas[index].estadoPago = 'pagada';  // solo pagada
    escribirFacturas(facturas);
  }

  res.redirect('/facturas-profesores');
});

// POST /facturas-profesores/anular-pago/:id
router.post('/anular-pago/:id', (req, res) => {
  const facturas = leerFacturas();
  const id = parseInt(req.params.id);
  const index = facturas.findIndex(f => f.id === id);

  if (index !== -1) {
    facturas[index].estadoPago = 'pendiente';  // solo pendiente
    escribirFacturas(facturas);
  }

  res.redirect('/facturas-profesores');
});

// POST /facturas-profesores/anular-factura/:id
router.post('/anular-factura/:id', (req, res) => {
  const facturas = leerFacturas();
  const id = parseInt(req.params.id);
  const index = facturas.findIndex(f => f.id === id);

  if (index !== -1) {
    facturas[index].estadoFactura = 'anulada'; // activa o anulada
    escribirFacturas(facturas);
  }

  res.redirect('/facturas-profesores');
});

// POST /facturas-profesores/reactivar-factura/:id
router.post('/reactivar-factura/:id', (req, res) => {
  const facturas = leerFacturas();
  const id = parseInt(req.params.id);
  const index = facturas.findIndex(f => f.id === id);

  if (index !== -1) {
    facturas[index].estadoFactura = 'activa'; // activa o anulada
    escribirFacturas(facturas);
  }

  res.redirect('/facturas-profesores');
});

// GET /facturas-profesores/editar/:id
router.get('/editar/:id', (req, res) => {
  const facturas = leerFacturas();
  const profesores = leerProfesores();
  const id = parseInt(req.params.id);
  const factura = facturas.find(f => f.id === id);

  if (!factura) return res.status(404).send('Factura no encontrada');

  res.render('facturas-profesores/editar', { factura, profesores });
});

// POST /facturas-profesores/:id  (actualizar factura)
router.post('/:id', (req, res) => {
  const facturas = leerFacturas();
  const id = parseInt(req.params.id);
  const index = facturas.findIndex(f => f.id === id);

  if (index === -1) return res.status(404).send('Factura no encontrada');

  const { profesorId, fecha, monto, detalle, numeroFactura, estadoPago, estadoFactura } = req.body;

  if (!profesorId || !fecha || !monto || !detalle || !numeroFactura || !estadoPago || !estadoFactura) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  // Actualizar los campos
  facturas[index] = {
    ...facturas[index],
    profesorId: parseInt(profesorId),
    fecha,
    monto: parseFloat(monto),
    detalle,
    numeroFactura,
    estadoPago,    // debe ser 'pendiente' o 'pagada'
    estadoFactura  // debe ser 'activa' o 'anulada'
  };

  escribirFacturas(facturas);
  res.redirect('/facturas-profesores');
});

module.exports = router;
