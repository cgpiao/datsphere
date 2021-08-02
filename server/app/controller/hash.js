'use strict';

const Controller = require('egg').Controller;

class HashController extends Controller {
   async pin() {
      const {ctx} = this;
      // const user = ctx.state.user;
      const hash = this.ctx.params.hash;
      try {
         // const stat = await ctx.service.ipfs.stat(hash);
         ctx.status = 200;
         setTimeout(async () => {
            await ctx.service.ipfs.get(hash, ctx.request.body.parent);
         }, 100);
      } catch (e) {
         ctx.body = 'Hash is not valid.';
         ctx.status = 400;
      }
   }
}

module.exports = HashController;
