'use strict';

module.exports = appInfo => {
   const config = exports = {};

   config.keys = appInfo.name + '_{{keys}}';
   config.multipart = {
      mode: 'file',
      fileExtensions: [ '.pdf', '.php', '' ],
   };
   exports.bodyParser = {
      jsonLimit: '5mb',
      formLimit: '15mb',
   };
   // add your config here
   config.middleware = [
      'auth',
   ];
   config.redis = {
      client: {
         port: 6379,
         host: '127.0.0.1',
         password: null,
         db: 0,
      },
   };

   // change to your own sequelize configurations
   config.sequelize = {
      dialect: 'mysql',
      database: 'datsphere',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
   };
   config.security = {
      csrf: {
         enable: false,
      },
      domainWhiteList: [ 'http://localhost:8080' ],
   };
   config.jwt = {
      secret: process.env.JWT_SECRET || '12345',
   };
   config.disk_root = process.env.DISK_ROOT || '/Users/piaocg/Workspace/fildrive/server/server/disk';
   config.ipfs_host = process.env.IPFS_HOST || 'http://127.0.0.1:5001';
   config.prefix = process.env.PREFIX || '';
   config.host = process.env.HOST || 'http://127.0.0.1:7001';
   config.mailgun = {
      api_key: process.env.MAILGUN_API_KEY,
   };

   return config;
};
