// src/routes/cart.js
const express = require('express');
const router = express.Router();
const { CartItem, Cart, Variante, Product } = require('../models');
const requireAuth = require('../middlewares/authMiddleware');


router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({
      where: { userId },
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          attributes: { exclude: ['updatedAt', 'createdAt', "varianteId", "cartId"] },
          include: [
            {
              model: Variante,
              as: 'variante',
              attributes: { exclude: ['updatedAt', 'createdAt', 'productId'] },
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: { exclude: ['descripcion', 'updatedAt', 'createdAt'] },
                }
              ]
            }
          ]
        }
      ]
    });
    if (!cart) return res.status(404).json({ error: 'No se encontró el carrito' });

    return res.status(200).json({ data: cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { varianteId, quantity: rawQuantity } = req.body;
    const quantity = parseInt(rawQuantity, 10);

    const variante = await Variante.findByPk(varianteId);
    if (!variante) return res.status(404).json({ error: 'No se encontró la variante seleccionada.' });

    const cart = await Cart.findOne({ where: { userId } });

    const existing = await CartItem.findOne({ where: { cartId: cart.id, varianteId } });
    const currentQty = existing ? existing.quantity : 0;
    if (variante.stock < currentQty + quantity)
      return res.status(400).json({ error: 'No hay suficiente stock del producto.' });

    if (existing) {
      await existing.increment('quantity', { by: quantity });
      await existing.reload();
      return res.status(200).json({ data: existing });
    }

    const cartItem = await CartItem.create({ cartId: cart.id, varianteId, quantity });
    return res.status(201).json({ data: cartItem });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/:cartItemId', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;
    const { quantity: rawQuantity } = req.body;
    const quantity = parseInt(rawQuantity, 10);

    const cart = await Cart.findOne({ where: { userId } });
    const cartItem = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });
    if (!cartItem) return res.status(404).json({ error: 'Item no encontrado en el carrito.' });

    const variante = await Variante.findByPk(cartItem.varianteId);
    if (variante.stock < quantity)
      return res.status(400).json({ error: 'No hay suficiente stock del producto.' });

    await cartItem.update({ quantity });
    return res.status(200).json({ data: cartItem });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:cartItemId', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });
    const cartItem = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });
    if (!cartItem) return res.status(404).json({ error: 'Item no encontrado en el carrito.' });

    await cartItem.destroy();
    return res.status(200).json({ message: 'Item eliminado del carrito.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});





module.exports = router;