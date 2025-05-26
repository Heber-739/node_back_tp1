const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/profesores.json');

// Funciones para leer y escribir datos
const leerDatos = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const escribirDatos = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// // GET /profesores
// router.get('/', (req, res) => {
//     const profesores = leerDatos();
//     res.render('profesores/index', { profesores }); // Renderiza la vista 'profesores' y pasa los datos
// });

// GET /profesores con búsqueda y filtros
router.get('/', (req, res) => {
  const profesores = leerDatos();
  const { nombre } = req.query;

  let filtrados = profesores;

  if (nombre) {
    const busqueda = nombre.toLowerCase();
    filtrados = filtrados.filter(a =>
      a.nombre.toLowerCase().includes(busqueda) ||
      a.apellido.toLowerCase().includes(busqueda)
    );
  }

  res.render('profesores/index', { profesores: filtrados, nombre });
});







// GET /profesores/:id/editar
router.get('/:id/editar', (req, res) => {
    const profesores = leerDatos();
    const profesor = profesores.find(p => p.id === parseInt(req.params.id));
    if (!profesor) return res.status(404).send('Profesor no encontrado');
    res.render('profesores/editar', { profesor });
});

// POST /profesores - crea un nuevo profesor
router.post('/', (req, res) => {
    const profesores = leerDatos();

    // Validar que los campos estén presentes
    const { nombre, apellido, email, telefono, cuit } = req.body;
    if (!nombre || !apellido || !email || !telefono || !cuit) {
        return res.status(400).send('Faltan campos requeridos');
    }
    const nuevoProfesor = {
        id: profesores.length > 0 ? profesores[profesores.length - 1].id + 1 : 1,
        nombre,
        apellido,
        email,
        telefono,
        cuit
    };
    profesores.push(nuevoProfesor);
    escribirDatos(profesores);
    res.redirect('/profesores');
});

// PUT /profesores/:id - actualizar profesor
router.put('/:id', (req, res) => {
    const profesores = leerDatos();
    const id = parseInt(req.params.id);
    const index = profesores.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Profesor no encontrado');

    profesores[index] = {
        id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        cuit: req.body.cuit
    };
    escribirDatos(profesores);
    res.redirect('/profesores');
});

// DELETE /profesores/:id - eliminar profesor
router.delete('/:id', (req, res) => {
    let profesores = leerDatos();
    const id = parseInt(req.params.id);
    const cantidadInicial = profesores.length;
    profesores = profesores.filter(p => p.id !== id);
    if (profesores.length === cantidadInicial)
        return res.status(404).send('Profesor no encontrado');
    escribirDatos(profesores);
    res.redirect('/profesores');
});

module.exports = router;
