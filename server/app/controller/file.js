'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const md5File = require('md5-file');
const {v4: uuidv4} = require('uuid');
const {decode} = require('js-base64');

class FileController extends Controller {
   async index() {
      const {ctx} = this;
      const user = ctx.state.user;
      const {folder, from = '1'} = this.ctx.query;
      const trashList = await ctx.model.Trash.findAll({
         where: {
            userId: user.id,
         },
         attributes: ['ufId'],
      }).map(item => item.ufId);
      const where = {
         userId: user.id,
      };
      if (from === '1') {
         // all files
         where.parentId = folder;
         where.deletedAt = null;
      } else {
         // trash
         where.id = trashList;
      }
      const childList = await ctx.model.UserFile.findAll({
         where,
         attributes: ['id', 'fileId', 'originalName', 'size', 'deletedAt'],
      }).map(uf => {
         return {
            id: uf.id,
            fileId: uf.fileId,
            originalName: uf.originalName,
            size: uf.size,
            deletedAt: uf.deletedAt
         }
      });
      const fileList = await ctx.model.File.findAll({
         where: {
            id: childList.map(c => c.fileId),
         },
      });
      const result = [];
      for (const child of childList) {
         // eslint-disable-next-line no-return-assign
         const target = fileList.find(f => f.id === child.fileId);
         result.push({
            id: child.id,
            originalName: child.originalName,
            deletedAt: child.deletedAt,
            file: target ? {
               cid: target.cid,
               size: target.size,
               mime: target.mime,
            } : null,
         });
      }

      ctx.body = result;
   }

   async show() {
      const {ctx, app} = this;
      const root = app.config.disk_root;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);
      const file = await ctx.model.File.findByPk(uf.fileId);
      ctx.body = fs.readFileSync(root + '/' + file.path);
   }

   async create() {
      const {ctx, app} = this;
      const user = ctx.state.user;
      const {parent, fileName: originalFileName, content, actionType} = ctx.request.body;
      const root = app.config.disk_root;
      const parentFolder = await ctx.model.UserFile.findByPk(parent);
      const t = await ctx.model.transaction();
      const fileName = uuidv4();
      const childNameList = await ctx.model.UserFile.findAll({
         where: {
            parentId: parent,
         },
      }).map(uf => uf.originalName);
      if (childNameList.includes(originalFileName.trim())) {
         ctx.status = 400;
         ctx.body = `The name "${originalFileName}" is already taken. Please choose a different name.`;
         return;
      }
      try {
         if (actionType === 1) {
            // create folder
            const uf = await ctx.model.UserFile.create({
               userId: user.id,
               parentId: parentFolder.id,
               originalName: originalFileName,
            }, {transaction: t});

            ctx.body = {
               fileId: uf.id,
               originalName: originalFileName,
            };
         } else {
            fs.writeFileSync(root + '/' + fileName, content);
            const stats = await fs.statSync(root + '/' + fileName);
            const hash = await md5File(root + '/' + fileName);
            let theFile = await ctx.model.File.findOne({where: {md5: hash}});
            if (!theFile) {
               theFile = await ctx.model.File.create({
                  userId: user.id,
                  refCount: 1,
                  size: stats.size,
                  mime: 'text/plain',
                  path: fileName,
                  md5: hash,
               }, {transaction: t});
            } else {
               theFile.refCount += 1;
               await theFile.save();
            }
            await ctx.model.UserFile.create({
               userId: user.id,
               fileId: theFile.id,
               originalName: originalFileName,
               parentId: parentFolder.id,
            }, {transaction: t});

            ctx.body = {
               fileId: theFile.id,
               originalName: originalFileName,
               mime: 'text/plain',
               size: stats.size,
            };
         }
         await t.commit();
      } catch (e) {
         await t.rollback();
         ctx.status = 400;
         ctx.body = 'create failed';
      }
   }

   async update() {
      const {ctx, app} = this;
      const user = ctx.state.user;
      const root = app.config.disk_root;
      const transaction = await ctx.model.transaction();
      const {fileName: originalFileName, content} = ctx.request.body;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);

      if (originalFileName !== uf.originalName && await ctx.service.file.checkExist(originalFileName, uf.parentId)) {
         ctx.status = 400;
         ctx.body = `The name "${originalFileName}" is already taken. Please choose a different name.`;
         return;
      }
      const fileName = uuidv4();
      fs.writeFileSync(root + '/' + fileName, content);
      const stats = await fs.statSync(root + '/' + fileName);
      const hash = await md5File(root + '/' + fileName);
      let theFile = await ctx.model.File.findOne({where: {md5: hash}});
      try {
         if (!theFile) {
            theFile = await ctx.model.File.create({
               refCount: 1,
               size: stats.size,
               mime: 'text/plain',
               path: fileName,
               md5: hash,
            }, {transaction});
            const file = await ctx.model.File.findByPk(uf.fileId);
            file.refCount -= 1;
            file.save({transaction});
         } else {
            theFile.refCount += 1;
            await theFile.save({transaction});
         }
         uf.originalName = originalFileName;
         uf.fileId = theFile.id;
         await uf.save({transaction});
         await transaction.commit();
      } catch (e) {
         await transaction.rollback();
         ctx.status = 400;
         ctx.body = 'create failed';
      }
      ctx.body = {};
   }

   async import() {
      const {ctx} = this;

      ctx.body = {
         name: 'asdf',
      };
   }

   async upload() {
      const {ctx, app} = this;
      const root = app.config.disk_root;
      const user = ctx.state.user;
      const {parent} = ctx.request.body;
      const files = ctx.request.files;
      const fileNames = [];
      for (const f of files) {
         const filename = decode(f.fieldname.substr(5));
         fileNames.push(filename.split('/'));
      }
      const parentFolder = await ctx.model.UserFile.findByPk(parent);
      try {
         for (let i = 0; i < fileNames.length; i++) {
            if (i === 0) {
               if (await ctx.service.file.checkExist(fileNames[i][0], parentFolder.id)) {
                  ctx.status = 400;
                  ctx.body = `The name "${fileNames[i][0]}" is already taken. Please choose a different name.`;
                  return;
               }
            }
            let parentId = parentFolder.id;
            const fileName = uuidv4();
            for (let j = 0; j < fileNames[i].length; j++) {
               // console.log('==== isDirectory', stats.isDirectory());
               if (j === fileNames[i].length - 1) {
                  // file
                  const stats = await fs.statSync(files[i].filepath);
                  fs.copyFileSync(files[i].filepath, root + '/' + fileName);
                  const uf = await ctx.model.UserFile.findByPk(parentId);
                  const hash = await md5File(root + '/' + fileName);
                  let theFile = await ctx.model.File.findOne({where: {md5: hash}});
                  if (!theFile) {
                     theFile = await ctx.model.File.create({
                        userId: user.id,
                        refCount: 1,
                        size: stats.size,
                        mime: files[i].mime,
                        path: fileName,
                        md5: hash,
                     });
                  } else {
                     theFile.refCount += 1;
                     await theFile.save();
                  }
                  await ctx.model.UserFile.create({
                     userId: user.id,
                     fileId: theFile.id,
                     originalName: fileNames[i][j],
                     parentId,
                  });
               } else {
                  // folder
                  const childList = await ctx.model.UserFile.findAll({
                     where: {
                        parentId,
                     },
                  });
                  const childNameList = childList.map(c => c.originalName);
                  const index = childNameList.indexOf(fileNames[i][j]);
                  let uf = null;
                  if (index < 0) {
                     uf = await ctx.model.UserFile.create({
                        userId: user.id,
                        fileId: null,
                        parentId,
                        originalName: fileNames[i][j],
                     });
                  } else {
                     uf = childList[index];
                  }

                  parentId = uf.id;
               }
            }
         }
         // await t.commit();
      } catch (e) {
         // await t.rollback();
      }
      ctx.body = {};
   }

   async destroy() {
      const {ctx} = this;
      const user = ctx.state.user;
      await this.ctx.service.file.delete([ctx.params.id]);
      await ctx.model.Trash.create({
         userId: user.id,
         ufId: ctx.params.id,
      });
      ctx.body = '';
   }

   async rename() {
      const {ctx} = this;
      const {name} = ctx.request.body;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);
      if (await ctx.service.file.checkExist(name, uf.parentId)) {
         ctx.status = 400;
         ctx.body = `The name "${name}" is already taken. Please choose a different name.`;
         return;
      }
      uf.originalName = name;
      uf.save();
      ctx.body = '';
   }

   async download() {
      await this.ctx.service.file.download();
   }

   async back() {
      const {ctx} = this;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);
      const {force = ''} = ctx.request.body;
      const childNameList = await ctx.model.UserFile.findAll({
         where: {
            parentId: uf.parentId,
            deletedAt: null,
         },
      }).map(uf => uf.originalName);
      if (!force && childNameList.includes(uf.originalName.trim())) {
         ctx.status = 400;
         ctx.body = `A newer item named "${uf.originalName}" already exists in this location. Do you want to replace it with the older one you're moving?`;
         return;
      }
      const transaction = await ctx.model.transaction();
      try {
         await this.ctx.service.file.back([ctx.params.id], transaction);
         await ctx.model.Trash.destroy({
            where: {
               ufId: ctx.params.id,
            },
         }, {transaction});
         await transaction.commit();
      } catch (e) {
         await transaction.rollback();

      }
      ctx.body = '';
   }

   async clear() {
      const {ctx} = this;
      const user = ctx.state.user;
      const uf = await ctx.model.UserFile.findByPk(ctx.params.id);
      const file = await ctx.model.File.findByPk(uf.fileId);


      const transaction = await ctx.model.transaction();
      try {
         await this.ctx.service.file.clear([ctx.params.id], transaction);
         const trash = ctx.model.Trash.findOne({
            where: {
               userId: user.id,
               ufId: ctx.params.id,
            },
         });
         await trash.destroy({transaction});
         file.refCount -= 1;
         await file.save({transaction});
         if (file.refCount === 0) {
            await file.destroy({transaction});
         }
         await transaction.commit();
      } catch (e) {
         await transaction.rollback();
      }

      ctx.body = '';
   }
}

module.exports = FileController;
