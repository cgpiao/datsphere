'use strict';

const bcrypt = require('bcrypt');
const md5 = require('md5');
const dayjs = require("dayjs");
const Controller = require('egg').Controller;
const {v4: uuidv4} = require('uuid');

class AccountController extends Controller {
   async show() {
      const {ctx} = this;
      if (!ctx.state.user) {
         ctx.status = 401;
         return;
      }

      const uf = await ctx.model.UserFile.findOne({
         where: {
            userId: ctx.state.user.id,
            parentId: null,
         },
      });
      if (uf.fileId) {
         const file = await ctx.model.File.findByPk(uf.fileId);
         ctx.body = {
            id: uf.id,
            originalName: uf.originalName,
            file: file ? {
               isDirectory: file.isDirectory,
               size: file.size,
               cid: file.cid,
               mime: file.mime,
            } : undefined,
         };
      } else {
         ctx.body = {
            username: ctx.state.user.username.substring(0, ctx.state.user.username.indexOf('@')),
            root: {
               id: uf.id,
               originalName: uf.originalName,
            },
         };
      }
   }

   async login() {
      const {ctx, app} = this;
      const {username, password} = ctx.request.body;
      const user = await ctx.model.User.findOne({
         where: {
            username,
         },
      });
      if (!user) {
         ctx.status = 400;
         ctx.body = 'username or password is invalid';
         return;
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
         ctx.status = 400;
         ctx.body = 'username or password is invalid';
         return;
      }
      ctx.body = app.jwt.sign({
         username: user.username,
         id: user.id,
      }, app.config.jwt.secret);
   }

   async register() {
      const {ctx, app} = this;
      const {username, password, key, code} = ctx.request.body;
      const kv = await ctx.model.Kv.findOne({
         where: {
            key,
            expiredAt: {
               [ctx.model.Op.gte]: Date.now(),
            },
         },
      });
      if (!kv || `${kv.value}` !== `${code}`) {
         ctx.status = 400;
         ctx.body = 'verification code is invalid or expired';
         return;
      }
      const hash = await bcrypt.hash(password, 10);
      const t = await ctx.model.transaction();
      try {
         const user = await ctx.model.User.create({
            username,
            password: hash,
            drive: md5(username),
         }, {transaction: t});
         await ctx.model.UserFile.create({
            userId: user.id,
            originalName: '',
         }, {transaction: t});
         ctx.body = app.jwt.sign({
            username: user.username,
            id: user.id,
         }, app.config.jwt.secret);
         await t.commit();
      } catch (e) {
         await t.rollback();
         ctx.status = 400;
         ctx.body = 'email already in use';
      }
   }

   async logout() {
      const {ctx, app} = this;
      const userToken = ctx.request.headers['x-token'];
      await app.redis.del(userToken);
      ctx.body = ctx.state.user;
   }

   async forgotPassword() {
      const {ctx} = this;
      const {username} = ctx.request.body;
      const result = await ctx.service.mail.sendResetPasswordLink(username);
      // send
      if (result) {
         ctx.status = 200;
         ctx.body = result;
      } else {
         ctx.status = 400;
         ctx.body = 'email is not valid';
      }
      ctx.body = '';
   }

   async resetPassword() {
      const {ctx, app} = this;
      const {token, password} = ctx.request.body;
      const mail = await ctx.model.Kv.findOne({
         where: {
            key: token,
         },
      });
      const user = await ctx.model.User.findOne({
         username: mail.value,
      });
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      ctx.body = '';
      ctx.body = app.jwt.sign({
         username: user.username,
         id: user.id,
      }, app.config.jwt.secret);
   }

   async changePassword() {
      const {ctx} = this;
      const {currentPassword, password} = ctx.request.body;
      const user = await ctx.model.User.findByPk(ctx.state.user.id);
      const result = await bcrypt.compare(currentPassword, user.password);
      if (!result) {
         ctx.status = 400;
         ctx.body = 'Password is incorrect';
         return;
      }
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      ctx.body = '';
   }
}

module.exports = AccountController;
