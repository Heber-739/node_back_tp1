const Alumno = require('../models/Alumno.model');

const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

// GET /alumnos con búsqueda y filtros
const getAllAlumnos = async (req, res) => {
  const { nombre } = req.query;

  try {
    let query = {};
    if (nombre) {
      const regex = new RegExp(nombre, 'i');
      query = {
        $or: [
          { nombre: regex },
          { apellido: regex }
        ]
      };
    }

    const alumnos = await Alumno.find(query);

    if (isApi(req)) {
      return res.status(200).json(alumnos);
    } else {
      res.render('alumnos/index', { alumnos, nombre });
    }
  } catch (err) {
    res.status(500).send('Error al obtener alumnos');
  }
};

// GET /alumnos/:id/editar
const goToEditarAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).send('Alumno no encontrado');

    if (isApi(req)) {
      return res.status(200).json(alumno);
    } else {
      res.render('alumnos/editar', { alumno });
    }
  } catch (err) {
    res.status(500).send('Error al obtener alumno');
  }
};

// POST /alumnos - crea un nuevo alumno
const crearAlumno = async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  if (!nombre || !apellido || !email || !telefono) {
    return res.status(400).send('Faltan campos requeridos');
  }
  try {
    const nuevoAlumno = new Alumno({ nombre, apellido, email, telefono });
    await nuevoAlumno.save();

    if (isApi(req)) {
      return res.status(201).json({ message: 'Alumno creado', alumno: nuevoAlumno });
    } else {
      res.redirect('/alumnos');
    }
  } catch (err) {
    
    res.status(500).send('Error al crear alumno');
  }

};

// PUT /alumnos/:id - actualiza un alumno
const editarAlumno = async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;

  try {
    const alumno = await Alumno.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, telefono },
      { new: true }
    );

    if (!alumno) return res.status(404).send('Alumno no encontrado');

    if (isApi(req)) {
      return res.status(200).json({ message: 'Alumno actualizado', alumno });
    } else {
      res.redirect('/alumnos');
    }
  } catch (err) {
    res.status(500).send('Error al actualizar alumno');
  }
};

// DELETE /alumnos/:id - elimina un alumno
const eliminaAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno) return res.status(404).send('Alumno no encontrado');

    if (isApi(req)) {
      return res.status(200).json({ message: 'Alumno eliminado', idEliminado: req.params.id });
    } else {
      res.redirect('/alumnos');
    }
  } catch (err) {
    res.status(500).send('Error al eliminar alumno');
  }
};

module.exports = {
  getAllAlumnos,
  goToEditarAlumno,
  crearAlumno,
  editarAlumno,
  eliminaAlumno
};