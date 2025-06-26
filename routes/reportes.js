// ROUTER: /report
const express = require("express");
const router = express.Router();
const { reportCursosDisponibles, reportCursosCompletos, reportAlumnosPorCurso } = require("../controller/report.controller");
const verifyToken = require("../middlewares/verifyToken"); // Middleware to verify the token
const checkRole = require('../middlewares/checkRole');

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 

// Rutas con permisos para admin, usuario y profesor
router.get("/cursos-disponibles", checkRole('admin', 'usuario', 'profesor'), reportCursosDisponibles);
router.get("/cursos-completos", checkRole('admin', 'usuario', 'profesor'), reportCursosCompletos);
router.get("/alumnos-por-curso", checkRole('admin', 'usuario', 'profesor'), reportAlumnosPorCurso);


module.exports = router;

