'use strict';

const Controller = require('egg').Controller;

class CodeController extends Controller {
   async send() {
      const {ctx} = this;
      const {email} = ctx.request.body;
      // const re = /^.+?@\w+\.[a-z]+$/;
      // if (!re.test(String(email).toLowerCase())) {
      //    ctx.body = 'email is not valid';
      //    ctx.status = 400;
      //    return;
      // }
      const user = await ctx.model.User.findOne({
         where: {
            username: email,
         },
      });
      if (user) {
         ctx.status = 400;
         ctx.body = 'email already in use';
         return;
      }
      const result = await ctx.service.mail.sendVerificationCode(email);
      // send
      if (result) {
         ctx.status = 200;
         ctx.body = result;
      } else {
         ctx.status = 400;
         ctx.body = 'email is not valid';
      }

   }
}

module.exports = CodeController;
