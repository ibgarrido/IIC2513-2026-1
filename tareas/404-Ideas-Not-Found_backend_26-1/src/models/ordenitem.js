'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
      OrderItem.belongsTo(models.Variante, {
        foreignKey: 'varianteId',
        as: 'variante'
      });
    }
  }
  OrderItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    varianteId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    varianteTalla: {
      type: DataTypes.STRING,
      allowNull: false
    },
    varianteColor: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
