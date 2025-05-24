const express = require('express');
const router = express.Router();

const {leerDatos,escribirDatos} = require("../services/data.service");
const { Curso } = require('../models/curso.class');

const COURSES_FILE = require('path').join(__dirname, '../data/cursos.json');

// GET cursos
router.get('/', (req, res) => {
    
    const data = leerDatos(COURSES_FILE);
    const response = data.cursos.map((curso) => {
        const {dictados,...res} = curso;
        return res;
    })
    res.render('cursos/lista', { response });
});

router.get('/editar/:id', (req, res) => {
    const id = req.params.id;
    const data = leerDatos(COURSES_FILE);
    const curso = data.cursos.find((c)=>c.id === id)
    if(!curso){
        res.status(404).send("Curso no encontrado");
    }
    res.render('cursos/editar', {curso})});

// GET curso por ID
router.get('/:id', (req, res) => {
    const data = leerDatos(COURSES_FILE);
    const curso = data.cursos.find(c => c.id === req.params.id);

    // TODO agregar la logica para obtener el nombre del profesor
    if (!curso) return res.status(404).send('Curso no encontrado');
    res.render('cursos/detalle', { curso });
});




router.post('/new', (req, res) => {
    try {
    const {profesor, nombre,horario,cupo,area,estado} = req.body;
    if(!profesor|| !nombre||!horario||!cupo||!area||!estado){
        res.status(400).send('Campos faltan para crear un nuevo curso');
    }
    const curso = new Curso(profesor,nombre,horario,cupo,area,estado);
    const data = leerDatos(COURSES_FILE);
    data = data?.cursos || {"cursos":[]}
    data.cursos.push(curso);
    escribirDatos(data,COURSES_FILE);
    } catch (error) {
        console.error(error)
    }
    res.redirect('/cursos')
});


router.put('/:id', (req, res) => {
    try {
const data = leerDatos(COURSES_FILE);
    const id = req.params.id;
    const index = data.cursos.findIndex(c => c.id === id);
    if (index === -1){
        return res.status(404).send('Curso no encontrado');
    } 
    let curso = data.cursos[index];
    curso = {
        ...curso,
        profesor:req.body.profesor,
        nombre:req.body.nombre,
        horario:req.body.horario,
        cupo:req.body.cupo,
        area:req.body.area,
        estado:req.body.estado,
    };
    data.cursos[index] = curso;
    escribirDatos(data,COURSES_FILE);
    } catch(err) {
        console.error(err)
        res.status(500)
    }
    
    res.redirect('/cursos');
});

// DELETE /alumnos/:id
router.delete('/:id', (req, res) => {
    const data = leerDatos(COURSES_FILE);
    const id = req.params.id;
    const origin_length = data.cursos.length;
    let cursos = data.cursos.filter(c => c.id !== id);
    if (origin_length === cursos.length)
        return res.status(404).send('Curso no encontrado');
    escribirDatos({cursos},COURSES_FILE);
    res.redirect('/cursos'); // Redirige a la lista de alumnos para mostrar el cambio
});

module.exports = router;
