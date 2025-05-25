const { readFile, writeFile } = require("../services/data.service");
const { Course } = require("../models/course.class");
const { coursesService } = require("../services/courses.service");
const COURSES_FILE = require("path").join(__dirname, "../data/courses.json");

const USER_AGENT_API = ["Thunder Client", "Postman"]

const isApi = (req) => {
  const userAgent = req.get('User-Agent');
  return USER_AGENT_API.some(agent => {
    console.log(userAgent.includes(agent))
    return userAgent.includes(agent)
  });
};

const getAllCourses = (req, res) => {
  try {
    const response = coursesService.getAllCoursesForViewOnly();
    isApi(req) ? res.status(200).send(response) 
    : res.render("courses/list", { response });
  } catch (error) {
    res.status(500).send("No se pudieron obtener los courses");
  }
};

const getCourseById = (req, res) => {
  try {
    const course = coursesService.getCourseById(req.params.id);

    // TODO agregar la logica para obtener el nombre del profesor
    if (!course) return res.status(404).send("Curso no encontrado");
    isApi(req) ? res.status(200).send(course)
    : res.render("courses/details", { course }) ;
  } catch (error) {
    res.status(500).send("Error al buscar el curso");
  }
};

const goToEditCourseById = (req, res) => {
  try {
    
    const course = coursesService.getCourseById(req.params.id);
    if (!course) {
      res.status(404).send("Curso no encontrado");
    }
    isApi(req) ? res.status(200).send(course) 
    : res.render("courses/edit", { course });
  } catch (error) {
    res.status(500).send("No se pudieron obtener el curso");
  }
};

const newCourse = (req, res) => {
  try {
    const { profesor, nombre, horario, cupo, area, estado } = req.body;
    if (!profesor || !nombre || !horario || !cupo || !area || !estado) {
      res.status(400).send("Campos faltan para crear un nuevo curso");
    }
    const course = new Course(profesor, nombre, horario, Number(cupo), area, estado);
    coursesService.addCourse(course);
    isApi(req) ? res.status(200).send(course)
    : res.redirect("/courses");
  } catch (error) {
    console.error(error);
    res.status(500).send("No pudimos agregar el curso")
  }
  
};

const updateCourseById = (req,res) => {
  try {
    let course = coursesService.getCourseById(req.params.id)
    if (!course === -1) {
      return res.status(404).send("Curso no encontrado");
    }
    course = {
      ...course,
      profesor: req.body.profesor,
      nombre: req.body.nombre,
      horario: req.body.horario,
      cupo: Number(req.body.cupo),
      area: req.body.area,
      estado: req.body.estado,
    };
    coursesService.updateCourse(course)
    isApi(req) ? res.status(200).send(course)
    : res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.status(500);
  }

};

const deleteCourseById = (req,res) => {
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
