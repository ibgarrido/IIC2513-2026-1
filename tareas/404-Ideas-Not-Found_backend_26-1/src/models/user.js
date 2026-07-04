'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
    static associate(models) {
      User.hasOne(models.Direction, {
        foreignKey: 'userId',
        as: 'userDirection'
      });
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'userOrders'
      });
      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        as: 'cart'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'client'
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        user.email = user.email.toUpperCase();
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  return User;
};