'use strict';
const { Order, OrderStatus } = require('../models');

const STATUS_ORDER = ['recibido', 'confirmado', 'procesando', 'embalando', 'enviado', 'terminado'];
const INTERVAL_MS = 20 * 60 * 1000;

async function advanceOrderStatuses() {
  const orders = await Order.findAll({ attributes: ['id'] });

  for (const order of orders) {
    const latest = await OrderStatus.findOne({
      where: { orderId: order.id },
      order: [['fecha', 'DESC']]
    });

    const currentStatus = latest?.status;
    if (!currentStatus || currentStatus === 'terminado') continue;

    const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(currentStatus) + 1];
    await OrderStatus.create({ orderId: order.id, status: nextStatus, fecha: new Date() });
    console.log(`[orderJob] Order ${order.id}: ${currentStatus} → ${nextStatus}`);
  }
}

function startOrderStatusJob() {
  setInterval(advanceOrderStatuses, INTERVAL_MS);
  console.log('[orderJob] Status advancement job started (every 20 min)');
}

module.exports = { startOrderStatusJob, advanceOrderStatuses };
