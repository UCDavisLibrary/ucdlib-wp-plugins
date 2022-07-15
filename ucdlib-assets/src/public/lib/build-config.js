require('dotenv').config();

let config = {
  fileName: 'ucdlib.js',
  clientModules: [
    'node_modules',
    '../../../../ucdlib-locations/src/public/node_modules'
  ],
  themeInDocker: '../../../../themes/ucdlib-theme-wp/',
  themeInRepo: '../../../../../ucdlib-theme-wp/',
  isDockerEnv: process.env.WORDPRESS_DB_HOST ? true: false,
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

if ( config.isDockerEnv ) {
  config.themePublicJs = config.themeInDocker + "src/public/";
} else {
  config.themePublicJs = config.themeInRepo + "src/public/";
}
config.clientModules.push(config.themePublicJs + "node_modules");

module.exports = config;