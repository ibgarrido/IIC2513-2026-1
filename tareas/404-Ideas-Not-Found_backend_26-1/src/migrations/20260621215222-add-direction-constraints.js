'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Directions"
        ADD CONSTRAINT directions_numero_range
          CHECK (numero >= 0 AND numero <= 10000),
        ADD CONSTRAINT directions_codigo_postal_range
          CHECK ("codigoPostal" >= 0 AND "codigoPostal" <= 9999999),
        ADD CONSTRAINT directions_ciudad_no_digits
          CHECK (ciudad !~ '[0-9]'),
        ADD CONSTRAINT directions_comuna_no_digits
          CHECK (comuna !~ '[0-9]'),
        ADD CONSTRAINT directions_region_no_digits
          CHECK (region !~ '[0-9]');
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Directions"
        DROP CONSTRAINT IF EXISTS directions_numero_range,
        DROP CONSTRAINT IF EXISTS directions_codigo_postal_range,
        DROP CONSTRAINT IF EXISTS directions_ciudad_no_digits,
        DROP CONSTRAINT IF EXISTS directions_comuna_no_digits,
        DROP CONSTRAINT IF EXISTS directions_region_no_digits;
    `);
  }
};
