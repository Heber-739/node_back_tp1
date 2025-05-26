// REPORT.CONTROLLER

const { coursesService } = require("../services/courses.service");
const { getCoursesWithAvailableSlots } = require("../services/report.service");

const reportCursosDisponibles = (req, res) => {
    const cursos = getCoursesWithAvailableSlots();
    res.render("reportes/cursos-disponibles", { cursos }); // ⬅️ Acá se llama al archivo .pug
};

module.exports = {
    reportCursosDisponibles,
};
