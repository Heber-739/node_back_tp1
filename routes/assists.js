const express = require("express");
const router = express.Router();
const { newDictation, goToAddAssists, registerDictation, goToRecords } = require("../controller/assists.controller");

router.get("/new-dictation", newDictation);
router.post("/addAssists", goToAddAssists);
router.post("/register", registerDictation);
router.get("/attendence-records", goToRecords);


module.exports = router;
