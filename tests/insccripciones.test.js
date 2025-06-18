const request = require('supertest');
const app = require('../app')
const path = require('path');
const { coursesService } = require('../services/courses.service');
const { readFile } = require('../services/data.service');

const alumnosPath = path.join(__dirname, '../data/alumnos.json');

describe('GET /inscripciones', () => {
  it('debería devolver todas las inscripciones', async () => {
    const res = await request(app)
      .get('/inscripciones')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debería filtrar por nombreAlumno', async () => {
    const res = await request(app)
      .get('/inscripciones?nombreAlumno=juan')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(res.body.every(i => i.alumno?.nombre.toLowerCase().includes('juan'))).toBe(true);
  });

  it('debería filtrar por nombreCurso', async () => {
    const res = await request(app)
      .get('/inscripciones?nombreCurso=javascript')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(res.body.every(i => i.curso?.nombre.toLowerCase().includes('javascript'))).toBe(true);
  });

  it('debería mostrar estado "activo" si hubo pagos recientes', async () => {
    const res = await request(app)
      .get('/inscripciones')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);

    const activos = res.body.filter(i => i.estado === 'activo');
    if (activos.length > 0) {
      expect(activos[0]).toHaveProperty('pagos');
    }
  });

  it('debería mostrar estado "inactivo" si no hubo pagos recientes', async () => {
    const res = await request(app)
      .get('/inscripciones')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);

    const inactivos = res.body.filter(i => i.estado === 'inactivo');
    if (inactivos.length > 0) {
      expect(inactivos[0]).toHaveProperty('pagos');
    }
  });
});

describe('POST /inscripciones', () => {
  let alumnoValido;
  let cursoValido;

  beforeAll(() => {
    const alumnos = readFile(alumnosPath);
    const cursos = coursesService.getAllCourses();

    // Buscar un alumno y curso donde ese alumno NO esté inscripto
    alumnoValido = alumnos.find(al => al.id);
    cursoValido = cursos.find(c => !c.alumnos.includes(alumnoValido.id));

    if (!alumnoValido || !cursoValido) {
      throw new Error('No se encontró alumno y curso válidos para la prueba');
    }
  });

  it('debería crear una inscripción válida', async () => {
    const res = await request(app)
      .post('/inscripciones')
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: alumnoValido.id,
        cursoId: cursoValido.id,
        monto: 1000,
        medio: 'efectivo'
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('inscripcion');
    expect(res.body.inscripcion).toHaveProperty('alumnoId', alumnoValido.id);
    expect(res.body.inscripcion).toHaveProperty('cursoId', cursoValido.id);
  });

  it('debería rechazar si el alumno no existe', async () => {
    const res = await request(app)
      .post('/inscripciones')
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: 9999, // ID inexistente
        cursoId: 1,
        monto: 1000,
        medio: 'efectivo'
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/alumno no existe/i);
  });

  it('debería rechazar si el curso no existe', async () => {
    const res = await request(app)
      .post('/inscripciones')
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: alumnoValido.id,
        cursoId: 9999,
        monto: 1000,
        medio: 'efectivo'
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/curso no existe/i);
  });
  /* //Funciona solamente si hay algun curso con cupo completo
    it('debería rechazar si no hay cupo en el curso', async () => {
      const res = await request(app)
        .post('/inscripciones')
        .set('User-Agent', 'Thunder Client')
        .send({
          alumnoId: 1,
          cursoId: 2, 
          monto: 1000,
          medio: 'efectivo'
        });
  
      expect(res.statusCode).toBe(400);
      expect(res.text).toMatch(/no hay cupos/i);
    });*/

  it('debería rechazar si falta el pago inicial', async () => {
    const res = await request(app)
      .post('/inscripciones')
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: alumnoValido.id,
        cursoId: cursoValido.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/pago.*obligatorio/i);
  });

  it('debería rechazar si el alumno ya está inscripto', async () => {
    // este test solo funciona si ya hay una inscripción previa alumnoId=1 y cursoId=1
    const res = await request(app)
      .post('/inscripciones')
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: alumnoValido.id,
        cursoId: cursoValido.id,
        monto: 1000,
        medio: 'efectivo'
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/ya.*inscripto/i);
  });
});

describe('PUT /inscripciones/editar/:id', () => {
  let alumnoValido;
  let cursoValido;

  beforeAll(() => {
    const inscripciones = readFile(inscripcionesPath);
    const alumnos = readFile(alumnosPath);
    const cursos = coursesService.getAllCourses();

    const insc = inscripciones.find(i =>
      alumnos.some(a => a.id === i.alumnoId) &&
      cursos.some(c => c.id === i.cursoId)
    );

    if (!insc) {
      throw new Error('No se encontró una inscripción válida con alumno y curso reales');
    }

    alumnoValido = alumnos.find(a => a.id === insc.alumnoId);
    cursoValido = cursos.find(c => c.id === insc.cursoId);
    inscripcionId = insc.id;
  });

  it('debería actualizar una inscripción existente', async () => {
    // Buscar un curso alternativo válido para la actualización
    const cursos = coursesService.getAllCourses();
    const nuevoCurso = cursos.find(
      c => c.id !== cursoValido.id && !c.alumnos.includes(alumnoValido.id)
    );

    if (!nuevoCurso) {
      throw new Error('No se encontró un curso alternativo válido');
    }

    const res = await request(app)
      .put(`/inscripciones/editar/${inscripcionId}?_method=PUT`)
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: alumnoValido.id,
        cursoId: nuevoCurso.id
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('alumnoId', alumnoValido.id);
    expect(res.body).toHaveProperty('cursoId', nuevoCurso.id);
  });

  it('debería devolver 404 si la inscripción no existe', async () => {
    const res = await request(app)
      .put('/inscripciones/editar/9999?_method=PUT') // ID que no existe
      .set('User-Agent', 'Thunder Client')
      .send({
        alumnoId: 1,
        cursoId: 1
      });

    expect(res.statusCode).toBe(404);
    expect(res.text).toMatch(/inscripción no encontrada/i);
  });
});

describe('GET /inscripciones/pago/:id', () => {
  it('debería devolver los datos de la inscripción para pago', async () => {
    const res = await request(app)
      .get('/inscripciones/pago/1')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('debería retornar 404 si la inscripción no existe', async () => {
    const res = await request(app)
      .get('/inscripciones/pago/9999')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(404);
    expect(res.text).toMatch(/no encontrada/i);
  });
});

describe('POST /inscripciones/pago/:id', () => {
  it('debería registrar un pago válido', async () => {
    const res = await request(app)
      .post('/inscripciones/pago/1')
      .set('User-Agent', 'Thunder Client')
      .send({
        monto: 1500,
        medio: 'transferencia'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('pagos');
    expect(res.body.pagos[0]).toHaveProperty('monto', 1500);
  });

  it('debería rechazar si falta monto o medio', async () => {
    const res = await request(app)
      .post('/inscripciones/pago/1')
      .set('User-Agent', 'Thunder Client')
      .send({
        monto: 1000 // Falta "medio"
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/obligatorios/i);
  });

  it('debería devolver 404 si la inscripción no existe', async () => {
    const res = await request(app)
      .post('/inscripciones/pago/9999')
      .set('User-Agent', 'Thunder Client')
      .send({
        monto: 1000,
        medio: 'efectivo'
      });

    expect(res.statusCode).toBe(404);
    expect(res.text).toMatch(/no encontrada/i);
  });
});

describe('DELETE /inscripciones/:id', () => {
  it('debería eliminar una inscripción existente', async () => {
    const res = await request(app)
      .delete('/inscripciones/1')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje');
    expect(res.body).toHaveProperty('eliminada');
  });

  it('debería retornar 404 si la inscripción no existe', async () => {
    const res = await request(app)
      .delete('/inscripciones/9999')
      .set('User-Agent', 'Thunder Client');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
