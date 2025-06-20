const Inscripcion = require('../models/Inscripcion.model');
const Alumno = require('../models/Alumno.model');
const Course = require('../models/Course.model');
const { coursesService } = require('../services/courses.service');

const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

//Obtener todas las inscripciones
const getAllInscripciones = async (req, res) => {
  try {
    const { nombreAlumno = '', nombreCurso = '' } = req.query;

    let inscripciones = await Inscripcion.find()
      .populate('alumnoId')
      .populate('cursoId')
      .lean();

    inscripciones = inscripciones.map(insc => {
      const alumno = insc.alumnoId;
      const curso = insc.cursoId;

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
        alumno: alumno ? { id: alumno._id, nombre: alumno.nombre, apellido: alumno.apellido } : null,
        curso: curso ? { id: curso._id, nombre: curso.nombre } : null,
        fecha_inscripcion: fechaInscripcion,
        pagos: pagosFormateados,
        estado: estado
      };
    });

    if (nombreAlumno) {
      const aux = nombreAlumno.toLowerCase();
      inscripciones = inscripciones.filter(i => i.alumno && i.alumno.nombre && i.alumno.nombre.toLowerCase().includes(aux));
    }
    if (nombreCurso) {
      const aux = nombreCurso.toLowerCase();
      inscripciones = inscripciones.filter(i => i.curso && i.curso.nombre && i.curso.nombre.toLowerCase().includes(aux));
    }

    if (isApi(req)) {
      return res.status(200).json(inscripciones);
    } else {
      const alumnos = await Alumno.find().lean();
      const cursos = await coursesService.getAllCourses();
      const cursosDisponibles = await coursesService.getVacancyCourses();
      return res.render('inscripciones/listado', {
        inscripciones,
        alumnos,
        cursos,
        cursosDisponibles,
        nombreAlumno,
        nombreCurso
      });
    }
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Crear una nueva inscripción
const crearInscripcion = async (req, res) => {
  try {
    const { alumnoId, cursoId, monto, medio } = req.body;

    const alumno = await Alumno.findById(alumnoId);
    const curso = await coursesService.getCourseById(cursoId);

    if (!alumno || !curso) {
      return res.status(400).send('Alumno o curso no válido');
    }

    if (curso.alumnos.includes(alumnoId)) {
      return res.status(400).send('El alumno ya está inscripto');
    }

    if (curso.alumnos.length >= curso.cupo) {
      return res.status(400).send('No hay cupos disponibles');
    }

    if (!monto || !medio) {
      return res.status(400).send('Pago inicial obligatorio');
    }

    const nuevaInscripcion = new Inscripcion({
      alumnoId,
      cursoId,
      pagos: [{
        monto: Number(monto),
        medio,
        fecha_pago: new Date().toISOString().slice(0, 10)
      }]
    });

    await nuevaInscripcion.save();
    await coursesService.addAlumns(cursoId, [alumnoId]);

    isApi(req)
      ? res.status(201).json({ message: 'Inscripción creada', inscripcion: nuevaInscripcion })
      : res.redirect('/inscripciones');
  } catch (error) {
    console.error("Error al crear inscripción:", error);
    res.status(500).send("Error interno al crear inscripción");
  }
};

// GET Editar inscripción
const goToeditarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findById(id).lean();
    const alumnos = await Alumno.find().lean();
    const cursosDisponibles = await coursesService.getVacancyCourses();
    if (!inscripcion)
      return res.status(404).send("Inscripción no encontrada");

    res.render('inscripciones/editar', { inscripcion, alumnos, cursosDisponibles });
  } catch (error) {
    res.status(500).send("Error interno al cargar edición");
  }
};

// PUT Editar inscripción
const editarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { alumnoId, cursoId } = req.body;

    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) return res.status(404).send("Inscripción no encontrada");

    const cursoCambio = String(inscripcion.cursoId) !== String(cursoId);
    const alumnoCambio = String(inscripcion.alumnoId) !== String(alumnoId);

    if (cursoCambio || alumnoCambio) {
      await coursesService.removeAlumns(inscripcion.cursoId, inscripcion.alumnoId);
      await coursesService.addAlumns(cursoId, [alumnoId]);
    }

    inscripcion.alumnoId = alumnoId;
    inscripcion.cursoId = cursoId;
    await inscripcion.save();

    return isApi(req)
      ? res.status(200).json(inscripcion)
      : res.redirect('/inscripciones');

  } catch (error) {
    console.error("Error al editar inscripción:", error);
    res.status(500).send("Error al editar inscripción");
  }
};

//Para pagos
// GET para agregar pago
const goToAgregarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findById(id).lean();

    if (!inscripcion) return res.status(404).send("Inscripción no encontrada");

    isApi(req)
      ? res.status(200).send(inscripcion)
      : res.render('inscripciones/nuevoPago', { inscripcion });

  } catch (error) {
    res.status(500).send("Error al buscar inscripción");
  }
};

// POST que registra el pago
const agregarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, medio } = req.body;

    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion)
      return res.status(404).send("Inscripción no encontrada");

    if (!monto || !medio)
      return res.status(400).send("Monto y medio de pago son obligatorios");


    inscripcion.pagos.push({
      monto: Number(monto),
      medio,
      fecha_pago: new Date().toISOString().slice(0, 10)
    });

    inscripcion.estado = 'activo';
    await inscripcion.save();

    isApi(req)
      ? res.status(200).json(inscripcion)
      : res.redirect('/inscripciones');
  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).send("Error al registrar pago");
  }
};

// DELETE eliminar inscripción
const eliminarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findByIdAndDelete(id);

    if (!inscripcion) return res.status(404).send("Inscripción no encontrada");

    await coursesService.removeAlumns(inscripcion.cursoId, inscripcion.alumnoId);

    isApi(req)
      ? res.status(200).send({ mensaje: 'Inscripción eliminada', inscripcion })
      : res.redirect('/inscripciones');
  } catch (error) {
    res.status(500).send("Error al eliminar inscripción");
  }
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