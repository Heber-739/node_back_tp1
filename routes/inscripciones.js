const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const inscripcionesPath = path.join(__dirname, '../data/inscripciones.json');
const cursosPath = path.join(__dirname, '../data/courses.json');
const alumnosPath = path.join(__dirname, '../data/alumnos.json');

// Funciones para leer y escribir datos
const leerDatos = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8'));
const escribirDatos = (ruta, datos) =>
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

// GET todas las inscripciones
router.get('/', (req, res) => {
  const inscripciones = leerDatos(inscripcionesPath);
  const cursosData = leerDatos(cursosPath); // <-- lee el objeto
  const cursos = cursosData.courses;        // <-- accede al array
  const alumnos = leerDatos(alumnosPath); // leer alumnos

   const inscripcionesConInfo = inscripciones.map(insc => {
    const alumno = alumnos.find(a => String(a.id) === String(insc.alumnoId));
    const curso = cursos.find(
      c => String(c.id) === String(insc.cursoId)
    );

    if (!curso) {
      console.log('No se encontró curso para insc.cursoId:', insc.cursoId);
    }

    return {
      ...insc,
      alumno: alumno
        ? { id: alumno.id, nombre: alumno.nombre, apellido: alumno.apellido }
        : null,
      curso: curso
        ? { id: curso.id, nombre: curso.nombre }
        : null
    };
  });

  res.render('inscripciones/listado', { inscripciones: inscripcionesConInfo });
});

// DELETE eliminar una inscripción
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let inscripciones = leerDatos(inscripcionesPath);

  const index = inscripciones.findIndex(i => String(i.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const eliminada = inscripciones.splice(index, 1)[0];
  escribirDatos(inscripcionesPath, inscripciones);

  res.redirect('/inscripciones');
});

module.exports = router;
