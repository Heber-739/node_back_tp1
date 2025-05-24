const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  goToEditCourseById,
  getCourseById,
  newCourse,
  updateCourseById,
  deleteCourseById,
} = require("../controller/cursos.controller");

// Get all courses whitout dictation
router.get("/", getAllCourses);

// Get curso por ID
router.get("/:id", getCourseById);

// Go to page for edit course
router.get("/edit/:id", goToEditCourseById);

// Create new course
router.post("/new", newCourse);

// Update course data
router.put("/:id", updateCourseById);

// Delete a course
router.delete("/:id", deleteCourseById);

module.exports = router;
