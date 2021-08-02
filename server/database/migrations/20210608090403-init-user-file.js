'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const { BIGINT, DATE, STRING } = Sequelize;
      await queryInterface.createTable('user_file', {
         id: { type: BIGINT, primaryKey: true, autoIncrement: true },
         userId: {
            field: 'user_id',
            type: BIGINT,
         },
         fileId: {
            field: 'file_id',
            type: BIGINT,
         },
         originalName: {
            field: 'original_name',
            type: STRING(255),
         },
         parentId: {
            field: 'parent_id',
            type: BIGINT,
            allowNull: true,
         },
         size: {
            type: BIGINT,
            defaultValue: 0,
         },
         createdAt: {
            field: 'created_at',
            type: DATE,
         },
         updatedAt: {
            field: 'updated_at',
            type: DATE,
         },
         deletedAt: {
            type: DATE,
            allowNull: true,
            field: 'deleted_at',
         },
      });
   },

   down: async queryInterface => {
      await queryInterface.dropTable('user_file');
   },
};
