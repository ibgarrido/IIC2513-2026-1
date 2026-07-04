'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direction extends Model {
    static associate(models) {
      Direction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Direction.hasMany(models.Order, {
        foreignKey: 'directionId',
        as: 'orders'
      });
    }
  }
  Direction.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 10000 }
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, is: /^[^\d]+$/i }
    },
    comuna: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, is: /^[^\d]+$/i }
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, is: /^[^\d]+$/i }
    },
    codigoPostal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 9999999 }
    },
  }, {
    sequelize,
    modelName: 'Direction',
  });
  return Direction;
};
