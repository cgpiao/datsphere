'use strict';

const Subscription = require('egg').Subscription;
const fs = require('fs');

class Cleanup extends Subscription {
   static get schedule() {
      return {
         interval: '1h',
         type: 'worker',
      };
   }

   async subscribe() {
      const {ctx, app} = this;
      const root = app.config.disk_root;

      const now = new Date();
      const criticalDate = new Date(now.getTime() - 86400000 * 10);
      const expiredUserFiles = await ctx.model.UserFile.findAll({
         where: {
            deletedAt: {
               [ctx.model.Op.lte]: criticalDate,
            },
         },
      });
      const expiredFiles = await ctx.model.File.findAll({
         where: {
            id: expiredUserFiles.map(f => f.fileId)
         },
      });
      for (const f of expiredFiles) {
         await f.increment('refCount', {by: 1});
      }
      const files = await ctx.model.File.findAll({
         where: {
            refCount: 0,
         },
      });
      for (const file of files) {
         file.destroy();
         fs.unlinkSync(root + '/' + file.path);
      }
   }
}

module.exports = Cleanup;
