const { readFile, writeFile } = require("../services/data.service");
const { Course } = require("../models/course.class");
const { coursesService } = require("../services/courses.service");
const { getAllProfesores } = require("../services/profesores.service");

const COURSES_FILE = require("path").join(__dirname, "../data/courses.json");

const USER_AGENT_API = ["Thunder Client", "Postman"]

const isApi = (req) => {
  const userAgent = req.get('User-Agent');
  return USER_AGENT_API.some(agent => userAgent.includes(agent));
};

const getAllCourses = (req, res) => {
  try {
    const { nombreCurso = '', nombreProfesor = '' } = req.query;
    let courses = coursesService.getAllCourses();
    const profesores = getAllProfesores();

    // Enriquecer cursos con el nombre completo del profe
    let response = courses.map(course => {
      // Buscar al profe con el mismo ID
      const prof = profesores.find(p => String(p.id) === String(course.profesor));
      return {
        ...course,
        profesorNombre: prof
          ? `${prof.apellido} ${prof.nombre}`
          : "Sin asignar"
      };
    });

    if (nombreCurso.trim()) {
      const term = nombreCurso.toLowerCase();
      response = response.filter(c =>
        c.nombre.toLowerCase().includes(term)
      );
    }
    if (nombreProfesor.trim()) {
      const term = nombreProfesor.toLowerCase();
      response = response.filter(c =>
        c.profesorNombre.toLowerCase().includes(term)
      );
    }

    isApi(req) ? res.status(200).send(response) 
    : res.render("courses/list", { response, profesores, filtros: { nombreCurso, nombreProfesor } });
  } catch (error) {
    console.error("Error en getAllCourses:", error);
    res.status(500).send("No se pudieron obtener los cursos o profesores");
  }
};

const getCourseById = (req, res) => {
  try {
    const course = coursesService.getCourseById(req.params.id);

    // TODO agregar la logica para obtener el nombre del profesor
    if (!course) return res.status(404).send("Curso no encontrado");
    isApi(req) ? res.status(200).send(course)
      : res.render("courses/details", { course });
  } catch (error) {
    res.status(500).send("Error al buscar el curso");
  }
};

const goToEditCourseById = (req, res) => {
  try {
    const id = req.params.id;
    const course = coursesService.getCourseById(id);
    if (!course) {
      return res.status(404).send("Curso no encontrado");
    }

    // Traer la lista de profesores
    const profesores = getAllProfesores();

    // Para API:
    if (isApi(req)) {
      return res.status(200).send({ course, profesores });
    }

    // Para render web:
    return res.render("courses/edit", { course, profesores });

  } catch (error) {
    console.error("Error al cargar edición de curso:", error);
    return res.status(500).send("No se pudieron obtener los datos para editar");
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

const updateCourseById = (req, res) => {
  try {    let course = coursesService.getCourseById(req.params.id)
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

const deleteCourseById = (req, res) => {
  try {
    const data = readFile(COURSES_FILE);
    const id = req.params.id;
    const origin_length = data.length;
    let courses = data.filter((c) => c.id !== id);
    if (origin_length === courses.length)
      return res.status(404).send("Curso no encontrado");
    writeFile( courses , COURSES_FILE);
  } catch (error) {
    console.error(error);
  }
  isApi(req) ? res.status(200).send("Curso eliminado con éxito")
      : res.redirect("/courses");
};

module.exports = {
  getAllCourses,
  goToEditCourseById,
  getCourseById,
  newCourse,
  updateCourseById,
  deleteCourseById,
};