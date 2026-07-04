'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      categoriaId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Categorias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING
      },
      precioBase: {
        type: Sequelize.INTEGER
      },
      image_url: {
        type: Sequelize.STRING
      },
      activo: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Products');
  }
};