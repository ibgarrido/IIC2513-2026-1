'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_varianteId_fkey";
      ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_varianteId_fkey1";
      ALTER TABLE "OrderItems" ALTER COLUMN "varianteId" DROP NOT NULL;
      ALTER TABLE "OrderItems"
        ADD CONSTRAINT "OrderItems_varianteId_fkey"
        FOREIGN KEY ("varianteId") REFERENCES "Variantes"(id)
        ON UPDATE CASCADE ON DELETE SET NULL;
    `);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_varianteId_fkey";
      DELETE FROM "OrderItems" WHERE "varianteId" IS NULL;
      ALTER TABLE "OrderItems" ALTER COLUMN "varianteId" SET NOT NULL;
      ALTER TABLE "OrderItems"
        ADD CONSTRAINT "OrderItems_varianteId_fkey"
        FOREIGN KEY ("varianteId") REFERENCES "Variantes"(id)
        ON UPDATE CASCADE ON DELETE CASCADE;
    `);
  }
};
