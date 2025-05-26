const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');

// Rutas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const alumnosRouter = require('./routes/alumnos');
const profesoresRouter = require('./routes/profesores');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const coursesRouter = require('./routes/courses');
const inscripcionesRouter = require('./routes/inscripciones');
const facturasProfesoresRouter = require('./routes/facturas-profesores');
const reportRoutes = require("./routes/reportes");




const app = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Middleware de sesión 
app.use(session({
  secret: 'secreto', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // si usás HTTPS ponelo en true
}));

// Middleware para verificar si el usuario está logueado y pasarlo a las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alumnos', alumnosRouter);
app.use('/profesores', profesoresRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/courses', coursesRouter);
app.use('/inscripciones', inscripcionesRouter);
app.use('/facturas-profesores', facturasProfesoresRouter);
app.use('/report', reportRoutes);

// Captura de error 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;