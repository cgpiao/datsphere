'use strict';

const Subscription = require('egg').Subscription;
const IpfsHttpClient = require('ipfs-http-client');
const fs = require('fs');

class Pin extends Subscription {
   static get schedule() {
      return {
         interval: '1m',
         type: 'worker',
      };
   }

   async subscribe() {
      const {ctx, app} = this;
      ctx.logger.info('===== Schedule::pin start');
      const RUNNING = 'RUNNING';
      const IDLE = 'IDLE';
      const PIN_STATE = 'PIN_STATE';
      const root = app.config.disk_root;
      let record = await ctx.model.Config.findOne({
         where: {
            key: PIN_STATE,
         },
      });
      if (record && record.textValue === RUNNING) {
         return;
      }
      if (record) {
         record.textValue = RUNNING;
         record.save();
      } else {
         record = await ctx.model.Config.create({
            key: PIN_STATE,
            textValue: RUNNING,
         });
      }
      try {
         const fileList = await ctx.model.File.findAll({
            where: {
               cid: null,
            },
         });
         const {globSource} = IpfsHttpClient;
         const ipfs = IpfsHttpClient.create(app.config.ipfs_host);
         for (const file of fileList) {
            if (!fs.existsSync(root + '/' + file.path)) {
               return;
            }
            const {cid} = await ipfs.add(globSource(root + '/' + file.path, {recursive: true}));
            file.cid = cid.toString();
            await file.save();
         }
         ctx.logger.info('===== Schedule::pin end');
      } catch (e) {
         ctx.logger.info(`===== Schedule::pin error[${e.message}]`);
         ctx.logger.error(`===== Schedule::pin error[${e.message}]`);
      } finally {
         record.textValue = IDLE;
         await record.save();
      }
   }
}

module.exports = Pin;
