'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const {BIGINT, DATE, STRING, TEXT} = Sequelize;
      await queryInterface.createTable('kv', {
         id: {type: BIGINT, primaryKey: true, autoIncrement: true},
         key: STRING,
         value: TEXT,
         expiredAt: {
            type: DATE,
            allowNull: true,
            field: 'expired_at',
         },
      });
   },

   down: async queryInterface => {
      await queryInterface.dropTable('kv');
   },
};
