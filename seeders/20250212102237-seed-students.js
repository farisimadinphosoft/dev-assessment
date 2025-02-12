'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Students', [
      {
        id: v4(),
        email: 'studentjon@gmail.com',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: v4(),
        email: 'studenthon@gmail.com',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: v4(),
        email: 'commonstudent1@gmail.com',
        status: 'active',
        createdAt: new Date(),
      },
      {
        id: v4(),
        email: 'commonstudent2@gmail.com',
        status: 'active',
        createdAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', null, {});
  }
};
