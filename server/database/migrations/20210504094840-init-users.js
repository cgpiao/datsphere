'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const { BIGINT, DATE, STRING } = Sequelize;
      await queryInterface.createTable('users', {
         id: { type: BIGINT, primaryKey: true, autoIncrement: true },
         username: {
            type: STRING(30),
            unique: true,
         },
         password: {
            type: STRING(255),
         },
         file_amount: {
            type: BIGINT,
            defaultValue: 0,
         },
         current_size: {
            type: BIGINT,
            defaultValue: 0,
         },
         drive: STRING(255),
         created_at: DATE,
         updated_at: DATE,
      });
   },
   down: async queryInterface => {
      await queryInterface.dropTable('users');
   },
};
