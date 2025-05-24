const uuid = require("uuid");

class Curso {
  constructor(profesor,nombre,horario,cupo,area,estado,alumnos) {
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
module.exports = {Curso};