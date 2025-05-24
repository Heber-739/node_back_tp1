const express = require('express');
const router = express.Router();
const fs = require('fs');

const DB_FILE = require('path').join(__dirname, '../alumnos.json');
console.log(DB_FILE);


// Funciones para leer y escribir datos
const leerDatos = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const escribirDatos = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// GET /alumnos
router.get('/', (req, res) => {
    const alumnos = leerDatos();
    res.render('alumnos', { alumnos }); // Renderiza la vista 'alumnos' y pasa los datos
});

// GET /alumnos/:id/editar
router.get('/:id/editar', (req, res) => {
    const alumnos = leerDatos();
    const alumno = alumnos.find(a => a.id === parseInt(req.params.id));
    if (!alumno) return res.status(404).send('Alumno no encontrado');
    res.render('editar', { alumno });
});

// POST /alumnos - crea un nuevo alumno
router.post('/', (req, res) => {
    const alumnos = leerDatos();

    // Validar que los campos estén presentes
    const { nombre, apellido, email, curso } = req.body;
    if (!nombre || !apellido || !email || !curso) {
        return res.status(400).send('Faltan campos requeridos');
    }
    const nuevoAlumno = {
        id: alumnos.length > 0 ? alumnos[alumnos.length - 1].id + 1 : 1,
        nombre,
        apellido,
        email,
        curso
    };
    alumnos.push(nuevoAlumno);
    escribirDatos(alumnos);
    res.redirect('/alumnos'); 
});


router.put('/:id', (req, res) => {
    const alumnos = leerDatos();
    const id = parseInt(req.params.id);
    const index = alumnos.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send('Alumno no encontrado');
    // Sobrescribimos todos los campos del alumno con los nuevos del body
    alumnos[index] = {
        id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        curso: req.body.curso
    };
    escribirDatos(alumnos);
    res.redirect('/alumnos');
});

// DELETE /alumnos/:id
router.delete('/:id', (req, res) => {
    let alumnos = leerDatos();
    const id = parseInt(req.params.id);
    const cantidadInicial = alumnos.length;
    alumnos = alumnos.filter(a => a.id !== id);
    if (alumnos.length === cantidadInicial)
        return res.status(404).send('Alumno no encontrado');
    escribirDatos(alumnos);
    res.redirect('/alumnos'); // Redirige a la lista de alumnos para mostrar el cambio
});

module.exports = router;
