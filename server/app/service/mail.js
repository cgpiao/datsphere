'use strict';

const Service = require('egg').Service;
const random = require('lodash/random');
const dayjs = require("dayjs");
const {v4: uuidv4} = require('uuid');

const mailgun = require("mailgun-js");
const DOMAIN = 'datsphere.com';

class MailService extends Service {
   async sendVerificationCode(mail) {
      const {app} = this;
      const mg = mailgun({apiKey: app.config.mailgun.api_key, domain: DOMAIN});
      const code = random(1111, 9999);
      const message = 'Your verification code is ' + code + '.';
      this.ctx.logger.info(`verification code for [${mail}] is ${code}`);
      try {
         const kv = await this.ctx.model.Kv.create({
            key: uuidv4(),
            value: `${code}`,
            expiredAt: dayjs().add(15, 'minute'),
         });
         const data = {
            from: 'admin@datsphere.com',
            to: mail,
            subject: 'Please verify your email',
            text: message,
         };
         await mg.messages().send(data);
         return kv.key;
      } catch (error) {
         console.error(error);
         return null;
      }
   }

   async sendResetPasswordLink(mail) {
      const {app} = this;
      const host = app.config.host;
      const uuid = uuidv4();
      const message = 'Please click following link to reset your password. ' + host + '/reset-password?id=' + uuid;

      try {
         const mg = mailgun({apiKey: app.config.mailgun.api_key, domain: DOMAIN});
         const kv = await this.ctx.model.Kv.create({
            key: uuid,
            value: mail,
            expiredAt: dayjs().add(15, 'minute'),
         });
         const data = {
            from: 'admin@datsphere.com',
            to: mail,
            subject: 'Reset your password',
            text: message,
         };
         await mg.messages().send(data);
         return kv.key;
      } catch (error) {
         console.error(error);
         return null;
      }
   }

   async send({from: {FromEmail, FromName}, to: {ToEmail, ToName}, Subject, TextPart, HTMLPart, }) {
      const Messages = [
         {
            From: {
               Email: FromEmail, Name: FromName,
            },
            To: [
               {
                  Email: ToEmail, Name: ToName,
               },
            ],
            Subject,
            TextPart,
            HTMLPart,
         },
      ];
      await mailjet
         .post("send", {'version': 'v3.1'})
         .request({
            Messages,
         });
   }
}

module.exports = MailService;
