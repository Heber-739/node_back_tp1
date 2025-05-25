const fs = require("fs");
//const path = require("path");

const PROFESORES_FILE = require('path').join(__dirname, "../data/profesores.json");


const getAllProfesores = () => {
  const leerDatos = () => JSON.parse(fs.readFileSync(PROFESORES_FILE, 'utf8'));
  const profesores = leerDatos();
  return profesores;  // Devuelvo el array profesores
};

module.exports = {
  getAllProfesores,
};
