'use strict';

module.exports = app => {
   const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize;

   return app.model.define('user', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(30),
      password: INTEGER,
      fileAmount: {
         type: INTEGER,
         field: 'file_amount',
      },
      currentSize: {
         type: BIGINT,
         field: 'current_size',
      },
      drive: STRING(255),
      createdAt: {
         type: DATE,
         field: 'created_at',
      },
      updatedAt: {
         type: DATE,
         field: 'updated_at',
      },
   }, {
      tableName: 'users',
      underscored: true,
      timestamps: true,
   });
};
