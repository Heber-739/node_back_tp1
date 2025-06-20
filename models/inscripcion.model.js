const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  monto: { type: Number, required: true },
  medio: { type: String, required: true },
  fecha_pago: { type: String, required: true }
}, { _id: false });

const inscripcionSchema = new mongoose.Schema({

  alumnoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno',
    required: true
  },
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  fecha_inscripcion: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  estado: {
    type: String,
    default: 'activo',
    enum: ['activo', 'cancelado', 'finalizado'] // opcional: limitar estados válidos
  },
  pagos: {
    type: [pagoSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);
