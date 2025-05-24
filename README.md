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

## 📌 ACTUALIZACIONES

23-05  RAMA: ori1

- CRUD profesores
- Login de usaurios
  ```
  "email": "admin@admin",
  "password": "1234",
  "nombre": "Administrador",
  "rol": "admin"

  "email": "profe1@profe",
  "password": "pass123",
  "nombre": "Profesor Uno",
  "rol": "profesor"
  ```


