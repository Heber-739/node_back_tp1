const fs = require('fs');
const path = require('path');
const { coursesService } = require('../services/courses.service');
const { readFile, writeFile } = require('../services/data.service');
const { Inscripcion } = require('../models/inscripcion.class');

const inscripcionesPath = path.join(__dirname, '../data/inscripciones.json');
const alumnosPath = path.join(__dirname, '../data/alumnos.json');


const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

//Obtener todas las inscripciones
const getAllInscripciones = (req, res) => {
  const { nombreAlumno = '', nombreCurso = '' } = req.query;

  const inscripciones = readFile(inscripcionesPath);
  const alumnos = readFile(alumnosPath);
  const cursos = coursesService.getAllCourses();

  const inscripcionesConInfo = inscripciones.map(insc => {
    const alumno = alumnos.find(a => String(a.id) === String(insc.alumnoId));
    const curso = cursos.find(c => String(c.id) === String(insc.cursoId));

    const fechaInscripcion = new Date(insc.fecha_inscripcion).toLocaleDateString('es-AR');
    const pagosFormateados = (insc.pagos || []).map(pago => ({
      ...pago,
      fecha_pago: new Date(pago.fecha_pago).toLocaleDateString('es-AR')
    }));

    let estado = "inactivo";
    if (insc.pagos?.length) {
      const ultimaFechaPago = new Date(insc.pagos[insc.pagos.length - 1].fecha_pago);
      const hoy = new Date();
      const dias = (hoy - ultimaFechaPago) / (1000 * 60 * 60 * 24);
      estado = dias > 30 ? "inactivo" : "activo";
    }

    return {
      ...insc,
      alumno: alumno ? { id: alumno.id, nombre: alumno.nombre, apellido: alumno.apellido } : null,
      curso: curso ? { id: curso.id, nombre: curso.nombre } : null,
      fecha_inscripcion: fechaInscripcion,
      pagos: pagosFormateados,
      estado: estado
    };
  });

  let listado = inscripcionesConInfo;
  if (nombreAlumno) {
    const aux = nombreAlumno.toLowerCase();
    listado = listado.filter(i => i.alumno?.nombre.toLowerCase().includes(aux));
  }
  if (nombreCurso) {
    const aux = nombreCurso.toLowerCase();
    listado = listado.filter(i => i.curso?.nombre.toLowerCase().includes(aux));
  }

  if (isApi(req)) {
    return res.status(200).json(listado);
  } else {
    res.render('inscripciones/listado', {
      inscripciones: listado,
      alumnos,
      cursos,
      cursosDisponibles: coursesService.getVacancyCourses() || [],
      nombreAlumno,
      nombreCurso
    });
  }
};

// Crear una nueva inscripción
const crearInscripcion = (req, res) => {
  const inscripciones = readFile(inscripcionesPath);
  const alumnos = readFile(alumnosPath);

  const { alumnoId, cursoId, monto, medio } = req.body;

  const alumno = alumnos.find(a => String(a.id) === String(alumnoId));
  if (!alumno) {
    return res.status(400).send('El alumno no existe');
  }

  let curso;
  try {
    curso = coursesService.getCourseById(cursoId);
  } catch (err) {
    return res.status(400).send('El curso no existe');
  }

  if (curso.cupo <= curso.alumnos.length) {
    return res.status(400).send('No hay cupos disponibles');
  }

  if (!monto || !medio) {
    return res.status(400).send('Pago inicial obligatorio');
  }

  if (curso.alumnos.includes(Number(alumnoId))) {
    return res.status(400).send('El alumno ya está inscripto');
  }

  const nuevaInscripcion = new Inscripcion(alumnoId, cursoId, monto, medio);

  inscripciones.push(nuevaInscripcion);
  writeFile(inscripciones, inscripcionesPath);

  try {
    coursesService.addAlumns(cursoId, [Number(alumnoId)]);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  isApi(req)
    ? res.status(201).json({ message: 'Inscripción creada', inscripcion: nuevaInscripcion })
    : res.redirect('/inscripciones');
};

// GET Editar inscripción
const goToeditarInscripcion = (req, res) => {
  const { id } = req.params;
  const inscripciones = readFile(inscripcionesPath);
  const alumnos = readFile(alumnosPath);

  const inscripcion = inscripciones.find(i => String(i.id) === String(id));
  if (!inscripcion) {
    return res.status(404).send('Inscripción no encontrada');
  }

  // Cursos con cupo disponible
  const cursosDisponibles = coursesService.getVacancyCourses() || [];

  res.render('inscripciones/editar', {
    inscripcion,
    alumnos,
    cursosDisponibles
  });
};

// PUT Editar inscripción
const editarInscripcion = (req, res) => {
  const { id } = req.params;
  const { alumnoId: nuevoAlumnoId, cursoId: nuevoCursoId } = req.body;
  const inscripciones = readFile(inscripcionesPath);

  const idx = inscripciones.findIndex(i => String(i.id) === String(id));
  if (idx === -1) {
    return res.status(404).send('Inscripción no encontrada');
  }
  const original = inscripciones[idx];
  const antiguoAlumnoId = String(original.alumnoId);
  const antiguoCursoId = String(original.cursoId);

  original.alumnoId = Number(nuevoAlumnoId);
  original.cursoId = nuevoCursoId;
  writeFile(inscripciones, inscripcionesPath);

  // Se debe eliminar al alumno antiguo del curso antiguo (si hay cambio de alumno o curso)
  if (antiguoAlumnoId !== String(nuevoAlumnoId) || antiguoCursoId !== String(nuevoCursoId)) {
    try {
      coursesService.removeAlumns(antiguoCursoId, antiguoAlumnoId);
    } catch (err) {
      console.error('No pude quitar alumno antiguo:', err.message);
    }
  }

  // Se debe agregar al nuevo alumno al nuevo curso (si hay cambio de alumno o curso)
  if (antiguoAlumnoId !== String(nuevoAlumnoId) || antiguoCursoId !== String(nuevoCursoId)) {
    try {
      coursesService.addAlumns(nuevoCursoId, [Number(nuevoAlumnoId)]);
    } catch (err) {
      console.error('No pude añadir alumno nuevo:', err.message);
    }
  }
  isApi(req)
    ? res.status(200).send(original)
    : res.redirect('/inscripciones');
};

//Para pagos
// GET para agregar pago
const goToAgregarPago = (req, res) => {
  const { id } = req.params;
  const inscripciones = readFile(inscripcionesPath);
  const inscripcion = inscripciones.find(i => String(i.id) === String(id));
  if (!inscripcion) {
    return res.status(404).send('Inscripción no encontrada');
  }
  isApi(req)
    ? res.status(200).send(inscripcion)
    : res.render('inscripciones/nuevoPago', { inscripcion });
};

// POST que registra el pago
const agregarPago = (req, res) => {
  const { id } = req.params;
  const { monto, medio } = req.body;
  const inscripciones = readFile(inscripcionesPath);

  const idx = inscripciones.findIndex(i => String(i.id) === String(id));
  if (idx === -1) {
    return res.status(404).send('Inscripción no encontrada');
  }
  if (!monto || !medio) {
    return res.status(400).send('Monto y medio de pago son obligatorios');
  }

  // Insertar nuevo pago con fecha del sistema
  const insc = inscripciones[idx];
  insc.pagos = insc.pagos || [];
  insc.pagos.push({
    monto: Number(monto),
    medio,
    fecha_pago: new Date().toISOString().slice(0, 10)
  });

  insc.estado = 'activo';

  writeFile(inscripciones, inscripcionesPath);
  isApi(req)
    ? res.status(200).send(insc)
    : res.redirect('/inscripciones');
};

// DELETE eliminar inscripción
const eliminarInscripcion = (req, res) => {
  const { id } = req.params;
  const inscripciones = readFile(inscripcionesPath);

  const index = inscripciones.findIndex(i => String(i.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const eliminada = inscripciones.splice(index, 1)[0];
  writeFile(inscripciones, inscripcionesPath);
  try {
    coursesService.removeAlumns(eliminada.cursoId, eliminada.alumnoId);
  } catch (err) {
    console.error('Error al remover alumno del curso:', err.message);
  }

  isApi(req)
    ? res.status(200).send({ mensaje: 'Inscripción eliminada', eliminada })
    : res.redirect('/inscripciones');
};

module.exports = {
  getAllInscripciones,
  crearInscripcion,
  goToeditarInscripcion,
  editarInscripcion,
  goToAgregarPago,
  agregarPago,
  eliminarInscripcion
};