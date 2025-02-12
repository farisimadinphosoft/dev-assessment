'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Students', [
      {
        id: v4(),
        email: 'studentjon@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        email: 'studenthon@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', null, {});
  }
};
