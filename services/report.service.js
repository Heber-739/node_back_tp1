// REPORT.SERVICE

const { all } = require("../routes/reportes");
const { coursesService } = require("./courses.service");

const getCoursesWithAvailableSlots = () => {
  const allCourses = coursesService.getVacancyCourses();
  return allCourses;
};

module.exports = {
  getCoursesWithAvailableSlots,
};
