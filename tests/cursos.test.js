const request = require('supertest');
const express = require('express');
const app = express();

// Mocks de middlewares
jest.mock('../middlewares/verifyToken', () => (req, res, next) => next());
jest.mock('../middlewares/checkRole', () => () => (req, res, next) => next());

// Mocks de Cursos
const mockSave = jest.fn();
jest.mock('../models/Course.model', () => {
  return function Course(data) {
    return {
      ...data,
      save: mockSave.mockResolvedValue({ _id: 'mock-id', ...data })
    };
  };
});
const Course = require('../models/Course.model');

Course.find = jest.fn();
Course.findById = jest.fn();
Course.findByIdAndUpdate = jest.fn();
Course.findByIdAndDelete = jest.fn();

jest.mock('../services/profesores.service', () => ({
  getAllProfesores: jest.fn()
}));
const { getAllProfesores } = require('../services/profesores.service');

const coursesRoutes = require('../routes/courses');
app.use(express.json());
app.use((req, res, next) => {
  req.get = () => 'Postman';
  next();
});
app.use('/courses', coursesRoutes);

afterEach(() => jest.clearAllMocks());

describe('GET /courses', () => {
  test('Lista cursos con nombre de profesor', async () => {
    Course.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([
      { _id: '1', nombre: 'NodeJS', profesor: 'p1' }
    ])});
    getAllProfesores.mockResolvedValue([
      { _id: 'p1', nombre: 'Ana', apellido: 'Perez' }
    ]);

    const res = await request(app).get('/courses');
    expect(res.status).toBe(200);
    expect(res.body[0].profesorNombre).toBe('Perez Ana');
  });
});

describe('GET /courses/:id', () => {
  test('Devuelve curso por ID', async () => {
    Course.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({
      _id: '1', nombre: 'NodeJS'
    })});

    const res = await request(app).get('/courses/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ _id: '1', nombre: 'NodeJS' });
  });
});

describe('GET /courses/edit/:id', () => {
  test('Devuelve curso + profesores', async () => {
    Course.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({
      _id: '1', nombre: 'NodeJS'
    })});
    getAllProfesores.mockResolvedValue([
      { _id: 'p1', nombre: 'Ana', apellido: 'Perez' }
    ]);

    const res = await request(app).get('/courses/edit/1');
    expect(res.status).toBe(200);
    expect(res.body.course).toEqual({ _id: '1', nombre: 'NodeJS' });
    expect(res.body.profesores.length).toBe(1);
  });
});

describe('POST /courses/new', () => {
  test('Crea un nuevo curso', async () => {
    const data = {
      profesor: 'p1',
      nombre: 'JavaScript',
      horario: 'Lunes',
      cupo: 20,
      area: 'Web',
      estado: 'activo'
    };

    const res = await request(app).post('/courses/new').send(data);
    expect(res.status).toBe(200);
    expect(mockSave).toHaveBeenCalled();
  });
});

describe('PUT /courses/:id', () => {
  test('Actualiza curso', async () => {
    const updated = {
      _id: '1',
      profesor: 'p2',
      nombre: 'ReactJS',
      horario: 'Martes',
      cupo: 15,
      area: 'Frontend',
      estado: 'activo'
    };

    Course.findByIdAndUpdate.mockResolvedValue(updated);

    const res = await request(app).put('/courses/1').send(updated);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});

describe('DELETE /courses/:id', () => {
  test('Elimina curso', async () => {
    Course.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const res = await request(app).delete('/courses/1');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Curso eliminado');
  });
});