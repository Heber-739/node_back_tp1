const { v4: uuidv4 } = require('uuid');

class Alumno {
  constructor(nombre, apellido, email, telefono) {
    this.id = uuidv4();   
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
  }
}

module.exports = { Alumno };