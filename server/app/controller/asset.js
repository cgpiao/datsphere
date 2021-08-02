'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');

class AssetController extends Controller {
   async show() {
      const {ctx, app} = this;
      let diskRoot = app.config.disk_root;
      diskRoot = diskRoot.split('/');
      diskRoot.pop();

      const path = ctx.params.path;
      const filePath = `${diskRoot.join('/')}/assets/${path}`;

      ctx.attachment(filePath);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(filePath);
   }
}

module.exports = AssetController;
