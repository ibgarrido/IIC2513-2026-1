'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Product, {
        foreignKey: 'categoriaId',
        as: 'products'
      });
    }
  }
  Categoria.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias',
  });
  return Categoria;
};
