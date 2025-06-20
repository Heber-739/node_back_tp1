const Profesor = require('../models/Profesor.model');

const isApi = (req) => {
  const ua = req.get('User-Agent');
  return /postman|thunder client/i.test(ua);
};

const getAllProfesores = async (req, res) => {
  const { nombre } = req.query;
  let filtro = {};
  if (nombre) {
    const regex = new RegExp(nombre, 'i');
    filtro = {
      $or: [
        { nombre: regex },
        { apellido: regex }
      ]
    };
  }

  try {
    const profesores = await Profesor.find(filtro);
    if (isApi(req)) {
      res.status(200).json(profesores);
    } else {
      res.render('profesores/index', { profesores, nombre });
    }
  } catch (err) {
    res.status(500).send('Error al obtener profesores');
  }
};

const goToEditarProfesor = async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) return res.status(404).send('Profesor no encontrado');

    res.render('profesores/editar', { profesor });
  } catch (err) {
    res.status(500).send('Error al cargar profesor');
  }
};

const crearProfesor = async (req, res) => {
  const { nombre, apellido, email, telefono, cuit } = req.body;
  if (!nombre || !apellido || !email || !telefono || !cuit) {
    return res.status(400).send('Faltan campos requeridos');
  }

  try {
    const nuevo = new Profesor({ nombre, apellido, email, telefono, cuit });
    await nuevo.save();
    res.redirect('/profesores');
  } catch (err) {
    res.status(500).send('Error al crear profesor');
  }
};

const editarProfesor = async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profesor) return res.status(404).send('Profesor no encontrado');

    res.redirect('/profesores');
  } catch (err) {
    res.status(500).send('Error al actualizar profesor');
  }
};

const eliminarProfesor = async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndDelete(req.params.id);
    if (!profesor) return res.status(404).send('Profesor no encontrado');

    res.redirect('/profesores');
  } catch (err) {
    res.status(500).send('Error al eliminar profesor');
  }
};

module.exports = {
  getAllProfesores,
  goToEditarProfesor,
  crearProfesor,
  editarProfesor,
  eliminarProfesor
};