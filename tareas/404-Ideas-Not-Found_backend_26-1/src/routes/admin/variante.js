const express = require('express');
const router = express.Router();
const { Variante, CartItem, OrderItem } = require('../../models');

router.patch('/:varianteId', async (req, res) => {
  try {
    const variante = await Variante.findByPk(req.params.varianteId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!variante) return res.status(404).json({ error: 'Variante no encontrada' });

    const { talla, color, stock, extraPrice } = req.body;

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }

    const resolvedTalla = talla ?? variante.talla;
    const resolvedColor = color ?? variante.color;

    const conflict = await Variante.findOne({
      where: { productId: variante.productId, talla: resolvedTalla, color: resolvedColor },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (conflict && conflict.id !== variante.id) {
      return res.status(409).json({
        error: 'Ya existe una variante con esta talla y color para este producto',
        existing: conflict
      });
    }

    await variante.update({ talla, color, stock, extraPrice });
    return res.status(200).json({ data: variante });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:varianteId', async (req, res) => {
  try {
    const variante = await Variante.findByPk(req.params.varianteId);
    if (!variante) return res.status(404).json({ error: 'Variante no encontrada' });

    const inCart = await CartItem.count({ where: { varianteId: req.params.varianteId } });
    if (inCart > 0) {
      return res.status(409).json({ error: 'La variante está en carritos activos y no puede eliminarse' });
    }

    await OrderItem.update({ varianteId: null }, { where: { varianteId: req.params.varianteId } });

    await variante.destroy();
    return res.status(200).json({ message: 'Variante eliminada' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
