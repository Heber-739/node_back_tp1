// const { readFile, writeFile } = require("../services/data.service");
// const { Course } = require("../models/course.class");
const alumnService = require("../services/alumns.service");
const { coursesService } = require("../services/courses.service");
// const COURSES_FILE = require("path").join(__dirname, "../data/courses.json");

const USER_AGENT_API = ["Thunder Client", "Postman"]

const dataState = {
  dictationData: {}
}

const isApi = (req) => {
  const userAgent = req.get('User-Agent');
  return USER_AGENT_API.some(agent => userAgent.includes(agent));
};

const newDictation = (req, res) => {
  const courses = coursesService.getActiveCourses();
  res.render("assists/new-dictation", { courses })
};

const goToAddAssists = (req, res) => {
  const {cursoId, fecha} = req.body;
  const alumns = coursesService.getAlumnsByCourse(cursoId);
  const alumnsData = alumnService.getAllAlumnsByIds(alumns)
  dataState.dictationData = { cursoId, fecha }

  res.render("assists/addAssists", { alumnsData })
};

const registerDictation = (req, res) => {
  const alumns = req.body.selected
  if(alumns.length == 0){
    res.redirect("assists/new-dictation")
  }
  const { cursoId, fecha } = dataState.dictationData;
  dataState.dictationData = {}
  coursesService.addDictation(cursoId, fecha, alumns)
  res.redirect("/assists/new-dictation");
};

const goToRecords = (req, res) => {
  let courses = coursesService.getAllCourses();
  courses = courses.map((c)=>{
     let dictados = c.dictados?.map((d)=>{
      let asistencias = alumnService.getAllAlumnsByIds(d.asistencias)
      return {...d, asistencias}
      })
      return {...c, dictados}
    })
    
  res.render("assists/records-home", {courses})
}

module.exports = {
  newDictation,
  goToAddAssists,
  registerDictation,
  goToRecords
};
