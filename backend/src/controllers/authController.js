const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const yaExiste = await User.findOne({ email });
    if (yaExiste) return res.status(400).json({ message: 'El correo ya está registrado' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token: generarToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token: generarToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = { registerUser, loginUser };
