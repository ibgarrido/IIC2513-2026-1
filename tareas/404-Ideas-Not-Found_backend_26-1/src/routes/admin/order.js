const express = require('express');
const router = express.Router();
const { Order, OrderItem, OrderStatus, Variante, Product, User, Direction } = require('../../models');

const STATUS_ORDER = ['recibido', 'confirmado', 'procesando', 'embalando', 'enviado', 'terminado'];

const ORDER_INCLUDE = [
  {
    model: OrderItem,
    as: 'orderItems',
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [{
      model: Variante,
      as: 'variante',
      include: [{ model: Product, as: 'product', attributes: { exclude: ['createdAt', 'updatedAt'] } }]
    }]
  },
  { model: OrderStatus, as: 'statuses' },
  { model: User, as: 'user', attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
  { model: Direction, as: 'direction', attributes: { exclude: ['createdAt', 'updatedAt'] } }
];

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: ORDER_INCLUDE,
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ data: orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: ORDER_INCLUDE
    });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    return res.status(200).json({ data: order });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/:orderId', async (req, res) => {
  try {
    const { status, descripcion } = req.body;
    const { orderId } = req.params;

    if (!status) return res.status(400).json({ error: 'status is required' });
    if (!STATUS_ORDER.includes(status)) return res.status(400).json({ error: 'Invalid status value' });

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const latest = await OrderStatus.findOne({
      where: { orderId },
      order: [['fecha', 'DESC']]
    });

    const currentIndex = latest ? STATUS_ORDER.indexOf(latest.status) : -1;
    const newIndex = STATUS_ORDER.indexOf(status);

    if (newIndex <= currentIndex) {
      return res.status(400).json({
        error: `New status must be ahead of current status ('${latest ? latest.status : 'none'}')`
      });
    }

    await OrderStatus.create({ orderId, status, descripcion, fecha: new Date() });

    const result = await Order.findByPk(orderId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: ORDER_INCLUDE
    });

    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
