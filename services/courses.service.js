const { readFile, writeFile } = require("./data.service");

const COURSES_FILE = require("path").join(__dirname, "../data/courses.json");

class CoursesService {

  getAllCourses = () => {
    const data = readFile(COURSES_FILE);
    return (
      data?.courses?.map((course) => {
        delete course?.dictados;
        return course;
      }) || []
    );
  };

  addCourse = (curse) => {
    let courses = this.getAllCourses()
    courses.unshift(curse);
    writeFile({courses},COURSES_FILE)
  }

  updateCourse = (course) => {
    const data = readFile(COURSES_FILE);
    const index = data?.courses?.findIndex((c) => c.id === course.id);
    if (index === -1) {
      throw new Error("Curso no encontrado");
    }
    data.courses[index] = course;
    writeFile(data,COURSES_FILE);
  };

  getCourseById = (id) => {
    const data = readFile(COURSES_FILE);
    const course = data?.courses?.find((c) => c.id === id);
    if (!course) {
      throw new Error("");
    }

    // TODO agregar la logica para obtener el nombre del profesor
    return course;
  };

  addDictation = (courseId, fecha) => {
    let course = this.getCourseById(courseId);
    if(course.dictados.some(d => new Date(d?.fecha) === new Date(fecha))){
        return;
    }
    course.dictados?.unshift({ fecha, asistencias: [] });
    this.updateCourse(course);
  };

  addAlumns = (courseId, alumnArray) => {
    let course = this.getCourseById(courseId);
    if(course.cupo == course.alumnos.length){
        throw new Error("Cupo lleno");
        
    }
    alumnArray = alumnArray.filter((a)=> !course.alumnos.includes(a))
    course.alumnos.push(...alumnArray);
    this.updateCourse(course);
  };

  addCourseAttendence = (courseId,fecha,alumnos)=>{
    this.addDictation(courseId,fecha);
    this.addAlumns(courseId,alumnos);
  }

  getAlumnsByCourse = (courseId) => {
    let course = this.getCourseById(courseId);
    return course.alumnos;
  };

  getQuotaByCourse = (courseId) => {
    let course = this.getCourseById(courseId);
    return course.cupo;
  };

  getFullCourses = () => {
    const courses = this.getAllCourses();
    const fullCourses = courses.filter((c) => c?.estado === "activa" && c?.cupo === c?.alumnos.length);
    return fullCourses || [];
  };

  getVacancyCourses = () => {
    const courses = this.getAllCourses();
    const vacancyCourses = courses.filter((c) => c?.estado === "activa" && c?.cupo > c?.alumnos.length);
    return vacancyCourses || [];
  }

  getCoursesByAlumnId = (id) => {
    const allCourses = this.getAllCourses();
    const coursesResult = allCourses.filter((c) => c?.alumnos?.includes(id));
    return coursesResult || [];
  };

  getCoursesByDateDictation = (date) => {
    const allCourses = this.getAllCourses();
    const coursesResult = allCourses.filter((c) =>
      c?.dictados?.find((d) => new Date(d.fecha) === new Date(date))
    );
    return coursesResult;
  };

removeAlumns = (courseId, alumnId) => {

    const data = readFile(COURSES_FILE);
    if (!data || !Array.isArray(data.courses)) {
      throw new Error('Formato de courses.json inválido');
    }

    const idx = data.courses.findIndex(c => c.id === courseId);
    if (idx === -1) {
      throw new Error('Curso no encontrado');
    }
    const course = data.courses[idx];
    const inscritosAntes = Array.isArray(course.alumnos) ? course.alumnos.length : 0;
    course.alumnos = (course.alumnos || []).filter(a => String(a) !== String(alumnId));
    if (course.alumnos.length === inscritosAntes) {
      throw new Error('El alumno no estaba inscrito en este curso');
    }

    data.courses[idx] = course;
    writeFile(data, COURSES_FILE);
  };
  
}
const coursesService = new CoursesService();

module.exports = {
  coursesService,
};
