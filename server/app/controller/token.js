'use strict';

const Controller = require('egg').Controller;

class TokenController extends Controller {
   async index() {

   }

   async create() {
      const {app, ctx} = this;
      const user = ctx.state.user;

      // files:read, files:write, files:delete, cid:pin
      const {name, scope} = ctx.request.body;
      const token = app.jwt.sign({
         username: user.username,
         id: user.id,
         scope,
         name,
      }, app.config.jwt.secret);
      await ctx.model.Token.create({
         userId: user.id,
         name,
         token,
         scope,
      });
      ctx.body = token;
   }

   async destroy() {

   }
}

module.exports = TokenController;
