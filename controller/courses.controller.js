const { readFile, writeFile } = require("../services/data.service");
const { Course } = require("../models/course.class");
const { coursesService } = require("../services/courses.service");
const COURSES_FILE = require("path").join(__dirname, "../data/courses.json");


const getAllCourses = (req, res) => {
  try {
    const response = coursesService.getAllCourses();
    res.render("courses/lista", { response });
  } catch (error) {
    res.status(500).send("No se pudieron obtener los courses");
  }
};

const goToEditCourseById = (req, res) => {
  try {
    
    const course = coursesService.getCourseById(req.params.id);
    if (!course) {
      res.status(404).send("Curso no encontrado");
    }
    res.render("courses/editar", { course });
  } catch (error) {
    res.status(500).send("No se pudieron obtener el curso");
  }
};

const getCourseById = () => {
  try {
    const course = coursesService.getCourseById(req.params.id);

    // TODO agregar la logica para obtener el nombre del profesor
    if (!course) return res.status(404).send("Curso no encontrado");
    res.render("courses/detalle", { course });
  } catch (error) {
    res.status(500).send("Error al buscar el curso");
  }
};

const newCourse = () => {
  try {
    const { profesor, nombre, horario, cupo, area, estado } = req.body;
    if (!profesor || !nombre || !horario || !cupo || !area || !estado) {
      res.status(400).send("Campos faltan para crear un nuevo curso");
    }
    const course = new Course(profesor, nombre, horario, cupo, area, estado);
    const data = readFile(COURSES_FILE);
    data = data?.courses || { courses: [] };
    data.courses.push(course);
    writeFile(data, COURSES_FILE);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/courses");
};

const updateCourseById = () => {
  try {
    const course = coursesService.getCourseById()
    if (!course === -1) {
      return res.status(404).send("Curso no encontrado");
    }
    course = {
      ...course,
      profesor: req.body.profesor,
      nombre: req.body.nombre,
      horario: req.body.horario,
      cupo: req.body.cupo,
      area: req.body.area,
      estado: req.body.estado,
    };
    coursesService.updateCourse(course)
  } catch (err) {
    console.error(err);
    res.status(500);
  }

  res.redirect("/courses");
};

const deleteCourseById = () => {
  try {
    const data = readFile(COURSES_FILE);
    const id = req.params.id;
    const origin_length = data.courses.length;
    let courses = data.courses.filter((c) => c.id !== id);
    if (origin_length === courses.length)
      return res.status(404).send("Curso no encontrado");
    writeFile({ courses }, COURSES_FILE);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/courses");
};

module.exports = {
  getAllCourses,
  goToEditCourseById,
  getCourseById,
  newCourse,
  updateCourseById,
  deleteCourseById,
};
