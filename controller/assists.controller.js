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

const newDictation = async (req, res) => {
  const courses = await coursesService.getActiveCourses();
  isApi(req) ? res.status(200).send(courses)
    : res.render("assists/new-dictation", { courses })
};

const goToAddAssists = async (req, res) => {
  const { cursoId, fecha } = req.body;
  const alumns = await coursesService.getAlumnsByCourse(cursoId);
  const alumnsData = await alumnsService.getAllAlumnsByIds(alumns)
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

const goToRecords = async (req, res) => {
  let courses = await coursesService.getAllCourses();
  courses = await Promise.all(
  courses.map(async (c) => {
    const dictados = await Promise.all(
      c.dictados?.map(async (d) => {
        const asistencias = await alumnsService.getAllAlumnsByIds(d.asistencias);
        return { ...d, asistencias };
      }) || []
    );
    return { ...c, dictados };
  })
);
  isApi(req) ? res.status(200).send(courses)
    : res.render("assists/records-home", { courses })
}

module.exports = {
  newDictation,
  goToAddAssists,
  registerDictation,
  goToRecords
};
