'use strict';

module.exports = app => {
   const { STRING, INTEGER, DATE, BIGINT, BOOLEAN, TEXT } = app.Sequelize;

   return app.model.define('file', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
      mime: STRING(255),
      cid: {
         type: STRING(255),
         allowNull: true,
      },
      md5: {
         type: STRING(255),
         allowNull: true,
      },
      isDirectory: {
         field: 'is_directory',
         type: BOOLEAN,
         defaultValue: false,
      },
      size: {
         type: BIGINT,
         defaultValue: 0,
      },
      path: {
         type: TEXT,
         allowNull: true,
      },
      refCount: {
         field: 'ref_count',
         type: INTEGER,
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
      expiredAt: {
         type: DATE,
         allowNull: true,
         field: 'expired_at',
      },
   }, {
      tableName: 'files',
      underscored: true,
      timestamps: true,
   });
};
