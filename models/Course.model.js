const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profesor',
    required: true
  },
  dictados: {
    type: [Object],
    default: []
  },
  nombre: {
    type: String,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  cupo: {
    type: Number,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  alumnos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
