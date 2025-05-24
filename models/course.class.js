const uuid = require("uuid");

class Course {
  constructor(profesor,nombre,horario,cupo,area,estado) {
    this.id = uuid.v4();
    this.profesor = profesor;
    this.dictados = [];
    this.nombre = nombre;
    this.horario = horario;
    this.cupo = cupo;
    this.area = area;
    this.estado = estado;
    this.alumnos = [];
  }
}
module.exports = { Course };