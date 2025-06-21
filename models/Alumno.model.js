const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Alumno', alumnoSchema);