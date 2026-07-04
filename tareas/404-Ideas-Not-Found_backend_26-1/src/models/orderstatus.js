'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderStatus extends Model {
    static associate(models) {
      OrderStatus.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
    }
  }
  OrderStatus.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'recibido',
        'confirmado',
        'procesando',
        'embalando',
        'enviado',
        'terminado'
      ),
      allowNull: false
    },
    descripcion: DataTypes.STRING,
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderStatus',
  });
  return OrderStatus;
};
