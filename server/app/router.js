'use strict';

module.exports = app => {
   const { router, controller } = app;
   const prefix = app.config.prefix;
   router.get(prefix + '/assets/:path', controller.asset.show);
   router.get(prefix + '/test/send', controller.test.send);
   router.post(prefix + '/login', controller.account.login);
   router.post(prefix + '/register', controller.account.register);
   router.post(prefix + '/forgot-password', controller.account.forgotPassword);
   router.post(prefix + '/reset-password', controller.account.resetPassword);
   router.post(prefix + '/change-password', app.jwt, controller.account.changePassword);
   router.post(prefix + '/codes/send', controller.code.send);
   router.post(prefix + '/hashes/:hash/pin', app.jwt, controller.hash.pin);
   router.get(prefix + '/account', app.jwt, controller.account.show);
   router.resources(prefix + '/files', app.jwt, controller.file);
   router.post(prefix + '/upload', app.jwt, controller.file.upload);
   router.get(prefix + '/files/:id/download', app.jwt, controller.file.download);
   router.post(prefix + '/files/:id/rename', app.jwt, controller.file.rename);
   router.post(prefix + '/files/:id/back', app.jwt, controller.file.back);
   router.post(prefix + '/files/:id/clear', app.jwt, controller.file.clear);
   router.post(prefix + '/import', app.jwt, controller.file.import);
};
