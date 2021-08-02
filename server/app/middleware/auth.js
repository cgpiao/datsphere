'use strict';

module.exports = () => {
   return async function auth(ctx, next) {
      const guestPaths = [ '/login', '/register' ];
      if (guestPaths.includes(ctx.request.path)) {
         await next();
         return;
      }
      // const userToken = ctx.request.headers['x-token'];
      // const userId = await ctx.app.redis.get(userToken);
      // const user = await ctx.model.User.findById(userId);
      // if (!user) {
      //    ctx.status = 401;
      //    return;
      // }
      // ctx.state.user = user;
      await next();
   };
};

