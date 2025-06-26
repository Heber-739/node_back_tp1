const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken"); // Middleware to verify the token
const checkRole = require('../middlewares/checkRole');

// Middleware global for this router
router.use(verifyToken); // Verifies the token in all routes of this router

const {
  getAllCourses,
  goToEditCourseById,
  getCourseById,
  newCourse,
  updateCourseById,
  deleteCourseById,
} = require("../controller/courses.controller");

// Rutas con permisos para admin, usuario y profesor
router.get("/", checkRole('admin', 'usuario', 'profesor'), getAllCourses);
router.get("/edit/:id", checkRole('admin', 'usuario'), goToEditCourseById);
router.get("/:id", checkRole('admin', 'usuario', 'profesor'), getCourseById);
router.post("/new", checkRole('admin', 'usuario'), newCourse);
router.put("/:id", checkRole('admin', 'usuario'), updateCourseById);
router.delete("/:id", checkRole('admin', 'usuario'), deleteCourseById);

module.exports = router;
