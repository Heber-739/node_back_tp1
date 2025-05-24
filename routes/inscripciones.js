const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const inscripcionesPath = path.join(__dirname, '../data/inscripciones.json');
const cursosPath = path.join(__dirname, '../data/courses.json');
const alumnosPath = path.join(__dirname, '../data/alumnos.json');

// Funciones para leer y escribir datos
const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8'));
const escribirDatos = (ruta, datos) =>
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

const decrementarCupoCurso = (cursoId) => {
  const cursosData = leerDatos(cursosPath);
  const curso = cursosData.courses.find(c => String(c.id) === String(cursoId));

  if (curso) {
    curso.cupo -= 1;
    escribirDatos(cursosPath, cursosData);
  }
};


// GET todas las inscripciones
router.get('/', (req, res) => {
  const inscripciones = leerDatos(inscripcionesPath);
  const cursosData = leerDatos(cursosPath);
  const cursos = cursosData.courses;
  const alumnos = leerDatos(alumnosPath);

  const cursosDisponibles = cursos;

  const inscripcionesConInfo = inscripciones.map(insc => {
    const alumno = alumnos.find(a => String(a.id) === String(insc.alumnoId));
    const curso = cursos.find(c => String(c.id) === String(insc.cursoId));


        // Formatear fecha de inscripción
  const fechaFormateada = insc.fecha_inscripcion
    ? new Date(insc.fecha_inscripcion).toLocaleDateString('es-AR')
    : 'Sin fecha';

  // Formatear fechas de pagos
  const pagosFormateados = (insc.pagos || []).map(pago => ({
    ...pago,
    fecha_pago: new Date(pago.fecha_pago).toLocaleDateString('es-AR')



  }));
    return {
      ...insc,
    alumno: alumno ? { id: alumno.id, nombre: alumno.nombre, apellido: alumno.apellido } : null,
    curso: curso ? { id: curso.id, nombre: curso.nombre } : null,
    fecha_inscripcion: fechaFormateada,
    pagos: pagosFormateados

    };
  });

  res.render('inscripciones/listado', {
    inscripciones: inscripcionesConInfo,
    alumnos,
    cursos: cursosDisponibles
  });
});

// POST Crear nueva inscripción
router.post('/', (req, res) => {
  const inscripciones = leerDatos(inscripcionesPath);
  const alumnos = leerDatos(alumnosPath);
  const cursosData = leerDatos(cursosPath);
  const cursos = cursosData.courses;

  const { alumnoId, cursoId, pagos } = req.body;

  const alumno = alumnos.find(a => String(a.id) === String(alumnoId));
  const curso = cursos.find(c => String(c.id) === String(cursoId));

  if (!alumno) {
    return res.status(400).send('El alumno no existe');
  }

  if (!curso) {
    return res.status(400).send('El curso no existe');
  }

  let pagosNuevo = [];
  if (req.body.monto && req.body.medio) {
    pagosNuevo.push({
      monto: Number(req.body.monto),
      fecha_pago: new Date().toISOString().split('T')[0],
      medio: req.body.medio
    });
  }

  const nuevaInscripcion = {
    id: inscripciones.length ? inscripciones[inscripciones.length - 1].id + 1 : 1,
    alumnoId: Number(alumnoId),
    cursoId: cursoId,
    fecha_inscripcion: new Date().toISOString().slice(0, 10),
    estado: "activo",
    pagos: pagosNuevo

  };


  // Agregar la inscripción
  inscripciones.push(nuevaInscripcion);
  escribirDatos(inscripcionesPath, inscripciones);

  // Actualizar cupos del curso
  decrementarCupoCurso(cursoId)

  res.redirect('/inscripciones');
});


// DELETE eliminar una inscripción
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let inscripciones = leerDatos(inscripcionesPath);

  const index = inscripciones.findIndex(i => String(i.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const eliminada = inscripciones.splice(index, 1)[0];
  escribirDatos(inscripcionesPath, inscripciones);

  res.redirect('/inscripciones');
});

module.exports = router;
