const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const pagoSchema = new mongoose.Schema({
  monto: { type: Number, required: true },
  medio: { type: String, required: true },
  fecha_pago: { type: String, required: true }
}, { _id: false });

const inscripcionSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 }, // 👈 tu ID personalizado con UUID
  alumnoId: { type: String, required: true },
  cursoId: { type: String, required: true },
  fecha_inscripcion: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  estado: { type: String, default: 'activo' },
  pagos: { type: [pagoSchema], default: [] }
}, {
  timestamps: true // opcional: agrega createdAt / updatedAt
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);
