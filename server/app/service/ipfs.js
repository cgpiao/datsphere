'use strict';

const Service = require('egg').Service;
const {v4: uuidv4} = require('uuid');
const CID = require('cids');
const childProcess = require('child_process');
const {create} = require('ipfs-http-client');
const fs = require('fs');
const md5File = require('md5-file');

class IpfsService extends Service {
   async get(hash, parent) {
      const {ctx, app} = this;
      const user = ctx.state.user;
      const root = app.config.disk_root;
      const ipfs = create(app.config.ipfs_host);
      for await (const file of ipfs.get(hash)) {
         const folderPath = root;
         const fileName = uuidv4();
         const filePath = folderPath + '/' + fileName;
         if (!file.content) continue;

         const content = [];

         for await (const chunk of file.content) {
            content.push(chunk);
         }
         let parentId = parent;
         const fileNames = file.path.split('/');
         for (let i = 0; i < fileNames.length; i++) {
            if (i === 0) {
               if (await ctx.service.file.checkExist(fileNames[0], parent)) {
                  ctx.status = 400;
                  ctx.body = `The name "${fileNames[0]}" is already taken. Please choose a different name.`;
                  return;
               }
            }
            if (i === fileNames.length - 1) {
               // file
               fs.writeFileSync(filePath, Buffer.concat(content));
               const hash = await md5File(filePath);
               let theFile = await ctx.model.File.findOne({where: {md5: hash}});
               const stats = await fs.statSync(filePath);
               if (!theFile) {
                  childProcess.exec(`file --b --mime-type ${filePath}`, async (err, res) => {
                     theFile = await ctx.model.File.create({
                        userId: user.id,
                        refCount: 1,
                        size: stats.size,
                        mime: res,
                        path: fileName,
                        md5: hash,
                     });
                     await ctx.model.UserFile.create({
                        userId: user.id,
                        fileId: theFile.id,
                        originalName: fileNames[i],
                        parentId,
                     });
                  });
               } else {
                  theFile.refCount += 1;
                  await theFile.save();
                  await ctx.model.UserFile.create({
                     userId: user.id,
                     fileId: theFile.id,
                     originalName: fileNames[i],
                     parentId,
                  });
               }
            } else {
               // folder
               const childList = await ctx.model.UserFile.findAll({
                  where: {
                     parentId,
                  },
               });
               const childNameList = childList.map(c => c.originalName);
               const index = childNameList.indexOf(fileNames[i]);
               let uf = null;
               if (index < 0) {
                  uf = await ctx.model.UserFile.create({
                     userId: user.id,
                     fileId: null,
                     parentId,
                     originalName: fileNames[i],
                  });
               } else {
                  uf = childList[index];
               }

               parentId = uf.id;
            }
         }
      }
   }
   async stat(hash) {
      const {ctx, app} = this;
      const ipfs = create(app.config.ipfs_host);
      let stat = await ipfs.object.stat(hash)
      return stat
   }
}

module.exports = IpfsService;
