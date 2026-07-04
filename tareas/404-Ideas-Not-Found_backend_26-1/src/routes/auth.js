// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Importar el modelo Movie creado con sequelize
const { User, Cart, sequelize } = require('../models');


const signToken = (user) => {
  const payload = { sub: user.id, nombre: user.nombre, rol: user.rol };
  const opts = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET, opts);
};


router.post('/register', async (req, res) => {
  try {
    const { nombre, password, email } = req.body;

    if (!nombre || !password || !email) {
      return res.status(400).json({
        error: 'username, password y email son obligatorios'
      });
    }

    const existing_name = await User.findOne({ where: { nombre } });
    if (existing_name) return res.status(409).json({ error: 'El usuario ya existe. Verifica tu contraseña.' });

    const existing_mail = await User.findOne({ where: { email: email.toUpperCase() } });
    if (existing_mail) return res.status(409).json({ error: 'Ya hay un usuario con ese correo.' });

    const { user, userCart } = await sequelize.transaction(async (t) => {
      const user = await User.create({ nombre, password, email }, { transaction: t });
      const userCart = await Cart.create({ userId: user.id }, { transaction: t });
      return { user, userCart };
    });

    const token = signToken(user);

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        cartId: userCart.id,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son obligatorios' });

    const user = await User.findOne({ where: { email: email.toUpperCase() } });
    if (!user) return res.status(401).json({ error: 'Credenciales invalidas' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales invalidas' });

    const token = signToken(user);
    const cart = await Cart.findOne({ where: { userId: user.id } });
    return res.status(200).json({
      message: 'Login OK',
      token,
      user: {
        nombre: user.nombre,
        carrito: cart.id
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;