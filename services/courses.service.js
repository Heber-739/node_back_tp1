const Course = require('../models/Course.model');

class CoursesService {

  getAllCourses = async () => {
    return await Course.find().lean();
  };

  getActiveCourses = async () => {
    return await Course.find({ estado: 'activa' }).lean();
  };

  addCourse = async (course) => {
    const nuevo = new Course(course);
    return await nuevo.save();
  }

  updateCourse = async (updatedCourse) => {
    const course = await Course.findById(updatedCourse._id);
    if (!course) throw new Error("Curso no encontrado");

    Object.assign(course, updatedCourse);
    return await course.save();
  };

  getCourseById = async (id) => {
    const course = await Course.findById(id).lean();
    if (!course) throw new Error("Curso no encontrado");
    return course;
  };

  addDictation = async (courseId, fecha, alumns) => {

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Curso no encontrado");

    const fechaDate = new Date(fecha);
    if (course.dictados?.some(d => new Date(d.fecha).toDateString() === fechaDate.toDateString())) {
      return;
    }

    course.dictados.unshift({ fecha: fechaDate, asistencias: alumns });
    await course.save();
  }
};

addAlumns = async (courseId, alumnArray) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Curso no encontrado");

  if (course.alumnos.length >= course.cupo) {
    throw new Error("Cupo lleno");
  }

  const nuevos = alumnArray.filter((a) => !course.alumnos.includes(a));
  course.alumnos.push(...nuevos);
  await course.save();
};

addCourseAttendence = async (courseId, fecha, alumnos) => {
  await this.addDictation(courseId, fecha, alumnos);
  await this.addAlumns(courseId, alumnos);
}

getAlumnsByCourse = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  return course?.alumnos || [];
};

getQuotaByCourse = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  return course?.cupo;
};

getFullCourses = async () => {
  return await Course.find({
    estado: 'activa',
    $expr: { $eq: [{ $size: "$alumnos" }, "$cupo"] }
  }).lean();
};

getVacancyCourses = async () => {
  return await Course.find({
    estado: 'activa',
    $expr: { $lt: [{ $size: "$alumnos" }, "$cupo"] }
  }).lean();
}

getCoursesByAlumnId = async (id) => {
  return await Course.find({ alumnos: id }).lean();
};

getCoursesByDateDictation = async (date) => {
  const fecha = new Date(date).toDateString();
  const allCourses = await Course.find().lean();

  const coursesResult = allCourses.filter((c) =>
    c?.dictados?.some(d => new Date(d.fecha).toDateString() === fecha)
  );
  return coursesResult;
};

removeAlumns = async (courseId, alumnId) => {

  const course = await Course.findById(courseId);
  if (!course) throw new Error("Curso no encontrado");

  const antes = course.alumnos.length;
  course.alumnos = course.alumnos.filter(a => String(a) !== String(alumnId));

  if (course.alumnos.length === antes) {
    throw new Error("El alumno no estaba inscrito en este curso");
  }

  await course.save();
};

const coursesService = new CoursesService();

module.exports = {
  coursesService,
};
