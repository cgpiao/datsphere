'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const {BIGINT, DATE, STRING} = Sequelize;
      await queryInterface.createTable('tokens', {
         id: {type: BIGINT, primaryKey: true, autoIncrement: true},
         userId: {
            field: 'user_id',
            type: BIGINT,
         },
         name: {
            type: STRING,
         },
         token: {
            field: 'token',
            type: STRING,
         },
         scope: {
            field: 'token',
            type: STRING,
         },
         createdAt: {
            field: 'created_at',
            type: DATE,
         },
      });
   },

   down: async (queryInterface) => {
      return await queryInterface.dropTable('tokens');
   },
};
