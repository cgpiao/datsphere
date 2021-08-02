'use strict';

module.exports = app => {
   const { BIGINT, INTEGER, DATE, STRING } = app.Sequelize;

   return app.model.define('Token', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
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
   }, {
      tableName: 'tokens',
      underscored: true,
      timestamps: true,
      updatedAt: false,
   });
};
