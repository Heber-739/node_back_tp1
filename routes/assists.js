const express = require("express");
const router = express.Router();
const { newDictation, goToAddAssists, registerDictation } = require("../controller/assists.controller");

// const {
//   getAllCourses,
//   goToEditCourseById,
//   getCourseById,
//   newCourse,
//   updateCourseById,
//   deleteCourseById,
// } = require("../controller/courses.controller");

// Get all courses whitout dictation
// router.get("/", getAllCourses);

// // Get curso por ID
// router.get("/:id", getCourseById);

// // Go to page for edit course
// router.get("/edit/:id", goToEditCourseById);

// Create new course
router.get("/new-dictation", newDictation);
router.post("/addAssists", goToAddAssists);
router.post("/register", registerDictation);

// // Update course data
// router.put("/:id", updateCourseById);

// // Delete a course
// router.delete("/:id", deleteCourseById);

module.exports = router;
