'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Orders', key: 'id' },
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
      cantidad: {
        type: Sequelize.INTEGER
      },
      unitPrice: {
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      varianteTalla: {
        type: Sequelize.STRING,
        allowNull: false
      },
      varianteColor: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('OrderItems');
  }
};