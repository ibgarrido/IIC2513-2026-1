'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Artists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      hypeLevel: {
        type: Sequelize.INTEGER,
        validate : {
          min: 1,
          max: 100
        }
      },
      genres: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      price: {
        type: Sequelize.INTEGER,
        validate : {
          min: 50,
          max: 2000
        }
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: true   
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Artists');
  }
};