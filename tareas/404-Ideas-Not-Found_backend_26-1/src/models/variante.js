'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variante extends Model {
    static associate(models) {
      Variante.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  Variante.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    talla: DataTypes.STRING,
    color: DataTypes.STRING,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    extraPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Variante',
  });
  return Variante;
};
