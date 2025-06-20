const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.model'); // corregí según tu estructura

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash);

    if (!user || !passwordCorrect) {
      return res.status(401).render('login', {
        error: 'Credenciales incorrectas',
        isLoginPage: true
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: '1h'
    });

    // Guardar usuario y token en la sesión
    req.session.usuario = {
      id: user._id,
      username: user.username,
      name: user.name
    };
    req.session.token = token;

    // Redirigir al dashboard o página protegida
    res.redirect('/alumnos');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser
};
