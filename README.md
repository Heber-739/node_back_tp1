# 🎓 Trabajo Integrador Desarrollo Web Backend

Este es un proyecto backend desarrollado con [Node.js](https://nodejs.org/) y [Express](https://expressjs.com/). 

Consulta la [consigna completa del trabajo aquí](CONSIGNA.md).


## 📁 Estructura del Proyecto
```
api/
bin/
config/
controller/
middlewares/
models/
public/
├── stylesheets/
routes/
services/
tests/
views/
├── alumnos/
├── assists/
├── ayuda/
├── courses/
├── facturas-profesores/
├── inscripciones/
├── profesores/
├── reportes/
└── users/
```

## ⚙️ Instalación

1. Clonar el repositorio:


```bash
git clone https://github.com/Heber-739/node_back_tp1.git
cd tu-repo
```

2. Instalar las dependencias:

```
npm install
```

3. Iniciar el servidor: (nodemon para no tener que reiniciarlo)

```bash
npx nodemon app.js

El servidor estará disponible en: http://localhost:3000
```

# Documentación API

Este documento describe los endpoints y controladores principales del backend, junto con los middlewares de seguridad y control de acceso usados.

## 🔎 Módulo Cursos

### Ruta base: `/courses`

### Middlewares globales

- `verifyToken`: Verifica el JWT para todas las rutas.
- `checkRole`: Control de acceso por roles `admin`, `usuario` y `profesor`.

---

### Endpoints

| Método | Ruta               | Roles permitidos           | Descripción                           |
|--------|--------------------|---------------------------|-------------------------------------|
| GET    | `/`                | admin, usuario, profesor  | Listar cursos con filtros opcionales|
| GET    | `/edit/:id`         | admin, usuario            | Obtener formulario para editar curso|
| GET    | `/:id`              | admin, usuario, profesor  | Obtener detalles de un curso         |
| POST   | `/new`              | admin, usuario            | Crear nuevo curso                   |
| PUT    | `/:id`              | admin, usuario            | Actualizar curso                   |
| DELETE | `/:id`              | admin, usuario            | Eliminar curso                    |

---

### Controlador: `courses.controller.js`

- `getAllCourses(req, res)`

  - Lista cursos con filtro por nombre de curso y nombre de profesor.
  - Asocia datos de profesor a cada curso.
  - Responde JSON para API o renderiza vista `courses/list`.

- `getCourseById(req, res)`

  - Obtiene un curso por su ID.
  - Responde JSON o renderiza vista `courses/details`.

- `goToEditCourseById(req, res)`

  - Obtiene datos para editar un curso.
  - Incluye lista de profesores para asignar.
  - Responde JSON o renderiza vista `courses/edit`.

- `newCourse(req, res)`

  - Valida campos obligatorios.
  - Crea un nuevo curso en base a datos recibidos.
  - Redirige o responde JSON.

- `updateCourseById(req, res)`

  - Actualiza un curso por ID con datos recibidos.
  - Redirige o responde JSON.

- `deleteCourseById(req, res)`

  - Elimina un curso por ID.
  - Redirige o responde JSON.

---

## 🔎 Módulo Asistencias (Dictados)

### Ruta base: `/assists`

### Middlewares globales

- `verifyToken`: JWT para todas las rutas.
- `checkRole`: Roles `admin` y `profesor` para todas las rutas.

---

### Endpoints

| Método | Ruta             | Roles permitidos     | Descripción                      |
|--------|------------------|---------------------|---------------------------------|
| GET    | `/new-dictation` | admin, profesor     | Crear nuevo dictado             |
| POST   | `/addAssists`    | admin, profesor     | Agregar asistencias a dictado   |
| POST   | `/register`      | admin, profesor     | Registrar dictado               |
| GET    | `/attendence-records` | admin, profesor | Ver registros de asistencias    |

---

### Controlador: `assists.controller.js`

- `newDictation(req, res)`

  - Obtiene cursos activos.
  - Responde JSON o renderiza vista `assists/new-dictation`.

- `goToAddAssists(req, res)`

  - Recibe curso y fecha.
  - Obtiene alumnos del curso.
  - Guarda temporalmente datos para el dictado.
  - Responde JSON o renderiza vista `assists/addAssists`.

- `registerDictation(req, res)`

  - Registra las asistencias enviadas para el dictado.
  - Limpia datos temporales.
  - Redirige o responde JSON.

- `goToRecords(req, res)`

  - Obtiene cursos con dictados y asistentes detallados.
  - Responde JSON o renderiza vista `assists/records-home`.

---

## 🔎 Módulo Facturas

### Ruta base: `/facturas-profesores`

### Middlewares globales

- `verifyToken`: Verifica JWT.
- `checkRole`: Roles `admin` y `usuario`.

---

### Endpoints

| Método | Ruta                    | Roles permitidos       | Descripción                              |
|--------|-------------------------|-----------------------|------------------------------------------|
| GET    | `/`                     | admin, usuario        | Listar facturas con filtros             |
| GET    | `/nueva`                | admin, usuario        | Formulario para crear nueva factura     |
| POST   | `/`                     | admin, usuario        | Crear factura                           |
| POST   | `/pagar/:id`            | admin, usuario        | Marcar factura como pagada               |
| POST   | `/anular-pago/:id`      | admin, usuario        | Anular pago de factura                   |
| POST   | `/anular-factura/:id`   | admin, usuario        | Anular factura                          |
| POST   | `/reactivar-factura/:id`| admin, usuario        | Reactivar factura                       |
| GET    | `/editar/:id`           | admin, usuario        | Formulario edición factura                |
| POST   | `/:id`                  | admin, usuario        | Actualizar factura                      |

---

### Controlador: `factura.controller.js`

- Métodos para obtener, crear, editar, pagar, anular y reactivar facturas.
- Manejo de filtros para búsqueda.
- Renderiza vistas o responde JSON según el cliente.

---

## 🔎 Módulo Inscripciones

### Ruta base: `/inscripciones`

### Middlewares globales

- `verifyToken`
- `checkRole`: Roles `usuario`, `admin`, `profesor` según acción.

---

### Endpoints

| Método | Ruta               | Roles permitidos          | Descripción                        |
|--------|--------------------|--------------------------|----------------------------------|
| GET    | `/`                | usuario, admin, profesor | Listar inscripciones con filtros |
| POST   | `/`                | usuario, admin           | Crear nueva inscripción          |
| GET    | `/editar/:id`       | usuario, admin           | Formulario edición inscripción   |
| PUT    | `/editar/:id`       | usuario, admin           | Actualizar inscripción           |
| GET    | `/pago/:id`         | usuario, admin           | Formulario para agregar pago     |
| POST   | `/pago/:id`         | usuario, admin           | Registrar pago                   |
| DELETE | `/:id`              | usuario, admin           | Eliminar inscripción             |

---

### Controlador: `inscripciones.controller.js`

- Maneja creación, edición, listado y eliminación de inscripciones.
- Valida datos de alumno y curso.
- Controla disponibilidad de cupos.
- Maneja pagos asociados a inscripciones.
- Filtra por alumno y curso.
- Responde JSON para API o renderiza vistas.

---

## 🔎 Módulo Profesores

### Ruta base: `/profesores`

### Middlewares globales

- `verifyToken`
- `checkRole`: Roles `admin`, `usuario`.

---

### Endpoints

| Método | Ruta          | Roles permitidos    | Descripción                  |
|--------|---------------|--------------------|------------------------------|
| GET    | `/`           | admin, usuario     | Listar profesores            |
| GET    | `/:id/editar` | admin, usuario     | Formulario para editar       |
| POST   | `/`           | admin, usuario     | Crear nuevo profesor         |
| PUT    | `/:id`        | admin, usuario     | Actualizar profesor          |
| DELETE | `/:id`        | admin, usuario     | Eliminar profesor            |

---

### Controlador: `profesores.controller.js`

- Listado y búsqueda de profesores por nombre o apellido.
- Creación con validación de campos obligatorios.
- Edición y eliminación por ID.
- Responde JSON o renderiza vistas según el cliente.

---

# Notas comunes

- Todas las rutas usan middleware `verifyToken` para seguridad.
- El middleware `checkRole` controla permisos según roles definidos.
- Detecta peticiones API según el `User-Agent` (Postman, Thunder Client) para enviar JSON o renderizar vistas.
- Los errores se manejan con status HTTP y mensajes claros.
- Los modelos usados son Mongoose y las bases de datos MongoDB.

---

---

## 🔎 Módulo Reportes

### Ruta base: `/report`

### Middlewares globales

- `verifyToken`: Verifica el JWT en todas las rutas.
- `checkRole('admin', 'usuario', 'profesor')`: Control de acceso por roles.

---

### Endpoints

| Método | Ruta                  | Descripción                                   |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/cursos-disponibles` | Muestra cursos con cupo disponible             |
| GET    | `/cursos-completos`   | Muestra cursos que están completos             |
| GET    | `/alumnos-por-curso`  | Muestra alumnos inscritos para un curso dado  |

---

### Controlador: `report.controller.js`

- `reportCursosDisponibles(req, res)`

  - Obtiene la lista de cursos con vacantes disponibles.
  - Renderiza la vista `reportes/cursos-disponibles`.
  - En caso de error, responde con status 500 y mensaje de error.

- `reportCursosCompletos(req, res)`

  - Obtiene la lista de cursos que están completos (sin vacantes).
  - Renderiza la vista `reportes/cursos-completos`.
  - En caso de error, responde con status 500 y mensaje de error.

- `reportAlumnosPorCurso(req, res)`

  - Recibe parámetro opcional `cursoId` por query.
  - Si no se pasa o es inválido, renderiza vista `reportes/alumnos-por-curso` con listado de cursos pero sin alumnos.
  - Si se pasa `cursoId` válido, busca el curso y las inscripciones, con información de los alumnos.
  - Renderiza vista `reportes/alumnos-por-curso` con curso seleccionado y lista de alumnos.
  - En caso de error, responde con status 500 y mensaje.

---

## 🔎 Módulo Usuarios

### Ruta base: `/users`

### Middlewares globales

- `verifyToken`: Verifica JWT para todas las rutas.
- `checkRole('admin')`: Solo administradores pueden acceder a estas rutas.

---

### Endpoints

| Método | Ruta                 | Descripción                      |
|--------|----------------------|---------------------------------|
| GET    | `/users`             | Lista usuarios, con filtro opcional |
| POST   | `/users`             | Crear nuevo usuario             |
| GET    | `/users/:id/editar`  | Mostrar formulario para editar  |
| POST   | `/users/:id/editar`  | Actualizar usuario              |
| DELETE | `/users/:id`         | Eliminar usuario                |

---

### Controlador: `users.controller.js`

- `getUsers(req, res)`

  - Lista usuarios, permite filtrar por nombre o username (query param `nombre`).
  - Si la petición proviene de API (Postman o Thunder Client), responde JSON.
  - Si es web, renderiza vista `users/index`.

- `createUser(req, res)`

  - Recibe `username`, `name`, `password` y `role` en body.
  - Hashea la contraseña antes de guardar.
  - Redirige a `/users` tras creación.

- `getUserEditForm(req, res)`

  - Obtiene usuario por ID.
  - Renderiza formulario para editar usuario `users/edit`.

- `updateUser(req, res)`

  - Actualiza datos del usuario.
  - Si se recibe nueva contraseña, la hashea antes de actualizar.
  - Redirige a `/users`.

- `deleteUser(req, res)`

  - Elimina usuario por ID.
  - Redirige a `/users`.

---

# Seguridad y Control de Acceso

- Todas las rutas usan el middleware `verifyToken` para validar JWT.
- El middleware `checkRole` asegura que solo roles autorizados puedan acceder a cada ruta.
- En general, las operaciones de creación, edición y eliminación están limitadas a usuarios con rol `admin`.
- Las consultas y reportes suelen permitir también roles `usuario` y `profesor` según corresponda.

---

# Notas

- Las vistas se renderizan con plantillas del servidor (EJS, Pug, etc.) según tu configuración.
- Para acceder vía API (Postman, Thunder Client) se detecta mediante el `User-Agent` y responde JSON en lugar de renderizar vistas.
- Manejo de errores con mensajes claros y status HTTP adecuados.

---

¿Querés que también te arme un ejemplo de estructura de carpetas para este proyecto o algún script para automatizar tareas comunes?  
Estoy para ayudarte.

