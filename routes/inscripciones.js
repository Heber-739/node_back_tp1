const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { coursesService } = require('../services/courses.service');

const inscripcionesPath = path.join(__dirname, '../data/inscripciones.json');
const cursosPath = path.join(__dirname, '../data/courses.json');
const alumnosPath = path.join(__dirname, '../data/alumnos.json');

// Funciones para leer y escribir datos
const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8'));
const escribirDatos = (ruta, datos) =>
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

// Detectar si es un User-Agent de API
const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};


// GET todas las inscripciones
router.get('/', (req, res) => {
  const { nombreAlumno = '', nombreCurso = '' } = req.query;

  const inscripciones = leerDatos(inscripcionesPath);
  const alumnos = leerDatos(alumnosPath);
  const cursos = coursesService.getAllCourses();


  const inscripcionesConInfo = inscripciones.map(insc => {
    const alumno = alumnos.find(a => String(a.id) === String(insc.alumnoId));
    const curso = cursos.find(c => String(c.id) === String(insc.cursoId));

    // Formatear fechas
    const fechaInscripcion = new Date(insc.fecha_inscripcion).toLocaleDateString('es-AR');
    const pagosFormateados = (insc.pagos || []).map(pago => ({
      ...pago,
      fecha_pago: new Date(pago.fecha_pago).toLocaleDateString('es-AR')
    }));

    // Calcular estado
    let estado = "inactivo";
    if (insc.pagos?.length) {
      const ultimaFechaPago = new Date(insc.pagos[insc.pagos.length - 1].fecha_pago);
      const hoy = new Date();
      const diferencia = hoy - ultimaFechaPago;
      const dias = diferencia / (1000 * 60 * 60 * 24);
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

  // Filtrar por nombre de alumno
  if (nombreAlumno) {
    const aux = nombreAlumno.toLowerCase();
    listado = listado.filter(i =>
      i.alumno?.nombre.toLowerCase().includes(aux)
    );
  }


  // Filtro por nombre de curso
  if (nombreCurso) {
    const aux = nombreCurso.toLowerCase();
    listado = listado.filter(i =>
      i.curso?.nombre.toLowerCase().includes(aux)
    );
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

});

// POST Crear nueva inscripción
router.post('/', (req, res) => {
  const inscripciones = leerDatos(inscripcionesPath);
  const alumnos = leerDatos(alumnosPath);

  const { alumnoId, cursoId, monto, medio } = req.body;

  // Validar alumno
  const alumno = alumnos.find(a => String(a.id) === String(alumnoId));
  if (!alumno) {
    return res.status(400).send('El alumno no existe');
  }

  // Validar curso con el servicio
  let curso;
  try {
    curso = coursesService.getCourseById(cursoId);
  } catch (err) {
    return res.status(400).send('El curso no existe');
  }

  // Validar cupo con el servicio
  if (curso.cupo <= curso.alumnos.length) {
    return res.status(400).send('No hay cupos disponibles en el curso');
  }

  // Validar pago obligatorio
  if (!monto || !medio) {
    return res.status(400).send('El pago inicial es obligatorio');
  }

  // Validar que el alumno no esté ya inscripto
  if (curso.alumnos.includes(Number(alumnoId))) {
    return res.status(400).send('El alumno ya está inscripto en este curso.');
  }

  // Generar inscripción
  const nuevaInscripcion = {
    id: inscripciones.length ? inscripciones[inscripciones.length - 1].id + 1 : 1,
    alumnoId: Number(alumnoId),
    cursoId: cursoId,
    fecha_inscripcion: new Date().toISOString().split('T')[0],
    estado: "activo",
    pagos: [
      {
        monto: Number(monto),
        fecha_pago: new Date().toISOString().split('T')[0],
        medio: medio
      }
    ]
  };

  // Guardar inscripción
  inscripciones.push(nuevaInscripcion);
  escribirDatos(inscripcionesPath, inscripciones);

  try {
    coursesService.addAlumns(cursoId, [Number(alumnoId)]);
  } catch (err) {
    return res.status(400).send(err.message);
  }
  if (isApi(req)) {
    return res.status(201).json({
      message: 'Inscripción creada correctamente',
      inscripcion: nuevaInscripcion
    });
  } else {
    return res.redirect('/inscripciones');
  }
});

// GET Editar inscripción
router.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  const inscripciones = leerDatos(inscripcionesPath);
  const alumnos = leerDatos(alumnosPath);
  const cursos = coursesService.getAllCourses();

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
});

// PUT Editar inscripción
router.put('/editar/:id', (req, res) => {
  const { id } = req.params;
  const { alumnoId: nuevoAlumnoId, cursoId: nuevoCursoId } = req.body;
  const inscripciones = leerDatos(inscripcionesPath);

  const idx = inscripciones.findIndex(i => String(i.id) === String(id));
  if (idx === -1) {
    return res.status(404).send('Inscripción no encontrada');
  }
  const original = inscripciones[idx];
  const antiguoAlumnoId = String(original.alumnoId);
  const antiguoCursoId = String(original.cursoId);

  original.alumnoId = Number(nuevoAlumnoId);
  original.cursoId = nuevoCursoId;
  escribirDatos(inscripcionesPath, inscripciones);

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
});


//Para pagos
// GET form para agregar pago
router.get('/pago/:id', (req, res) => {
  const { id } = req.params;
  const inscripciones = leerDatos(inscripcionesPath);
  const inscripcion = inscripciones.find(i => String(i.id) === String(id));
  if (!inscripcion) {
    return res.status(404).send('Inscripción no encontrada');
  }
  isApi(req)
    ? res.status(200).send(inscripcion)
    : res.render('inscripciones/nuevoPago', { inscripcion });

});

// POST que registra el pago
router.post('/pago/:id', (req, res) => {
  const { id } = req.params;
  const { monto, medio } = req.body;
  const inscripciones = leerDatos(inscripcionesPath);

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

  escribirDatos(inscripcionesPath, inscripciones);
  isApi(req)
    ? res.status(200).send(insc)
    : res.redirect('/inscripciones');
});

// DELETE eliminar inscripción
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const inscripciones = leerDatos(inscripcionesPath);

  const index = inscripciones.findIndex(i => String(i.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const eliminada = inscripciones.splice(index, 1)[0];
  escribirDatos(inscripcionesPath, inscripciones);
  try {
    coursesService.removeAlumns(eliminada.cursoId, eliminada.alumnoId);
  } catch (err) {
    console.error('Error al remover alumno del curso:', err.message);
  }

  isApi(req)
    ? res.status(200).send({ mensaje: 'Inscripción eliminada', eliminada })
    : res.redirect('/inscripciones');
});

module.exports = router;
