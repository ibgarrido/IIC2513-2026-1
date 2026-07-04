'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('OrderStatuses', 'status', {
      type: Sequelize.ENUM(
        'recibido',
        'confirmado',
        'procesando',
        'embalando',
        'enviado',
        'terminado'
      ),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('OrderStatuses', 'status', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
