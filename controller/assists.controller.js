const { alumnsService } = require("../services/alumns.service");
const { coursesService } = require("../services/courses.service");

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
  isApi(req) ? res.status(200).send(courses)
    : res.render("assists/new-dictation", { courses })
};

const goToAddAssists = (req, res) => {
  const { cursoId, fecha } = req.body;
  const alumns = coursesService.getAlumnsByCourse(cursoId);
  const alumnsData = alumnsService.getAllAlumnsByIds(alumns)
  dataState.dictationData = { cursoId, fecha }

  isApi(req) ? res.status(200).send(alumnsData) :
    res.render("assists/addAssists", { alumnsData })
};

const registerDictation = (req, res) => {
  const alumns = req.body.selected
  if (alumns?.length == 0) {
    res.redirect("assists/new-dictation")
  }
  const { cursoId, fecha } = dataState.dictationData;
  dataState.dictationData = {}
  coursesService.addDictation(cursoId, fecha, alumns)
  isApi(req) ? res.status(200).send("Registro de clase exitoso")
    : res.redirect("/assists/new-dictation");
};

const goToRecords = (req, res) => {
  let courses = coursesService.getAllCourses();
  courses = courses.map((c) => {
    let dictados = c.dictados?.map((d) => {
      const asistencias = Array.isArray(d.asistencias)
        ? alumnsService.getAllAlumnsByIds(d.asistencias)
        : [];
      return { ...d, asistencias }
    });
    return { ...c, dictados }
  })
  isApi(req) ? res.status(200).send(courses)
    : res.render("assists/records-home", { courses })
}

module.exports = {
  newDictation,
  goToAddAssists,
  registerDictation,
  goToRecords
};
