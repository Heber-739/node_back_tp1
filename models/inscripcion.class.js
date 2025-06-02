const { v4: uuidv4 } = require('uuid');

class Inscripcion {
  constructor(alumnoId, cursoId, monto, medio) {
    this.id = uuidv4(); 
    this.alumnoId = alumnoId;
    this.cursoId = cursoId;   
    this.fecha_inscripcion = new Date().toISOString().split('T')[0];
    this.estado = "activo";
    this.pagos = [
      {
        monto: Number(monto),
        medio: medio,
        fecha_pago: new Date().toISOString().split('T')[0]
      }
    ];
  }
}

module.exports = { Inscripcion };
