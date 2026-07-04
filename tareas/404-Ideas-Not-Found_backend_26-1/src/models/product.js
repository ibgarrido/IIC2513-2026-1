'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria'
      });
      Product.hasMany(models.Variante, {
        foreignKey: 'productId',
        as: 'variantes'
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.STRING,
    precioBase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image_url: DataTypes.STRING,
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
