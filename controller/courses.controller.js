const Course = require("../models/Course.model");
const { getAllProfesores } = require("../services/profesores.service");

const USER_AGENT_API = ["Thunder Client", "Postman"]

const isApi = (req) => {
  const userAgent = req.get('User-Agent');
  return USER_AGENT_API.some(agent => userAgent.includes(agent));
};

const getAllCourses = async (req, res) => {
  try {
    const { nombreCurso = '', nombreProfesor = '' } = req.query;

    let query = {};

    if (nombreCurso) {
      query.nombre = { $regex: nombreCurso, $options: "i" };
    }

    const courses = await Course.find(query).lean();
    const profesores = await getAllProfesores();

    let response = courses.map((course) => {
      const prof = profesores.find(
        (p) => String(p._id) === String(course.profesor)
      );
      return {
        ...course,
        profesorNombre: prof
          ? `${prof.apellido} ${prof.nombre}`
          : "Sin asignar",
      };
    });

    if (nombreProfesor) {
      const term = nombreProfesor.toLowerCase();
      response = response.filter((c) =>
        c.profesorNombre.toLowerCase().includes(term)
      );
    }

    isApi(req)
      ? res.status(200).json(response)
      : res.render("courses/list", {
        response,
        profesores,
        filtros: { nombreCurso, nombreProfesor },
      });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).send("No se pudieron obtener los cursos o profesores");
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    if (!course) return res.status(404).send("Curso no encontrado");
    isApi(req)
      ? res.status(200).json(course)
      : res.render("courses/details", { course });
  } catch (error) {
    res.status(500).send("Error al buscar el curso");
  }
};

const goToEditCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      return res.status(404).send("Curso no encontrado");
    }

    // Traer la lista de profesores
    const profesores = await getAllProfesores();

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


const newCourse = async (req, res) => {
  try {
    const { profesor, nombre, horario, cupo, area, estado } = req.body;
    if (!profesor || !nombre || !horario || !cupo || !area || !estado) {
      res.status(400).send("Campos faltan para crear un nuevo curso");
    }
    const course = new Course({
      profesor,
      nombre,
      horario,
      cupo: Number(cupo),
      area,
      estado,
    });

    await course.save();

    isApi(req) ? res.status(200).send(course)
      : res.redirect("/courses");
  } catch (error) {
    console.error(error);
    res.status(500).send("No pudimos agregar el curso")
  }

};

const updateCourseById = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      {
        profesor: req.body.profesor,
        nombre: req.body.nombre,
        horario: req.body.horario,
        cupo: Number(req.body.cupo),
        area: req.body.area,
        estado: req.body.estado,
      },
      { new: true }
    );
    if (!updated) return res.status(404).send("Curso no encontrado");

    isApi(req) ? res.status(200).send(updated)
      : res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("No se pudo actualizar el curso");
  }

};

const deleteCourseById = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Curso no encontrado");

    isApi(req) ? res.status(200).send("Curso eliminado con éxito")
      : res.redirect("/courses");

  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudo eliminar el curso");
  }

};

module.exports = {
  getAllCourses,
  goToEditCourseById,
  getCourseById,
  newCourse,
  updateCourseById,
  deleteCourseById,
};