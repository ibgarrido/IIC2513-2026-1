'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Order.belongsTo(models.Direction, {
        foreignKey: 'directionId',
        as: 'direction'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems'
      });
      Order.hasMany(models.OrderStatus, {
        foreignKey: 'orderId',
        as: 'statuses'
      });
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    directionId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
