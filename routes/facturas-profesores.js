const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const FACTURAS_FILE = path.join(__dirname, '../data/facturas-profesores.json');
const PROFESORES_FILE = path.join(__dirname, '../profesores.json');

// Funciones utilitarias
const leerFacturas = () => JSON.parse(fs.readFileSync(FACTURAS_FILE, 'utf8'));
const escribirFacturas = (data) => fs.writeFileSync(FACTURAS_FILE, JSON.stringify(data, null, 2));
const leerProfesores = () => JSON.parse(fs.readFileSync(PROFESORES_FILE, 'utf8'));

// GET /facturas-profesores
router.get('/', (req, res) => {
  const facturas = leerFacturas();
  const profesores = leerProfesores();

  const facturasConNombre = facturas.map(f => {
    const profe = profesores.find(p => p.id === f.profesorId);
    return {
      ...f,
      profesorNombre: profe ? `${profe.nombre} ${profe.apellido}` : 'Desconocido'
    };
  });

  res.render('facturas-profesores/index', { facturas: facturasConNombre });
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
    estadoPago: "pendiente"
  };

  facturas.push(nuevaFactura);
  escribirFacturas(facturas);
  res.redirect('/facturas-profesores');
});

module.exports = router;
