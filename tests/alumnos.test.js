const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Alumno = require('../models/Alumno.model');
const connectDB = require('../config/db');
require('dotenv').config();

let idCreado = null;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  //await Alumno.deleteMany({}); //Borrar todos los alumnos creados durante las pruebas (Ver si es peligroso)
  await mongoose.connection.close();
});

describe('Test de API /alumnos', () => {
  it('debería crear un alumno', async () => {
    const res = await request(app)
      .post('/alumnos')
      .set('User-Agent', 'Thunder Client')
      .send({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        telefono: '123456789'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.alumno).toHaveProperty('_id');
    idCreado = res.body.alumno._id;
  });

  it('debería obtener todos los alumnos', async () => {
    const res = await request(app)
      .get('/alumnos')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('debería editar el alumno', async () => {
    const res = await request(app)
      .put(`/alumnos/${idCreado}?_method=PUT`)
      .set('User-Agent', 'Thunder Client')
      .send({
        nombre: 'Juan Carlos',
        apellido: 'Pérez',
        email: 'juan.carlos@example.com',
        telefono: '987654321'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.alumno.nombre).toBe('Juan Carlos');
  });

 it('debería eliminar el alumno', async () => {
    const res = await request(app)
      .delete(`/alumnos/${idCreado}?_method=DELETE`)
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('idEliminado', idCreado);
  }); 
});
