'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const {BIGINT, DATE, STRING, TEXT, JSON, BOOLEAN} = Sequelize;
      await queryInterface.createTable('configs', {
         id: {type: BIGINT, primaryKey: true, autoIncrement: true},
         key: STRING,
         textValue: {
            type: TEXT,
            allowNull: true,
            field: 'text_value',
         },
         jsonValue: {
            type: JSON,
            allowNull: true,
            field: 'json_value',
         },
         intValue: {
            type: BIGINT,
            allowNull: true,
            field: 'int_value',
         },
         boolValue: {
            type: BOOLEAN,
            allowNull: true,
            field: 'bool_value',
         },
         dateValue: {
            type: DATE,
            allowNull: true,
            field: 'date_value',
         },
      });
   },

   down: async queryInterface => {
      await queryInterface.dropTable('configs');
   },
};
