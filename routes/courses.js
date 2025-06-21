const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken"); // Middleware to verify the token

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

// Get all courses whitout dictation
router.get("/", getAllCourses);

// Go to page for edit course
router.get("/edit/:id", goToEditCourseById);

// Get curso por ID
router.get("/:id", getCourseById);

// Create new course
router.post("/new", newCourse);

// Update course data
router.put("/:id", updateCourseById);

// Delete a course
router.delete("/:id", deleteCourseById);

module.exports = router;
