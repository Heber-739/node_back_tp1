// REPORT.CONTROLLER

const { coursesService } = require("../services/courses.service");
const { alumnsService } = require("../services/alumns.service");


const reportCursosDisponibles = (req, res) => {
    const cursos = coursesService.getVacancyCourses();
    res.render("reportes/cursos-disponibles", { cursos });
};

const reportCursosCompletos = (req, res) => {
    const cursos = coursesService.getFullCourses();
    res.render("reportes/cursos-completos", { cursos });
};

const reportAlumnosPorCurso = (req, res) => {
    const cursoId = req.query.cursoId;
    const cursos = coursesService.getAllCourses(); // todos los cursos
    const alumnos = alumnsService.getAllAlumns();  // todos los alumnos

    if (!cursoId) {
        return res.render("reportes/alumnos-por-curso", {
            cursos,
            curso: null,
            alumnos: []
        });
    }

    try {
        // const curso = coursesService.getCourseById(cursoId);
        // if (!curso) throw new Error("Curso no encontrado");

        // // IDs de alumnos inscritos
        // const alumnosIds = curso.alumnos;

        // // Filtrar alumnos completos por IDs
        // const alumnosDelCurso = alumnos.filter(a => alumnosIds.includes(a.id));
        const curso = coursesService.getCourseById(cursoId);
        if (!curso) throw new Error("Curso no encontrado");

        // IDs de alumnos inscritos
        const alumnosIds = curso.alumnos;

        // Filtrar alumnos completos por IDs
        let alumnosDelCurso = alumnos.filter(a => alumnosIds.includes(a.id));

        // Agregar asistencias a cada alumno
        alumnosDelCurso = alumnosDelCurso.map(alumno => {
            // Contar cuántas veces aparece el ID del alumno en los dictados
            const asistencias = (curso.dictados || []).filter(d => 
                d.asistencias && d.asistencias.includes(alumno.id)
            ).length;

            return {
                ...alumno,
                asistencias
            };
        });


        res.render("reportes/alumnos-por-curso", {
            cursos,
            curso,
            alumnos: alumnosDelCurso
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
};






module.exports = {
    reportCursosDisponibles,
    reportCursosCompletos,
    reportAlumnosPorCurso
};
