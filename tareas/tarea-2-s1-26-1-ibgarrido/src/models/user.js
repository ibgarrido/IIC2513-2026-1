'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // relación generada y explicada por GeminiAI. Un usuario puede tener muchos artistas, porque un usuario puede contratar a varios artistas.
      User.hasMany(models.Artist, {
      foreignKey: 'ownerId',
      as: 'artists'
    });
     User.hasMany(models.Review, { // Un usuario puede tener muchas reseñas, porque un usuario puede dejar reseñas para varios artistas.
      foreignKey: 'userId',
      as: 'reviews'
    });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};