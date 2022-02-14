require('dotenv').config();

let config = {
  fileName: 'ucdlib.js',
  clientModules: [
    'node_modules', 
    '../../../../ucdlib-locations/src/public/node_modules'
  ],
  theme: '../../../../../themes/ucdlib-theme-wp/',
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

config.themePublicJs = config.theme + "src/public";

if ( config.isDockerEnv ) {
  config.clientModules.push(config.themePublicJs + "node_modules");
} else {
  config.clientModules.push('../../../../ucdlib-theme-wp/src/public/node_modules',);
}


module.exports = config;