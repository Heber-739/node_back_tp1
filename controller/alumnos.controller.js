const fs = require('fs');
const { readFile, writeFile } = require('../services/data.service');
const { Alumno } = require('../models/alumno.class'); 
const DB_FILE = require('path').join(__dirname, '../data/alumnos.json');

const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

// GET /alumnos con búsqueda y filtros
const getAllAlumnos = (req, res) => {
  const alumnos = readFile(DB_FILE);
  const { nombre } = req.query;

  let filtrados = alumnos;

  if (nombre) {
    const busqueda = nombre.toLowerCase();
    filtrados = filtrados.filter(a =>
      a.nombre.toLowerCase().includes(busqueda) ||
      a.apellido.toLowerCase().includes(busqueda)
    );
  }

  if (isApi(req)) {
    return res.status(200).json(filtrados);
  } else {
    res.render('alumnos/index', { alumnos: filtrados, nombre });
  }
};

// GET /alumnos/:id/editar
const goToEditarAlumno = (req, res) => {
  const alumnos = readFile(DB_FILE);
  const alumno = alumnos.find(a => a.id === parseInt(req.params.id));
  if (!alumno) return res.status(404).send('Alumno no encontrado');

  if (isApi(req)) {
    return res.status(200).json(alumno);
  } else {
    res.render('alumnos/editar', { alumno });
  }
};

// POST /alumnos - crea un nuevo alumno
const crearAlumno = (req, res) => {
  const alumnos = readFile(DB_FILE);

  const { nombre, apellido, email, telefono } = req.body;
  if (!nombre || !apellido || !email || !telefono) {
    return res.status(400).send('Faltan campos requeridos');
  }

  const nuevoAlumno = new Alumno(nombre, apellido, email, telefono);
  alumnos.push(nuevoAlumno);
  writeFile(alumnos, DB_FILE);

  if (isApi(req)) {
    return res.status(201).json({ message: 'Alumno creado', alumno: nuevoAlumno });
  } else {
    res.redirect('/alumnos');
  }
};

// PUT /alumnos/:id - actualiza un alumno
const editarAlumno = (req, res) => {
  const alumnos = readFile(DB_FILE);
  const id = parseInt(req.params.id);
  const index = alumnos.findIndex(a => a.id === id);

  if (index === -1) return res.status(404).send('Alumno no encontrado');

  alumnos[index] = {
    id,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    telefono: req.body.telefono
  };

  writeFile(alumnos, DB_FILE);

  if (isApi(req)) {
    return res.status(200).json({ message: 'Alumno actualizado', alumno: alumnos[index] });
  } else {
    res.redirect('/alumnos');
  }
};

// DELETE /alumnos/:id - elimina un alumno
const eliminaAlumno = (req, res) => {
  let alumnos = readFile(DB_FILE);
  const id = parseInt(req.params.id);
  const cantidadInicial = alumnos.length;
  alumnos = alumnos.filter(a => a.id !== id);

  if (alumnos.length === cantidadInicial) {
    return res.status(404).send('Alumno no encontrado');
  }

  writeFile(alumnos, DB_FILE);

  if (isApi(req)) {
    return res.status(200).json({ message: 'Alumno eliminado', idEliminado: id });
  } else {
    res.redirect('/alumnos');
  }
};

module.exports = {
  getAllAlumnos,
  goToEditarAlumno,
  crearAlumno,
  editarAlumno,
  eliminaAlumno
};