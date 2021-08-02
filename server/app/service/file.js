'use strict';
const Service = require('egg').Service;
const fs = require('fs');

const {v4: uuidv4} = require('uuid');
const AdmZip = require('adm-zip');

class FileService extends Service {
   async download() {
      const {ctx, app} = this;
      const root = app.config.disk_root;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);
      const file = await ctx.model.File.findByPk(uf.fileId);
      let filePath = null;
      let originalName = uf.originalName.replace(/(\s+)/g, '\\$1');
      if (!uf.fileId) {
         // Folder
         const uuid = uuidv4();
         const tempPath = root + '/' + uuid + '/' + uf.originalName.replace(/(\s+)/g, '\\$1');
         fs.mkdirSync(tempPath, {recursive: true});
         await this.copyChild(tempPath, uf.id);
         const zip = new AdmZip();
         zip.addLocalFolder(tempPath);
         const zipPath = root + '/' + uuid + '/' + uf.originalName.replace(/(\s+)/g, '\\$1') + '.zip';
         filePath = zipPath;
         zip.writeZip(zipPath);
         originalName = uf.originalName.replace(/(\s+)/g, '\\$1') + '.zip';
      } else {
         filePath = root + '/' + file.path;
      }
      ctx.attachment(originalName);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(filePath);
   }

   async delete(parentIdList) {
      const { ctx } = this;
      await ctx.model.UserFile.update({deletedAt: new Date()}, {
         where: {
            id: parentIdList,
         },
      });
      const childList = await ctx.model.UserFile.findAll({
         where: {
            parentId: parentIdList,
         },
      });
      if (childList.length > 0) {
         await this.delete(childList.map(c => c.id));
      }
   }

   async clear(parentIdList, transaction) {
      const { ctx } = this;
      await ctx.model.UserFile.destroy({
         where: {
            id: parentIdList,
         },
      }, {transaction});
      const childList = await ctx.model.UserFile.findAll({
         where: {
            parentId: parentIdList,
         },
      });
      if (childList.length > 0) {
         await this.clear(childList.map(c => c.id), transaction);
      }
   }

   async back(parentIdList, transaction) {
      const { ctx } = this;
      await ctx.model.UserFile.update({deletedAt: null}, {
         where: {
            id: parentIdList,
         },
      }, {transaction});
      const childList = await ctx.model.UserFile.findAll({
         where: {
            parentId: parentIdList,
         },
      });
      if (childList.length > 0) {
         await this.back(childList.map(c => c.id), transaction);
      }
   }

   async copyChild(path, parentId) {
      const root = this.app.config.disk_root;
      const user = this.ctx.state.user;
      const childList = await this.ctx.model.UserFile.findAll({
         where: {
            parentId,
            deletedAt: null,
            userId: user.id,
         },
         attributes: ['id', 'fileId', 'originalName', 'size'],
      });
      for (const c of childList) {
         if (c.fileId) {
            // file
            const file = await this.ctx.model.File.findByPk(c.fileId);
            const source = root + '/' + file.path;
            const target = path + '/' + c.originalName.replace(/(\s+)/g, '\\$1');
            fs.copyFileSync(source, target);
         } else {
            fs.mkdirSync(path + '/' + c.originalName.replace(/(\s+)/g, '\\$1'));
            await this.copyChild(path + '/' + c.object, c.id);
         }
      }
   }

   async checkExist(fileName, parent) {
      const {ctx} = this;
      const childList = await ctx.model.UserFile.findAll({
         where: {
            parentId: parent,
            deletedAt: null,
         },
      }).map(uf => uf.originalName);

      return childList.includes(fileName.trim());
   }
}

module.exports = FileService;
