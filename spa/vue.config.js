let isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
const webpack = require('webpack');

module.exports = {
   css: {
      loaderOptions: {
         less: {
            lessOptions: {
               modifyVars: {},
               javascriptEnabled: true,
            },
         }
      },
   },

   chainWebpack: (config) => {

      const svgRule = config.module.rule('svg');

      svgRule.uses.clear();

      svgRule
         .use('vue-loader')
         .loader('vue-loader-v16') // or `vue-loader-v16` if you are using a preview support of Vue 3 in Vue CLI
         .end()
         .use('vue-svg-loader')
         .loader('vue-svg-loader');

      config
         .resolve.extensions.add('.ts').add('.tsx')
         .end().end()
         .module
         .rule('typescript')
         .test(/\.tsx?$/)
         .use('babel-loader')
         .loader('babel-loader')
         .end()
         .use('ts-loader')
         .loader('ts-loader')
         .options({
            transpileOnly: true,
            appendTsSuffixTo: [
               '\\.vue$',
            ],
            happyPackMode: false,
         })
         .end();
   },

   configureWebpack: {
      devtool: isProduction ? 'hidden-nosources-source-map' : 'cheap-module-eval-source-map',
      plugins: [
         new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ],
   },

   pluginOptions: {
      quasar: {
         importStrategy: 'kebab',
         rtlSupport: false
      }
   },

   transpileDependencies: [
      'quasar'
   ]
}
