// https://sequelize.org/docs/v6/core-concepts/model-querying-finders/ findByPk
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /users/:id - Obtener Usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Excluimos la contraseña por seguridad
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id - Actualizar Usuario
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este perfil' });
    }

    const { username, image, password, balance } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    if (image) user.image = image;
    if (balance !== undefined) user.balance = balance;

    if (password) {
      const bcrypt = require('bcrypt');
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance,
        image: user.image
      }
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /users/:id - Eliminar Usuario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este perfil' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;