'use strict';

module.exports = app => {
   const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

   return app.model.define('Kv', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      key: {
         type: STRING(255),
      },
      value: {
         type: TEXT,
         defaultValue: '',
      },
      expiredAt: {
         type: DATE,
         field: 'expired_at',
      },
   }, {
      tableName: 'kv',
      underscored: true,
      timestamps: false,
   });
};
