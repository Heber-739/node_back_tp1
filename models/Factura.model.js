const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
  numeroFactura: { type: String, required: true, unique: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
  fecha: { type: Date, required: true },
  monto: { type: Number, required: true },
  detalle: { type: String, required: true },
  estadoPago: { type: String, enum: ['pendiente', 'pagada'], default: 'pendiente' },
  estadoFactura: { type: String, enum: ['activa', 'anulada'], default: 'activa' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Factura', FacturaSchema);