const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  telefono: { type: String, required: true, unique:true },
  cuit: { type: String, required: true, unique:true }
}, {
  timestamps: true
});

const Profesor = mongoose.model('Profesor', profesorSchema);
module.exports = Profesor;