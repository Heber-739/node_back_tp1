const express = require("express");
const verifyToken = require("../middlewares/verifyToken"); // Middleware para verificar el token

const router = express.Router();
const { newDictation, goToAddAssists, registerDictation, goToRecords } = require("../controller/assists.controller");

// Middleware global para este router
router.use(verifyToken); // Verifica el token en todas las rutas de este router 

router.get("/new-dictation", newDictation);
router.post("/addAssists", goToAddAssists);
router.post("/register", registerDictation);
router.get("/attendence-records", goToRecords);


module.exports = router;
