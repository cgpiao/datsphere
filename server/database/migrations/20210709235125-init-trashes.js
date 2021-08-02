'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const {BIGINT, DATE} = Sequelize;
      await queryInterface.createTable('trashes', {
         id: {type: BIGINT, primaryKey: true, autoIncrement: true},
         userId: {
            field: 'user_id',
            type: BIGINT,
         },
         ufId: {
            field: 'uf_id',
            type: BIGINT,
         },
         createdAt: {
            field: 'created_at',
            type: DATE,
         },
      });
   },

   down: async (queryInterface) => {
      return await queryInterface.dropTable('trashes');
   },
};
