const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

//login authentication
// https://medium.com/@svk19998/building-a-secure-login-system-with-node-js-bcrypt-and-jwt-authentication-b3e5b25de218
// https://stackoverflow.com/questions/40076638/compare-passwords-bcryptjs (bcrypt compare)
// https://stackoverflow.com/questions/56855440/in-jwt-the-sign-method (Sign method)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: 'user not found' });
    }

    // Comparar contraseña (hashed + salted)
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '4h' }
    );

    // Respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
        image: user.image
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, image } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      balance: 5000,
      image: image || null
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        balance: newUser.balance,
        image: newUser.image
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;