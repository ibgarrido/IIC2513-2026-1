'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Carts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      varianteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Variantes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('CartItems');
  }
};