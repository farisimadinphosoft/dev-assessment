'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Teachers', [
      {
        id: v4(),
        email: 'teacherken@gmail.com',
        createdAt: new Date(),
      },
      {
        id: v4(),
        email: 'teacherjane@gmail.com',
        createdAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', null, {});
  }
};
