const request = require('supertest');
const express = require('express');
const app = express();

// Middleware y mocks
jest.mock('../middlewares/verifyToken', () => (req, res, next) => next());
jest.mock('../middlewares/checkRole', () => (role) => (req, res, next) => next());

// Mock de Alumno
const mockSave = jest.fn();
jest.mock('../models/Alumno.model', () => {
  return function Alumno(data) {
    return {
      ...data,
      save: mockSave.mockResolvedValue({ _id: 'mock-id', ...data })
    };
  };
});
const Alumno = require('../models/Alumno.model');

Alumno.find = jest.fn();
Alumno.findById = jest.fn();
Alumno.findByIdAndUpdate = jest.fn();
Alumno.findByIdAndDelete = jest.fn();

const alumnosRoutes = require('../routes/alumnos');
app.use(express.json());
app.use((req, res, next) => {
  req.get = () => 'Postman';
  next();
});
app.use('/alumnos', alumnosRoutes);

afterEach(() => jest.clearAllMocks());

describe('GET /alumnos', () => {
  test('Devuelve lista de alumnos', async () => {
    const mockAlumnos = [{ nombre: 'Juan', apellido: 'Pérez' }];
    Alumno.find.mockResolvedValue(mockAlumnos);

    const res = await request(app).get('/alumnos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAlumnos);
  });
});

describe('GET /alumnos/:id/editar', () => {
  test('Devuelve un alumno por ID', async () => {
    const alumno = { _id: '1', nombre: 'Mica', apellido: 'Orellano' };
    Alumno.findById.mockResolvedValue(alumno);

    const res = await request(app).get('/alumnos/1/editar');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(alumno);
  });
});

describe('POST /alumnos', () => {
  test('Crea un nuevo alumno', async () => {
    const data = {
      nombre: 'Lautaro',
      apellido: 'Gonzalez',
      email: 'lau@mail.com',
      telefono: '1234'
    };

    const res = await request(app).post('/alumnos').send(data);
    expect(res.status).toBe(201);
    expect(res.body.alumno.nombre).toBe('Lautaro');
    expect(mockSave).toHaveBeenCalled();
  });
});

describe('PUT /alumnos/:id', () => {
  test('Actualiza un alumno', async () => {
    const updated = {
      _id: '1',
      nombre: 'Editado',
      apellido: 'Apellido',
      email: 'editado@mail.com',
      telefono: '9999'
    };
    Alumno.findByIdAndUpdate.mockResolvedValue(updated);

    const res = await request(app).put('/alumnos/1').send(updated);
    expect(res.status).toBe(200);
    expect(res.body.alumno).toEqual(updated);
  });
});

describe('DELETE /alumnos/:id', () => {
  test('Elimina un alumno', async () => {
    Alumno.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const res = await request(app).delete('/alumnos/1');
    expect(res.status).toBe(200);
    expect(res.body.idEliminado).toBe('1');
  });
});