'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
   async send() {
      console.log('send')
      const {ctx} = this;
      const mailgun = require("mailgun-js");
      const DOMAIN = 'datsphere.com';
      const mg = mailgun({apiKey: 'key-9654084e18a88d6791d04833fbd3acc1', domain: DOMAIN});
      const data = {
         from: 'piaocg@outlook.com',
         to: 'piaocg@outlook.com',
         subject: 'Hello',
         text: 'Testing some Mailgun awesomness!'
      };
      const resp = await mg.messages().send(data);
      console.log('resp', resp)
      ctx.body = '';
   }
}

module.exports = TestController;
