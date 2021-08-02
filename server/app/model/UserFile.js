'use strict';

module.exports = app => {
   const { STRING, DATE, BIGINT } = app.Sequelize;

   return app.model.define('UserFile', {
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
   }, {
      tableName: 'user_file',
      underscored: true,
      timestamps: true,
   });
};
