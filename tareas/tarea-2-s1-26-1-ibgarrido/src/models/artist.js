'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    // Un Artista pertenece a un Usuario (dueño)
    Artist.belongsTo(models.User, { // Relación generada y explicada por GeminiAI. Un artista tiene un dueño, que es un usuario.
      foreignKey: 'ownerId',
      as: 'owner'
    });
    Artist.hasMany(models.Review, { // Un artista puede tener muchas reseñas, porque muchos usuarios pueden dejar reseñas para el mismo artista.
      foreignKey: 'artistId',
      as: 'reviews'
    });
    }
  }
  Artist.init({
    name: DataTypes.STRING,
    hypeLevel: DataTypes.INTEGER,
    genres: DataTypes.ARRAY(DataTypes.STRING),
    price: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};