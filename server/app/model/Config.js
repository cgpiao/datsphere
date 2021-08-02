'use strict';

module.exports = app => {
   const { STRING, BIGINT, DATE, TEXT, BOOLEAN, JSON } = app.Sequelize;

   return app.model.define('Config', {
      id: { type: BIGINT, primaryKey: true, autoIncrement: true },
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
   }, {
      tableName: 'configs',
      underscored: true,
      timestamps: false,
   });
};
