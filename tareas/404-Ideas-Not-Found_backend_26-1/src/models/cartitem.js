'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart'
      });
      CartItem.belongsTo(models.Variante, {
        foreignKey: 'varianteId',
        as: 'variante'
      });
    }
  }
  CartItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    varianteId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};
