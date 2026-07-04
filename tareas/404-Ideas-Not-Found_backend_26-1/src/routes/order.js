// src/routes/order.js
const express = require('express');
const router = express.Router();
const { sequelize, Order, OrderItem, OrderStatus, Cart, CartItem, Variante, Product, User, Direction } = require('../models');
const requireAuth = require('../middlewares/authMiddleware');

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Direction, as: 'userDirection' }]
    });

    const result = await Order.findAll({
      where: { userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [{
            model: Variante,
            as: 'variante',
            include: [{
              model: Product,
              as: 'product',
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            }]
          }]
        },
        {
          model: OrderStatus,
          as: 'statuses'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        },
        {
          model: Direction,
          as: 'direction',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    });

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Direction, as: 'userDirection' }]
    });

    if (!user.userDirection) {
      return res.status(400).json({ error: 'User has no saved address' });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [{ model: Product, as: 'product' }]
            }
          ]
        }
      ]
    });

    if (!cart || !cart.cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cart.cartItems) {
      if (item.quantity > item.variante.stock) {
        return res.status(400).json({
          error: `Insufficient stock for variant ${item.variante.id} (${item.variante.color} / ${item.variante.talla})`
        });
      }
    }

    const order = await sequelize.transaction(async (t) => {
      const total = cart.cartItems.reduce((sum, item) => {
        const unitPrice = item.variante.product.precioBase + item.variante.extraPrice;
        return sum + unitPrice * item.quantity;
      }, 0);

      const newOrder = await Order.create(
        { userId, directionId: user.userDirection.id, total },
        { transaction: t }
      );

      await Promise.all(cart.cartItems.map((item) => {
        const unitPrice = item.variante.product.precioBase + item.variante.extraPrice;
        return OrderItem.create(
          {
            orderId: newOrder.id,
            varianteId: item.variante.id,
            cantidad: item.quantity,
            unitPrice,
            productName: item.variante.product.nombre,
            varianteTalla: item.variante.talla,
            varianteColor: item.variante.color
          },
          { transaction: t }
        );
      }));

      await OrderStatus.create(
        { orderId: newOrder.id, status: 'recibido', descripcion: "Pedido ingresado con éxito", fecha: new Date() },
        { transaction: t }
      );

      await Promise.all(cart.cartItems.map((item) =>
        item.variante.decrement('stock', { by: item.quantity, transaction: t })
      ));

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      return newOrder;
    });

    const result = await Order.findByPk(order.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [{
            model: Variante,
            as: 'variante',
            include: [{
              model: Product,
              as: 'product',
              attributes: { exclude: ['createdAt', 'updatedAt'] }
            }]
          }]
        },
        {
          model: OrderStatus,
          as: 'statuses'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        },
        {
          model: Direction,
          as: 'direction',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    });

    return res.status(201).json({ data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
