const express = require("express");
const verifyToken = require("../middlewares/verifyToken"); // Middleware para verificar el token
const checkRole = require('../middlewares/checkRole');

const router = express.Router();
const { newDictation, goToAddAssists, registerDictation, goToRecords } = require("../controller/assists.controller");

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 

// Rutas con control de acceso por rol
router.get("/new-dictation", checkRole('admin', 'profesor'), newDictation);
router.post("/addAssists", checkRole('admin', 'profesor'), goToAddAssists);
router.post("/register", checkRole('admin', 'profesor'), registerDictation);
router.get("/attendence-records", checkRole('admin', 'profesor'), goToRecords);

module.exports = router;
