// ROUTER: /report
const express = require("express");
const router = express.Router();
const { reportCursosDisponibles, reportCursosCompletos, reportAlumnosPorCurso } = require("../controller/report.controller");
const verifyToken = require("../middlewares/verifyToken"); // Middleware to verify the token

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 


router.get("/cursos-disponibles", reportCursosDisponibles);
router.get("/cursos-completos", reportCursosCompletos);
router.get("/alumnos-por-curso", reportAlumnosPorCurso);



module.exports = router;

