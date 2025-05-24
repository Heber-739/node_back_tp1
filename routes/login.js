const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const USUARIOS_FILE = path.join(__dirname, '../usuarios.json');

const leerUsuarios = () => {
  const data = fs.readFileSync(USUARIOS_FILE, 'utf8');
  return JSON.parse(data);
};

// Rutas de login

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const usuarios = leerUsuarios();

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    req.session.usuario = { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol };
    return res.redirect('/alumnos');
  }

  res.render('login', { error: 'Credenciales incorrectas' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
