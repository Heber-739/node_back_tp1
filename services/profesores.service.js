const Profesor = require('../models/Profesor.model');

const getAllProfesores = async () => {
  try {
    const profesores = await Profesor.find().lean();
    return profesores;
  } catch (error) {
    console.error("Error al obtener profesores desde MongoDB:", error);
    return [];
  }
};

module.exports = {
  getAllProfesores,
};
