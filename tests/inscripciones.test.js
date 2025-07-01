const request = require('supertest');
const express = require('express');
const app = express();

jest.mock('../middlewares/verifyToken', () => (req, res, next) => next());
jest.mock('../middlewares/checkRole', () => () => (req, res, next) => next());

const mockSave = jest.fn();

jest.mock('../models/inscripcion.model', () => {
  return function Inscripcion(data) {
    return {
      ...data,
      save: mockSave.mockResolvedValue({ _id: 'i1', ...data })
    };
  };
});
const Inscripcion = require('../models/inscripcion.model');
Inscripcion.find = jest.fn();
Inscripcion.findById = jest.fn();
Inscripcion.findByIdAndDelete = jest.fn();

jest.mock('../models/Alumno.model', () => ({
  findById: jest.fn(),
}));
const Alumno = require('../models/Alumno.model');

jest.mock('../services/courses.service', () => ({
  coursesService: {
    getCourseById: jest.fn(),
    addAlumns: jest.fn(),
    removeAlumns: jest.fn()
  }
}));
const { coursesService } = require('../services/courses.service');

const inscripcionesRoutes = require('../routes/inscripciones');
app.use(express.json());
app.use((req, res, next) => {
  req.get = () => 'Postman';
  next();
});
app.use('/inscripciones', inscripcionesRoutes);

afterEach(() => jest.clearAllMocks());

describe('GET /inscripciones', () => {
  test('Devuelve lista de inscripciones', async () => {
    Inscripcion.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([
        {
          _id: 'i1',
          alumnoId: { _id: 'a1', nombre: 'Mica', apellido: 'Orellano' },
          cursoId: { _id: 'c1', nombre: 'NodeJS' },
          fecha_inscripcion: new Date().toISOString(),
          pagos: [{ monto: 1000, medio: 'efectivo', fecha_pago: new Date().toISOString() }]
        }
      ])
    });

    const res = await request(app).get('/inscripciones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /inscripciones', () => {
  test('Crea inscripción nueva', async () => {
    Alumno.findById.mockResolvedValue({ _id: 'a1' });
    coursesService.getCourseById.mockResolvedValue({
      _id: 'c1',
      alumnos: [],
      cupo: 5
    });

    const body = {
      alumnoId: 'a1',
      cursoId: 'c1',
      monto: 1000,
      medio: 'efectivo'
    };

    const res = await request(app).post('/inscripciones').send(body);
    expect(res.status).toBe(201);
    expect(coursesService.addAlumns).toHaveBeenCalled();
  });
});

describe('DELETE /inscripciones/:id', () => {
  test('Elimina inscripción', async () => {
    Inscripcion.findByIdAndDelete.mockResolvedValue({
      _id: 'i1',
      cursoId: 'c1',
      alumnoId: 'a1'
    });

    const res = await request(app).delete('/inscripciones/1');
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('Inscripción eliminada');
    expect(coursesService.removeAlumns).toHaveBeenCalled();
  });
});