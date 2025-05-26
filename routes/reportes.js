// ROUTER: /report

const express = require("express");
const router = express.Router();
const { reportCursosDisponibles } = require("../controller/report.controller");

router.get("/cursos-disponibles", reportCursosDisponibles);

module.exports = router;

