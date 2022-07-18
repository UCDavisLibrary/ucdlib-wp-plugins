require('dotenv').config();

let config = {
  fileName: 'ucdlib.js',
  clientModules: [
    'node_modules',
    '../../../../ucdlib-locations/src/public/node_modules',
    '../../../../../themes/ucdlib-theme-wp/src/public/node_modules',
    '../../../../../ucdlib-theme-wp/src/public/node_modules'
  ],
  loaderOptions: {
    css: {
      loader: 'css-loader',
      options : {
        url: false
      }
    },
    scss: {
      loader: 'sass-loader',
      options: {
        implementation: require("sass"),
        sassOptions: {
          includePaths: [
            "node_modules/@ucd-lib/theme-sass",
            "node_modules/breakpoint-sass/stylesheets",
            "node_modules/sass-toolkit/stylesheets"]
        }
      }
    }
  },
  assetsPath: "../../../assets/"
};

module.exports = config;