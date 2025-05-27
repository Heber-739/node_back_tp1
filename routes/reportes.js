// ROUTER: /report

const express = require("express");
const router = express.Router();
const { reportCursosDisponibles, reportCursosCompletos, reportAlumnosPorCurso } = require("../controller/report.controller");


router.get("/cursos-disponibles", reportCursosDisponibles);
router.get("/cursos-completos", reportCursosCompletos);
router.get("/alumnos-por-curso", reportAlumnosPorCurso);



module.exports = router;

