# 🎓 Trabajo Integrador Desarrollo Web Backend

Este es un proyecto backend desarrollado con [Node.js](https://nodejs.org/) y [Express](https://expressjs.com/). 

Consulta la [consigna completa del trabajo aquí](CONSIGNA.md).


## 📁 Estructura del Proyecto
```
.
├── app.js / index.js # Servidor principal
├── routes/
│ ├── index.js
│ ├── users.js
│ └── alumnos.js # Rutas de alumnos
├── alumnos.json # Base de datos simulada
├── views/ # Vistas Jade
├── public/ # Archivos estáticos
├── package.json
└── README.md
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

## 📌 Endpoints de /alumnos
```
Método	Ruta	Descripción
GET	/alumnos	Devuelve la lista completa de alumnos
GET	/alumnos/:id	Devuelve un alumno por su ID
POST	/alumnos	Crea un nuevo alumno
PUT	/alumnos/:id	Reemplaza completamente un alumno
PATCH	/alumnos/:id	Actualiza parcialmente un alumno
DELETE	/alumnos/:id	Elimina un alumno por ID
```
## 📥 Formato esperado para crear/editar alumno
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "curso": "Programación"
}
```
