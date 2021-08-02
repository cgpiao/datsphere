'use strict';

module.exports = app => {
   const { BIGINT, INTEGER, DATE } = app.Sequelize;

   return app.model.define('Trash', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
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
   }, {
      tableName: 'trashes',
      underscored: true,
      timestamps: true,
      updatedAt: false,
   });
};
