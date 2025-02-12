"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("students", "status", {
      type: Sequelize.ENUM("active", "suspended"),
      allowNull: false,
      defaultValue: "active",
    });

    await queryInterface.changeColumn("students", "updatedAt", {
      allowNull: true,
      type: Sequelize.DATE,
    });

    await queryInterface.changeColumn("teachers", "updatedAt", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("students", "status");

    await queryInterface.changeColumn("students", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
    });

    await queryInterface.changeColumn("teachers", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
    });
  },
};
