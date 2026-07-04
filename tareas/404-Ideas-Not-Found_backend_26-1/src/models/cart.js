'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'cartItems'
      });
    }
  }
  Cart.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};
