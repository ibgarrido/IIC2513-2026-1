// src/routes/user.js
const express = require('express');
const router = express.Router();
// Importar el modelo Movie creado con sequelize
const { User, Direction, Order } = require('../models');
const requireAuth = require('../middlewares/authMiddleware');


router.get('/me', requireAuth, async (req, res) => {
  try {
    const activeUserId = req.userId;
    const usuario = await User.findByPk(activeUserId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Direction,
          as: 'userDirection',
          attributes: { exclude: ['id', 'userId', 'updatedAt', 'createdAt'] }
        }
      ]
    });
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontro el usuario' });
    }
    return res.status(200).json({ data: usuario });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/me/data', requireAuth, async (req, res) => {
  try {
    const { email, calle, numero, ciudad, comuna, region, codigoPostal, password, oldPassword } = req.body;
    const userId = req.userId;

    const usuario = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'rol', 'createdAt', 'updatedAt'] },
      include: [{
        model: Direction,
        as: 'userDirection',
        attributes: { exclude: ['updatedAt', 'createdAt'] },
      }]
    });
    if (!usuario) return res.status(404).json({ error: 'No se encontro el usuario' });
    let updatedPass = false;
    if (password) {
      const userWithPass = await User.findByPk(userId, { attributes: ['password'] });
      const ok = await userWithPass.validatePassword(oldPassword);
      if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });
      await usuario.update({ password });
      updatedPass = true;
    }
    const directionFields = [calle, numero, ciudad, comuna, region, codigoPostal];
    if (directionFields.some(f => f !== undefined)) {
      const noDigit = /^[^\d]+$/;
      if (calle !== undefined && !calle.trim())
        return res.status(400).json({ error: 'Calle no puede estar vacía' });
      if (numero !== undefined && (numero < 0 || numero > 10000))
        return res.status(400).json({ error: 'Número debe estar entre 0 y 10000' });
      if (ciudad !== undefined && !noDigit.test(ciudad))
        return res.status(400).json({ error: 'Ciudad no debe contener números' });
      if (comuna !== undefined && !noDigit.test(comuna))
        return res.status(400).json({ error: 'Comuna no debe contener números' });
      if (region !== undefined && !noDigit.test(region))
        return res.status(400).json({ error: 'Región no debe contener números' });
      if (codigoPostal !== undefined && (codigoPostal < 0 || codigoPostal > 9999999))
        return res.status(400).json({ error: 'Código postal debe tener máximo 7 dígitos' });
    }

    if (calle) {
      const [direccion, created] = await Direction.findOrCreate({
        where: { userId },
        defaults: { calle, numero, ciudad, comuna, region, codigoPostal }
      });
      if (!created) {
        await direccion.update({ calle, numero, ciudad, comuna, region, codigoPostal });
      }
    }

    if (email) await usuario.update({ email });

    const result = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'rol', 'createdAt', 'updatedAt'] },
      include: [{ model: Direction, as: 'userDirection', attributes: { exclude: ['updatedAt', 'createdAt'] } }]
    });
    return res.status(200).json({ data: result, updatedPass });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/me/:userId', requireAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const activeUserId = req.userId;
    const userId = req.params.userId;
    const activeUser = await User.findByPk(activeUserId);
    if (activeUserId != userId) {
      if (activeUser.rol != 'admin') // Admin puede eliminar usuarios!
        return res.status(403).json({ message: 'Acceso no autorizado' });
    };


    const usuario = await User.findByPk(activeUserId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!usuario) return res.status(404).json({ error: 'No se encontro el usuario' });
    const ok = await usuario.validatePassword(password);
    if (!ok) return res.status(401).json({ error: 'Credenciales invalidas' });

    await usuario.destroy();
    return res.status(200).json({ message: 'Perfil eliminado' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', requireAuth, async (req, res) => {
  try {
    // TODO: es necesario buscar solo por ID o tambien buscar por email?
    const activeUserId = req.userId;
    const activeUser = await User.findByPk(activeUserId);
    if (activeUser.rol != 'admin') return res.status(403).json({ message: 'Acceso no autorizado' });

    const userId = req.params.userId;

    const usuario = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Direction,
          as: 'userDirection',
          attributes: { exclude: ['id', 'userId', 'updatedAt', 'createdAt'] }
        },
        {
          model: Order,
          as: 'userOrders',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt', 'directionId'] }
        }
      ]
    });
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontro el usuario' });
    }
    return res.status(200).json({ data: usuario });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;