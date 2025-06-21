const mongoose = require("mongoose");
const { coursesService } = require("../services/courses.service");
const Inscripcion = require("../models/inscripcion.model");

const reportCursosDisponibles = async (req, res) => {
    try {
        const cursos = await coursesService.getVacancyCourses();
        res.render("reportes/cursos-disponibles", { cursos });
    } catch (error) {
        res.status(500).send("Error al obtener cursos disponibles");
    }
};

const reportCursosCompletos = async (req, res) => {
    try {
        const cursos = await coursesService.getFullCourses();
        res.render("reportes/cursos-completos", { cursos });
    } catch (error) {
        return res.status(500).send("Error al obtener cursos completos");
    }
}

const reportAlumnosPorCurso = async (req, res) => {
  const cursoId = req.query.cursoId;

  try {
    const cursos = await coursesService.getAllCourses();

    if (!cursoId || !mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.render("reportes/alumnos-por-curso", {
        cursos,
        curso: null,
        alumnos: []
      });
    }

    const curso = await coursesService.getCourseById(cursoId);
    if (!curso) throw new Error("Curso no encontrado");

    const inscripciones = await Inscripcion.find({ cursoId })
      .populate("alumnoId")
      .lean();

    const alumnosDelCurso = inscripciones.map(insc => ({
      nombre: insc.alumnoId?.nombre,
      apellido: insc.alumnoId?.apellido,
      email: insc.alumnoId?.email,
      fechaInscripcion: insc.fecha_inscripcion
    }));

    res.render("reportes/alumnos-por-curso", {
      cursos,
      curso,
      alumnos: alumnosDelCurso
    });
  } catch (error) {
    console.error("Error en reporte alumnos por curso:", error);
    res.status(500).send(error.message);
  }
};

module.exports = {
    reportCursosDisponibles,
    reportCursosCompletos,
    reportAlumnosPorCurso
};